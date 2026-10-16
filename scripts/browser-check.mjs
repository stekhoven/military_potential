import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium, expect } from '../frontend/node_modules/@playwright/test/index.mjs';
import { translate as t } from '../frontend/src/i18n.js';

const baseURL = process.env.QA_BASE_URL;
if (!baseURL || !process.env.QA_CHIEF_PASSWORD) throw new Error('Run via scripts/browser_check.py');
const browser = await chromium.launch();
const errors = [];
async function open(role = 'chief', viewport = { width: 1440, height: 1000 }) {
  const context = await browser.newContext({ baseURL, viewport });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.locator('[name=username]').fill(`qa_${role}`);
  await page.locator('[name=password]').fill(process.env[`QA_${role.toUpperCase()}_PASSWORD`]);
  await page.locator('.login-form button[type=submit], .login-form button').last().click();
  await expect(page.locator('.app-shell')).toBeVisible();
  await expect(page.locator('.overview-factors .numeric').first()).not.toHaveText('—');
  return { context, page };
}
async function nav(page, tab, lang = 'de') {
  await page.locator('.nav-item').filter({ hasText: t(lang, tab) }).click();
  await expect(page.locator('h1')).toHaveText(t(lang, tab === 'overview' ? 'overviewTitle' : tab));
}
async function language(page, lang) {
  await page.locator('.topbar .language-select select').selectOption(lang);
  await expect(page.locator('html')).toHaveAttribute('lang', lang);
}
async function save(page, lang = 'de') {
  await page.locator('.topbar button').filter({ hasText: t(lang, 'save') }).click();
  await expect(page.locator('.save-state')).toContainText(t(lang, 'saved'));
  await expect(page.locator('.alert.error')).toHaveCount(0);
}
async function state(page) { return (await page.request.get('/api/state/')).json(); }
async function addEntity(page, kind, id, { definition = false } = {}) {
  await page.locator('.management-nav button').filter({ hasText: new RegExp(`^${t('de', kind)}`) }).click();
  await page.locator('.management-layout .panel-heading button').click();
  const modal = page.getByRole('dialog');
  await modal.getByLabel(t('de', 'id'), { exact: true }).fill(id);
  for (const lang of ['de', 'fr', 'it']) {
    await modal.locator('.editor-language select').selectOption(lang);
    await modal.getByLabel(`${t(lang, 'name')} · ${lang.toUpperCase()}`, { exact: true }).fill(`QA ${id} ${lang}`);
    if (definition) await modal.getByLabel(`${t(lang, 'definition')} · ${lang.toUpperCase()}`, { exact: true }).fill(`Definition ${lang}`);
    if (kind === 'scenarios') await modal.getByLabel(`${t(lang, 'description')} · ${lang.toUpperCase()}`, { exact: true }).fill(`Scenario ${lang}`);
  }
  await modal.getByRole('button', { name: t('it', 'apply'), exact: true }).click();
  await expect(modal).toHaveCount(0);
  await language(page, 'de');
}

try {
  const { context, page } = await open();
  await page.screenshot({ path: 'artifacts/overview.png', fullPage: true });
  for (const lang of ['fr', 'it', 'de']) {
    await language(page, lang);
    await expect(page.locator('.language-select select')).toHaveCount(1);
    await nav(page, 'dashboard', lang);
    await expect(page.locator('.actor-card')).toHaveCount(1);
    await expect(page.locator('.overall-number .numeric')).not.toHaveText('—');
  }
  await nav(page, 'assessments');
  const firstRow = page.locator('.assessment-table tbody tr').first();
  const note = firstRow.locator('textarea');
  await note.fill('QA source preserved across language changes');
  await firstRow.locator('select').nth(0).selectOption('2');
  await firstRow.locator('select').nth(1).selectOption('C3');
  for (const lang of ['fr', 'it', 'de']) {
    await language(page, lang);
    await expect(note).toHaveValue('QA source preserved across language changes');
    await expect(firstRow.locator('select').nth(0)).toHaveValue('2');
  }
  await save(page);
  const edited = await state(page);
  await page.reload();
  await expect(page.locator('.assessment-table textarea').first()).toHaveValue('QA source preserved across language changes');

  await nav(page, 'model');
  await addEntity(page, 'nodes', 'QA_NODE');
  await addEntity(page, 'indicators', 'QA_INDICATOR', { definition: true });
  // Assign the indicator to the new node through the editor.
  await page.getByRole('button', { name: `${t('de', 'edit')} QA_INDICATOR`, exact: true }).click();
  await page.getByRole('dialog').getByLabel(t('de', 'node'), { exact: true }).selectOption('QA_NODE');
  await page.getByRole('dialog').getByRole('button', { name: t('de', 'apply'), exact: true }).click();
  await addEntity(page, 'targets', 'QA_TARGET');
  await page.locator('.management-nav button').filter({ hasText: t('de', 'edges') }).click();
  await page.locator('.management-layout .panel-heading button').click();
  await page.getByRole('dialog').getByLabel(t('de', 'source'), { exact: true }).selectOption('QA_NODE');
  await page.getByRole('dialog').getByLabel(t('de', 'destination'), { exact: true }).selectOption('QA_TARGET');
  await page.getByRole('dialog').getByRole('button', { name: t('de', 'apply'), exact: true }).click();
  await save(page);
  let current = await state(page);
  assert.equal(current.bundle.scenarios[0].model.nodes.length, 36);
  assert.equal(current.bundle.scenarios[0].model.indicators.length, 122);
  assert.equal(current.bundle.scenarios[0].model.targets.length, 6);
  assert.equal(current.bundle.model.nodes.length, 35);
  await page.locator('.management-nav button').filter({ hasText: t('de', 'scenarios') }).click();
  await page.getByRole('button', { name: `${t('de', 'edit')} S1`, exact: true }).click();
  const slider = page.getByRole('dialog').getByRole('slider');
  await slider.press('Home');
  for (let i = 0; i < 5; i++) await slider.press('ArrowRight');
  await page.getByRole('dialog').getByRole('button', { name: t('de', 'apply'), exact: true }).click();
  await save(page);
  assert.equal((await state(page)).bundle.scenarios[0].gain, 1.25);
  await addEntity(page, 'scenarios', 'QA_SCENARIO');
  await save(page);
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: `${t('de', 'remove')} QA_SCENARIO`, exact: true }).click();
  await save(page);
  assert.equal((await state(page)).bundle.scenarios.length, 6);

  await nav(page, 'network');
  await expect(page.locator('[data-node]')).toHaveCount(42);
  await page.locator('[data-node="QA_NODE"]').click();
  await expect(page.locator('.node-details')).toBeVisible();
  await expect(page.locator('.node-details')).toContainText('QA QA_NODE de');
  await page.getByRole('button', { name: t('de', 'zoomIn'), exact: true }).click();
  await expect(page.locator('.network-controls')).toContainText('120%');
  await page.screenshot({ path: 'artifacts/network.png', fullPage: true });
  await nav(page, 'derivation');
  if (await page.locator('.node-details[role=dialog]').count()) {
    await page.locator('.node-details[role=dialog]').getByRole('button', { name: t('de', 'close'), exact: true }).click();
  }
  await expect(page.locator('.contribution-table tbody tr')).toHaveCount(36);
  await page.locator('.segmented button').filter({ hasText: t('de', 'contrast') }).click();
  await expect(page.locator('.contrast-equation')).toContainText('1.25');
  await expect(page.locator('.derivation-equation .numeric').last()).not.toHaveText('—');

  // Create a normal actor through the UI and compare both actors at a common horizon.
  await page.locator('.actor-picker summary').click();
  await page.locator('.actor-picker-popover button').click();
  await page.getByRole('dialog').locator('.inline-form input').fill('QA comparison actor');
  await page.getByRole('dialog').locator('.inline-form button').click();
  await page.getByRole('dialog').getByRole('button', { name: t('de', 'close'), exact: true }).click();
  await save(page);
  if (await page.locator('.actor-picker').evaluate(el => !el.open)) await page.locator('.actor-picker summary').click();
  await page.locator('.actor-picker-popover label').filter({ hasText: 'QA comparison actor' }).locator('input').check();
  await page.locator('.actor-picker summary').click();
  await nav(page, 'dashboard');
  await expect(page.locator('.actor-card')).toHaveCount(2);
  await page.locator('.context-bar').getByLabel(t('de', 'time'), { exact: true }).selectOption('2');
  await expect(page.locator('.actor-card .overall-number .numeric').last()).toHaveText('3,00');
  await page.screenshot({ path: 'artifacts/comparison.png', fullPage: true });

  // Saved export and reimport preserve every input; invalid references abort atomically.
  await nav(page, 'exchange');
  const exportedPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: t('de', 'export'), exact: true }).click();
  const download = await exportedPromise;
  const exported = JSON.parse(await fs.readFile(await download.path(), 'utf8'));
  current = await state(page);
  assert.deepEqual(exported, current.bundle);
  const fileInput = page.locator('input[type=file]');
  await fileInput.setInputFiles({ name: 'roundtrip.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(exported)) });
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: t('de', 'import'), exact: true }).click();
  await expect(page.locator('.alert.success')).toContainText(t('de', 'importSuccess'));
  assert.deepEqual((await state(page)).bundle, exported);
  const invalid = structuredClone(exported);
  invalid.model.edges[0].target = 'nonexistent';
  const beforeInvalid = (await state(page)).revision;
  await fileInput.setInputFiles({ name: 'invalid.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(invalid)) });
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: t('de', 'import'), exact: true }).click();
  await expect(page.locator('.alert.error')).toBeVisible();
  assert.equal((await state(page)).revision, beforeInvalid);

  // Two browser sessions must retain the losing editor's input on a write conflict.
  const other = await open();
  await nav(page, 'assessments');
  await nav(other.page, 'assessments');
  await page.locator('.assessment-table textarea').first().fill('Concurrent winner');
  await other.page.locator('.assessment-table textarea').first().fill('Concurrent local draft retained');
  await save(page);
  await other.page.locator('.topbar button').filter({ hasText: t('de', 'save') }).click();
  await expect(other.page.locator('.alert.error')).toBeVisible();
  await expect(other.page.locator('.assessment-table textarea').first()).toHaveValue('Concurrent local draft retained');
  const backupPromise = other.page.waitForEvent('download');
  await other.page.getByRole('button', { name: t('de', 'localBackup'), exact: true }).click();
  const backup = JSON.parse(await fs.readFile(await (await backupPromise).path(), 'utf8'));
  assert(Object.values(backup.actors[0].assessments).some(a => a.note === 'Concurrent local draft retained'));
  other.page.once('dialog', dialog => dialog.accept());
  await other.page.getByRole('button', { name: t('de', 'refresh'), exact: true }).click();
  await expect(other.page.locator('.assessment-table textarea').first()).toHaveValue('Concurrent winner');
  await other.context.close();

  await nav(page, 'exchange');
  await page.locator('.panel').filter({ has: page.getByRole('heading', { name: t('de', 'history'), exact: true }) })
    .locator('tbody tr').last().getByRole('button', { name: t('de', 'preview'), exact: true }).click();
  await expect(page.locator('.alert.info')).toContainText(t('de', 'historical'));
  await nav(page, 'assessments');
  await expect(page.locator('.assessment-table select').first()).toBeDisabled();
  await page.getByRole('button', { name: t('de', 'backCurrent'), exact: true }).click();

  await nav(page, 'model');
  for (const [kind, id] of [['indicators', 'QA_INDICATOR'], ['targets', 'QA_TARGET'], ['nodes', 'QA_NODE']]) {
    await page.locator('.management-nav button').filter({ hasText: new RegExp(`^${t('de', kind)}`) }).click();
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: `${t('de', 'remove')} ${id}`, exact: true }).click();
  }
  await save(page);
  const afterRemove = await state(page);
  assert.equal(afterRemove.bundle.scenarios[0].model.nodes.length, 35);
  assert.equal(afterRemove.bundle.scenarios[0].model.targets.length, 5);
  assert.equal(afterRemove.bundle.scenarios[0].model.indicators.length, 121);

  // Empty scenario lists are valid and must support creating a new scenario.
  await page.locator('.management-nav button').filter({ hasText: t('de', 'scenarios') }).click();
  for (const scenario of afterRemove.bundle.scenarios) {
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: `${t('de', 'remove')} ${scenario.id}`, exact: true }).click();
  }
  await save(page);
  assert.equal((await state(page)).bundle.scenarios.length, 0);
  await addEntity(page, 'scenarios', 'QA_RECOVERED');
  await save(page);
  const recovered = await state(page);
  assert.equal(recovered.bundle.scenarios.length, 1);
  assert.equal(Object.keys(recovered.bundle.scenarios[0].weights).length, 5);
  await nav(page, 'dashboard');
  await expect(page.locator('.overall-number .numeric').first()).not.toHaveText('—');

  const analyst = await open('analyst');
  await expect(analyst.page.locator('.nav-item').filter({ hasText: t('de', 'model') })).toHaveCount(0);
  await analyst.page.locator('.actor-picker summary').click();
  await analyst.page.locator('.actor-picker-popover button').click();
  await expect(analyst.page.getByRole('button', { name: `${t('de', 'delete')} USA`, exact: true })).toBeDisabled();
  await analyst.page.getByRole('dialog').getByRole('button', { name: t('de', 'close'), exact: true }).click();
  await analyst.context.close();

  // Check narrow layout and login translations without changing application state.
  const mobile = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 }, isMobile: true });
  const mobilePage = await mobile.newPage();
  mobilePage.on('pageerror', error => errors.push(error.message));
  await mobilePage.goto('/');
  await mobilePage.locator('.language-select select').selectOption('it');
  await expect(mobilePage.locator('h2')).toHaveText(t('it', 'login'));
  assert(await mobilePage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  await mobilePage.screenshot({ path: 'artifacts/login-mobile.png', fullPage: true });
  await mobile.close();
  await context.close();
  assert.deepEqual(errors, []);
  console.log('Browser checks passed: DE/FR/IT, persisted edits, dynamic model/scenario CRUD, graph, comparison, contrast, JSON, conflict recovery, history, roles, narrow login.');
} finally {
  await browser.close();
}

import React, { useState, useEffect } from "react";
import {
  Icon,
  Select,
  Badge,
  Panel,
  Modal,
  Empty,
  NumberValue,
  Percent,
  groupName,
} from "./ui.jsx";
import { useViewState } from "./views.jsx";
import {
  uniqueId,
  missingLanguages,
  effectiveModel,
  pruneAssessments,
} from "./utils.js";

const newLoc = () => ({ de: "", fr: "", it: "" });
function modelForEdit(bundle, scenarioId) {
  const s = bundle.scenarios.find((s) => s.id === scenarioId);
  if (!s.model) s.model = structuredClone(bundle.model);
  return s.model;
}
export function ModelView({ c }) {
  const { t, model, scenario, bundle } = c;
  const [section, setSection] = useViewState("modelSection", "scenarios"),
    [editor, setEditor] = useState(null),
    [query, setQuery] = useViewState("modelQuery", "");
  const sections = [
    "scenarios",
    "nodes",
    "targets",
    "indicators",
    "edges",
    "qualityParameters",
  ];
  const editable =
    !c.readOnly && (section === "scenarios" || Boolean(scenario));
  function edit(kind, item, index) {
    setEditor({ kind, item: structuredClone(item), index });
  }
  function add() {
    const nodes = model.nodes;
    let item;
    if (section === "nodes")
      item = {
        id: uniqueId("N-", nodes),
        label: newLoc(),
        group: nodes[0]?.group || "military",
        controllability: "partial",
      };
    if (section === "targets")
      item = { id: uniqueId("X-", model.targets), label: newLoc() };
    if (section === "indicators")
      item = {
        id: uniqueId("I-", model.indicators),
        label: newLoc(),
        definition: newLoc(),
        node_id: nodes[0]?.id || "",
        weight: 1,
        weight_note: "",
      };
    if (section === "edges")
      item = {
        source: nodes[0]?.id || "",
        target: model.targets[0]?.id || nodes[1]?.id || "",
        strength: 1,
        term: "K",
      };
    if (section === "scenarios")
      item = {
        id: uniqueId("scenario-", bundle.scenarios),
        label: newLoc(),
        description: newLoc(),
        weights: Object.fromEntries(
          model.targets.map((target) => [
            target.id,
            scenario?.weights?.[target.id] ?? 1,
          ]),
        ),
        gain: 1,
        model: structuredClone(model),
      };
    edit(section, item);
  }
  function remove(kind, item, index) {
    if (!window.confirm(t("deleteConfirm"))) return;
    c.mutate((b) => {
      if (kind === "scenarios") {
        b.scenarios = b.scenarios.filter((s) => s.id !== item.id);
      } else {
        const m = modelForEdit(b, c.scenarioId);
        if (kind === "edges") m.edges.splice(index, 1);
        else {
          m[kind] = m[kind].filter((x) => x.id !== item.id);
          if (kind === "nodes") {
            m.indicators = m.indicators.filter((i) => i.node_id !== item.id);
            m.edges = m.edges.filter(
              (e) => e.source !== item.id && e.target !== item.id,
            );
          }
          if (kind === "targets") {
            m.edges = m.edges.filter((e) => e.target !== item.id);
            delete b.scenarios.find((s) => s.id === c.scenarioId).weights[
              item.id
            ];
          }
        }
      }
      pruneAssessments(b);
    });
  }
  function apply(item) {
    const { kind, index } = editor;
    c.mutate((b) => {
      if (kind === "scenarios") {
        const found = b.scenarios.findIndex((s) => s.id === item.id);
        if (found >= 0) b.scenarios[found] = item;
        else b.scenarios.push(item);
      } else if (kind === "qualityParameters") {
        modelForEdit(b, c.scenarioId).quality_thresholds = item;
      } else {
        const m = modelForEdit(b, c.scenarioId);
        if (kind === "edges") {
          if (index == null) m.edges.push(item);
          else m.edges[index] = item;
        } else {
          const found = m[kind].findIndex((x) => x.id === item.id);
          if (found >= 0) m[kind][found] = item;
          else m[kind].push(item);
          if (kind === "targets")
            b.scenarios.find((s) => s.id === c.scenarioId).weights[item.id] ??=
              1;
        }
      }
    });
    if (editor.kind === "scenarios") c.setScenarioId(item.id);
    setEditor(null);
  }
  const allItems =
    section === "scenarios"
      ? bundle.scenarios
      : section === "qualityParameters"
        ? []
        : model[section];
  const items = allItems
    .map((item, index) => ({ item, index }))
    .filter(({ item }) =>
      `${item.id ?? ""} ${item.source ?? ""} ${item.target ?? ""} ${c.loc(item.label)}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  return (
    <>
      <div className="subtle-note">
        <Icon name="info" />
        {t("modelHint")}
      </div>
      <div className="management-layout">
        <nav className="management-nav" aria-label={t("model")}>
          {sections.map((k) => (
            <button
              key={k}
              className={section === k ? "selected" : ""}
              onClick={() => {
                setSection(k);
                setQuery("");
              }}
            >
              {t(k)}
              <span>
                {k === "scenarios"
                  ? bundle.scenarios.length
                  : k === "qualityParameters"
                    ? ""
                    : model[k].length}
              </span>
            </button>
          ))}
        </nav>
        <Panel
          title={t(section)}
          subtitle={section === "scenarios" ? t("scenarioWeights") : undefined}
          action={
            section === "qualityParameters" ? (
              <button
                className="button small"
                disabled={!editable}
                onClick={() => edit(section, model.quality_thresholds)}
              >
                <Icon name="edit" />
                {t("edit")}
              </button>
            ) : (
              <button
                className="button primary small"
                disabled={
                  !editable ||
                  (section === "indicators" && !model.nodes.length) ||
                  (section === "edges" &&
                    (!model.nodes.length ||
                      (!model.targets.length && !model.nodes.length)))
                }
                onClick={add}
              >
                <Icon name="plus" />
                {t("add")}
              </button>
            )
          }
        >
          {section === "qualityParameters" ? (
            <div className="quality-parameters">
              <p>{t("qualityHelp")}</p>
              <dl>
                <div>
                  <dt>{t("greenThreshold")}</dt>
                  <dd>
                    <Percent c={c} value={model.quality_thresholds.green} />
                  </dd>
                </div>
                <div>
                  <dt>{t("redThreshold")}</dt>
                  <dd>
                    <Percent c={c} value={model.quality_thresholds.red} />
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            <>
              <div className="filter-bar">
                <label className="search-field">
                  <Icon name="search" />
                  <input
                    aria-label={t("search")}
                    placeholder={t("search")}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <Badge>{allItems.length}</Badge>
              </div>
              <div className="table-scroll">
                <table className="model-table">
                  <thead>
                    <tr>
                      <th>{section === "edges" ? t("source") : t("name")}</th>
                      <th>
                        {section === "scenarios"
                          ? t("gain")
                          : section === "indicators"
                            ? t("node")
                            : section === "edges"
                              ? t("destination")
                              : t("details")}
                      </th>
                      <th>
                        {section === "edges"
                          ? t("strength")
                          : section === "indicators"
                            ? t("weight")
                            : ""}
                      </th>
                      <th>{t("edit")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(({ item, index }) => (
                      <tr key={item.id ?? `${item.source}-${item.target}`}>
                        <td>
                          {section === "edges" ? (
                            <>
                              <small>{item.source}</small>
                              <strong>
                                {c.loc(
                                  model.nodes.find((n) => n.id === item.source)
                                    ?.label,
                                )}
                              </strong>
                            </>
                          ) : (
                            <>
                              <small>{item.id}</small>
                              <strong>{c.loc(item.label)}</strong>
                              {missingLanguages(item.label).length > 0 && (
                                <Badge tone="warning">
                                  {t("missingTranslations")}:{" "}
                                  {missingLanguages(item.label).join(", ")}
                                </Badge>
                              )}
                            </>
                          )}
                        </td>
                        <td>
                          {section === "scenarios" ? (
                            <>
                              <NumberValue c={c} value={item.gain} />
                              <p className="scenario-description">
                                {c.loc(item.description)}
                              </p>
                            </>
                          ) : section === "indicators" ? (
                            <>
                              {item.node_id}
                              <small>
                                {c.loc(
                                  model.nodes.find((n) => n.id === item.node_id)
                                    ?.label,
                                )}
                              </small>
                            </>
                          ) : section === "edges" ? (
                            <>
                              <small>{item.target}</small>
                              <strong>
                                {c.loc(
                                  [...model.nodes, ...model.targets].find(
                                    (n) => n.id === item.target,
                                  )?.label,
                                )}
                              </strong>
                            </>
                          ) : section === "nodes" ? (
                            <>
                              <Badge>{groupName(item.group, c)}</Badge>
                              <small>{t(item.controllability)}</small>
                            </>
                          ) : (
                            <small>{t("targetHelp")}</small>
                          )}
                        </td>
                        <td>
                          {section === "edges" ? (
                            <Badge tone={item.strength < 0 ? "warning" : ""}>
                              {item.strength > 0 ? "+" : ""}
                              {item.strength}
                              {item.term}
                            </Badge>
                          ) : section === "indicators" ? (
                            item.weight
                          ) : null}
                        </td>
                        <td>
                          <div className="button-row">
                            <button
                              className="icon-button"
                              disabled={!editable}
                              aria-label={`${t("edit")} ${item.id ?? item.source}`}
                              onClick={() => edit(section, item, index)}
                            >
                              <Icon name="edit" />
                            </button>
                            <button
                              className="icon-button danger"
                              disabled={!editable}
                              aria-label={`${t("remove")} ${item.id ?? item.source}`}
                              onClick={() => remove(section, item, index)}
                            >
                              <Icon name="trash" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!items.length && <Empty c={c} />}
            </>
          )}
        </Panel>
      </div>
      {editor && (
        <EntityEditor
          c={c}
          editor={editor}
          close={() => setEditor(null)}
          apply={apply}
        />
      )}
    </>
  );
}

function EntityEditor({ c, editor, close, apply }) {
  const { t, model, lang } = c;
  const [item, setItem] = useState(editor.item);
  const [idEditable] = useState(
    editor.index == null && editor.kind !== "qualityParameters",
  );
  const [formError, setFormError] = useState(false);
  const kind = editor.kind;
  function change(key, value) {
    setItem((x) => ({ ...x, [key]: value }));
  }
  function localized(key, value) {
    setItem((x) => ({ ...x, [key]: { ...x[key], [lang]: value } }));
  }
  const allFields =
    kind === "scenarios"
      ? ["label", "description"]
      : kind === "indicators"
        ? ["label", "definition"]
        : ["nodes", "targets"].includes(kind)
          ? ["label"]
          : [];
  const missing = allFields.flatMap((key) => missingLanguages(item[key]));
  const languages = (
    <Select
      label={t("language")}
      value={lang}
      onChange={c.setLang}
      options={[
        { id: "de", label: "Deutsch" },
        { id: "fr", label: "Français" },
        { id: "it", label: "Italiano" },
      ]}
    />
  );
  function submit(e) {
    e.preventDefault();
    const duplicate =
      kind === "edges" &&
      model.edges.some(
        (edge, index) =>
          index !== editor.index &&
          edge.source === item.source &&
          edge.target === item.target,
      );
    const duplicateId =
      item.id &&
      (kind === "scenarios"
        ? c.bundle.scenarios
        : [...model.nodes, ...model.targets, ...model.indicators]
      ).some((x) => x.id === item.id) &&
      editor.index == null;
    const invalidThreshold =
      kind === "qualityParameters" &&
      (item.green >= item.red || item.green < 0 || item.red > 1);
    if (missing.length || duplicate || duplicateId || invalidThreshold) {
      setFormError(true);
      return;
    }
    apply(item);
  }
  return (
    <Modal
      title={`${t(editor.index == null ? "add" : "edit")} · ${t(kind)}`}
      closeLabel={t("close")}
      onClose={close}
    >
      <form onSubmit={submit} className="entity-form">
        {allFields.length > 0 && (
          <>
            <div className="editor-language">
              {languages}
              <Badge>{lang.toUpperCase()}</Badge>
            </div>
            <p className="form-hint">{t("translationHint")}</p>
            {missing.length > 0 && (
              <div className="translation-status">
                <Icon name="info" />
                {t("missingTranslations")}:{" "}
                {[...new Set(missing)].join(", ").toUpperCase()}
              </div>
            )}
          </>
        )}
        {formError && (
          <div className="alert error" role="alert">
            {t("invalid")}
          </div>
        )}
        {item.id !== undefined && (
          <label>
            {t("id")}
            <input
              required
              pattern="[A-Za-z0-9_:\-]{1,80}"
              value={item.id}
              disabled={!idEditable}
              onChange={(e) => change("id", e.target.value)}
            />
          </label>
        )}
        {allFields.map((field) => (
          <label key={field}>
            {t(field === "label" ? "name" : field)} · {lang.toUpperCase()}
            {field === "label" ? (
              <input
                value={item[field]?.[lang] || ""}
                onChange={(e) => localized(field, e.target.value)}
              />
            ) : (
              <textarea
                rows={field === "definition" ? 7 : 3}
                value={item[field]?.[lang] || ""}
                onChange={(e) => localized(field, e.target.value)}
              />
            )}
          </label>
        ))}
        {kind === "nodes" && (
          <>
            <Select
              label={t("group")}
              value={item.group}
              onChange={(v) => change("group", v)}
              options={[
                "politics",
                "military",
                "economy",
                "society",
                "information",
                "infrastructure",
                "environment",
                "domains",
              ].map((id) => ({ id, label: groupName(id, c) }))}
            />
            <Select
              label={t("controllability")}
              value={item.controllability}
              onChange={(v) => change("controllability", v)}
              options={["yes", "partial", "no"].map((id) => ({
                id,
                label: t(id),
              }))}
            />
          </>
        )}
        {kind === "indicators" && (
          <>
            <Select
              label={t("node")}
              value={item.node_id}
              onChange={(v) => change("node_id", v)}
              options={model.nodes.map((n) => ({
                id: n.id,
                label: `${n.id} · ${c.loc(n.label)}`,
              }))}
            />
            <label>
              {t("weight")}
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                required
                value={item.weight}
                onChange={(e) => change("weight", Number(e.target.value))}
              />
            </label>
            <label>
              {t("weightNote")}
              <textarea
                value={item.weight_note}
                onChange={(e) => change("weight_note", e.target.value)}
              />
            </label>
          </>
        )}
        {kind === "edges" && (
          <>
            <div className="form-grid">
              <Select
                label={t("source")}
                value={item.source}
                onChange={(v) => change("source", v)}
                options={model.nodes.map((n) => ({
                  id: n.id,
                  label: `${n.id} · ${c.loc(n.label)}`,
                }))}
              />
              <Select
                label={t("destination")}
                value={item.target}
                onChange={(v) => change("target", v)}
                options={[...model.nodes, ...model.targets].map((n) => ({
                  id: n.id,
                  label: `${n.id} · ${c.loc(n.label)}`,
                }))}
              />
              <Select
                label={t("strength")}
                value={item.strength}
                onChange={(v) => change("strength", Number(v))}
                options={[-3, -2, -1, 1, 2, 3].map((id) => ({
                  id,
                  label: `${id > 0 ? "+" : ""}${id}`,
                }))}
              />
              <Select
                label={t("term")}
                value={item.term}
                onChange={(v) => change("term", v)}
                options={["K", "M", "L"].map((id) => ({ id, label: id }))}
              />
            </div>
          </>
        )}
        {kind === "scenarios" && (
          <>
            <label>
              {t("gain")}
              <div className="range-field">
                <input
                  type="range"
                  min="1"
                  max="2"
                  step="0.05"
                  value={item.gain}
                  onChange={(e) => change("gain", Number(e.target.value))}
                />
                <input
                  type="number"
                  aria-label={t("gain")}
                  required
                  min="0.01"
                  step="0.01"
                  value={item.gain}
                  onChange={(e) => change("gain", Number(e.target.value))}
                />
              </div>
            </label>
            <p className="form-hint">{t("contrastHint")}</p>
            <h3>{t("scenarioWeights")}</h3>
            <div className="scenario-weight-grid">
              {(item.model || model).targets.map((target) => (
                <label key={target.id}>
                  {c.loc(target.label)}
                  <input
                    required
                    type="number"
                    min="0"
                    max="3"
                    step="1"
                    value={item.weights[target.id] ?? 0}
                    onChange={(e) =>
                      change("weights", {
                        ...item.weights,
                        [target.id]: Number(e.target.value),
                      })
                    }
                  />
                </label>
              ))}
            </div>
          </>
        )}
        {kind === "qualityParameters" && (
          <>
            <p className="form-hint">{t("qualityHelp")}</p>
            <div className="form-grid">
              <label>
                {t("greenThreshold")}
                <input
                  required
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={item.green}
                  onChange={(e) => change("green", Number(e.target.value))}
                />
              </label>
              <label>
                {t("redThreshold")}
                <input
                  required
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={item.red}
                  onChange={(e) => change("red", Number(e.target.value))}
                />
              </label>
            </div>
          </>
        )}
        <div className="form-actions">
          <button type="button" className="button" onClick={close}>
            {t("cancel")}
          </button>
          <button className="button primary">
            <Icon name="check" />
            {t("apply")}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function Exchange({ c }) {
  const { t } = c;
  const [versions, setVersions] = useState([]),
    [file, setFile] = useState(null),
    [fileName, setFileName] = useState("");
  useEffect(() => {
    c.api("history/")
      .then((data) => setVersions(data.versions))
      .catch(c.setError);
  }, [c.state.revision]);
  async function choose(e) {
    const f = e.target.files[0];
    if (!f) return;
    try {
      const parsed = JSON.parse(await f.text());
      if (
        parsed.schema_version !== "0.1" ||
        !parsed.model ||
        !Array.isArray(parsed.actors) ||
        !Array.isArray(parsed.scenarios)
      )
        throw new Error("invalid");
      setFile(parsed);
      setFileName(f.name);
      c.setError(null);
    } catch {
      setFile(null);
      setFileName("");
      c.setError({ code: "invalid" });
    }
  }
  async function doImport() {
    if (!window.confirm(t("importConfirm"))) return;
    c.setBusy(true);
    try {
      const data = await c.api("import/", {
        method: "POST",
        data: { revision: c.state.revision, bundle: file },
      });
      c.acceptState(data);
      c.setNotice("importSuccess");
      setFile(null);
      setFileName("");
    } catch (e) {
      c.setError(e);
    } finally {
      c.setBusy(false);
    }
  }
  async function doExport() {
    try {
      if (c.readOnly) {
        c.backup();
        return;
      }
      const data = await c.api("export/");
      const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        }),
        url = URL.createObjectURL(blob),
        a = document.createElement("a");
      a.href = url;
      a.download = `potential-v0.1-r${c.state.revision}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      c.setError(e);
    }
  }
  return (
    <>
      <div className="exchange-grid">
        <Panel title={t("export")}>
          <div className="exchange-card-body">
            <span className="large-icon">
              <Icon name="download" />
            </span>
            <p>{t("exportHint")}</p>
            <dl className="exchange-stats">
              <div>
                <dt>{t("actors")}</dt>
                <dd>{c.bundle.actors.length}</dd>
              </div>
              <div>
                <dt>{t("scenarios")}</dt>
                <dd>{c.bundle.scenarios.length}</dd>
              </div>
              <div>
                <dt>{t("revision")}</dt>
                <dd>{c.state.revision}</dd>
              </div>
            </dl>
            <button
              className="button primary"
              disabled={c.dirty || c.busy}
              onClick={doExport}
            >
              <Icon name="download" />
              {t("export")}
            </button>
            {c.dirty && (
              <button className="text-button" onClick={c.backup}>
                {t("localBackup")}
              </button>
            )}
          </div>
        </Panel>
        <Panel title={t("import")}>
          <div className="exchange-card-body">
            <span className="large-icon">
              <Icon name="upload" />
            </span>
            <p>{t("importHint")}</p>
            <label className="file-drop">
              <Icon name="upload" />
              <strong>{fileName || t("chooseFile")}</strong>
              <small>JSON · v0.1</small>
              <input
                type="file"
                accept=".json,application/json"
                aria-label={t("chooseFile")}
                disabled={c.readOnly || c.busy || c.dirty}
                onChange={choose}
              />
            </label>
            {file && (
              <div className="import-summary">
                <Badge>
                  {file.actors.length} {t("actors")}
                </Badge>
                <Badge>
                  {file.scenarios.length} {t("scenarios")}
                </Badge>
              </div>
            )}
            <button
              className="button primary"
              disabled={!file || c.readOnly || c.busy || c.dirty}
              onClick={doImport}
            >
              <Icon name="check" />
              {t("import")}
            </button>
          </div>
        </Panel>
      </div>
      <Panel title={t("history")} subtitle={t("historyIntro")}>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>{t("revision")}</th>
                <th>{t("date")}</th>
                <th>{t("author")}</th>
                <th>{t("details")}</th>
              </tr>
            </thead>
            <tbody>
              {versions.map((v) => (
                <tr key={v.revision}>
                  <td>
                    <Badge>r{v.revision}</Badge>
                  </td>
                  <td>
                    {new Intl.DateTimeFormat(c.lang, {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "Europe/Zurich",
                    }).format(new Date(v.created_at))}
                  </td>
                  <td>{v.username || "—"}</td>
                  <td>
                    <button
                      className="text-button"
                      disabled={c.busy}
                      onClick={() => c.preview(v.revision)}
                    >
                      {t("preview")}
                      <Icon name="arrow" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!versions.length && <Empty c={c} />}
      </Panel>
    </>
  );
}

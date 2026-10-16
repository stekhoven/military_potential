export const languages = ["de", "fr", "it"];
export function local(value, lang) {
  return typeof value === "string" ? value : value?.[lang] || "—";
}
export function effectiveModel(bundle, scenarioId) {
  return (
    bundle.scenarios.find((s) => s.id === scenarioId)?.model || bundle.model
  );
}
export function selectedActors(bundle, ids) {
  return bundle.actors.filter((a) => ids.includes(a.id));
}
export function contrast(raw, gain) {
  return raw == null ? null : Math.min(5, Math.max(1, 3 + gain * (raw - 3)));
}
export function trend(values) {
  if (values?.[0] == null || values?.[2] == null) return null;
  return values[2] - values[0];
}
export function parseRating(value) {
  return value === "" ? null : Number(value);
}
export function uniqueId(prefix, items) {
  let n = 1;
  while (items.some((item) => item.id === `${prefix}${n}`)) n++;
  return `${prefix}${n}`;
}
export function missingLanguages(record) {
  return languages.filter((l) => !record?.[l]?.trim());
}
export function pruneAssessments(bundle) {
  const models = [
    bundle.model,
    ...bundle.scenarios.map((s) => s.model).filter(Boolean),
  ];
  const ids = new Set(models.flatMap((m) => m.indicators.map((i) => i.id)));
  bundle.actors.forEach((a) => {
    for (const id of Object.keys(a.assessments))
      if (!ids.has(id)) delete a.assessments[id];
  });
  return bundle;
}
export function sortedRows(rows, key, direction = 1) {
  return [...rows].sort((a, b) => {
    const av = a[key],
      bv = b[key];
    if (av == null) return bv == null ? 0 : 1;
    if (bv == null) return -1;
    return typeof av === "number" && typeof bv === "number"
      ? (av - bv) * direction
      : String(av).localeCompare(String(bv)) * direction;
  });
}
export function groupRows(rows) {
  const groups = new Map();
  for (const row of rows) {
    if (!groups.has(row.group)) groups.set(row.group, []);
    groups.get(row.group).push(row);
  }
  return [...groups].map(([group, members]) => ({ group, members }));
}

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Icon,
  Select,
  Badge,
  NumberValue,
  Percent,
  Trend,
  Panel,
  Empty,
  Rating,
  QualityDot,
  groupName,
} from "./ui.jsx";
import { sortedRows, groupRows } from "./utils.js";
import { errorMessage } from "./i18n.js";
export function useViewState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem(`potential.view.${key}`)) ?? initial
      );
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    localStorage.setItem(`potential.view.${key}`, JSON.stringify(value));
  }, [value, key]);
  return [value, setValue];
}
const colors = [
  "#21867d",
  "#da9958",
  "#5e80b6",
  "#ab7296",
  "#8a9856",
  "#8471ac",
];
const byId = (items, id) => items.find((x) => x.id === id);
const activeActors = (c) =>
  c.bundle.actors.filter((a) => c.actorIds.includes(a.id));
const resultFor = (c, id) => c.result?.actors?.find((a) => a.id === id);
const series = (obj, c) => obj?.[c.contrast ? "contrast" : "values"];
const contribution = (v, time) =>
  v?.[
    time === 0
      ? "contribution"
      : time === 1
        ? "future5_contribution"
        : "future10_contribution"
  ];

function ModeSwitch({ c }) {
  return (
    <div className="segmented" aria-label={c.t("contrast")}>
      {["original", "contrast"].map((k, i) => (
        <button
          key={k}
          aria-pressed={c.contrast === Boolean(i)}
          className={c.contrast === Boolean(i) ? "selected" : ""}
          onClick={() => c.setContrast(Boolean(i))}
        >
          {c.t(k)}
          {i === 1 && <span>g {c.scenario?.gain ?? 1}</span>}
        </button>
      ))}
    </div>
  );
}
function ErrorList({ c, errors }) {
  return errors?.length ? (
    <div className="engine-errors">
      {errors.map((code) => (
        <div className="alert warning" key={code}>
          <Icon name="alert" />
          {errorMessage(c.lang, code)}
        </div>
      ))}
    </div>
  ) : null;
}
function QualitySummary({ c, quality }) {
  return (
    <div className="quality-summary">
      <span>
        <QualityDot value={quality?.red_fraction} model={c.model} />
        {c.t("redFraction")}{" "}
        <strong>
          <Percent c={c} value={quality?.red_fraction} />
        </strong>
      </span>
      <span>
        {c.t("missingReliability")}{" "}
        <strong>{quality?.missing_reliability ?? "—"}</strong>
      </span>
    </div>
  );
}

export function Overview({ c }) {
  const { t, model, bundle, setTab } = c;
  const quality = c.actorResult?.quality;
  return (
    <>
      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-icon">
            <Icon name="check" />
          </span>
          <label>{t("completeness")}</label>
          <strong>
            <Percent c={c} value={quality?.coverage} />
          </strong>
          <p>
            {quality?.rated ?? "—"} /{" "}
            {quality?.active ??
              model.indicators.filter((i) => i.weight > 0).length}{" "}
            {t("indicators")} {t("rated")}
          </p>
          <div className="progress-track">
            <i style={{ width: `${(quality?.coverage ?? 0) * 100}%` }} />
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">
            <Icon name="users" />
          </span>
          <label>{t("actors")}</label>
          <strong>{bundle.actors.length.toString().padStart(2, "0")}</strong>
          <p>
            {activeActors(c)
              .map((a) => a.label)
              .join(" · ") || "—"}
          </p>
        </div>
        <div className="stat-card">
          <span className="stat-icon">
            <Icon name="network" />
          </span>
          <label>{t("model")}</label>
          <strong>
            {model.nodes.length}
            <small> + {model.targets.length}</small>
          </strong>
          <p>
            {t("nodes")} / {t("targets")} · {model.edges.length} {t("edges")}
          </p>
        </div>
        <div className="stat-card quality-stat">
          <span className="stat-icon">
            <Icon name="layers" />
          </span>
          <label>{t("quality")}</label>
          <strong>
            <QualityDot value={quality?.red_fraction} model={model} />
            <Percent c={c} value={quality?.red_fraction} />
          </strong>
          <p>
            {t("redFraction")} · {quality?.missing_reliability ?? "—"}{" "}
            {t("missingReliability")}
          </p>
        </div>
      </div>
      <div className="overview-main">
        <Panel
          title={t("factors")}
          subtitle={`${c.actor?.label ?? "—"} · ${t(["today", "future5", "future10"][c.time])}`}
          action={
            <button className="text-button" onClick={() => setTab("dashboard")}>
              {t("dashboard")}
              <Icon name="arrow" />
            </button>
          }
        >
          <div className="overview-factors">
            {model.targets.map((target, i) => {
              const r = c.actorResult?.targets?.[target.id];
              return (
                <button
                  className="factor-row"
                  key={target.id}
                  onClick={() => {
                    c.setSelectedTarget(target.id);
                    setTab("derivation");
                  }}
                >
                  <span className="factor-number">0{i + 1}</span>
                  <div>
                    <strong>{c.loc(target.label)}</strong>
                    <div className="value-track">
                      <i className="neutral-mark" />
                      <i
                        className="value-fill"
                        style={{
                          width: `${Math.max(0, ((r?.values?.[c.time] ?? 1) - 1) / 4) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <NumberValue c={c} value={r?.values?.[c.time]} />
                  <Trend c={c} values={r?.values} />
                  <Icon name="arrow" />
                </button>
              );
            })}
          </div>
        </Panel>
        <Panel className="workflow-panel" title={t("workspace")}>
          <div className="workflow-step">
            <span>01</span>
            <div>
              <h3>{t("continueAssessments")}</h3>
              <p>{t("assessmentsIntro")}</p>
              <button
                className="text-button"
                onClick={() => setTab("assessments")}
              >
                {t("assessments")}
                <Icon name="arrow" />
              </button>
            </div>
          </div>
          <div className="workflow-step">
            <span>02</span>
            <div>
              <h3>{t("compare")}</h3>
              <p>{t("dashboardIntro")}</p>
              <button
                className="text-button"
                onClick={() => setTab("dashboard")}
              >
                {t("dashboard")}
                <Icon name="arrow" />
              </button>
            </div>
          </div>
          <div className="workflow-step">
            <span>03</span>
            <div>
              <h3>{t("openNetwork")}</h3>
              <p>{t("networkIntro")}</p>
              <button className="text-button" onClick={() => setTab("network")}>
                {t("network")}
                <Icon name="arrow" />
              </button>
            </div>
          </div>
        </Panel>
      </div>
      <Panel title={t("quality")}>
        <QualitySummary c={c} quality={quality} />
        {bundle.actors.some((a) => a.is_example) && (
          <div className="subtle-note">
            <Icon name="info" />
            {t("exampleHint")}
          </div>
        )}
      </Panel>
      <ErrorList c={c} errors={c.actorResult?.errors} />
    </>
  );
}

export function Assessments({ c }) {
  const { t, model, actor, mutate } = c;
  const actorId = actor?.id || "",
    setActorId = (id) =>
      c.setActorIds([id, ...c.actorIds.filter((x) => x !== id)]);
  const [query, setQuery] = useViewState("assessmentQuery", ""),
    [group, setGroup] = useViewState("assessmentGroup", ""),
    [node, setNode] = useViewState("assessmentNode", c.selectedNode || ""),
    [onlyMissing, setOnlyMissing] = useViewState("assessmentMissing", false);
  useEffect(() => {
    if (c.selectedNode) {
      setNode(c.selectedNode);
      setGroup("");
    }
  }, [c.selectedNode]);
  const current = byId(c.bundle.actors, actorId) || actor;
  const groups = [...new Set(model.nodes.map((n) => n.group))];
  const indicators = model.indicators.filter((i) => {
    const n = byId(model.nodes, i.node_id);
    return (
      (!group || n?.group === group) &&
      (!node || i.node_id === node) &&
      (!onlyMissing || current?.assessments?.[i.id]?.value == null) &&
      `${i.id} ${c.loc(i.label)} ${c.loc(n?.label)}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  });
  function update(id, key, value) {
    if (!current) return;
    mutate((b) => {
      const a = byId(b.actors, current.id);
      a.assessments[id] = {
        value: null,
        future5: null,
        future10: null,
        reliability: "",
        note: "",
        ...a.assessments[id],
        [key]: value,
      };
    });
  }
  return (
    <>
      <Panel
        className="assessment-panel"
        title={t("assessments")}
        subtitle={t("futureHint")}
        action={
          <Badge>
            {indicators.length} / {model.indicators.length}
          </Badge>
        }
      >
        <div className="filter-bar">
          <Select
            label={t("actor")}
            value={current?.id}
            onChange={setActorId}
            options={c.bundle.actors.map((a) => ({ id: a.id, label: a.label }))}
          />
          <Select
            label={t("group")}
            value={group}
            onChange={(v) => {
              setGroup(v);
              setNode("");
            }}
            options={[
              { id: "", label: t("all") },
              ...groups.map((id) => ({ id, label: groupName(id, c) })),
            ]}
          />
          <Select
            label={t("node")}
            value={node}
            onChange={setNode}
            options={[
              { id: "", label: t("all") },
              ...model.nodes
                .filter((n) => !group || n.group === group)
                .map((n) => ({ id: n.id, label: c.loc(n.label) })),
            ]}
          />
          <label className="search-field">
            <Icon name="search" />
            <input
              aria-label={t("search")}
              placeholder={t("searchHint")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <label className="check-field">
            <input
              type="checkbox"
              checked={onlyMissing}
              onChange={(e) => setOnlyMissing(e.target.checked)}
            />
            {t("onlyMissing")}
          </label>
        </div>
        <div className="assessment-help">
          <Icon name="info" />
          {t("reliabilityHint")}
        </div>
        {!current ? (
          <Empty c={c}>{t("noActors")}</Empty>
        ) : !indicators.length ? (
          <Empty c={c}>{t("noResults")}</Empty>
        ) : (
          <div className="table-scroll">
            <table className="assessment-table">
              <thead>
                <tr>
                  <th>{t("indicator")}</th>
                  <th>{t("today")}</th>
                  <th>{t("reliability")}</th>
                  <th>{t("future5")}</th>
                  <th>{t("future10")}</th>
                  <th>{t("note")}</th>
                </tr>
              </thead>
              <tbody>
                {indicators.map((i) => {
                  const a = current.assessments[i.id] || {},
                    n = byId(model.nodes, i.node_id);
                  return (
                    <tr
                      key={i.id}
                      className={i.weight === 0 ? "disabled-row" : ""}
                    >
                      <td className="indicator-cell">
                        <span className="row-id">
                          {i.id} <span>· {c.loc(n?.label)}</span>
                        </span>
                        <strong>{c.loc(i.label)}</strong>
                        <details>
                          <summary>{t("definition")}</summary>
                          <p className="definition-text">
                            {c.loc(i.definition)}
                          </p>
                          <small>
                            {t("weight")}: {i.weight}
                          </small>
                        </details>
                      </td>
                      <td>
                        <Rating
                          label={`${c.loc(i.label)} · ${t("today")}`}
                          value={a.value}
                          disabled={c.readOnly}
                          onChange={(v) => update(i.id, "value", v)}
                        />
                        {a.value == null && (
                          <small className="missing-label">
                            {t("missing")}
                          </small>
                        )}
                      </td>
                      <td>
                        <select
                          aria-label={`${c.loc(i.label)} · ${t("reliability")}`}
                          value={a.reliability || ""}
                          disabled={c.readOnly}
                          onChange={(e) =>
                            update(i.id, "reliability", e.target.value)
                          }
                        >
                          <option value="">—</option>
                          {[
                            "A1",
                            "A2",
                            "A3",
                            "B1",
                            "B2",
                            "B3",
                            "C1",
                            "C2",
                            "C3",
                          ].map((v) => (
                            <option key={v}>{v}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <Rating
                          label={`${c.loc(i.label)} · ${t("future5")}`}
                          value={a.future5}
                          disabled={c.readOnly}
                          onChange={(v) => update(i.id, "future5", v)}
                        />
                      </td>
                      <td>
                        <Rating
                          label={`${c.loc(i.label)} · ${t("future10")}`}
                          value={a.future10}
                          disabled={c.readOnly}
                          onChange={(v) => update(i.id, "future10", v)}
                        />
                      </td>
                      <td>
                        <textarea
                          rows="2"
                          aria-label={`${c.loc(i.label)} · ${t("note")}`}
                          placeholder={t("noteHint")}
                          value={a.note || ""}
                          disabled={c.readOnly}
                          onChange={(e) => update(i.id, "note", e.target.value)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}

function EvolutionChart({ c, actors }) {
  const points = [90, 330, 570],
    scale = (v) => 240 - (v - 1) * 48;
  return (
    <>
      <svg
        className="evolution-chart"
        viewBox="0 0 660 300"
        role="img"
        aria-label={c.t("evolution")}
      >
        {[1, 2, 3, 4, 5].map((v) => (
          <g key={v}>
            <line
              x1="65"
              x2="605"
              y1={scale(v)}
              y2={scale(v)}
              stroke={v === 3 ? "#a8b4b5" : "#e9eeeb"}
              strokeDasharray={v === 3 ? "4 4" : undefined}
            />
            <text x="40" y={scale(v) + 4}>
              {v}
            </text>
          </g>
        ))}
        {[0, 1, 2].map((v) => (
          <text key={v} x={points[v]} y="278" textAnchor="middle">
            {c.t(["today", "future5", "future10"][v])}
          </text>
        ))}
        {actors.map((a, i) => {
          const values = series(resultFor(c, a.id)?.overall, c);
          if (!values?.every((v) => v != null)) return null;
          return (
            <g key={a.id}>
              <polyline
                points={values
                  .map((v, j) => `${points[j]},${scale(v)}`)
                  .join(" ")}
                fill="none"
                stroke={colors[i % colors.length]}
                strokeWidth="2.6"
              />
              {values.map((v, j) => (
                <circle
                  key={j}
                  cx={points[j]}
                  cy={scale(v)}
                  r="5"
                  fill="white"
                  stroke={colors[i % colors.length]}
                  strokeWidth="2.5"
                >
                  <title>{`${a.label} · ${c.t(["today", "future5", "future10"][j])}: ${v.toFixed(3)}`}</title>
                </circle>
              ))}
            </g>
          );
        })}
      </svg>
      <div className="chart-legend">
        {actors.map((a, i) => (
          <span key={a.id}>
            <i style={{ background: colors[i % colors.length] }} />
            {a.label}
          </span>
        ))}
      </div>
    </>
  );
}
export function Dashboard({ c }) {
  const actors = activeActors(c),
    { t, model } = c;
  return (
    <>
      <div className="view-toolbar">
        <ModeSwitch c={c} />
        <span className="muted">{t("trendHint")}</span>
      </div>
      {c.contrast && (
        <div className="subtle-note">
          <Icon name="info" />
          {t("contrastHint")}
        </div>
      )}
      {!actors.length ? (
        <Empty c={c}>{t("noActors")}</Empty>
      ) : (
        <>
          <div
            className="actor-cards"
            style={{ "--actor-count": Math.min(actors.length, 4) }}
          >
            {actors.map((a, i) => {
              const r = resultFor(c, a.id);
              return (
                <article className="actor-card" key={a.id}>
                  <header>
                    <span
                      className="actor-color"
                      style={{ background: colors[i % colors.length] }}
                    />
                    <strong>{a.label}</strong>
                    {a.is_example && <Badge>{t("example")}</Badge>}
                  </header>
                  <label>{t(c.contrast ? "contrastOverall" : "overall")}</label>
                  <div className="overall-number">
                    <NumberValue
                      c={c}
                      value={series(r?.overall, c)?.[c.time]}
                    />
                    <small>/ 5</small>
                  </div>
                  <div className="actor-card-footer">
                    <Trend c={c} values={series(r?.overall, c)} />
                    <span>
                      {t("completeness")}{" "}
                      <Percent c={c} value={r?.quality?.coverage} />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="dashboard-grid">
            <Panel
              title={t("factors")}
              action={
                <Badge>{t(["today", "future5", "future10"][c.time])}</Badge>
              }
            >
              <div className="comparison-bars">
                {model.targets.map((target) => (
                  <div className="comparison-group" key={target.id}>
                    <button
                      className="text-button factor-name"
                      onClick={() => {
                        c.setSelectedTarget(target.id);
                        c.setTab("derivation");
                      }}
                    >
                      {c.loc(target.label)}
                      <Icon name="arrow" />
                    </button>
                    {actors.map((a, i) => {
                      const v = series(
                        resultFor(c, a.id)?.targets?.[target.id],
                        c,
                      )?.[c.time];
                      return (
                        <div className="comparison-bar-row" key={a.id}>
                          <span>{a.label}</span>
                          <div className="value-track">
                            <i className="neutral-mark" />
                            <i
                              className="value-fill"
                              style={{
                                background: colors[i % colors.length],
                                width: `${Math.max(0, ((v ?? 1) - 1) / 4) * 100}%`,
                              }}
                            />
                          </div>
                          <NumberValue c={c} value={v} />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </Panel>
            <Panel
              title={t("evolution")}
              subtitle={t(c.contrast ? "contrastOverall" : "overall")}
            >
              <EvolutionChart c={c} actors={actors} />
              <p className="chart-hint">{t("trendHint")}</p>
            </Panel>
          </div>
          <Panel title={t("table")}>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>
                      {t("actor")} / {t("factors")}
                    </th>
                    <th>{t("today")}</th>
                    <th>{t("future5")}</th>
                    <th>{t("future10")}</th>
                    <th>{t("trend")}</th>
                  </tr>
                </thead>
                <tbody>
                  {actors.flatMap((a) => {
                    const r = resultFor(c, a.id);
                    return [
                      {
                        id: "overall",
                        label: t(c.contrast ? "contrastOverall" : "overall"),
                        data: r?.overall,
                      },
                      ...model.targets.map((target) => ({
                        id: target.id,
                        label: c.loc(target.label),
                        data: r?.targets?.[target.id],
                      })),
                    ].map((row) => (
                      <tr
                        className={row.id === "overall" ? "total-row" : ""}
                        key={`${a.id}-${row.id}`}
                      >
                        <td>
                          <small>{a.label}</small>
                          <strong>{row.label}</strong>
                        </td>
                        {[0, 1, 2].map((n) => (
                          <td key={n}>
                            <NumberValue
                              c={c}
                              value={series(row.data, c)?.[n]}
                            />
                          </td>
                        ))}
                        <td>
                          <Trend c={c} values={series(row.data, c)} />
                        </td>
                      </tr>
                    ));
                  })}
                </tbody>
              </table>
            </div>
          </Panel>
          <Panel title={t("quality")}>
            <div className="quality-comparison">
              {actors.map((a) => (
                <div key={a.id}>
                  <h3>{a.label}</h3>
                  <QualitySummary c={c} quality={resultFor(c, a.id)?.quality} />
                  <ErrorList c={c} errors={resultFor(c, a.id)?.errors} />
                </div>
              ))}
            </div>
          </Panel>
        </>
      )}
    </>
  );
}

export function NodeOverview({ c }) {
  const [query, setQuery] = useViewState("nodesQuery", ""),
    [sort, setSort] = useViewState("nodesSort", { key: "label", direction: 1 }),
    [collapsed, setCollapsed] = useViewState("nodesCollapsed", []);
  const actors = activeActors(c),
    { t, model } = c;
  let rows = model.nodes
    .filter((n) =>
      `${n.id} ${c.loc(n.label)}`.toLowerCase().includes(query.toLowerCase()),
    )
    .map((n) => ({
      ...n,
      label: c.loc(n.label),
      group: n.group,
      value: c.actorResult?.nodes?.[n.id]?.values?.[c.time],
    }));
  rows = sortedRows(rows, sort.key, sort.direction);
  const heading = (key, text) => (
    <button
      className="sort-button"
      onClick={() =>
        setSort({ key, direction: sort.key === key ? -sort.direction : 1 })
      }
    >
      {text}
      {sort.key === key ? (sort.direction === 1 ? " ↑" : " ↓") : " ↕"}
    </button>
  );
  return (
    <Panel title={t("nodeoverview")} subtitle={t("trendHint")}>
      <div className="filter-bar">
        <label className="search-field">
          <Icon name="search" />
          <input
            aria-label={t("search")}
            placeholder={t("searchHint")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <Badge>{t("propagated")}</Badge>
      </div>
      <div className="table-scroll">
        <table className="node-table">
          <thead>
            <tr>
              <th rowSpan="2">{heading("label", t("node"))}</th>
              <th rowSpan="2">{heading("group", t("group"))}</th>
              {actors.map((a) => (
                <th colSpan="4" key={a.id}>
                  {a.label}
                </th>
              ))}
            </tr>
            <tr>
              {actors.flatMap((a) => [
                ...["today", "future5", "future10", "trend"].map((k, i) => (
                  <th key={`${a.id}-${i}`}>{t(k)}</th>
                )),
              ])}
            </tr>
          </thead>
          <tbody>
            {groupRows(rows).map(({ group, members }) => (
              <React.Fragment key={group}>
                <tr className="group-row">
                  <th colSpan={2 + actors.length * 4}>
                    <button
                      className="group-toggle"
                      aria-expanded={!collapsed.includes(group)}
                      onClick={() =>
                        setCollapsed(
                          collapsed.includes(group)
                            ? collapsed.filter((x) => x !== group)
                            : [...collapsed, group],
                        )
                      }
                    >
                      <Icon name="chevron" />
                      {groupName(group, c)}
                      <Badge>{members.length}</Badge>
                    </button>
                  </th>
                </tr>
                {!collapsed.includes(group) &&
                  members.map((n) => (
                    <tr key={n.id}>
                      <td>
                        <button
                          className="table-link"
                          onClick={() => c.setSelectedNode(n.id)}
                        >
                          <small>{n.id}</small>
                          <strong>{n.label}</strong>
                        </button>
                      </td>
                      <td>
                        <Badge>{groupName(n.group, c)}</Badge>
                      </td>
                      {actors.flatMap((a) => {
                        const r = resultFor(c, a.id)?.nodes?.[n.id];
                        return [0, 1, 2]
                          .map((i) => (
                            <td key={`${a.id}-${i}`}>
                              <NumberValue c={c} value={r?.values?.[i]} />
                              {r?.missing && i === 0 && (
                                <small className="missing-label">
                                  {t("unassessed")}
                                </small>
                              )}
                            </td>
                          ))
                          .concat(
                            <td key={`${a.id}-trend`}>
                              <Trend c={c} values={r?.values} />
                            </td>,
                          );
                      })}
                    </tr>
                  ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {c.selectedNode && (
        <NodeDetails
          c={c}
          id={c.selectedNode}
          close={() => c.setSelectedNode(null)}
        />
      )}
    </Panel>
  );
}

export function Derivation({ c }) {
  const { t, model } = c;
  const actorId = c.actor?.id || "",
    setActorId = (id) =>
      c.setActorIds([id, ...c.actorIds.filter((x) => x !== id)]);
  const [sort, setSort] = useViewState("derivationSort", {
    key: "magnitude",
    direction: -1,
  });
  const a = byId(c.bundle.actors, actorId) || c.actor;
  const target = byId(model.targets, c.selectedTarget) || model.targets[0];
  const result = resultFor(c, a?.id);
  const tr = result?.targets?.[target?.id];
  let rows = (tr?.contributions || []).map((row) => ({
    ...row,
    label: c.loc(byId(model.nodes, row.node_id)?.label),
    selected: contribution(row, c.time),
    magnitude: Math.abs(contribution(row, c.time) ?? 0),
  }));
  rows = sortedRows(rows, sort.key, sort.direction);
  const sum = rows.reduce((s, r) => s + (r.selected || 0), 0),
    raw = tr?.raw?.[c.time],
    original = tr?.values?.[c.time],
    cv = tr?.contrast?.[c.time];
  return (
    <>
      <div className="view-toolbar">
        <div className="inline-selects">
          <Select
            label={t("actor")}
            value={a?.id}
            onChange={setActorId}
            options={c.bundle.actors.map((a) => ({ id: a.id, label: a.label }))}
          />
          <Select
            label={t("target")}
            value={target?.id}
            onChange={c.setSelectedTarget}
            options={model.targets.map((target) => ({
              id: target.id,
              label: c.loc(target.label),
            }))}
          />
        </div>
        <ModeSwitch c={c} />
      </div>
      <div className="derivation-stats">
        <div className="derivation-equation">
          <span>{t("neutral")}</span>
          <strong>3</strong>
          <b>+</b>
          <div>
            <span>{t("contribution")}</span>
            <strong>
              <NumberValue c={c} value={tr ? sum : null} signed digits={3} />
            </strong>
          </div>
          <b>=</b>
          <div>
            <span>{t("raw")}</span>
            <strong>
              <NumberValue c={c} value={raw} digits={3} />
            </strong>
          </div>
          <b>→</b>
          <div>
            <span>{t("original")}</span>
            <strong>
              <NumberValue c={c} value={original} digits={3} />
            </strong>
          </div>
        </div>
        {c.contrast && (
          <div className="contrast-equation">
            <label>
              {t("contrast")} · g {c.scenario?.gain ?? 1}
            </label>
            <strong>
              <NumberValue c={c} value={cv} digits={3} />
            </strong>
            <small>
              3 + {c.scenario?.gain ?? 1} × (
              <NumberValue c={c} value={raw} digits={3} /> − 3)
            </small>
            {raw != null &&
              Math.abs(cv - (3 + (c.scenario?.gain ?? 1) * (raw - 3))) >
                1e-8 && <Badge tone="warning">{t("clipped")}</Badge>}
          </div>
        )}
      </div>
      <Panel
        title={t("composition")}
        subtitle={
          target
            ? `${c.loc(target.label)} · ${t(["today", "future5", "future10"][c.time])}`
            : ""
        }
      >
        <div className="table-scroll">
          <table className="contribution-table">
            <thead>
              <tr>
                <th>
                  <button
                    className="sort-button"
                    onClick={() =>
                      setSort({
                        key: "label",
                        direction: sort.key === "label" ? -sort.direction : 1,
                      })
                    }
                  >
                    {t("node")} ↕
                  </button>
                </th>
                <th>{t("value")}</th>
                <th>{t("influence")}</th>
                <th>{t("leverage")}</th>
                <th>
                  <button
                    className="sort-button"
                    onClick={() =>
                      setSort({
                        key: "magnitude",
                        direction:
                          sort.key === "magnitude" ? -sort.direction : -1,
                      })
                    }
                  >
                    {t("contribution")} ↕
                  </button>
                </th>
                <th>{t("quality")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const n = result?.nodes?.[row.node_id];
                return (
                  <tr key={row.node_id}>
                    <td>
                      <button
                        className="table-link"
                        onClick={() => c.setSelectedNode(row.node_id)}
                      >
                        <small>{row.node_id}</small>
                        <strong>{row.label}</strong>
                      </button>
                    </td>
                    <td>
                      <NumberValue c={c} value={n?.direct?.[c.time]} />
                      {n?.missing && (
                        <small className="missing-label">
                          {t("unassessed")}
                        </small>
                      )}
                    </td>
                    <td>
                      <Percent c={c} value={row.influence} />
                    </td>
                    <td>
                      <NumberValue
                        c={c}
                        value={row.leverage}
                        signed
                        digits={3}
                      />
                    </td>
                    <td>
                      <div className="contribution-cell">
                        <span
                          className={`contribution-direction ${row.selected >= 0 ? "up" : "down"}`}
                        >
                          {row.selected >= 0 ? "↗" : "↘"}
                        </span>
                        <div className="diverging-track">
                          <i className="diverging-zero" />
                          <i
                            style={{
                              left:
                                row.selected >= 0
                                  ? "50%"
                                  : `${50 - Math.min(50, Math.abs(row.selected) * 100)}%`,
                              width: `${Math.min(50, Math.abs(row.selected) * 100)}%`,
                              background:
                                row.selected >= 0 ? "#21867d" : "#ba735e",
                            }}
                          />
                        </div>
                        <NumberValue
                          c={c}
                          value={row.selected}
                          signed
                          digits={3}
                        />
                      </div>
                    </td>
                    <td>
                      <QualityDot
                        value={
                          n?.quality?.red_fraction ??
                          (n?.quality?.count
                            ? n.quality.red / n.quality.count
                            : null)
                        }
                        model={model}
                      />
                      <Percent c={c} value={n?.coverage} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <th>{t("reconciliation")}</th>
                <td colSpan="5">
                  3 + <NumberValue c={c} value={sum} digits={4} /> ={" "}
                  <NumberValue c={c} value={raw} digits={4} /> →{" "}
                  <NumberValue c={c} value={original} digits={4} />
                  {raw != null && Math.abs(raw - original) > 1e-8 && (
                    <Badge>{t("clipped")}</Badge>
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        {!rows.length && <Empty c={c}>{t("notCalculable")}</Empty>}
      </Panel>
      <Panel title={t("rounds")}>
        <div className="round-grid">
          {(tr?.rounds || []).map((v, i) => (
            <div key={i}>
              <span>
                {t("round")} {i + 1}
              </span>
              <strong>
                <Percent c={c} value={v} />
              </strong>
              <div className="progress-track">
                <i
                  style={{ width: `${Math.min(100, Math.abs(v ?? 0) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Panel>
      {tr?.error && <ErrorList c={c} errors={[tr.error]} />}
      {c.selectedNode && (
        <NodeDetails
          c={{ ...c, actor: a, actorResult: result }}
          id={c.selectedNode}
          close={() => c.setSelectedNode(null)}
        />
      )}
    </>
  );
}

export function NodeDetails({ c, id, close, embedded = false }) {
  const { t, model, actor } = c;
  const node = byId(model.nodes, id),
    target = byId(model.targets, id),
    n = c.actorResult?.nodes?.[id],
    indicators = model.indicators.filter((i) => i.node_id === id),
    metrics = c.result?.metrics?.[id];
  const edges = model.edges.filter((e) => e.source === id || e.target === id);
  const label = c.loc((node || target)?.label);
  return (
    <aside
      className={`node-details ${embedded ? "embedded" : ""}`}
      role={embedded ? undefined : "dialog"}
      aria-label={label}
    >
      <header>
        <div>
          <span className="eyebrow">
            {id} / {t(target ? "target" : "node")}
          </span>
          <h2>{label}</h2>
        </div>
        <button className="icon-button" aria-label={t("close")} onClick={close}>
          <Icon name="close" />
        </button>
      </header>
      <div className="node-details-body">
        <p className="model-definition">
          {t(target ? "targetHelp" : "nodeHelp")}
        </p>
        {target ? (
          <>
            <h3>{t("factors")}</h3>
            <div className="node-time-values">
              {[0, 1, 2].map((i) => (
                <div key={i}>
                  <small>{t(["today", "future5", "future10"][i])}</small>
                  <strong>
                    <NumberValue
                      c={c}
                      value={c.actorResult?.targets?.[id]?.values?.[i]}
                    />
                  </strong>
                </div>
              ))}
            </div>
            <button
              className="button"
              onClick={() => {
                c.setSelectedTarget(id);
                c.setTab("derivation");
                close();
              }}
            >
              {t("openDerivation")}
              <Icon name="arrow" />
            </button>
          </>
        ) : (
          <>
            <div className="node-time-values">
              {[0, 1, 2].map((i) => (
                <div key={i}>
                  <small>{t(["today", "future5", "future10"][i])}</small>
                  <strong>
                    <NumberValue c={c} value={n?.values?.[i]} />
                  </strong>
                </div>
              ))}
            </div>
            {n?.missing && <Badge tone="warning">{t("unassessed")}</Badge>}
            <dl className="detail-metrics">
              <div>
                <dt>{t("completeness")}</dt>
                <dd>
                  <Percent c={c} value={n?.coverage} />
                </dd>
              </div>
              <div>
                <dt>{t("role")}</dt>
                <dd>{t(metrics?.role || n?.role || "unknown")}</dd>
              </div>
              <div>
                <dt>{t("influence")}</dt>
                <dd>
                  <NumberValue
                    c={c}
                    value={metrics?.influence ?? n?.influence}
                    digits={3}
                  />
                </dd>
              </div>
              <div>
                <dt>{t("leverage")}</dt>
                <dd>
                  <NumberValue
                    c={c}
                    value={metrics?.leverage ?? n?.leverage}
                    signed
                    digits={3}
                  />
                </dd>
              </div>
              <div>
                <dt>{t("controllability")}</dt>
                <dd>{t(node?.controllability || "unknown")}</dd>
              </div>
            </dl>
            <h3>
              {t("indicators")} <Badge>{indicators.length}</Badge>
            </h3>
            {indicators.map((i) => {
              const a = actor?.assessments?.[i.id] || {};
              return (
                <details className="indicator-detail" key={i.id}>
                  <summary>
                    <span>
                      <small>{i.id}</small>
                      <strong>{c.loc(i.label)}</strong>
                    </span>
                    <span className="indicator-summary-value">
                      {a.value ?? "—"}
                      <Badge>{a.reliability || "—"}</Badge>
                    </span>
                  </summary>
                  <p className="definition-text">{c.loc(i.definition)}</p>
                  <dl className="detail-metrics">
                    <div>
                      <dt>{t("weight")}</dt>
                      <dd>{i.weight}</dd>
                    </div>
                    <div>
                      <dt>{t("future5")}</dt>
                      <dd>{a.future5 ?? "—"}</dd>
                    </div>
                    <div>
                      <dt>{t("future10")}</dt>
                      <dd>{a.future10 ?? "—"}</dd>
                    </div>
                  </dl>
                  <h4>{t("note")}</h4>
                  <p className="source-note">{a.note || t("missing")}</p>
                </details>
              );
            })}
            <button
              className="button"
              onClick={() => {
                c.setSelectedNode(id);
                c.setTab("assessments");
              }}
            >
              {t("continueAssessments")}
              <Icon name="arrow" />
            </button>
          </>
        )}
        <h3>
          {t("connections")} <Badge>{edges.length}</Badge>
        </h3>
        <div className="edge-details-list">
          {edges.map((e) => (
            <div key={`${e.source}-${e.target}`}>
              <span>
                {e.source} → {e.target}
              </span>
              <Badge tone={e.strength < 0 ? "warning" : ""}>
                {e.strength > 0 ? "+" : ""}
                {e.strength}
                {e.term}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export function Network({ c }) {
  const { t, model } = c;
  const [group, setGroup] = useViewState("networkGroup", ""),
    [term, setTerm] = useViewState("networkTerm", ""),
    [sign, setSign] = useViewState("networkSign", ""),
    [strength, setStrength] = useViewState("networkStrength", ""),
    [direction, setDirection] = useViewState("networkDirection", "both"),
    [selected, setSelected] = useState(null),
    [view, setView] = useViewState("networkView", { x: 0, y: 0, scale: 1 });
  const drag = useRef(null);
  const groups = [...new Set(model.nodes.map((n) => n.group))];
  const allNodes = [
    ...model.nodes.map((n) => ({ ...n, kind: "node" })),
    ...model.targets.map((n) => ({ ...n, kind: "target", group: "targets" })),
  ];
  const visible = allNodes.filter(
    (n) => !group || n.group === group || n.kind === "target",
  );
  const ids = new Set(visible.map((n) => n.id));
  const edges = model.edges.filter(
    (e) =>
      ids.has(e.source) &&
      ids.has(e.target) &&
      (!term || e.term === term) &&
      (!sign || (sign === "positive" ? e.strength > 0 : e.strength < 0)) &&
      (!strength || Math.abs(e.strength) >= Number(strength)),
  );
  const positions = useMemo(() => {
    const p = {};
    const nodes = allNodes.filter((n) => n.kind === "node");
    const gs = [...new Set(nodes.map((n) => n.group))];
    gs.forEach((g, i) => {
      const members = nodes.filter((n) => n.group === g),
        angle = -Math.PI / 2 + (i * 2 * Math.PI) / gs.length;
      const cx = 450 + Math.cos(angle) * 260,
        cy = 330 + Math.sin(angle) * 225;
      members.forEach((n, j) => {
        const a = (j * 2 * Math.PI) / members.length;
        p[n.id] = {
          x: cx + Math.cos(a) * Math.min(65, 24 + members.length * 5),
          y: cy + Math.sin(a) * Math.min(65, 24 + members.length * 5),
        };
      });
    });
    model.targets.forEach((n, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / model.targets.length;
      p[n.id] = { x: 450 + Math.cos(a) * 105, y: 330 + Math.sin(a) * 85 };
    });
    return p;
  }, [model]);
  const highlighted = (e) =>
    !selected ||
    (direction === "incoming"
      ? e.target === selected
      : direction === "outgoing"
        ? e.source === selected
        : e.source === selected || e.target === selected);
  function selectNode(id) {
    setSelected(id);
    c.setSelectedNode(id);
  }
  const detailId =
    selected && allNodes.some((n) => n.id === selected) ? selected : null;
  return (
    <>
      <Panel className="network-panel">
        <div className="filter-bar">
          <Select
            label={t("actor")}
            value={c.actor?.id}
            onChange={(id) =>
              c.setActorIds([id, ...c.actorIds.filter((x) => x !== id)])
            }
            options={c.bundle.actors.map((a) => ({ id: a.id, label: a.label }))}
          />
          <Select
            label={t("group")}
            value={group}
            onChange={setGroup}
            options={[
              { id: "", label: t("all") },
              ...groups.map((id) => ({ id, label: groupName(id, c) })),
            ]}
          />
          <Select
            label={t("term")}
            value={term}
            onChange={setTerm}
            options={[
              { id: "", label: t("all") },
              ...["K", "M", "L"].map((id) => ({ id, label: id })),
            ]}
          />
          <Select
            label={t("sign")}
            value={sign}
            onChange={setSign}
            options={[
              { id: "", label: t("all") },
              { id: "positive", label: t("positive") },
              { id: "negative", label: t("negative") },
            ]}
          />
          <Select
            label={t("strength")}
            value={strength}
            onChange={setStrength}
            options={[
              { id: "", label: t("all") },
              ...["1", "2", "3"].map((id) => ({ id, label: `≥ ${id}` })),
            ]}
          />
          <Select
            label={t("direction")}
            value={direction}
            onChange={setDirection}
            options={["both", "incoming", "outgoing"].map((id) => ({
              id,
              label: t(id),
            }))}
          />
          <button
            className="button small"
            onClick={() => {
              setGroup("");
              setTerm("");
              setSign("");
              setStrength("");
              setDirection("both");
              setSelected(null);
              setView({ x: 0, y: 0, scale: 1 });
            }}
          >
            <Icon name="reset" />
            {t("reset")}
          </button>
        </div>
        <div className={`network-workspace ${detailId ? "with-detail" : ""}`}>
          <div className="network-canvas">
            <svg
              viewBox="0 0 900 670"
              role="img"
              aria-label={t("network")}
              onPointerDown={(e) => {
                if (e.target.closest("[data-node]")) return;
                drag.current = {
                  px: e.clientX,
                  py: e.clientY,
                  x: view.x,
                  y: view.y,
                };
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                if (!drag.current) return;
                const ratio =
                  900 / e.currentTarget.getBoundingClientRect().width;
                setView((v) => ({
                  ...v,
                  x: drag.current.x + (e.clientX - drag.current.px) * ratio,
                  y: drag.current.y + (e.clientY - drag.current.py) * ratio,
                }));
              }}
              onPointerUp={() => {
                drag.current = null;
              }}
              onPointerCancel={() => {
                drag.current = null;
              }}
            >
              <defs>
                <marker
                  id="arrow-positive"
                  markerWidth="8"
                  markerHeight="8"
                  refX="24"
                  refY="4"
                  orient="auto"
                  markerUnits="userSpaceOnUse"
                >
                  <path d="M0 0L8 4L0 8" fill="none" stroke="#588b87" />
                </marker>
                <marker
                  id="arrow-negative"
                  markerWidth="8"
                  markerHeight="8"
                  refX="24"
                  refY="4"
                  orient="auto"
                  markerUnits="userSpaceOnUse"
                >
                  <path d="M0 0L8 4L0 8" fill="none" stroke="#bc7762" />
                </marker>
              </defs>
              <g
                transform={`translate(${450 * (1 - view.scale) + view.x} ${335 * (1 - view.scale) + view.y}) scale(${view.scale})`}
              >
                <g className="network-edges">
                  {edges.map((e) => {
                    const s = positions[e.source],
                      d = positions[e.target];
                    if (!s || !d) return null;
                    const middleX = (s.x + d.x) / 2 + (d.y - s.y) * 0.06,
                      middleY = (s.y + d.y) / 2 - (d.x - s.x) * 0.06;
                    return (
                      <path
                        key={`${e.source}-${e.target}`}
                        d={`M${s.x},${s.y} Q${middleX},${middleY} ${d.x},${d.y}`}
                        fill="none"
                        stroke={e.strength > 0 ? "#588b87" : "#bc7762"}
                        opacity={
                          selected ? (highlighted(e) ? 0.85 : 0.06) : 0.22
                        }
                        strokeWidth={
                          highlighted(e)
                            ? Math.abs(e.strength) * 0.48 + 0.5
                            : 0.6
                        }
                        strokeDasharray={e.strength < 0 ? "4 3" : undefined}
                        markerEnd={`url(#arrow-${e.strength > 0 ? "positive" : "negative"})`}
                      >
                        <title>
                          {e.source} → {e.target}: {e.strength > 0 ? "+" : ""}
                          {e.strength}
                          {e.term}
                        </title>
                      </path>
                    );
                  })}
                </g>
                {visible.map((n) => {
                  const p = positions[n.id];
                  const isTarget = n.kind === "target",
                    v = (
                      isTarget
                        ? c.actorResult?.targets?.[n.id]
                        : c.actorResult?.nodes?.[n.id]
                    )?.values?.[c.time];
                  const gi = groups.indexOf(n.group);
                  return (
                    <g
                      key={n.id}
                      data-node={n.id}
                      role="button"
                      aria-label={`${n.id} · ${c.loc(n.label)} · ${v ?? t("missing")}`}
                      aria-pressed={selected === n.id}
                      tabIndex="0"
                      className={`network-node ${selected === n.id ? "selected" : ""}`}
                      transform={`translate(${p.x} ${p.y})`}
                      onClick={() => selectNode(n.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          selectNode(n.id);
                        }
                      }}
                    >
                      <title>{c.loc(n.label)}</title>
                      {selected === n.id && (
                        <circle
                          r="27"
                          fill="none"
                          stroke="#21867d"
                          strokeWidth="2"
                        />
                      )}
                      <circle
                        r={isTarget ? 23 : 19}
                        fill={isTarget ? "#152c3d" : "#fff"}
                        stroke={
                          isTarget ? "#152c3d" : colors[gi % colors.length]
                        }
                        strokeWidth="2"
                      />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={isTarget ? "white" : "#243f4e"}
                        className="node-id"
                      >
                        {n.id}
                      </text>
                      <text
                        textAnchor="middle"
                        y={isTarget ? 39 : 34}
                        className="node-caption"
                      >
                        {c.loc(n.label).length > 23
                          ? `${c.loc(n.label).slice(0, 22)}…`
                          : c.loc(n.label)}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
            <div className="network-controls">
              <button
                className="icon-button"
                aria-label={t("zoomIn")}
                onClick={() =>
                  setView((v) => ({ ...v, scale: Math.min(3, v.scale + 0.2) }))
                }
              >
                <Icon name="plus" />
              </button>
              <span>{Math.round(view.scale * 100)}%</span>
              <button
                className="icon-button"
                aria-label={t("zoomOut")}
                onClick={() =>
                  setView((v) => ({
                    ...v,
                    scale: Math.max(0.4, v.scale - 0.2),
                  }))
                }
              >
                <Icon name="minus" />
              </button>
              <button
                className="icon-button"
                aria-label={t("reset")}
                onClick={() => setView({ x: 0, y: 0, scale: 1 })}
              >
                <Icon name="reset" />
              </button>
            </div>
            <div className="network-legend">
              <span>
                <i className="edge-line" />
                {t("positive")}
              </span>
              <span>
                <i className="edge-line negative" />
                {t("negative")}
              </span>
              <span>
                {visible.length} {t("nodes")} · {edges.length} {t("edges")}
              </span>
            </div>
          </div>
          {detailId && (
            <NodeDetails
              c={c}
              id={detailId}
              embedded
              close={() => setSelected(null)}
            />
          )}
        </div>
        <p className="network-help">
          <Icon name="info" />
          {t("networkHelp")}
        </p>
      </Panel>
      <Panel title={t("table")}>
        <details className="network-table-details">
          <summary>
            {t("connections")} · {edges.length}
          </summary>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>{t("source")}</th>
                  <th>{t("destination")}</th>
                  <th>{t("strength")}</th>
                  <th>{t("term")}</th>
                </tr>
              </thead>
              <tbody>
                {edges.map((e) => (
                  <tr key={`${e.source}-${e.target}`}>
                    <td>
                      <button
                        className="table-link"
                        onClick={() => selectNode(e.source)}
                      >
                        {c.loc(byId(allNodes, e.source)?.label)}{" "}
                        <small>{e.source}</small>
                      </button>
                    </td>
                    <td>
                      <button
                        className="table-link"
                        onClick={() => selectNode(e.target)}
                      >
                        {c.loc(byId(allNodes, e.target)?.label)}{" "}
                        <small>{e.target}</small>
                      </button>
                    </td>
                    <td>
                      {e.strength > 0 ? "+" : ""}
                      {e.strength}
                    </td>
                    <td>{e.term}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </Panel>
    </>
  );
}

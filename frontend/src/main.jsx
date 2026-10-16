import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { translate, errorMessage } from "./i18n.js";
import { local, effectiveModel, pruneAssessments } from "./utils.js";
import { Icon, Select, Badge, Modal, ActorManager } from "./ui.jsx";
import {
  Overview,
  Assessments,
  Dashboard,
  NodeOverview,
  Derivation,
  Network,
} from "./views.jsx";
import { ModelView, Exchange } from "./management.jsx";
import "./styles.css";

const tabs = [
  ["overview", "grid"],
  ["assessments", "edit"],
  ["dashboard", "chart"],
  ["nodeoverview", "table"],
  ["derivation", "layers"],
  ["network", "network"],
  ["model", "sliders"],
  ["exchange", "exchange"],
];
function persist(key, initial) {
  try {
    return JSON.parse(localStorage.getItem(`potential.${key}`)) ?? initial;
  } catch {
    return initial;
  }
}
function App() {
  const [lang, setLang] = useState(() => persist("lang", "de"));
  const [tab, setTab] = useState(() => persist("tab", "overview"));
  const [scenarioId, setScenarioId] = useState(() => persist("scenario", ""));
  const [actorIds, setActorIds] = useState(() => persist("actors", []));
  const [time, setTime] = useState(() => persist("time", 0));
  const [contrast, setContrast] = useState(false);
  const [session, setSession] = useState(undefined),
    [state, setState] = useState(null),
    [bundle, setBundle] = useState(null);
  const [result, setResult] = useState(null),
    [dirty, setDirty] = useState(false),
    [busy, setBusy] = useState(false),
    [calculating, setCalculating] = useState(false);
  const [error, setError] = useState(null),
    [notice, setNotice] = useState(""),
    [historical, setHistorical] = useState(null),
    [actorModal, setActorModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null),
    [selectedTarget, setSelectedTarget] = useState("");
  const csrf = useRef(""),
    seq = useRef(0),
    dirtyRef = useRef(false),
    [credentials, setCredentials] = useState({ username: "", password: "" });
  const t = (key) => translate(lang, key),
    loc = (value) => local(value, lang);
  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem("potential.lang", JSON.stringify(lang));
  }, [lang]);
  useEffect(() => {
    for (const [k, v] of Object.entries({
      tab,
      scenario: scenarioId,
      actors: actorIds,
      time,
    }))
      localStorage.setItem(`potential.${k}`, JSON.stringify(v));
  }, [tab, scenarioId, actorIds, time]);
  useEffect(() => {
    dirtyRef.current = dirty;
  }, [dirty]);
  useEffect(() => {
    if (session && session.role !== "chief" && tab === "model")
      setTab("overview");
  }, [session?.role, tab]);
  useEffect(() => {
    const guard = (e) => {
      if (dirtyRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, []);
  async function api(path, { method = "GET", data } = {}) {
    let response;
    try {
      response = await fetch(`/api/${path}`, {
        method,
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrf.current,
        },
        body: data === undefined ? undefined : JSON.stringify(data),
      });
    } catch {
      throw { code: "connection" };
    }
    let body;
    try {
      body = await response.json();
    } catch {
      throw { code: "connection" };
    }
    if (!response.ok) {
      if (response.status === 401 && path !== "login/") setSession(null);
      throw {
        code:
          body.error ||
          (response.status === 409
            ? "CONFLICT"
            : response.status === 403
              ? "FORBIDDEN"
              : "invalid"),
        details: body.details,
      };
    }
    if (body.csrf_token) csrf.current = body.csrf_token;
    return body;
  }
  function acceptState(data) {
    setResult(null);
    setState(data);
    setBundle(data.bundle);
    setDirty(false);
    setError(null);
    setHistorical(null);
  }
  async function load() {
    if (dirty && !window.confirm(t("discardConfirm"))) return;
    setBusy(true);
    try {
      acceptState(await api("state/"));
    } catch (e) {
      setError(e);
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    (async () => {
      try {
        const s = await api("session/");
        setSession(s.user);
        if (s.user) acceptState(await api("state/"));
      } catch (e) {
        setSession(null);
        setError(e);
      }
    })();
  }, []);
  useEffect(() => {
    if (!bundle) return;
    const currentModel = effectiveModel(bundle, scenarioId);
    if (
      selectedNode &&
      !currentModel.nodes.some((n) => n.id === selectedNode) &&
      !currentModel.targets.some((n) => n.id === selectedNode)
    )
      setSelectedNode(null);
    if (
      selectedTarget &&
      !currentModel.targets.some((n) => n.id === selectedTarget)
    )
      setSelectedTarget("");
    if (!bundle.scenarios.some((s) => s.id === scenarioId))
      setScenarioId(bundle.scenarios[0]?.id || "");
    const valid = actorIds.filter((id) =>
      bundle.actors.some((a) => a.id === id),
    );
    if (
      valid.length !== actorIds.length ||
      (!valid.length && bundle.actors.length)
    )
      setActorIds(valid.length ? valid : bundle.actors.map((a) => a.id));
  }, [bundle]);
  useEffect(() => {
    if (!scenarioId) {
      setResult(null);
      return;
    }
    if (!state || dirty) return;
    const request = ++seq.current;
    setCalculating(true);
    (async () => {
      try {
        const r = await api("calculate/", {
          method: "POST",
          data: {
            revision: historical ?? state.revision,
            scenario_id: scenarioId,
          },
        });
        if (request === seq.current) setResult(r);
      } catch (e) {
        if (request === seq.current) {
          setError(e);
          setResult(null);
        }
      } finally {
        if (request === seq.current) setCalculating(false);
      }
    })();
  }, [state?.revision, scenarioId, historical, dirty]);
  async function login(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const s = await api("login/", { method: "POST", data: credentials });
      setSession(s.user);
      setCredentials({ username: "", password: "" });
      if (!dirtyRef.current) acceptState(await api("state/"));
    } catch (e) {
      setError(e);
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    if (dirty && !window.confirm(t("discardConfirm"))) return;
    setBusy(true);
    try {
      await api("logout/", { method: "POST", data: {} });
      setSession(null);
      setState(null);
      setBundle(null);
      setResult(null);
      setDirty(false);
    } catch (e) {
      setError(e);
    } finally {
      setBusy(false);
    }
  }
  function mutate(fn) {
    if (historical != null || busy) return;
    setBundle((old) => {
      const next = structuredClone(old);
      fn(next);
      return next;
    });
    setDirty(true);
    setNotice("");
  }
  async function save() {
    setBusy(true);
    setError(null);
    try {
      acceptState(
        await api("state/", {
          method: "PUT",
          data: {
            revision: state.revision,
            bundle: pruneAssessments(structuredClone(bundle)),
          },
        }),
      );
      setNotice("saved");
    } catch (e) {
      setError(e);
    } finally {
      setBusy(false);
    }
  }
  async function preview(revision) {
    if (dirty && !window.confirm(t("discardConfirm"))) return;
    setBusy(true);
    try {
      const data = await api(`history/${revision}/`);
      setBundle(data.bundle);
      setHistorical(revision);
      setDirty(false);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setBusy(false);
    }
  }
  async function restore() {
    if (!window.confirm(t("restoreConfirm"))) return;
    setBusy(true);
    try {
      const current = await api("state/");
      acceptState(
        await api("state/", {
          method: "PUT",
          data: { revision: current.revision, bundle },
        }),
      );
      setNotice("saved");
    } catch (e) {
      setError(e);
    } finally {
      setBusy(false);
    }
  }
  function backup() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `potential-local-${state?.revision ?? 0}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  const languages = (
    <Select
      label={t("language")}
      value={lang}
      onChange={setLang}
      className="language-select"
      options={["de", "fr", "it"].map((id) => ({
        id,
        label: { de: "Deutsch", fr: "Français", it: "Italiano" }[id],
      }))}
    />
  );
  if (session === undefined)
    return (
      <div className="initial-loading">
        <span className="brand-mark">
          <Icon name="network" />
        </span>
        <p>{t("loading")}</p>
      </div>
    );
  if (!session)
    return (
      <div className="login-page">
        <aside className="login-story">
          <div className="login-brand">
            <span className="brand-mark">
              <Icon name="network" />
            </span>
            <b>
              {t("app")}
              <small>{t("workspace").toUpperCase()} / 0.1</small>
            </b>
          </div>
          <div>
            <span className="eyebrow">PMESII · {t("domains")}</span>
            <h1>{t("loginTitle")}</h1>
            <p>{t("loginBody")}</p>
          </div>
          <svg className="login-art" viewBox="0 0 550 280" aria-hidden="true">
            <g fill="none" stroke="currentColor" strokeWidth="1">
              {Array.from({ length: 12 }, (_, i) => (
                <ellipse
                  key={i}
                  cx="280"
                  cy="180"
                  rx={70 + i * 15}
                  ry={20 + i * 8}
                  transform={`rotate(${i * 8} 280 180)`}
                />
              ))}
            </g>
          </svg>
          <span className="login-foot">{t("subtitle")} · v0.1</span>
        </aside>
        <main className="login-form-area">
          <div className="login-language">{languages}</div>
          <form onSubmit={login} className="login-form">
            <span className="eyebrow">{t("workspace")}</span>
            <h2>{t("login")}</h2>
            <p>{t("loginHint")}</p>
            {error && (
              <div className="alert error" role="alert">
                {errorMessage(lang, error)}
              </div>
            )}
            <label>
              {t("username")}
              <input
                name="username"
                autoComplete="username"
                required
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
              />
            </label>
            <label>
              {t("password")}
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
              />
            </label>
            <button className="button primary" disabled={busy}>
              {busy ? t("loading") : t("login")}
              <Icon name="arrow" />
            </button>
          </form>
        </main>
      </div>
    );
  if (!bundle)
    return (
      <div className="initial-loading">
        {error ? (
          <>
            <p>{errorMessage(lang, error)}</p>
            <button className="button" onClick={load}>
              {t("refresh")}
            </button>
          </>
        ) : (
          t("loading")
        )}
      </div>
    );
  const scenario = bundle.scenarios.find((s) => s.id === scenarioId),
    model = effectiveModel(bundle, scenarioId),
    chief = session.role === "chief",
    readOnly = historical != null;
  const actor =
      bundle.actors.find((a) => a.id === actorIds[0]) || bundle.actors[0],
    activeResult = !dirty && result?.scenario_id === scenarioId ? result : null,
    actorResult = activeResult?.actors?.find((a) => a.id === actor?.id);
  const c = {
    t,
    loc,
    lang,
    setLang,
    tab,
    setTab,
    scenario,
    scenarioId,
    setScenarioId,
    model,
    bundle,
    mutate,
    actorIds,
    setActorIds,
    actor,
    actorResult,
    result: activeResult,
    dirty,
    time,
    setTime,
    contrast,
    setContrast,
    chief,
    readOnly: readOnly || busy,
    selectedNode,
    setSelectedNode,
    selectedTarget,
    setSelectedTarget,
    api,
    setError,
    setNotice,
    acceptState,
    state,
    preview,
    busy,
    setBusy,
    backup,
  };
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        {t("workspace")}
      </a>
      <aside className="sidebar">
        <a
          className="brand"
          href="#overview"
          onClick={(e) => {
            e.preventDefault();
            setTab("overview");
          }}
        >
          <span className="brand-mark">
            <Icon name="network" />
          </span>
          <span>
            {t("app")}
            <small>{t("subtitle")}</small>
          </span>
        </a>
        <nav aria-label={t("workspace")}>
          {tabs
            .filter(([id]) => id !== "model" || chief)
            .map(([id, icon], i) => (
              <React.Fragment key={id}>
                {[0, 2, 6].includes(i) && (
                  <span className="nav-label">
                    {t(i === 0 ? "workspace" : i === 2 ? "explore" : "manage")}
                  </span>
                )}
                <button
                  className={`nav-item ${tab === id ? "active" : ""}`}
                  aria-current={tab === id ? "page" : undefined}
                  onClick={() => setTab(id)}
                >
                  <Icon name={icon} />
                  <span>{t(id)}</span>
                  {tab === id && <span className="nav-dot" />}
                </button>
              </React.Fragment>
            ))}
        </nav>
        <div className="sidebar-bottom">
          <span className="local-status">
            <i /> v0.1 · {t("revision")} {historical ?? state.revision}
          </span>
          <div className="user-card">
            <span className="avatar">
              {session.username.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <strong>{session.username}</strong>
              <small>{t(session.role)}</small>
            </div>
            <button
              className="icon-button"
              title={t("logout")}
              aria-label={t("logout")}
              onClick={logout}
            >
              <Icon name="logout" />
            </button>
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            {t("workspace")}
            <span>/</span>
            <strong>{t(tab)}</strong>
          </div>
          <div className="top-actions">
            <button
              className="icon-button mobile-logout"
              aria-label={t("logout")}
              onClick={logout}
            >
              <Icon name="logout" />
            </button>
            <span
              className={`save-state ${dirty ? "unsaved" : ""}`}
              role="status"
            >
              <i />
              {busy ? t("saving") : dirty ? t("dirty") : t("saved")}
            </span>
            {languages}
            <button
              className="button primary compact"
              onClick={save}
              disabled={!dirty || busy || readOnly}
            >
              <Icon name="save" />
              {t("save")}
            </button>
          </div>
        </header>
        <main id="main" className="main-content">
          <div className="page-heading">
            <div>
              <span className="eyebrow">
                {t(
                  tab === "overview"
                    ? "workspace"
                    : tab === "model"
                      ? "manage"
                      : "explore",
                )}{" "}
                / 0.1
              </span>
              <h1>{t(tab === "overview" ? "overviewTitle" : tab)}</h1>
              <p>
                {t(
                  {
                    overview: "overviewIntro",
                    assessments: "assessmentsIntro",
                    dashboard: "dashboardIntro",
                    nodeoverview: "nodesIntro",
                    derivation: "derivationIntro",
                    network: "networkIntro",
                    model: "modelIntro",
                    exchange: "exchangeIntro",
                  }[tab],
                )}
              </p>
            </div>
            <span className="version-tag">
              <i />
              {t("revision")} {historical ?? state.revision}
            </span>
          </div>
          {error && (
            <div className="alert error" role="alert">
              <Icon name="alert" />
              <div>
                <strong>{t("error")}</strong>
                <p>{errorMessage(lang, error)}</p>
                {error.code === "CONFLICT" && (
                  <div className="button-row">
                    <button className="button small" onClick={backup}>
                      {t("localBackup")}
                    </button>
                    <button className="button small" onClick={load}>
                      {t("refresh")}
                    </button>
                  </div>
                )}
              </div>
              <button
                className="icon-button"
                onClick={() => setError(null)}
                aria-label={t("close")}
              >
                <Icon name="close" />
              </button>
            </div>
          )}
          {notice && (
            <div className="alert success" role="status">
              {t(notice)}
            </div>
          )}
          {readOnly && (
            <div className="alert info">
              <Icon name="history" />
              <span>
                {t("historical")} · {historical}
              </span>
              <button className="button small" onClick={load}>
                {t("backCurrent")}
              </button>
              {chief && (
                <button className="button small" onClick={restore}>
                  {t("restore")}
                </button>
              )}
            </div>
          )}
          <section className="context-bar" aria-label={t("scenario")}>
            <Select
              label={t("scenario")}
              value={scenarioId}
              onChange={setScenarioId}
              options={bundle.scenarios.map((s) => ({
                id: s.id,
                label: loc(s.label),
              }))}
            />
            <div className="context-divider" />
            <details className="actor-picker">
              <summary>
                <span className="field-label">{t("actors")}</span>
                <strong>
                  <Icon name="users" />
                  {actorIds.length === 1
                    ? bundle.actors.find((a) => a.id === actorIds[0])?.label
                    : `${actorIds.length} ${t("selected")}`}
                  <Icon name="chevron" />
                </strong>
              </summary>
              <div className="actor-picker-popover">
                {bundle.actors.map((a) => (
                  <label key={a.id}>
                    <input
                      type="checkbox"
                      checked={actorIds.includes(a.id)}
                      onChange={(e) =>
                        setActorIds(
                          e.target.checked
                            ? [...actorIds, a.id]
                            : actorIds.filter((id) => id !== a.id),
                        )
                      }
                    />
                    {a.label}
                    {a.is_example && <Badge>{t("example")}</Badge>}
                  </label>
                ))}
                <button
                  className="text-button"
                  onClick={() => setActorModal(true)}
                >
                  <Icon name="plus" />
                  {t("actors")} {t("edit").toLowerCase()}
                </button>
              </div>
            </details>
            <div className="context-divider" />
            <Select
              label={t("time")}
              value={time}
              onChange={(v) => setTime(Number(v))}
              options={[0, 1, 2].map((id) => ({
                id,
                label: t(["today", "future5", "future10"][id]),
              }))}
            />
            <div className="context-spacer" />
            <span className="model-ref">
              {model.id}
              <small>
                {model.nodes.length} {t("nodes")} · {model.targets.length}{" "}
                {t("targets")}
              </small>
            </span>
          </section>
          {dirty && (
            <div className="pending-note">
              <Icon name="clock" />
              {t("saveHint")}
            </div>
          )}
          {calculating && (
            <div className="calculation-loading" role="status">
              {t("loading")}
            </div>
          )}
          <div
            className={
              dirty && tab !== "assessments" && tab !== "model"
                ? "results-stale"
                : ""
            }
          >
            {tab === "overview" && <Overview c={c} />}
            {tab === "assessments" && <Assessments c={c} />}
            {tab === "dashboard" && <Dashboard c={c} />}
            {tab === "nodeoverview" && <NodeOverview c={c} />}
            {tab === "derivation" && <Derivation c={c} />}
            {tab === "network" && <Network c={c} />}
            {tab === "model" && chief && <ModelView c={c} />}
            {tab === "exchange" && <Exchange c={c} />}
          </div>
          <footer className="page-footer">
            <span>
              {t("app")} <b>/</b> v0.1
            </span>
            <span>PMESII · {t("domains")}</span>
          </footer>
        </main>
      </div>
      {actorModal && <ActorManager c={c} close={() => setActorModal(false)} />}
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);

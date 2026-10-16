import React, { useState, useRef, useEffect } from "react";
import { uniqueId } from "./utils.js";

const paths = {
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  edit: "M12 20H4v-8M16 3l5 5-11 11-6 1 1-6zM14 5l5 5",
  chart: "M3 3v18h18M6 15l5-5 4 3 6-8",
  table: "M3 4h18v16H3zM3 9h18M9 9v11M15 9v11M3 15h18",
  layers: "M12 3l10 5-10 5L2 8zM2 12l10 5 10-5M2 16l10 5 10-5",
  network:
    "M8 6l8 4M7 9l3 8M17 13l-4 5M19 8V4M5 5H2M21 11h2M12 21v2M5 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8M19 8a3 3 0 1 0 0 6 3 3 0 0 0 0-6M11 17a3 3 0 1 0 0 6 3 3 0 0 0 0-6",
  sliders:
    "M5 3v7M5 14v7M12 3v3M12 10v11M19 3v11M19 18v3M2 10h6v4H2zM9 6h6v4H9zM16 14h6v4h-6z",
  exchange: "M4 7h15l-4-4M20 17H5l4 4M19 7l-4 4M5 17l4-4",
  history: "M3 10a9 9 0 1 1 2 8M3 4v6h6M12 7v5l3 2",
  users:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
  save: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12l4 4v12a2 2 0 0 1-2 2M7 3v6h10V3M7 21v-8h10v8",
  logout: "M9 3H4v18h5M14 8l5 4-5 4M8 12h13",
  arrow: "M4 12h16M14 6l6 6-6 6",
  chevron: "M6 9l6 6 6-6",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  close: "M6 6l12 12M18 6L6 18",
  alert: "M12 3L2 21h20zM12 9v5M12 17v1",
  clock: "M12 8v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0",
  search: "M21 21l-6-6M17 9a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  check: "M4 12l5 5L20 6",
  trash: "M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7",
  download: "M12 3v12M7 10l5 5 5-5M3 16v5h18v-5",
  upload: "M12 16V4M7 9l5-5 5 5M3 16v5h18v-5",
  reset: "M3 10a9 9 0 1 1 2 8M3 4v6h6",
  external: "M14 3h7v7M21 3l-9 9M10 3H3v18h18v-7",
  info: "M12 10v7M12 6v1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0",
};
export function Icon({ name, className = "" }) {
  return (
    <svg
      className={`icon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] || paths.grid} />
    </svg>
  );
}
export function Select({
  label,
  value,
  onChange,
  options,
  className = "",
  disabled = false,
}) {
  return (
    <label className={`select-field ${className}`}>
      <span className="field-label">{label}</span>
      <select
        aria-label={label}
        value={value ?? ""}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
export function Badge({ children, tone = "" }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}
export function NumberValue({ value, c, digits = 2, signed = false }) {
  return (
    <span className="numeric">
      {value == null
        ? "—"
        : new Intl.NumberFormat(c.lang, {
            minimumFractionDigits: digits,
            maximumFractionDigits: digits,
            signDisplay: signed ? "exceptZero" : "auto",
          }).format(value)}
    </span>
  );
}
export function Percent({ value, c }) {
  return (
    <span>
      {value == null
        ? "—"
        : new Intl.NumberFormat(c.lang, {
            style: "percent",
            maximumFractionDigits: 0,
          }).format(value)}
    </span>
  );
}
export function Trend({ values, c }) {
  const n =
    values?.[0] != null && values?.[2] != null ? values[2] - values[0] : null;
  return (
    <span
      className={`trend ${n == null ? "" : Math.abs(n) <= 0.05 ? "stable" : n > 0 ? "up" : "down"}`}
      title={c.t("trendHint")}
    >
      {n == null ? (
        "—"
      ) : (
        <>
          {Math.abs(n) <= 0.05 ? "→" : n > 0 ? "↗" : "↘"}{" "}
          <NumberValue c={c} value={n} signed />
        </>
      )}
    </span>
  );
}
export function Panel({ title, subtitle, action, children, className = "" }) {
  return (
    <section className={`panel ${className}`}>
      {title && (
        <header className="panel-heading">
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
export function Empty({ c, children }) {
  return (
    <div className="empty-state">
      <Icon name="layers" />
      <p>{children || c.t("empty")}</p>
    </div>
  );
}
export function Modal({
  title,
  onClose,
  children,
  footer,
  closeLabel = "Close",
}) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    ref.current?.focus();
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const els = ref.current?.querySelectorAll(
          'button,input,select,textarea,[tabindex="0"]',
        );
        const list = [...(els || [])].filter((x) => !x.disabled);
        if (!list.length) return;
        const first = list[0],
          last = list.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
      previous?.focus();
    };
  }, []);
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex="-1"
        ref={ref}
      >
        <header>
          <h2 id="modal-title">{title}</h2>
          <button
            className="icon-button"
            aria-label={closeLabel}
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
        </header>
        <div className="modal-body">{children}</div>
        {footer && <footer>{footer}</footer>}
      </section>
    </div>
  );
}
export function ActorManager({ c, close }) {
  const { t, bundle, mutate, readOnly } = c;
  const [name, setName] = useState("");
  return (
    <Modal title={t("actors")} closeLabel={t("close")} onClose={close}>
      <div className="actor-management">
        {bundle.actors.map((a) => (
          <div className="actor-manage-row" key={a.id}>
            <div>
              <strong>{a.label}</strong>
              {a.is_example && (
                <p>
                  <Badge>{t("example")}</Badge>
                  <small>{t("exampleHint")}</small>
                </p>
              )}
            </div>
            <div className="button-row">
              <button
                className="icon-button"
                disabled={readOnly || (a.is_example && !c.chief)}
                aria-label={`${t("edit")} ${a.label}`}
                onClick={() => {
                  const next = window.prompt(t("name"), a.label);
                  if (next?.trim())
                    mutate((b) => {
                      b.actors.find((x) => x.id === a.id).label = next.trim();
                    });
                }}
              >
                <Icon name="edit" />
              </button>
              <button
                className="icon-button danger"
                disabled={readOnly || (a.is_example && !c.chief)}
                aria-label={`${t("delete")} ${a.label}`}
                onClick={() => {
                  if (window.confirm(t("deleteActorConfirm")))
                    mutate((b) => {
                      b.actors = b.actors.filter((x) => x.id !== a.id);
                    });
                }}
              >
                <Icon name="trash" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <form
        className="inline-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          mutate((b) => {
            b.actors.push({
              id: uniqueId("actor-", b.actors),
              label: name.trim(),
              is_example: false,
              assessments: {},
            });
          });
          setName("");
        }}
      >
        <label>
          {t("newActor")}
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={readOnly}
          />
        </label>
        <button className="button primary" disabled={readOnly}>
          <Icon name="plus" />
          {t("add")}
        </button>
      </form>
    </Modal>
  );
}
export function Rating({ value, onChange, label, disabled }) {
  return (
    <select
      className={`rating-input ${value == null ? "missing-input" : ""}`}
      aria-label={label}
      value={value ?? ""}
      disabled={disabled}
      onChange={(e) =>
        onChange(e.target.value === "" ? null : Number(e.target.value))
      }
    >
      <option value="">—</option>
      {[1, 2, 3, 4, 5].map((n) => (
        <option value={n} key={n}>
          {n}
        </option>
      ))}
    </select>
  );
}
export function QualityDot({ value, model }) {
  const tone =
    value == null
      ? "unknown"
      : value <= model.quality_thresholds.green
        ? "good"
        : value > model.quality_thresholds.red
          ? "poor"
          : "medium";
  return <i className={`quality-dot ${tone}`} aria-hidden="true" />;
}
export function groupName(group, c) {
  const keys = {
    society: "social",
    P: "politics",
    Politik: "politics",
    M: "military",
    Militär: "military",
    E: "economy",
    Wirtschaft: "economy",
    S: "social",
    Gesellschaft: "social",
    I: "information",
    Information: "information",
    N: "infrastructure",
    Infrastruktur: "infrastructure",
    U: "environment",
    Umwelt: "environment",
    "Operative Domänen": "domains",
    Domänen: "domains",
  };
  return c.t(keys[group] || group);
}

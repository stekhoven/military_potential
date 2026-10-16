"""Strict, framework-independent validation for the public JSON interchange format."""

import math
import re

LANGUAGES = ("de", "fr", "it")
GROUPS = {"politics", "military", "economy", "society", "information",
          "infrastructure", "environment", "domains"}
RELIABILITIES = {""} | {a + b for a in "ABC" for b in "123"}


class ValidationError(ValueError):
    def __init__(self, code, path):
        self.code, self.path = code, path
        super().__init__(f"{code}: {path}")


def _fail(code, path):
    raise ValidationError(code, path)


def _object(value, required, path, optional=()):
    if not isinstance(value, dict):
        _fail("TYPE", path)
    if set(value) - set(required) - set(optional):
        _fail("UNKNOWN_FIELD", path)
    if set(required) - set(value):
        _fail("MISSING_FIELD", path)


def _text(value, path, empty=False, limit=100000):
    if not isinstance(value, str):
        _fail("TYPE", path)
    try:
        value.encode("utf-8")
    except UnicodeEncodeError:
        _fail("INVALID_UNICODE", path)
    # PostgreSQL JSONB/text cannot represent U+0000, although JSON syntax can.
    if "\x00" in value:
        _fail("INVALID_UNICODE", path)
    if len(value) > limit or (not empty and not value.strip()):
        _fail("INVALID_VALUE", path)


def _identifier(value, path):
    if not isinstance(value, str) or not re.fullmatch(r"[A-Za-z0-9_:-]{1,80}", value):
        _fail("INVALID_ID", path)


def _loc(value, path, empty=False):
    _object(value, LANGUAGES, path)
    for language in LANGUAGES:
        _text(value[language], f"{path}.{language}", empty=empty)


def _number(value, path, low=None, high=None, integer=False):
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        _fail("TYPE", path)
    try:
        finite = math.isfinite(value)
    except OverflowError:
        finite = False
    if not finite:
        _fail("NON_FINITE", path)
    if integer and not isinstance(value, int):
        _fail("TYPE", path)
    if (low is not None and value < low) or (high is not None and value > high):
        _fail("RANGE", path)


def _records(value, path):
    if not isinstance(value, list):
        _fail("TYPE", path)
    seen = set()
    for index, entry in enumerate(value):
        p = f"{path}[{index}]"
        if not isinstance(entry, dict) or "id" not in entry:
            _fail("MISSING_FIELD", p)
        _identifier(entry["id"], p + ".id")
        if entry["id"] in seen:
            _fail("DUPLICATE_ID", p)
        seen.add(entry["id"])
    return seen


def _model(model, path):
    _object(model, ("id", "label", "nodes", "targets", "indicators", "edges", "quality_thresholds"), path)
    _identifier(model["id"], path + ".id")
    _loc(model["label"], path + ".label")
    nodes = _records(model["nodes"], path + ".nodes")
    targets = _records(model["targets"], path + ".targets")
    indicators = _records(model["indicators"], path + ".indicators")
    if nodes & targets:
        _fail("DUPLICATE_ID", path + ".targets")
    for node in model["nodes"]:
        p = path + ".nodes." + node["id"]
        _object(node, ("id", "label", "group", "controllability"), p)
        _loc(node["label"], p + ".label")
        if not isinstance(node["group"], str) or not isinstance(node["controllability"], str):
            _fail("TYPE", p)
        if node["group"] not in GROUPS or node["controllability"] not in {"yes", "partial", "no"}:
            _fail("INVALID_VALUE", p)
    for target in model["targets"]:
        p = path + ".targets." + target["id"]
        _object(target, ("id", "label"), p)
        _loc(target["label"], p + ".label")
    for indicator in model["indicators"]:
        p = path + ".indicators." + indicator["id"]
        _object(indicator, ("id", "node_id", "label", "definition", "weight", "weight_note"), p)
        _identifier(indicator["node_id"], p + ".node_id")
        if indicator["node_id"] not in nodes:
            _fail("UNKNOWN_REFERENCE", p + ".node_id")
        _loc(indicator["label"], p + ".label")
        _loc(indicator["definition"], p + ".definition")
        _number(indicator["weight"], p + ".weight", 0, 10)
        _text(indicator["weight_note"], p + ".weight_note", empty=True)
    if not isinstance(model["edges"], list):
        _fail("TYPE", path + ".edges")
    pairs = set()
    for index, edge in enumerate(model["edges"]):
        p = f"{path}.edges[{index}]"
        _object(edge, ("source", "target", "strength", "term"), p)
        _identifier(edge["source"], p + ".source")
        _identifier(edge["target"], p + ".target")
        if edge["source"] not in nodes or edge["target"] not in nodes | targets:
            _fail("UNKNOWN_REFERENCE", p)
        pair = edge["source"], edge["target"]
        if pair in pairs:
            _fail("DUPLICATE_EDGE", p)
        pairs.add(pair)
        _number(edge["strength"], p + ".strength", -3, 3, integer=True)
        if not isinstance(edge["term"], str):
            _fail("TYPE", p + ".term")
        if edge["strength"] == 0 or edge["term"] not in {"K", "M", "L"}:
            _fail("INVALID_VALUE", p)
    thresholds = model["quality_thresholds"]
    _object(thresholds, ("green", "red"), path + ".quality_thresholds")
    for key in thresholds:
        _number(thresholds[key], path + ".quality_thresholds." + key, 0, 1)
    if thresholds["green"] >= thresholds["red"]:
        _fail("RANGE", path + ".quality_thresholds")
    return indicators, targets


def validate_bundle(bundle):
    """Validate without mutation; failures carry a machine code and JSON path.

    Assessments may refer to indicators retained by any scenario model. This
    preserves assessments when a scenario removes an indicator from its variant.
    References absent from every current model are rejected, never defaulted.
    """
    _object(bundle, ("schema_version", "model", "scenarios", "actors"), "bundle")
    if bundle["schema_version"] != "0.1":
        _fail("SCHEMA_VERSION", "schema_version")
    indicators, base_targets = _model(bundle["model"], "model")
    _records(bundle["scenarios"], "scenarios")
    _records(bundle["actors"], "actors")
    all_indicators = set(indicators)
    for scenario in bundle["scenarios"]:
        p = "scenarios." + scenario["id"]
        _object(scenario, ("id", "label", "description", "weights", "gain"), p, optional=("model",))
        _loc(scenario["label"], p + ".label")
        _loc(scenario["description"], p + ".description", empty=True)
        target_ids = base_targets
        if scenario.get("model") is not None:
            extra_indicators, target_ids = _model(scenario["model"], p + ".model")
            all_indicators.update(extra_indicators)
        _object(scenario["weights"], target_ids, p + ".weights")
        for target_id, weight in scenario["weights"].items():
            _number(weight, p + ".weights." + target_id, 0, 3, integer=True)
        _number(scenario["gain"], p + ".gain", low=0)
        if scenario["gain"] == 0:
            _fail("RANGE", p + ".gain")
    for actor in bundle["actors"]:
        p = "actors." + actor["id"]
        _object(actor, ("id", "label", "is_example", "assessments"), p)
        _text(actor["label"], p + ".label", limit=200)
        if not isinstance(actor["is_example"], bool):
            _fail("TYPE", p + ".is_example")
        if not isinstance(actor["assessments"], dict):
            _fail("TYPE", p + ".assessments")
        for indicator_id, assessment in actor["assessments"].items():
            _identifier(indicator_id, p + ".assessments")
            ap = p + ".assessments." + str(indicator_id)
            if indicator_id not in all_indicators:
                _fail("UNKNOWN_REFERENCE", ap)
            _object(assessment, ("value", "future5", "future10", "reliability", "note"), ap)
            for field in ("value", "future5", "future10"):
                if assessment[field] is not None:
                    _number(assessment[field], ap + "." + field, 1, 5, integer=True)
            if not isinstance(assessment["reliability"], str):
                _fail("TYPE", ap + ".reliability")
            if assessment["reliability"] not in RELIABILITIES:
                _fail("INVALID_VALUE", ap + ".reliability")
            _text(assessment["note"], ap + ".note", empty=True)

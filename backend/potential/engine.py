"""Auditable v7 calculations. No Excel evaluation or framework dependencies."""

from .validation import validate_bundle


def _clip(value):
    return min(5.0, max(1.0, value))


def _multiply(a, b):
    size = len(a)
    result = [[0.0] * size for _ in range(size)]
    for i, row in enumerate(a):
        for k, value in enumerate(row):
            if value:
                for j, other in enumerate(b[k]):
                    if other:
                        result[i][j] += value * other
    return result


def _four_rounds(matrix):
    powers = [matrix]
    for _ in range(3):
        powers.append(_multiply(powers[-1], matrix))
    size = len(matrix)
    total = [[sum(power[i][j] for power in powers) for j in range(size)] for i in range(size)]
    return total, powers


def _quality(indicators, assessments):
    active = [item for item in indicators if item["weight"] > 0]
    rated = sum(assessments.get(item["id"], {}).get("value") is not None for item in active)
    codes = [assessments.get(item["id"], {}).get("reliability", "") for item in active]
    count = sum(bool(code) for code in codes)
    red = sum(bool(code) and (code[0] == "C" or code[1] == "3") for code in codes)
    return {"coverage": rated / len(active) if active else None,
            "red_fraction": red / count if count else None,
            "rated": rated, "active": len(active), "missing_reliability": len(active) - count,
            "red": red, "count": count}


def calculate(bundle, scenario_id):
    """Return three horizons [today, 5 years, 10 years] for every actor.

    Matrix orientation is source row -> receiving column. The full-network
    normalizer and target denominator are retained for the five-year network.
    Future target changes use direct deltas once, never propagated node deltas.
    """
    validate_bundle(bundle)
    scenario = next((s for s in bundle["scenarios"] if s["id"] == scenario_id), None)
    if scenario is None:
        raise ValueError("UNKNOWN_SCENARIO: " + str(scenario_id))
    model = scenario.get("model") or bundle["model"]
    nodes, targets = model["nodes"], model["targets"]
    ordered = nodes + targets
    index = {item["id"]: i for i, item in enumerate(ordered)}
    size, node_count = len(ordered), len(nodes)
    direct = [[0.0] * size for _ in range(size)]
    for edge in model["edges"]:
        direct[index[edge["source"]]][index[edge["target"]]] = edge["strength"]
    normalizer = max([sum(abs(x) for x in row) for row in direct] +
                     [sum(abs(direct[i][j]) for i in range(size)) for j in range(size)] + [0])
    n = [[value / normalizer if normalizer else 0.0 for value in row] for row in direct]
    n5 = [row[:] for row in n]
    for edge in model["edges"]:
        if edge["term"] == "L":
            n5[index[edge["source"]]][index[edge["target"]]] = 0.0
    total, powers = _four_rounds(n)
    total5, _ = _four_rounds(n5)
    q = {t["id"]: sum(abs(total[i][index[t["id"]]]) for i in range(node_count)) for t in targets}
    weights, weight_sum = scenario["weights"], sum(scenario["weights"].values())
    active_sums = [sum(abs(x) for x in row[:node_count]) for row in direct[:node_count]]
    passive_sums = [sum(abs(direct[i][j]) for i in range(node_count)) for j in range(node_count)]
    mean_active = sum(active_sums) / node_count if node_count else 0
    mean_passive = sum(passive_sums) / node_count if node_count else 0
    metrics = {}
    for i, node in enumerate(nodes):
        active, passive = active_sums[i] > mean_active, passive_sums[i] > mean_passive
        role = "critical" if active and passive else "active" if active else "passive" if passive else "inert"
        can_aggregate = weight_sum > 0 and all(q[t["id"]] > 0 for t in targets if weights[t["id"]] > 0)
        leverage = (sum(total[i][index[t["id"]]] / q[t["id"]] * weights[t["id"]]
                        for t in targets if weights[t["id"]] > 0) / weight_sum) if can_aggregate else None
        influence = (sum(abs(total[i][index[t["id"]]] / q[t["id"]]) * weights[t["id"]]
                         for t in targets if weights[t["id"]] > 0) / weight_sum) if can_aggregate else None
        metrics[node["id"]] = {"role": role, "influence": influence, "leverage": leverage,
                                "controllability": node["controllability"]}
    result_actors = []
    for actor in bundle["actors"]:
        assessments = actor["assessments"]
        actor_nodes, errors = {}, []
        if not normalizer:
            errors.append("NORMALIZATION_ZERO")
        if not weight_sum:
            errors.append("SCENARIO_WEIGHTS_ZERO")
        values = []
        for node in nodes:
            indicators = [item for item in model["indicators"] if item["node_id"] == node["id"]]
            available = [(item, assessments.get(item["id"], {})) for item in indicators
                         if item["weight"] > 0 and assessments.get(item["id"], {}).get("value") is not None]
            divisor = sum(item["weight"] for item, _ in available)
            means = [0.0, 0.0, 0.0]
            for item, assessment in available:
                today = assessment["value"]
                five = assessment.get("future5") if assessment.get("future5") is not None else today
                ten = assessment.get("future10") if assessment.get("future10") is not None else five
                for k, value in enumerate((today, five, ten)):
                    means[k] += item["weight"] * value
            means = [value / divisor for value in means] if divisor else [3.0, 3.0, 3.0]
            quality = _quality(indicators, assessments)
            actor_nodes[node["id"]] = {"direct": means, "values": means[:], "missing": not bool(divisor),
                "coverage": quality["coverage"],
                "quality": {"red": quality["red"], "missing": quality["missing_reliability"], "count": quality["count"]},
                **{key: metrics[node["id"]][key] for key in ("influence", "leverage", "role")}}
            values.append(means)
        delta5 = [row[1] - row[0] for row in values]
        delta10 = [row[2] - row[0] for row in values]
        for j, node in enumerate(nodes):
            actor_nodes[node["id"]]["values"] = [values[j][0],
                _clip(values[j][1] + sum(delta5[i] * total5[i][j] for i in range(node_count))) if normalizer else None,
                _clip(values[j][2] + sum(delta10[i] * total[i][j] for i in range(node_count))) if normalizer else None]
        actor_targets = {}
        for target in targets:
            tid, j = target["id"], index[target["id"]]
            if not q[tid]:
                error = "NORMALIZATION_ZERO" if not normalizer else "TARGET_UNREACHABLE"
                if normalizer:
                    errors.append(error + ":" + tid)
                actor_targets[tid] = {"raw": [None] * 3, "values": [None] * 3, "contrast": [None] * 3,
                                      "contributions": [], "rounds": [0.0] * 4, "error": error}
                continue
            contributions = []
            for i, node in enumerate(nodes):
                h, h5 = total[i][j] / q[tid], total5[i][j] / q[tid]
                contribution = h * (values[i][0] - 3)
                contributions.append({"node_id": node["id"], "value": values[i][0], "influence": abs(h),
                    "leverage": h, "contribution": contribution,
                    "future5_contribution": contribution + h5 * delta5[i],
                    "future10_contribution": contribution + h * delta10[i]})
            raw = [3 + sum(c[key] for c in contributions) for key in
                   ("contribution", "future5_contribution", "future10_contribution")]
            round_sums = [sum(abs(power[i][j]) for i in range(node_count)) for power in powers]
            rounds_divisor = sum(round_sums)
            actor_targets[tid] = {"raw": raw, "values": [_clip(x) for x in raw],
                "contrast": [_clip(3 + scenario["gain"] * (x - 3)) for x in raw],
                "contributions": contributions,
                "rounds": [x / rounds_divisor for x in round_sums] if rounds_divisor else [0.0] * 4,
                "error": None}
        overall = {}
        for field in ("raw", "values", "contrast"):
            overall[field] = [sum(actor_targets[t["id"]][field][k] * weights[t["id"]]
                                  for t in targets if weights[t["id"]] > 0) / weight_sum
                              if weight_sum and all(actor_targets[t["id"]][field][k] is not None
                                  for t in targets if weights[t["id"]] > 0) else None for k in range(3)]
        quality = _quality(model["indicators"], assessments)
        result_actors.append({"id": actor["id"], "nodes": actor_nodes, "targets": actor_targets,
            "overall": overall, "quality": {key: quality[key] for key in
                ("coverage", "red_fraction", "rated", "active", "missing_reliability")}, "errors": errors})
    return {"scenario_id": scenario_id, "actors": result_actors, "metrics": metrics,
            "network": {"nodes": [{"id": n["id"], "kind": "node", "group": n["group"]} for n in nodes] +
                                  [{"id": t["id"], "kind": "target", "group": "targets"} for t in targets],
                        "edges": [edge.copy() for edge in model["edges"]]}}

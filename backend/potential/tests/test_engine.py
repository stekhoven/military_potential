"""Synthetic boundary/regression tests plus read-only v7 cached references."""

import copy
import json
import math
import unittest
from pathlib import Path

from potential.engine import calculate
from potential.importer import WorkbookReader, load_workbook
from potential.validation import ValidationError, validate_bundle


def loc(text):
    return {language: text for language in ("de", "fr", "it")}


def assessment(value=None, future5=None, future10=None, reliability="", note=""):
    return {"value": value, "future5": future5, "future10": future10,
            "reliability": reliability, "note": note}


def fixture():
    return {"schema_version": "0.1", "model": {"id": "synthetic", "label": loc("Test"),
        "nodes": [{"id": "N1", "label": loc("Node 1"), "group": "military", "controllability": "yes"},
                  {"id": "N2", "label": loc("Node 2"), "group": "environment", "controllability": "no"}],
        "targets": [{"id": "X1", "label": loc("Target")}],
        "indicators": [{"id": "I1", "node_id": "N1", "label": loc("Indicator 1"),
                        "definition": loc("Definition 1"), "weight": 1, "weight_note": ""},
                       {"id": "I2", "node_id": "N2", "label": loc("Indicator 2"),
                        "definition": loc("Definition 2"), "weight": 1, "weight_note": ""}],
        "edges": [{"source": "N1", "target": "X1", "strength": 1, "term": "K"},
                  {"source": "N2", "target": "X1", "strength": 3, "term": "L"}],
        "quality_thresholds": {"green": .1, "red": .25}},
        "scenarios": [{"id": "S1", "label": loc("Scenario"), "description": loc(""),
                       "weights": {"X1": 1}, "gain": 1}],
        "actors": [{"id": "a", "label": "Actor", "is_example": False,
                    "assessments": {"I1": assessment(4, 5, 5, "A1"), "I2": assessment(2, 3, 4, "C3")}}]}


def result(bundle):
    return calculate(bundle, "S1")["actors"][0]


class EngineTests(unittest.TestCase):
    def test_full_denominator_for_five_year_horizon(self):
        actor = result(fixture())
        self.assertEqual(actor["targets"]["X1"]["raw"], [2.5, 2.75, 4.25])
        self.assertEqual(actor["nodes"]["N2"]["values"], [2, 3, 4])

    def test_future_fallback_and_missing_today(self):
        bundle = fixture()
        a = bundle["actors"][0]["assessments"]
        a["I1"] = assessment(4)
        a["I2"] = assessment(None, 5, 1)
        actor = result(bundle)
        self.assertEqual(actor["nodes"]["N1"]["direct"], [4] * 3)
        self.assertEqual(actor["nodes"]["N2"]["direct"], [3] * 3)
        self.assertTrue(actor["nodes"]["N2"]["missing"])
        self.assertEqual(actor["quality"]["coverage"], .5)
        a["I1"] = assessment(4, 2)
        self.assertEqual(result(bundle)["nodes"]["N1"]["direct"], [4, 2, 2])

    def test_zero_weight_excluded_from_both_coverage_counts(self):
        bundle = fixture()
        bundle["model"]["indicators"][1]["weight"] = 0
        actor = result(bundle)
        self.assertEqual(actor["quality"]["coverage"], 1)
        self.assertEqual(actor["quality"]["active"], 1)
        self.assertEqual(actor["quality"]["rated"], 1)
        self.assertTrue(actor["nodes"]["N2"]["missing"])
        self.assertIsNone(actor["nodes"]["N2"]["coverage"])
        bundle["model"]["indicators"][0]["weight"] = 0
        self.assertIsNone(result(bundle)["quality"]["coverage"])

    def test_no_double_feed_of_propagated_nodes_and_four_rounds(self):
        bundle = fixture()
        bundle["model"]["edges"] = [
            {"source": "N1", "target": "N2", "strength": 1, "term": "K"},
            {"source": "N2", "target": "X1", "strength": 1, "term": "K"}]
        a = bundle["actors"][0]["assessments"]
        a["I1"], a["I2"] = assessment(3, 4), assessment(3)
        actor = result(bundle)
        self.assertEqual(actor["nodes"]["N2"]["values"], [3, 4, 4])
        self.assertEqual(actor["targets"]["X1"]["raw"], [3, 3.5, 3.5])
        self.assertEqual(actor["targets"]["X1"]["rounds"], [.5, .5, 0, 0])
        for time, key in enumerate(("contribution", "future5_contribution", "future10_contribution")):
            self.assertEqual(3 + sum(c[key] for c in actor["targets"]["X1"]["contributions"]),
                             actor["targets"]["X1"]["raw"][time])

    def test_signed_edges_and_reliability_independent(self):
        bundle = fixture()
        bundle["model"]["edges"][1]["strength"] = -3
        first = result(bundle)
        bundle["actors"][0]["assessments"]["I1"]["reliability"] = "C3"
        second = result(bundle)
        self.assertEqual(first["targets"], second["targets"])
        self.assertNotEqual(first["quality"]["red_fraction"], second["quality"]["red_fraction"])
        self.assertEqual(first["targets"]["X1"]["raw"][0], 4)

    def test_contrast_neutral_clipping_and_common_basis(self):
        bundle = fixture()
        bundle["scenarios"][0]["gain"] = 1.25
        a = result(bundle)
        self.assertEqual(a["targets"]["X1"]["raw"][0], 2.5)
        self.assertEqual(a["targets"]["X1"]["contrast"][0], 2.375)
        bundle["scenarios"][0]["gain"] = 2
        a = result(bundle)
        self.assertEqual(a["targets"]["X1"]["contrast"][2], 5)
        self.assertEqual(a["overall"]["contrast"], a["targets"]["X1"]["contrast"])
        for item in bundle["actors"][0]["assessments"].values():
            item.update(value=3, future5=3, future10=3)
        self.assertEqual(result(bundle)["targets"]["X1"]["contrast"], [3] * 3)
        for gain in (1e308, 5e-324):
            extreme = fixture()
            extreme["scenarios"][0]["gain"] = gain
            computed = result(extreme)
            json.dumps(computed, allow_nan=False)
            self.assertTrue(all(1 <= value <= 5 for value in computed["targets"]["X1"]["contrast"]))

    def test_unreachable_zero_normalizer_and_zero_weights_reported(self):
        bundle = fixture()
        bundle["model"]["edges"] = []
        a = result(bundle)
        self.assertEqual(a["targets"]["X1"]["raw"], [None] * 3)
        self.assertIn("NORMALIZATION_ZERO", a["errors"])
        self.assertEqual(a["nodes"]["N1"]["direct"], [4, 5, 5])
        bundle["model"]["edges"] = [{"source": "N1", "target": "N2", "strength": 1, "term": "K"}]
        self.assertIn("TARGET_UNREACHABLE:X1", result(bundle)["errors"])
        bundle["scenarios"][0]["weights"]["X1"] = 0
        self.assertIn("SCENARIO_WEIGHTS_ZERO", result(bundle)["errors"])
        self.assertEqual(result(bundle)["overall"]["values"], [None] * 3)
        # Explicit nulls remain valid JSON; no NaN or Infinity reaches the API.
        json.dumps(result(bundle), allow_nan=False)

    def test_contrast_overall_weights_clipped_targets(self):
        bundle = fixture()
        bundle["model"]["targets"].append({"id": "X2", "label": loc("Other target")})
        bundle["model"]["edges"].append({"source": "N1", "target": "X2", "strength": 1, "term": "K"})
        bundle["scenarios"][0].update(weights={"X1": 1, "X2": 3}, gain=2)
        a = result(bundle)
        for k in range(3):
            self.assertAlmostEqual(a["overall"]["contrast"][k],
                (a["targets"]["X1"]["contrast"][k] + 3 * a["targets"]["X2"]["contrast"][k]) / 4)

    def test_scenario_model_change_is_independent_and_historical_assessments_retained(self):
        bundle = fixture()
        variant = copy.deepcopy(bundle["model"])
        variant["id"] = "variant"
        variant["indicators"] = variant["indicators"][:1]
        bundle["scenarios"].append({**copy.deepcopy(bundle["scenarios"][0]), "id": "S2", "model": variant})
        base_before = result(bundle)
        alternate = calculate(bundle, "S2")["actors"][0]
        self.assertEqual(alternate["nodes"]["N2"]["direct"], [3] * 3)
        self.assertEqual(base_before, result(bundle))
        self.assertIn("I2", bundle["actors"][0]["assessments"])

    def test_does_not_mutate_input(self):
        bundle = fixture()
        original = copy.deepcopy(bundle)
        result(bundle)
        self.assertEqual(bundle, original)


class ValidationTests(unittest.TestCase):
    def test_json_roundtrip_lossless(self):
        bundle = fixture()
        bundle["actors"][0]["assessments"]["I1"]["note"] = "Quelle / source / fonte é è\nhttps://example.test"
        restored = json.loads(json.dumps(bundle, ensure_ascii=False, allow_nan=False))
        validate_bundle(restored)
        self.assertEqual(restored, bundle)
        self.assertEqual(result(restored), result(bundle))

    def test_reject_invalid_schema_references_ranges_and_hidden_fields(self):
        mutations = [
            lambda b: b.update(schema_version="9"),
            lambda b: b["model"].update(secret="not allowed"),
            lambda b: b["model"]["nodes"].append(copy.deepcopy(b["model"]["nodes"][0])),
            lambda b: b["model"]["indicators"][0].update(node_id="unknown"),
            lambda b: b["model"]["edges"][0].update(source="unknown"),
            lambda b: b["model"]["edges"][0].update(term="Z"),
            lambda b: b["model"]["edges"][0].update(strength=0),
            lambda b: b["model"]["indicators"][0].update(weight=float("nan")),
            lambda b: b["model"]["indicators"][0].update(weight=11),
            lambda b: b["scenarios"][0].update(gain=float("inf")),
            lambda b: b["scenarios"][0].update(gain=10 ** 1000),
            lambda b: b["scenarios"][0].update(gain=0),
            lambda b: b["scenarios"][0].update(weights={"unknown": 1}),
            lambda b: b["actors"][0]["assessments"].update(unknown=assessment()),
            lambda b: b["actors"][0]["assessments"]["I1"].update(value=True),
            lambda b: b["actors"][0]["assessments"]["I1"].update(value=6),
            lambda b: b["actors"][0]["assessments"]["I1"].update(reliability="D1"),
            lambda b: b["actors"][0]["assessments"]["I1"].update(note="\ud800"),
            lambda b: b["actors"][0]["assessments"]["I1"].update(note="\x00"),
            lambda b: b["actors"][0]["assessments"].update({"\ud800": assessment()}),
            lambda b: b["model"]["label"].pop("fr"),
        ]
        for index, mutate in enumerate(mutations):
            with self.subTest(case=index):
                bundle = fixture()
                mutate(bundle)
                with self.assertRaises(ValidationError):
                    validate_bundle(bundle)


class V7ReferenceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.root = Path(__file__).resolve().parents[3]
        cls.source = cls.root / "temp" / "Potentialvergleich_v7.xlsx"
        cls.catalog = cls.root / "data" / "catalog-i18n.json"
        if not cls.source.exists() or not cls.catalog.exists():
            raise unittest.SkipTest("Local v7 workbook and translation catalog required")
        cls.bundle = load_workbook(cls.source, cls.catalog)
        reader = WorkbookReader(cls.source)
        try:
            cls.cached = reader.cells("Berechnung")
            cls.comments = reader.comments("Bewertung")
        finally:
            reader.close()

    def test_inventory_and_only_approved_example(self):
        model = self.bundle["model"]
        self.assertEqual([len(model[key]) for key in ("nodes", "targets", "indicators", "edges")], [35, 5, 121, 136])
        self.assertEqual(len(self.bundle["scenarios"]), 6)
        self.assertEqual([a["id"] for a in self.bundle["actors"]], ["usa"])
        self.assertTrue(self.bundle["actors"][0]["is_example"])
        self.assertEqual(model["indicators"][0]["definition"]["de"], self.comments["E6"])

    def test_all_v7_cached_nodes_targets_metrics_and_overall(self):
        # The selected cached threat model is Scenario 2 in the v7 source.
        actor = calculate(self.bundle, "S2")["actors"][0]
        for row in range(202, 237):
            node = actor["nodes"][self.cached[f"A{row}"]]
            for horizon, column in enumerate(("D", "E", "F")):
                with self.subTest(row=row, column=column):
                    self.assertAlmostEqual(node["direct"][horizon], self.cached[f"{column}{row}"], places=11)
            for horizon, column in enumerate(("D", "I", "J")):
                with self.subTest(row=row, column=column):
                    self.assertAlmostEqual(node["values"][horizon], self.cached[f"{column}{row}"], places=11)
        for row in range(800, 805):
            target = actor["targets"][self.cached[f"A{row}"]]
            for horizon, column in enumerate(("C", "D", "E")):
                self.assertAlmostEqual(target["raw"][horizon], self.cached[f"{column}{row}"], places=11)
            for horizon, column in enumerate(("G", "H", "I")):
                self.assertAlmostEqual(target["values"][horizon], self.cached[f"{column}{row}"], places=11)
                self.assertAlmostEqual(target["contrast"][horizon], target["values"][horizon], places=11)
        for horizon, column in enumerate(("G", "H", "I")):
            self.assertAlmostEqual(actor["overall"]["values"][horizon], self.cached[f"{column}805"], places=11)
        for row in range(760, 795):
            node = actor["nodes"][self.cached[f"A{row}"]]
            self.assertAlmostEqual(node["influence"], self.cached[f"M{row}"], places=11)
            self.assertAlmostEqual(node["leverage"], self.cached[f"S{row}"], places=11)

    def test_scenarios_gain_and_json_roundtrip(self):
        for scenario in self.bundle["scenarios"]:
            computed = calculate(self.bundle, scenario["id"])
            for actor in computed["actors"]:
                for value in actor["overall"]["values"]:
                    self.assertTrue(math.isfinite(value))
        restored = json.loads(json.dumps(self.bundle, ensure_ascii=False, allow_nan=False))
        validate_bundle(restored)
        self.assertEqual(restored, self.bundle)
        self.assertEqual(calculate(restored, "S2"), calculate(self.bundle, "S2"))


if __name__ == "__main__":
    unittest.main()

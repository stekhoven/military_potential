"""Read the approved v7 source as OOXML data, without evaluating any formulas.

    Only the explicitly approved USA actor is imported. Workbook authors,
    document metadata, external links and embedded objects are never copied.
"""

import json
import posixpath
import re
import xml.etree.ElementTree as ET
from pathlib import Path
from zipfile import ZipFile

from .validation import validate_bundle

MAIN = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
NS = {"m": MAIN}
GROUPS = {"Politik": "politics", "Militär": "military", "Wirtschaft": "economy",
          "Gesellschaft": "society", "Information": "information", "Infrastruktur": "infrastructure",
          "Umwelt": "environment", "Operative Domänen": "domains"}
CONTROL = {"lenkbar": "yes", "bedingt": "partial", "nicht": "no"}


def _column(number):
    result = ""
    while number:
        number, rest = divmod(number - 1, 26)
        result = chr(65 + rest) + result
    return result


def _resolve(source, target):
    return posixpath.normpath(target.lstrip("/") if target.startswith("/") else
                             posixpath.join(posixpath.dirname(source), target))


class WorkbookReader:
    """Minimal read-only OOXML reader; caches are values, formulas stay inert."""

    def __init__(self, path):
        self.archive = ZipFile(path)
        if sum(info.file_size for info in self.archive.infolist()) > 50_000_000:
            self.archive.close()
            raise ValueError("WORKBOOK_TOO_LARGE")
        self.strings = []
        if "xl/sharedStrings.xml" in self.archive.namelist():
            root = self._xml("xl/sharedStrings.xml")
            self.strings = [self._text(item) for item in root.findall("m:si", NS)]
        relations = self._relations("xl/workbook.xml")
        root = self._xml("xl/workbook.xml")
        self.sheets = {sheet.attrib["name"]: relations[sheet.attrib[f"{{{REL}}}id"]]
                       for sheet in root.findall("m:sheets/m:sheet", NS)}

    def close(self):
        self.archive.close()

    def _xml(self, path):
        data = self.archive.read(path)
        if b"<!DOCTYPE" in data or b"<!ENTITY" in data:
            raise ValueError("WORKBOOK_XML_ENTITY")
        return ET.fromstring(data)

    @staticmethod
    def _text(element):
        return "".join(item.text or "" for item in element.findall(".//m:t", NS))

    def _relations(self, source):
        parent, filename = posixpath.split(source)
        relpath = posixpath.join(parent, "_rels", filename + ".rels")
        if relpath not in self.archive.namelist():
            return {}
        return {item.attrib["Id"]: _resolve(source, item.attrib["Target"])
                for item in self._xml(relpath) if item.attrib.get("TargetMode") != "External"}

    def cells(self, name):
        cells = {}
        for cell in self._xml(self.sheets[name]).findall(".//m:sheetData/m:row/m:c", NS):
            kind = cell.attrib.get("t")
            value = cell.find("m:v", NS)
            if kind == "inlineStr":
                parsed = self._text(cell)
            elif value is None or value.text is None:
                parsed = None
            elif kind == "s":
                parsed = self.strings[int(value.text)]
            elif kind in {"str", "e"}:
                parsed = value.text
            else:
                number = float(value.text)
                parsed = int(number) if number.is_integer() else number
            cells[cell.attrib["r"]] = parsed
        return cells

    def comments(self, name):
        source = self.sheets[name]
        comments = {}
        for target in self._relations(source).values():
            if re.search(r"/comments\d+\.xml$", target):
                for comment in self._xml(target).findall("m:commentList/m:comment", NS):
                    comments[comment.attrib["ref"]] = self._text(comment)
        return comments


def load_workbook(path, translations_path=None):
    """Return the canonical bundle from v7 and the complete language catalog.

    Fixed coordinates occur only at this one-time v7 import boundary. The
    resulting engine and JSON format operate entirely on stable IDs.
    """
    catalog_path = Path(translations_path) if translations_path else Path(__file__).resolve().parents[2] / "data" / "catalog-i18n.json"
    if not catalog_path.exists():
        raise ValueError("CATALOG_MISSING")
    catalog = json.loads(catalog_path.read_text(encoding="utf-8"))

    def translated(section, item_id, field, original):
        try:
            result = catalog[section][item_id][field]
        except (KeyError, TypeError) as exc:
            raise ValueError(f"CATALOG_MISSING: {section}.{item_id}.{field}") from exc
        if result.get("de") != original:
            raise ValueError(f"CATALOG_SOURCE_MISMATCH: {section}.{item_id}.{field}")
        return dict(result)

    workbook = WorkbookReader(path)
    try:
        model_cells, assessment_cells = workbook.cells("Modell"), workbook.cells("Bewertung")
        comments = workbook.comments("Bewertung")
    finally:
        workbook.close()
    model = {"id": "v7", "label": {"de": "Potenzialmodell v7", "fr": "Modèle de potentiel v7", "it": "Modello di potenziale v7"},
             "nodes": [], "targets": [], "indicators": [], "edges": [],
             "quality_thresholds": {"green": model_cells["D202"], "red": model_cells["D204"]}}
    node_rows = {}
    for coordinate, value in model_cells.items():
        match = re.fullmatch(r"A(\d+)", coordinate)
        if not match:
            continue
        row = int(match[1])
        group = model_cells.get(f"C{row}")
        if group in GROUPS and isinstance(value, str) and value:
            node_rows[value] = row
            model["nodes"].append({"id": value,
                "label": translated("nodes", value, "label", model_cells[f"B{row}"]),
                "group": GROUPS[group], "controllability": CONTROL[model_cells[f"D{row}"]]})
    node_ids = set(node_rows)
    destination_columns = {}
    for col in range(5, 45):
        column = _column(col)
        item_id = model_cells.get(column + "22")
        if item_id in node_ids or (isinstance(item_id, str) and re.fullmatch(r"X\d+", item_id)):
            destination_columns[item_id] = column
            if item_id not in node_ids:
                model["targets"].append({"id": item_id,
                    "label": translated("targets", item_id, "label", model_cells[column + "21"])})
    for source, row in node_rows.items():
        for target, column in destination_columns.items():
            code = model_cells.get(f"{column}{row}")
            if code is None or code == "":
                continue
            match = re.fullmatch(r"([+-]?[123])([KML])", str(code).strip())
            if not match:
                raise ValueError(f"WORKBOOK_EDGE_INVALID: {source}/{target}")
            model["edges"].append({"source": source, "target": target,
                                   "strength": int(match[1]), "term": match[2]})
    weight_rows = {}
    for coordinate, value in model_cells.items():
        match = re.fullmatch(r"A(\d+)", coordinate)
        if match and model_cells.get("C" + match[1]) in node_ids:
            weight_rows[value] = int(match[1])
    indicator_rows = {}
    for coordinate, item_id in assessment_cells.items():
        match = re.fullmatch(r"A(\d+)", coordinate)
        if match and item_id in weight_rows:
            row, weight_row = int(match[1]), weight_rows[item_id]
            indicator_rows[item_id] = row
            definition = comments.get("E" + str(row))
            if not definition:
                raise ValueError("WORKBOOK_DEFINITION_MISSING: " + str(item_id))
            model["indicators"].append({"id": item_id, "node_id": assessment_cells[f"C{row}"],
                "label": translated("indicators", item_id, "label", assessment_cells[f"E{row}"]),
                "definition": translated("indicators", item_id, "definition", definition),
                "weight": model_cells[f"D{weight_row}"], "weight_note": model_cells.get(f"E{weight_row}") or ""})
    scenarios = []
    for row in range(5, 19):
        number, label = model_cells.get(f"A{row}"), model_cells.get(f"B{row}")
        if not isinstance(number, int) or not label:
            continue
        item_id = "S" + str(number)
        scenarios.append({"id": item_id, "label": translated("scenarios", item_id, "label", label),
            "description": translated("scenarios", item_id, "description", model_cells.get(f"C{row}") or ""),
            "weights": {target["id"]: model_cells[_column(5 + i) + str(row)]
                        for i, target in enumerate(model["targets"])}, "gain": 1})
    actors = []
    # Whitelist the approved example by its actual actor heading. Never copy
    # other populated blocks implicitly when importing an amended workbook.
    for col in (6, 11, 16, 21):
        if assessment_cells.get(_column(col) + "3") != "USA":
            continue
        assessments = {}
        for item_id, row in indicator_rows.items():
            assessments[item_id] = {"value": assessment_cells.get(_column(col) + str(row)),
                "reliability": assessment_cells.get(_column(col + 1) + str(row)) or "",
                "future5": assessment_cells.get(_column(col + 2) + str(row)),
                "future10": assessment_cells.get(_column(col + 3) + str(row)),
                "note": assessment_cells.get(_column(col + 4) + str(row)) or ""}
        actors.append({"id": "usa", "label": "USA", "is_example": True, "assessments": assessments})
    bundle = {"schema_version": "0.1", "model": model, "scenarios": scenarios, "actors": actors}
    validate_bundle(bundle)
    return bundle

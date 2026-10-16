import test from "node:test";
import assert from "node:assert/strict";
import { messages, translate, errorMessage } from "./i18n.js";
test("all UI messages contain exactly three nonempty translations", () => {
  for (const [key, value] of Object.entries(messages)) {
    assert.equal(value.length, 3, key);
    value.forEach((text) =>
      assert.ok(typeof text === "string" && text.trim(), key),
    );
  }
});
test("authentication, conflicts, invalid unicode and unavailable targets have specific messages", () => {
  for (const lang of ["de", "fr", "it"]) {
    assert.equal(errorMessage(lang, "CONFLICT"), translate(lang, "conflict"));
    assert.equal(
      errorMessage(lang, "LOGIN_FAILED"),
      translate(lang, "authentication"),
    );
    assert.equal(
      errorMessage(lang, "AUTH_REQUIRED"),
      translate(lang, "sessionExpired"),
    );
    assert.equal(
      errorMessage(lang, "CSRF_FAILED"),
      translate(lang, "csrfFailed"),
    );
    assert.equal(
      errorMessage(lang, "INVALID_UNICODE"),
      translate(lang, "invalidUnicode"),
    );
    assert.equal(
      errorMessage(lang, "TARGET_UNREACHABLE:X1"),
      translate(lang, "targetUnreachable"),
    );
  }
});

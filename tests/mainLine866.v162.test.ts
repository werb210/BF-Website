// BF_WEBSITE_MAIN_LINE_866_v162
import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

test("every public page shows the 866 main line, not the old 825 number", () => {
  for (const f of ["Home", "UnitedStates", "Contact", "privacy", "FAQ"]) {
    const s = readFileSync(`client/src/pages/${f}.tsx`, "utf8");
    assert.doesNotMatch(s, /451-1768|4511768/, f);
    assert.match(s, /631-8939|6318939/, f);
  }
});

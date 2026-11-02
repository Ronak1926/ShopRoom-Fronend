import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { csvCell, toCsv } from "./csv.ts";

describe("csvCell", () => {
  it("leaves plain text alone", () => {
    assert.equal(csvCell("Asha Rao"), "Asha Rao");
  });

  it("quotes cells with commas, quotes or line breaks, doubling inner quotes", () => {
    assert.equal(csvCell("Rao, Asha"), '"Rao, Asha"');
    assert.equal(csvCell('The "Boss"'), '"The ""Boss"""');
    assert.equal(csvCell("two\nlines"), '"two\nlines"');
  });

  it("defuses spreadsheet formulas", () => {
    for (const evil of ['=HYPERLINK("http://x")', "+1+1", "-2+3", "@SUM(A1)", "\tcmd", "\rcmd"]) {
      assert.ok(csvCell(evil).replace(/^"/, "").startsWith("'"), JSON.stringify(evil));
    }
    assert.equal(csvCell("a=b"), "a=b", "only a leading character is dangerous");
  });
});

describe("toCsv", () => {
  it("joins cells with commas and rows with CRLF, ending with a line break", () => {
    assert.equal(toCsv([["a", "b,c"], ["1", "2"]]), 'a,"b,c"\r\n1,2\r\n');
  });
});

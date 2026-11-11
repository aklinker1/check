import { describe, it, expect } from "bun:test";

import { parseOutput } from "./rumdl";

describe("rumdl", () => {
  it("should properly parse output", () => {
    const stdout = `
[
  {
    "file": ".github/ISSUE_TEMPLATE/feature_request.md",
    "line": 9,
    "column": 1,
    "rule": "MD001",
    "message": "Expected heading level 2, but found heading level 3",
    "severity": "error",
    "fixable": true,
    "fix": {
      "range": {
        "start": 100,
        "end": 103
      },
      "replacement": "##"
    }
  },
  {
    "file": ".github/ISSUE_TEMPLATE/feature_request.md",
    "line": 13,
    "column": 1,
    "rule": "MD001",
    "message": "Expected heading level 3, but found heading level 4",
    "severity": "error",
    "fixable": true,
    "fix": {
      "range": {
        "start": 247,
        "end": 251
      },
      "replacement": "###"
    }
  },
  {
    "file": "docs/guide/essentials/entrypoints.md",
    "line": 581,
    "column": 1,
    "rule": "MD075",
    "message": "Pipe-formatted rows without a table header/delimiter row",
    "severity": "warning",
    "fixable": false
  },
  {
    "file": "docs/guide/resources/compare.md",
    "line": 44,
    "column": 1,
    "rule": "MD067",
    "message": "Footnote definition '[^a]' is out of order; expected '[^n]' next(based on reference order)",
    "severity": "warning",
    "fixable": false
  }
]
`;
    const stderr = "warning: ignored unknown config key";
    const code = 1;

    expect(parseOutput({ code, stdout, stderr })).toEqual([
      {
        file: ".github/ISSUE_TEMPLATE/feature_request.md",
        message: "Expected heading level 2, but found heading level 3",
        location: {
          line: 9,
          column: 1,
        },
        rule: "MD001",
        kind: "error",
      },
      {
        file: ".github/ISSUE_TEMPLATE/feature_request.md",
        message: "Expected heading level 3, but found heading level 4",
        location: {
          line: 13,
          column: 1,
        },
        rule: "MD001",
        kind: "error",
      },
      {
        file: "docs/guide/essentials/entrypoints.md",
        message: "Pipe-formatted rows without a table header/delimiter row",
        location: {
          line: 581,
          column: 1,
        },
        rule: "MD075",
        kind: "warning",
      },
      {
        file: "docs/guide/resources/compare.md",
        message:
          "Footnote definition '[^a]' is out of order; expected '[^n]' next(based on reference order)",
        location: {
          line: 44,
          column: 1,
        },
        rule: "MD067",
        kind: "warning",
      },
    ]);
  });

  it("returns no problems when rumdl reports no violations", () => {
    expect(parseOutput({ code: 0, stdout: "[]\n", stderr: "" })).toEqual([]);
  });

  it("returns no problems when output is blank", () => {
    expect(parseOutput({ code: 0, stdout: "", stderr: "" })).toEqual([]);
  });
});

import { describe, it, expect } from "bun:test";
import { parseOutput } from "./markdownlint";

describe("Markdownlint", () => {
  it("should properly parse output", async () => {
    const stdout = "";
    const stderr = `
[
  {
    "fileName": "docs/guide/resources/upgrading.md",
    "lineNumber": 59,
    "ruleNames": [
      "MD031",
      "blanks-around-fences"
    ],
    "ruleDescription": "Fenced code blocks should be surrounded by blank lines",
    "ruleInformation": "https://github.com/DavidAnson/markdownlint/blob/v0.38.0/doc/md031.md",
    "errorDetail": null,
    "errorContext": "\`\`\`ts",
    "errorRange": null,
    "fixInfo": {
      "lineNumber": 59,
      "insertText": "\\n"
    }
  },
  {
    "fileName": "CODE_OF_CONDUCT.md",
    "lineNumber": 63,
    "ruleNames": [
      "MD034",
      "no-bare-urls"
    ],
    "ruleDescription": "Bare URL used",
    "ruleInformation": "https://github.com/DavidAnson/markdownlint/blob/v0.38.0/doc/md034.md",
    "errorDetail": null,
    "errorContext": "example@gmail.com",
    "errorRange": [
      5,
      23
    ],
    "fixInfo": {
      "editColumn": 1,
      "deleteCount": 23,
      "insertText": "<example@gmail.com>"
    }
  }
]
`;
    const code = 1;

    expect(parseOutput({ code, stdout, stderr })).toEqual([
      {
        file: "docs/guide/resources/upgrading.md",
        message: "Fenced code blocks should be surrounded by blank lines",
        location: {
          line: 59,
          column: 0,
        },
        rule: "MD031",
        kind: "warning",
      },
      {
        file: "CODE_OF_CONDUCT.md",
        message: "Bare URL used",
        location: {
          line: 63,
          column: 5,
        },
        rule: "MD034",
        kind: "warning",
      },
    ]);
  });
});

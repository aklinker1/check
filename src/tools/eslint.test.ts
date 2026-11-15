import { describe, it, expect } from "bun:test";

import { parseOutput } from "./eslint";

describe("ESLint", () => {
  it("should properly parse output", async () => {
    const stdout = JSON.stringify([
      {
        filePath: "/path/to/check/demo/test.ts",
        messages: [
          {
            ruleId: "@typescript-eslint/no-unused-vars",
            severity: 1,
            message: "'test' is assigned a value but never used.",
            line: 1,
            column: 7,
          },
          {
            ruleId: "@typescript-eslint/no-unused-vars",
            severity: 2,
            message: "'variable' is assigned a value but never used.",
            line: 5,
            column: 7,
          },
        ],
      },
    ]);
    const stderr = "";
    const code = 1;

    expect(parseOutput({ code, stdout, stderr })).toEqual([
      {
        file: "/path/to/check/demo/test.ts",
        message: "'test' is assigned a value but never used.",
        kind: "warning",
        location: {
          line: 1,
          column: 7,
        },
        rule: "@typescript-eslint/no-unused-vars",
      },
      {
        file: "/path/to/check/demo/test.ts",
        message: "'variable' is assigned a value but never used.",
        kind: "error",
        location: {
          line: 5,
          column: 7,
        },
        rule: "@typescript-eslint/no-unused-vars",
      },
    ]);
  });
});

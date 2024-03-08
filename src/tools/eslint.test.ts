import { describe, it, expect } from "bun:test";
import { parseOuptut } from "./eslint";

describe("ESLint", () => {
  it("should properly parse output", async () => {
    const stdout = `/path/to/check/demo/test.ts: line 1, col 7, Warning - 'test' is assigned a value but never used. (@typescript-eslint/no-unused-vars)
/path/to/check/demo/test.ts: line 5, col 7, Error - 'variable' is assigned a value but never used. (@typescript-eslint/no-unused-vars)

4 problems
`;
    const stderr = "";
    const code = 1;

    expect(parseOuptut({ code, stdout, stderr })).toEqual({
      type: "error",
      problems: [
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
      ],
    });
  });
});

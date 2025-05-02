import { describe, it, expect } from "bun:test";
import { parseOutput } from "./oxlint";

describe("Oxlint", () => {
  it("should properly parse output", async () => {
    const stdout = `
test.ts:1:7: Variable 'test' is declared but never used. [Warning/eslint(no-unused-vars)]
test.ts:3:7: Variable 'variable' is declared but never used. [Warning/eslint(no-unused-vars)]
test.ts:8:7: Variable 'two' is declared but never used. [Warning/eslint(no-unused-vars)]
test.ts:8:7: Missing initializer in const declaration [Error]

3 problems
`;
    const stderr = "";
    const code = 1;

    expect(parseOutput({ code, stdout, stderr })).toEqual([
      {
        file: "test.ts",
        message: "Variable 'test' is declared but never used.",
        location: {
          line: 1,
          column: 7,
        },
        rule: "eslint(no-unused-vars)",
        kind: "warning",
      },
      {
        file: "test.ts",
        message: "Variable 'variable' is declared but never used.",
        location: {
          line: 3,
          column: 7,
        },
        rule: "eslint(no-unused-vars)",
        kind: "warning",
      },
      {
        file: "test.ts",
        message: "Variable 'two' is declared but never used.",
        location: {
          line: 8,
          column: 7,
        },
        rule: "eslint(no-unused-vars)",
        kind: "warning",
      },
      {
        file: "test.ts",
        message: "Missing initializer in const declaration",
        location: {
          line: 8,
          column: 7,
        },
        kind: "error",
      },
    ]);
  });
});

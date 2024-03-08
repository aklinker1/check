import { describe, it, expect } from "bun:test";
import { parseOuptut } from "./typescript";

describe("TypeScript", () => {
  it("should properly parse output", async () => {
    const stdout = `test.ts(1,19): error TS2355: A function whose declared type is neither 'undefined', 'void', nor 'any' must return a value.
test.ts(5,24): error TS7006: Parameter 'a' implicitly has an 'any' type.
`;
    const stderr = "";
    const code = 1;

    expect(parseOuptut({ code, stdout, stderr })).toEqual({
      type: "error",
      problems: [
        {
          file: "test.ts",
          message:
            "A function whose declared type is neither 'undefined', 'void', nor 'any' must return a value.",
          kind: "error",
          location: {
            line: 1,
            column: 19,
          },
          rule: "TS2355",
        },
        {
          file: "test.ts",
          message: "Parameter 'a' implicitly has an 'any' type.",
          kind: "error",
          location: {
            line: 5,
            column: 24,
          },
          rule: "TS7006",
        },
      ],
    });
  });
});

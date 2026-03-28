import { describe, it, expect } from "bun:test";

import { parseOutput } from "./cspell";

describe("CSpell", () => {
  it("should properly parse output with errors", async () => {
    const stdout = `src/core/export-screenshots.ts:65:25 - Unknown word (networkidle)
src/core/get-screenshots.ts:3:8 - Unknown word (natsort)
src/core/get-screenshots.ts:51:25 - Unknown word (natsort)
`;
    const stderr = ` 1/36 assets/dashboard.ts 630.85ms
 2/36 CHANGELOG.md 31.26ms
 3/36 cspell.yml 15.64ms
CSpell: Files checked: 36, Issues found: 3 in 2 files.
`;
    const code = 1;

    expect(parseOutput({ code, stdout, stderr })).toEqual([
      {
        file: "src/core/export-screenshots.ts",
        message: "Unknown word (networkidle)",
        kind: "error",
        location: {
          line: 65,
          column: 25,
        },
      },
      {
        file: "src/core/get-screenshots.ts",
        message: "Unknown word (natsort)",
        kind: "error",
        location: {
          line: 3,
          column: 8,
        },
      },
      {
        file: "src/core/get-screenshots.ts",
        message: "Unknown word (natsort)",
        kind: "error",
        location: {
          line: 51,
          column: 25,
        },
      },
    ]);
  });

  it("should handle successful output with no errors", () => {
    const stdout = "";
    const stderr = ` 1/36 assets/dashboard.ts 630.85ms
 2/36 CHANGELOG.md 31.26ms
 3/36 cspell.yml 15.64ms
CSpell: Files checked: 36, Issues found: 0 in 0 files.
`;
    const code = 0;

    expect(parseOutput({ code, stdout, stderr })).toEqual([]);
  });

  it("should handle empty output", () => {
    const stdout = "";
    const stderr = "";
    const code = 0;

    expect(parseOutput({ code, stdout, stderr })).toEqual([]);
  });

  it("should parse different error types", () => {
    const stdout = `README.md:12:5 - Unknown word (mycustomword)
package.json:3:15 - Forbidden word (badword)
`;
    const stderr = "";
    const code = 1;

    expect(parseOutput({ code, stdout, stderr })).toEqual([
      {
        file: "README.md",
        message: "Unknown word (mycustomword)",
        kind: "error",
        location: {
          line: 12,
          column: 5,
        },
      },
      {
        file: "package.json",
        message: "Forbidden word (badword)",
        kind: "error",
        location: {
          line: 3,
          column: 15,
        },
      },
    ]);
  });
});

import { describe, it, expect } from "bun:test";
import { parseOutput } from "./prettier";

describe("Prettier", () => {
  it("should properly parse output", async () => {
    const stdout = `target/.rustc_info.json
  test.ts
  `;
    const stderr = "";
    const code = 1;

    expect(parseOutput({ code, stdout, stderr })).toEqual([
      {
        file: "target/.rustc_info.json",
        message: "Not formatted.",
        kind: "warning",
      },
      {
        file: "test.ts",
        message: "Not formatted.",
        kind: "warning",
      },
    ]);
  });

  it("return no problems when there isn't any output", async () => {
    const stdout = "";
    const stderr = "";
    const code = 1;

    expect(parseOutput({ code, stdout, stderr })).toEqual([]);
  });

  it("should return an error when a syntax error is reported", async () => {
    const stderr = `[error] src/components/CommitDiff.ts: SyntaxError: Declaration or statement expected. (15:1)
[error]   13 | });
[error]   14 |
[error] > 15 | }
[error]      | ^
[error]   16 |
[error] src/components/CompareDiff.ts: Some other error message. (14:1)
[error]   12 | });
[error]   13 |
[error] > 14 | }
[error]      | ^
[error]   15 |
`;
    const stdout = `.github/assets/privacy-policy.md 18ms
  .github/workflows/submit.yml 20ms
  .github/workflows/validate.yml 4ms
  .prettierrc.yml 0ms`;
    const code = 1;

    expect(parseOutput({ code, stdout, stderr })).toEqual([
      {
        file: "src/components/CommitDiff.ts",
        message: "SyntaxError: Declaration or statement expected.",
        location: {
          line: 15,
          column: 1,
        },
        kind: "error",
      },
      {
        file: "src/components/CompareDiff.ts",
        message: "Some other error message.",
        location: {
          line: 14,
          column: 1,
        },
        kind: "error",
      },
    ]);
  });

  it("should not report warnings for fix output", () => {
    const stderr = "";
    const stdout = `.github/assets/privacy-policy.md 18ms
.github/workflows/submit.yml 20ms
.github/workflows/validate.yml 4ms
.prettierrc.yml 0ms`;
    const code = 0;

    expect(parseOutput({ code, stdout, stderr })).toEqual([]);
  });
});

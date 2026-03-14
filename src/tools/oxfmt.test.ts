import { describe, it, expect } from "bun:test";

import { parseOutput } from "./oxfmt";

describe("Oxfmt", () => {
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
    const code = 0;

    expect(parseOutput({ code, stdout, stderr })).toEqual([]);
  });

  it("should return an error when a syntax error is reported", async () => {
    const stderr = `
  × Unterminated string
    ╭─[src/internal/compile-route-handler.ts:11:8]
 10 │   ServerSideFetch,
 11 │ } from "../types
    ·        ──────────
 12 │ import { smartDeserialize, smartSerialize } from "./serialization";
 13 │
    ╰────
Error occurred when checking code style in the above files.
`;
    const stdout = `.github/assets/privacy-policy.md
.oxfmtrc.jsonc`;
    const code = 1;

    expect(parseOutput({ code, stdout, stderr })).toEqual([
      {
        file: "src/internal/compile-route-handler.ts",
        message: "Unterminated string",
        location: {
          line: 11,
          column: 8,
        },
        kind: "error",
      },
      {
        file: ".github/assets/privacy-policy.md",
        kind: "warning",
        message: "Not formatted.",
      },
      {
        file: ".oxfmtrc.jsonc",
        kind: "warning",
        message: "Not formatted.",
      },
    ]);
  });

  it("should not report warnings for fix output", () => {
    const stderr = "";
    const stdout = `Finished in 571ms on 90 files using 12 threads.`;
    const code = 0;

    expect(parseOutput({ code, stdout, stderr })).toEqual([]);
  });
});

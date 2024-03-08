import { describe, it, expect } from "bun:test";
import { parseOuptut } from "./prettier";

describe("Prettier", () => {
  it("should properly parse output", async () => {
    const stdout = `target/.rustc_info.json
  test.ts
  `;
    const stderr = "";
    const code = 1;

    expect(parseOuptut({ code, stdout, stderr })).toEqual([
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

    expect(parseOuptut({ code, stdout, stderr })).toEqual([]);
  });
});

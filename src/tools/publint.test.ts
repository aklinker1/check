import { describe, it, expect } from "bun:test";
import { parseOutput } from "./publint";

describe("Publint", () => {
  it("should properly parse output", async () => {
    const stdout = `@aklinker1/check lint results:
Suggestions:
1. Consider being better lolz.
Warnings:
1. pkg.exports["."].import types is not exported. Consider adding pkg.exports["."].import.types: "./dist/index.d.ts" to be compatible with TypeScript's "moduleResolution": "bundler" compiler option.
Errors:
1. pkg.module is ./dist/index.cjs but the file does not exist.
`;
    const stderr = "";
    const code = 1;

    expect(parseOutput({ code, stdout, stderr })).toEqual([
      {
        file: "package.json",
        message: "Consider being better lolz.",
        kind: "warning",
      },
      {
        file: "package.json",
        message:
          'pkg.exports["."].import types is not exported. Consider adding pkg.exports["."].import.types: "./dist/index.d.ts" to be compatible with TypeScript\'s "moduleResolution": "bundler" compiler option.',
        kind: "warning",
      },
      {
        file: "package.json",
        message: "pkg.module is ./dist/index.cjs but the file does not exist.",
        kind: "error",
      },
    ]);
  });
});

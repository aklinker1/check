import type { OutputParser, Problem, ToolDefinition } from "../types";
import { execAndParse } from "../utils";

export const markdownlint: ToolDefinition = ({ root }) => {
  const bin = "markdownlint";
  const checkArgs = [
    "--json",
    "--ignore='**/dist/**'",
    "--ignore='**/node_modules/**'",
    "--ignore='**/.output/**'",
    "--ignore='**/coverage/**'",
  ];
  const fixArgs = [...checkArgs, "--fix"];

  return {
    name: "Markdownlint",
    packageName: "markdownlint-cli",
    check: () => execAndParse(bin, checkArgs, root, parseOutput),
    fix: () => execAndParse(bin, fixArgs, root, parseOutput),
  };
};

export const parseOutput: OutputParser = ({ stderr: _stderr }) => {
  const stderr = _stderr.trim();

  // When there are no errors, stderr is blank
  if (!stderr) return [];

  return JSON.parse(stderr).map((warning: any) => ({
    location: {
      line: warning.lineNumber,
      column: warning.errorRange?.[0] ?? 0,
    },
    message: warning.ruleDescription,
    file: warning.fileName,
    kind: "warning",
    rule: warning.ruleNames[0],
  }));
};

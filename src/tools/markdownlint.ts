import type { OutputParser, ToolDefinition } from "../types";
import { execAndParse } from "../utils";

export const markdownlint: ToolDefinition = ({ root }) => {
  const checkCmd = "markdownlint . --json";
  const fixCmd = `${checkCmd} --fix`;

  return {
    name: "Markdownlint",
    packageName: "markdownlint-cli",
    checkCommand: checkCmd,
    check: () => execAndParse(checkCmd, root, parseOutput),
    fixCommand: fixCmd,
    fix: () => execAndParse(fixCmd, root, parseOutput),
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

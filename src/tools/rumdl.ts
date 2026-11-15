import type { OutputParser, ToolDefinition } from "../types";
import { execAndParse } from "../utils";

export const rumdl: ToolDefinition = ({ root }) => {
  const checkCmd = "rumdl check . --output-format json";
  const fixCmd = `${checkCmd} --fix`;

  return {
    name: "rumdl",
    packageName: "rumdl",
    checkCommand: checkCmd,
    check: () => execAndParse(checkCmd, root, parseOutput),
    fixCommand: fixCmd,
    fix: () => execAndParse(fixCmd, root, parseOutput),
  };
};

export const parseOutput: OutputParser = ({ stdout }) => {
  if (!stdout.trim()) return [];

  return JSON.parse(stdout.trim()).map((diagnostic: any) => ({
    location: {
      line: diagnostic.line,
      column: diagnostic.column,
    },
    message: diagnostic.message,
    file: diagnostic.file,
    kind: diagnostic.severity === "error" ? "error" : "warning",
    rule: diagnostic.rule,
  }));
};

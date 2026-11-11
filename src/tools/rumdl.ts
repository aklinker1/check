import type { OutputParser, ToolDefinition } from "../types";
import { execAndParse } from "../utils";

export const rumdl: ToolDefinition = ({ root }) => {
  const checkCmd =
    "rumdl check . --output-format json --exclude 'dist,node_modules,.output,coverage'";
  const fixCmd = `${checkCmd} --fix`;

  return {
    name: "rumdl",
    packageName: "rumdl",
    check: () => execAndParse(checkCmd, root, parseOutput),
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

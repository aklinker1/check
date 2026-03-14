import type { OutputParser, Problem, ToolDefinition } from "../types";
import { execAndParse } from "../utils";

export const oxlint: ToolDefinition = ({ root }) => {
  const checkCmd =
    "oxlint . --format=unix --deny-warnings --ignore-path=.oxlintignore --ignore-pattern='**/dist/**' --ignore-pattern='**/node_modules/**' --ignore-pattern='**/.output/**' --ignore-pattern='**/coverage/**'";
  const fixCmd = `${checkCmd} --fix`;

  return {
    name: "Oxlint",
    packageName: "oxlint",
    check: () => execAndParse(checkCmd, root, parseOutput),
    fix: () => execAndParse(fixCmd, root, parseOutput),
  };
};

const NEWLINE_REGEX = /\r?\n/;

const LINT_REGEX =
  /^(?<file>.+?):(?<line>[0-9]+):(?<column>[0-9]+):\s?(?<message>.*?)\s?\[(?<kind>Warning|Error)\/?(?<rule>.*?)\]\s?$/;

export const parseOutput: OutputParser = ({ stdout }) => {
  return stdout.split(NEWLINE_REGEX).reduce<Problem[]>((acc, line) => {
    const groups = LINT_REGEX.exec(line)?.groups;
    if (groups) {
      acc.push({
        file: groups.file,
        kind: groups.kind === "Error" ? "error" : "warning",
        message: groups.message,
        rule: groups.rule || undefined,
        location: {
          line: parseInt(groups.line, 10),
          column: parseInt(groups.column, 10),
        },
      });
    }
    return acc;
  }, []);
};

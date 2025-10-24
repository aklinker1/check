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

export const parseOutput: OutputParser = ({ stdout }) => {
  if (stdout.trim()) {
    return stdout.split(/\r?\n/).reduce<Problem[]>((acc, line) => {
      const groups =
        /^(?<file>.+?):(?<line>[0-9]+):(?<column>[0-9]+):\s?(?<message>.*?)\s?\[(?<kind>Warning|Error)\/?(?<rule>.*?)\]\s?$/.exec(
          line,
        )?.groups;
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
  }

  return stdout
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => !!line && !line.includes(" "))
    .map(
      (line): Problem => ({
        file: line.trim(),
        kind: "warning",
        message: "Not formatted.",
      }),
    );
};

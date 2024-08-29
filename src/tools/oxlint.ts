import type { OutputParser, Problem, ToolDefinition } from "../types";
import { execAndParse, isBinInstalled } from "../utils";
import { resolve } from "node:path";

export const oxlint: ToolDefinition = ({ binDir, root }) => {
  const bin = resolve(root, binDir, "oxlint");
  const checkArgs = ["--format=linux"];
  const fixArgs = ["--format=linux", "--fix"];

  return {
    name: "Oxlint",
    isInstalled: () => isBinInstalled(bin),
    check: () => execAndParse(bin, checkArgs, root, parseOuptut),
    fix: () => execAndParse(bin, fixArgs, root, parseOuptut),
  };
};

export const parseOuptut: OutputParser = ({ stdout, stderr }) => {
  if (stdout.trim()) {
    return stdout.split(/\r?\n/).reduce<Problem[]>((acc, line) => {
      const groups =
        /^(?<file>.+?):(?<line>[0-9]+):(?<column>[0-9]):\s?(?<message>.*?)\s?\[(?<kind>Warning|Error)\/?(?<rule>.*?)\]\s?$/.exec(
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

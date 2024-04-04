import type { OutputParser, Problem, ToolDefinition } from "../types";
import { isBinInstalled, execAndParse } from "../utils";
import { resolve } from "node:path";

export const eslint: ToolDefinition = ({ binDir, root }) => {
  const bin = resolve(root, binDir, "eslint");
  const checkArgs = [
    ".",
    "--ext",
    ".js,.ts,.jsx,.tsx,.mjs,.mts,.cjs,.cts,.vue",
    "--format",
    "compact",
    "--max-warnings",
    "0",
  ];
  const fixArgs = [...checkArgs, "--fix"];

  return {
    name: "ESLint",
    isInstalled: () => isBinInstalled(bin),
    check: () => execAndParse(bin, checkArgs, root, parseOuptut),
    fix: () => execAndParse(bin, fixArgs, root, parseOuptut),
  };
};

export const parseOuptut: OutputParser = ({ stdout, stderr }) => {
  return `${stdout}\n${stderr}`
    .split(/\r?\n/)
    .reduce<Problem[]>((acc, line) => {
      const groups =
        /^(?<file>.*?): line (?<line>[0-9]+), col (?<column>[0-9]+), (?<kind>\S+) - (?<message>.*?) \((?<rule>\S*?)\)$/.exec(
          line,
        )?.groups;
      if (groups) {
        acc.push({
          file: groups.file,
          kind: groups.kind === "Warning" ? "warning" : "error",
          message: groups.message,
          location: {
            line: parseInt(groups.line, 10),
            column: parseInt(groups.column, 10),
          },
          rule: groups.rule,
        });
      }
      return acc;
    }, []);
};

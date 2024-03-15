import type { OutputParser, Problem, Tool } from "../types";
import { isBinInstalled, execAndParse } from "../utils";

const bin = "node_modules/.bin/eslint";
const args = [
  ".",
  "--ext",
  ".js,.ts,.jsx,.tsx,.mjs,.mts,.cjs,.cts,.vue",
  "--format",
  "compact",
  "--max-warnings",
  "0",
];

export const eslint: Tool = {
  name: "ESLint",
  isInstalled: (root) => isBinInstalled(bin, root),
  check: (root) => execAndParse(root, bin, args, parseOuptut),
  fix: (root) => execAndParse(root, bin, [...args, "--fix"], parseOuptut),
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

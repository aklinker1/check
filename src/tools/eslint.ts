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

export const parseOuptut: OutputParser = ({ code, stdout, stderr }) => {
  if (code === 0) return { type: "success" };

  const problems = `${stdout}\n${stderr}`
    .split(/\r?\n/)
    .reduce<Problem[]>((acc, line) => {
      const match =
        /^(.*?): line ([0-9]+), col ([0-9]+), (\S+) - (.*?) \((\S*?)\)$/.exec(
          line,
        );
      if (match) {
        acc.push({
          file: match[1],
          kind: match[4] === "Warning" ? "warning" : "error",
          message: match[5],
          location: {
            line: parseInt(match[2], 10),
            column: parseInt(match[3], 10),
          },
          rule: match[6],
        });
      }
      return acc;
    }, []);

  return {
    type: problems.some((problem) => problem.kind === "error")
      ? "error"
      : "warning",
    problems,
  };
};

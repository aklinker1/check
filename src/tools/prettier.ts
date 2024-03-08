import type { Tool, OutputParser, Problem } from "../types";
import { execAndParse, isBinInstalled } from "../utils";

const bin = "node_modules/.bin/prettier";
const checkArgs = [".", "--list-different"];
const fixArgs = [".", "--fix"];

export const prettier: Tool = {
  name: "Prettier",
  isInstalled: (root) => isBinInstalled(bin, root),
  check: (root) => execAndParse(root, bin, checkArgs, parseOuptut),
  fix: (root) => execAndParse(root, bin, fixArgs, parseOuptut),
};

export const parseOuptut: OutputParser = ({ code, stdout }) => {
  if (code === 0) return { type: "success" };

  const problems = stdout
    .trim()
    .split(/\r?\n/)
    .map(
      (line): Problem => ({
        file: line.trim(),
        kind: "warning",
        message: "Not formatted.",
      }),
    );
  return {
    type: "warning",
    problems,
  };
};

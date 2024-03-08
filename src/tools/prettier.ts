import type { Tool, OutputParser, Problem } from "../types";
import { execAndParse, isBinInstalled } from "../utils";

const bin = "node_modules/.bin/prettier";
const checkArgs = [".", "--list-different"];
const fixArgs = [".", "-w"];

export const prettier: Tool = {
  name: "Prettier",
  isInstalled: (root) => isBinInstalled(bin, root),
  check: (root) => execAndParse(root, bin, checkArgs, parseOuptut),
  fix: (root) => execAndParse(root, bin, fixArgs, parseOuptut),
};

export const parseOuptut: OutputParser = ({ stdout }) => {
  return stdout
    .trim()
    .split(/\r?\n/)
    .filter((line) => !!line)
    .map(
      (line): Problem => ({
        file: line.trim(),
        kind: "warning",
        message: "Not formatted.",
      }),
    );
};

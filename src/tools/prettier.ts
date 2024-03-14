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

export const parseOuptut: OutputParser = ({ stdout, stderr }) => {
  if (stderr.trim()) {
    return stderr.split(/\r?\n/).reduce<Problem[]>((acc, line) => {
      const match = /^\[(.+?)\]\s?(.+?):\s?(.*?)\s?\(([0-9]+):([0-9])\)$/.exec(
        line,
      );
      if (match) {
        acc.push({
          file: match[2],
          kind: match[1] === "error" ? "error" : "warning",
          message: match[3],
          location: {
            line: parseInt(match[4], 10),
            column: parseInt(match[5], 10),
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

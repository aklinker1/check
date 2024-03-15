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
      const groups =
        /^\[(?<kind>.+?)\]\s?(?<file>.+?):\s?(?<message>.*?)\s?\((?<line>[0-9]+):(?<column>[0-9])\)$/.exec(
          line,
        )?.groups;
      if (groups) {
        acc.push({
          file: groups.file,
          kind: groups.kind === "error" ? "error" : "warning",
          message: groups.message,
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

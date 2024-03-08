import type { OutputParser, Problem, ProblemKind, Tool } from "../types";
import { isBinInstalled, execAndParse } from "../utils";

const bin = "node_modules/.bin/publint";
const args: string[] = [];

export const publint: Tool = {
  name: "Publint",
  isInstalled: (root) => isBinInstalled(bin, root),
  check: (root) => execAndParse(root, bin, args, parseOuptut),
};

export const parseOuptut: OutputParser = ({ stdout }) => {
  let kind: ProblemKind = "warning";
  return stdout.split(/\r?\n/).reduce<Problem[]>((acc, line) => {
    if (line.includes("Errors:")) {
      kind = "error";
      return acc;
    }
    const match = /^[0-9]+\.\s?(.*)$/.exec(line);
    if (match == null) return acc;

    acc.push({
      kind,
      message: match[1],
      file: "package.json",
    });

    return acc;
  }, []);
};

import type { Tool, OutputParser, Problem } from "../types";
import { execAndParse, isBinInstalled } from "../utils";

const bin = "node_modules/.bin/tsc";
const checkArgs = ["--noEmit", "--pretty", "false"];

export const typescript: Tool = {
  name: "TypeScript",
  isInstalled: (root) => isBinInstalled(bin, root),
  check: (root) => execAndParse(root, bin, checkArgs, parseOuptut),
};

export const parseOuptut: OutputParser = ({ stdout }) => {
  return stdout.split(/\r?\n/).reduce<Problem[]>((acc, line) => {
    const groups =
      /^(?<file>\S+?)\((?<line>[0-9]+),(?<column>[0-9]+)\): \w+? (?<rule>TS[0-9]+): (?<message>.*)$/.exec(
        line,
      )?.groups;
    if (groups) {
      acc.push({
        file: groups.file,
        kind: "error",
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

import type { Tool, OutputParser, Problem } from "../types";
import { execAndParse, isBinInstalled } from "../utils";

const bin = "node_modules/.bin/tsc";
const checkArgs = ["--noEmit", "--pretty", "false"];

export const typescript: Tool = {
  name: "TypeScript",
  isInstalled: (root) => isBinInstalled(bin, root),
  check: (root) => execAndParse(root, bin, checkArgs, parseOuptut),
};

export const parseOuptut: OutputParser = ({ code, stdout }) => {
  if (code === 0) return { type: "success" };

  const problems = stdout.split(/\r?\n/).reduce<Problem[]>((acc, line) => {
    const match = /^(\S+?)\(([0-9]+),([0-9]+)\): \w+? (TS[0-9]+): (.*)$/.exec(
      line,
    );
    if (match) {
      acc.push({
        file: match[1],
        kind: "error",
        message: match[5],
        location: {
          line: parseInt(match[2], 10),
          column: parseInt(match[3], 10),
        },
        rule: match[4],
      });
    }
    return acc;
  }, []);
  return {
    type: "error",
    problems,
  };
};

import type { Tool, OutputParser, Problem } from "../types";
import { debug, execAndParse, isBinInstalled } from "../utils";

const tsc = {
  bin: "node_modules/.bin/tsc",
  args: ["--noEmit", "--pretty", "false"],
};
const vueTsc = {
  bin: "node_modules/.bin/vue-tsc",
  args: ["--noEmit", "--pretty", "false"],
};

export const typescript = async (root: string | undefined): Promise<Tool> => {
  const isVueTsc = await isBinInstalled(vueTsc.bin, root);
  debug("TypeScript: Is vue-tsc installed? " + isVueTsc);
  const cmd = isVueTsc ? vueTsc : tsc;
  const name = isVueTsc ? "TypeScript (Vue)" : "Typescript";
  return {
    name,
    // Always check if tsc is installed
    isInstalled: (root) => isBinInstalled(tsc.bin, root),
    // Execute the other TSC binary if necessary
    check: async (root) => execAndParse(root, cmd.bin, cmd.args, parseOuptut),
  };
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

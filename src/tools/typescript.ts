import type { Tool, OutputParser, Problem, ToolDefinition } from "../types";
import { debug, execAndParse, isBinInstalled } from "../utils";
import { resolve } from "node:path";

export const typescript: ToolDefinition = async ({
  root,
  binDir,
}): Promise<Tool> => {
  const tsc = {
    bin: resolve(root, binDir, "tsc"),
    args: ["--noEmit", "--pretty", "false"],
  };
  const vueTsc = {
    bin: resolve(root, binDir, "vue-tsc"),
    args: ["--noEmit", "--pretty", "false"],
  };

  const isVueTsc = await isBinInstalled(vueTsc.bin);
  debug("TypeScript: Is vue-tsc installed? " + isVueTsc);
  const cmd = isVueTsc ? vueTsc : tsc;
  const name = isVueTsc ? "TypeScript (Vue)" : "Typescript";
  return {
    name,
    // Always check if tsc is installed
    isInstalled: () => isBinInstalled(tsc.bin),
    // Execute the other TSC binary if necessary
    check: async () => execAndParse(cmd.bin, cmd.args, root, parseOuptut),
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

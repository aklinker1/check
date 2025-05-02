import type { Tool, OutputParser, Problem, ToolDefinition } from "../types";
import { debug, execAndParse } from "../utils";

export const typescript: ToolDefinition = async ({
  root,
  packageJson,
}): Promise<Tool> => {
  const tsc = {
    name: "TypeScript",
    bin: "tsc",
    packageName: "typescript",
    args: ["--noEmit", "--pretty", "false"],
  };
  const vueTsc = {
    name: "TypeScript (Vue)",
    bin: "vue-tsc",
    packageName: "vue-tsc",
    args: ["--noEmit", "--pretty", "false"],
  };

  const isVueTsc = packageJson.devDependencies?.["vue-tsc"] !== undefined;
  debug("TypeScript: Is vue-tsc installed? " + isVueTsc);
  const cmd = isVueTsc ? vueTsc : tsc;
  return {
    name: cmd.name,
    packageName: cmd.packageName,
    // Execute the other TSC binary if necessary
    check: async () => execAndParse(cmd.bin, cmd.args, root, parseOutput),
  };
};

export const parseOutput: OutputParser = ({ stdout }) => {
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

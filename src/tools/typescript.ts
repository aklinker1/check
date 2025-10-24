import type { Tool, OutputParser, Problem, ToolDefinition } from "../types";
import { debug, execAndParse } from "../utils";

export const typescript: ToolDefinition = async ({
  root,
  packageJson,
}): Promise<Tool> => {
  const tsc = {
    name: "TypeScript",
    cmd: "tsc --noEmit --pretty false",
    packageName: "typescript",
  };
  const vueTsc = {
    name: "TypeScript (Vue)",
    cmd: "vue-tsc --noEmit --pretty false",
    packageName: "vue-tsc",
  };

  const isVueTsc = packageJson.devDependencies?.["vue-tsc"] !== undefined;
  debug("TypeScript: Is vue-tsc installed? " + isVueTsc);
  const mod = isVueTsc ? vueTsc : tsc;
  return {
    name: mod.name,
    packageName: mod.packageName,
    check: async () => execAndParse(mod.cmd, root, parseOutput),
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

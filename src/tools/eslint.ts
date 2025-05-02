import type { OutputParser, Problem, ToolDefinition } from "../types";
import { execAndParse } from "../utils";

export const eslint: ToolDefinition = ({ root }) => {
  const bin = "eslint";
  const checkArgs = [
    ".",
    "--ext",
    ".js,.ts,.jsx,.tsx,.mjs,.mts,.cjs,.cts,.vue",
    "--format",
    "compact",
    "--max-warnings",
    "0",
  ];
  const fixArgs = [...checkArgs, "--fix"];

  return {
    name: "ESLint",
    packageName: "eslint",
    check: () => execAndParse(bin, checkArgs, root, parseOutput),
    fix: () => execAndParse(bin, fixArgs, root, parseOutput),
  };
};

export const parseOutput: OutputParser = ({ stdout, stderr }) => {
  return `${stdout}\n${stderr}`
    .split(/\r?\n/)
    .reduce<Problem[]>((acc, line) => {
      const groups =
        /^(?<file>.*?): line (?<line>[0-9]+), col (?<column>[0-9]+), (?<kind>\S+) - (?<message>.*?) \((?<rule>\S*?)\)$/.exec(
          line,
        )?.groups;
      if (groups) {
        acc.push({
          file: groups.file,
          kind: groups.kind === "Warning" ? "warning" : "error",
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

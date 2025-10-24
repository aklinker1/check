import type { OutputParser, Problem, ToolDefinition } from "../types";
import { execAndParse } from "../utils";

export const prettier: ToolDefinition = ({ root }) => {
  const checkCmd = "prettier . --list-different";
  const fixCmd = "prettier . -w";

  return {
    name: "Prettier",
    packageName: "prettier",
    check: () => execAndParse(checkCmd, root, parseOutput),
    fix: () => execAndParse(fixCmd, root, parseOutput),
  };
};

export const parseOutput: OutputParser = ({ stdout, stderr }) => {
  if (stderr.trim()) {
    return stderr.split(/\r?\n/).reduce<Problem[]>((acc, line) => {
      const groups =
        /^\[(?<kind>.+?)\]\s?(?<file>.+?):\s?(?<message>.*?)\s?\((?<line>[0-9]+):(?<column>[0-9]+)\)$/.exec(
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

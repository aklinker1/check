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

const NEWLINE_REGEX = /\r?\n/;

const ERROR_REGEX =
  /^\[(?<kind>.+?)\]\s?(?<file>.+?):\s?(?<message>.*?)\s?\((?<line>[0-9]+):(?<column>[0-9]+)\)$/;

export const parseOutput: OutputParser = ({ stdout, stderr }) => {
  if (stderr.trim()) {
    return stderr.split(NEWLINE_REGEX).reduce<Problem[]>((acc, line) => {
      const groups = ERROR_REGEX.exec(line)?.groups;
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
    .split(NEWLINE_REGEX)
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

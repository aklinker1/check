import type { OutputParser, Problem, ToolDefinition } from "../types";
import { execAndParse } from "../utils";

export const cspell: ToolDefinition = ({ root }) => {
  const checkCmd = "cspell --no-progress --no-summary .";

  return {
    name: "CSpell",
    packageName: "cspell",
    check: () => execAndParse(checkCmd, root, parseOutput),
  };
};

const NEWLINE_REGEX = /\r?\n/;

// Format: src/core/export-screenshots.ts:65:25 - Unknown word (networkidle)
const ERROR_REGEX = /^(?<file>.+?):(?<line>[0-9]+):(?<column>[0-9]+)\s+-\s+(?<message>.*)$/;

export const parseOutput: OutputParser = ({ stdout }) => {
  return stdout.split(NEWLINE_REGEX).reduce<Problem[]>((acc, line) => {
    const groups = ERROR_REGEX.exec(line)?.groups;
    if (groups) {
      acc.push({
        file: groups.file,
        kind: "error",
        message: groups.message,
        location: {
          line: parseInt(groups.line, 10),
          column: parseInt(groups.column, 10),
        },
      });
    }
    return acc;
  }, []);
};

import type { OutputParser, Problem, ToolDefinition } from "../types";
import { execAndParse } from "../utils";

export const oxfmt: ToolDefinition = ({ root }) => {
  const checkCmd = "oxfmt . --list-different";
  const fixCmd = "oxfmt .";

  return {
    name: "Oxfmt",
    packageName: "oxfmt",
    check: () => execAndParse(checkCmd, root, parseOutput),
    fix: () => execAndParse(fixCmd, root, parseOutput),
  };
};

const NEWLINE_REGEX = /\r?\n/;

const SYNTAX_ERROR_REGEX =
  /^\s*?[×✕]\s+(?<message>.+?)\r?\n\s+╭─\[(?<file>.+?):(?<line>[0-9]+):(?<column>[0-9]+)\]/;

export const parseOutput: OutputParser = ({ stdout, stderr }) => {
  // Syntax errors are in stderr, non-formatted files are in stdout.

  const problems: Problem[] = [];

  for (const { groups } of stderr.trim().matchAll(new RegExp(SYNTAX_ERROR_REGEX, "g"))) {
    problems.push({
      file: groups!.file,
      kind: "error",
      message: groups!.message,
      location: {
        line: parseInt(groups!.line, 10),
        column: parseInt(groups!.column, 10),
      },
    });
  }

  for (const line of stdout.trim().split(NEWLINE_REGEX)) {
    if (!line || line.includes(" ")) continue;
    problems.push({
      file: line.trim(),
      kind: "warning",
      message: "Not formatted.",
    });
  }

  return problems;
};

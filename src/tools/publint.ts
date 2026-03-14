import type { OutputParser, Problem, ProblemKind, ToolDefinition } from "../types";
import { execAndParse } from "../utils";

export const publint: ToolDefinition = ({ root }) => {
  const cmd = "publint";

  return {
    name: "Publint",
    packageName: "publint",
    check: () => execAndParse(cmd, root, parseOutput),
  };
};

const NEWLINE_REGEX = /\r?\n/;

const ERROR_REGEX = /^[0-9]+\.\s?(?<message>.*)$/;

export const parseOutput: OutputParser = ({ stdout }) => {
  let kind: ProblemKind = "warning";
  return stdout.split(NEWLINE_REGEX).reduce<Problem[]>((acc, line) => {
    if (line.includes("Errors:")) {
      kind = "error";
      return acc;
    }
    const groups = ERROR_REGEX.exec(line)?.groups;
    if (groups == null) return acc;

    acc.push({
      kind,
      message: groups.message,
      file: "package.json",
    });

    return acc;
  }, []);
};

import type {
  OutputParser,
  Problem,
  ProblemKind,
  ToolDefinition,
} from "../types";
import { execAndParse } from "../utils";

export const publint: ToolDefinition = ({ root }) => {
  const bin = "publint";
  const args: string[] = [];

  return {
    name: "Publint",
    packageName: "publint",
    check: () => execAndParse(bin, args, root, parseOutput),
  };
};

export const parseOutput: OutputParser = ({ stdout }) => {
  let kind: ProblemKind = "warning";
  return stdout.split(/\r?\n/).reduce<Problem[]>((acc, line) => {
    if (line.includes("Errors:")) {
      kind = "error";
      return acc;
    }
    const groups = /^[0-9]+\.\s?(?<message>.*)$/.exec(line)?.groups;
    if (groups == null) return acc;

    acc.push({
      kind,
      message: groups.message,
      file: "package.json",
    });

    return acc;
  }, []);
};

import type {
  OutputParser,
  Problem,
  ProblemKind,
  ToolDefinition,
} from "../types";
import { isBinInstalled, execAndParse } from "../utils";
import { resolve } from "node:path";

const bin = "publint";
const args: string[] = [];

export const publint: ToolDefinition = ({ binDir, root }) => {
  const bin = resolve(root, binDir, "publint");
  const args: string[] = [];

  return {
    name: "Publint",
    isInstalled: () => isBinInstalled(bin),
    check: () => execAndParse(bin, args, root, parseOuptut),
  };
};

export const parseOuptut: OutputParser = ({ stdout }) => {
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

import type { OutputParser, Problem, ToolDefinition } from "../types";
import { execAndParse } from "../utils";

export const eslint: ToolDefinition = ({ root }) => {
  const checkCmd = `eslint . --ext .js,.ts,.jsx,.tsx,.mjs,.mts,.cjs,.cts,.vue --format json --max-warnings 0`;
  const fixCmd = `${checkCmd} --fix`;

  return {
    name: "ESLint",
    packageName: "eslint",
    checkCommand: checkCmd,
    check: () => execAndParse(checkCmd, root, parseOutput),
    fixCommand: fixCmd,
    fix: () => execAndParse(fixCmd, root, parseOutput),
  };
};

interface EslintResult {
  filePath: string;
  messages: Array<{
    ruleId: string | null;
    severity: 1 | 2;
    message: string;
    line?: number;
    column?: number;
  }>;
}

export const parseOutput: OutputParser = ({ stdout }) => {
  let results: EslintResult[];
  try {
    results = JSON.parse(stdout);
  } catch {
    return [];
  }
  if (!Array.isArray(results)) return [];

  return results.flatMap((result) =>
    result.messages.map<Problem>((msg) => ({
      file: result.filePath,
      kind: msg.severity === 1 ? "warning" : "error",
      message: msg.message,
      location: msg.line != null ? { line: msg.line, column: msg.column ?? 1 } : undefined,
      rule: msg.ruleId ?? undefined,
    })),
  );
};

import { ALL_TOOLS } from "./tools";
import type { CheckOptions, Tool, Problem, ToolDefinition } from "./types";
import {
  bold,
  cyan,
  debug as debugLog,
  dim,
  humanMs,
  isDebug,
  red,
  yellow,
} from "./utils";
import { createTaskList } from "./tasklist";
import { relative, resolve, sep, join } from "node:path";
import { isCI } from "ci-info";
import { readFile } from "node:fs/promises";

export type * from "./types";

export async function check(options: CheckOptions = {}) {
  const { debug, fix = !isCI, root = process.cwd() } = options;
  const packageJson = JSON.parse(
    await readFile(join(root, "package.json"), "utf8"),
  );
  if (debug) {
    process.env.DEBUG = "true";
  }
  console.log();
  debugLog("Options:" + JSON.stringify(options));
  debugLog(
    "Resolved options:" + JSON.stringify({ debug, fix, root, packageJson }),
  );

  const tools = await findInstalledTools({ root, packageJson });
  if (tools.length === 0) {
    if (isDebug()) {
      console.log("No tools detected!");
    } else {
      console.log("No tools detected! Run with --debug for more info");
    }
    console.log();
    process.exit(1);
  }
  const results = await createTaskList(
    tools,
    async ({ input: tool, fail, succeed, warn }) => {
      const startTime = performance.now();
      // Run checks
      const fn = fix ? (tool.fix ?? tool.check) : tool.check;
      const problems = await fn();
      // Ensure problems are absolute paths relative to the root dir
      problems.forEach((problem) => {
        problem.file = resolve(root ?? process.cwd(), problem.file);
      });
      const duration = humanMs(performance.now() - startTime);

      const title = `${tool.name} ${dim(`(${duration})`)}`;
      const errorCount = problems.filter((p) => p.kind === "error").length;
      if (errorCount > 0) fail(title);
      else if (problems.length > 0) warn(title);
      else succeed(title);

      return problems;
    },
  );

  const problems = results.flat();
  console.log();
  if (problems.length === 0) {
    process.exit(0);
  }

  // Print problems
  console.log(plural(problems.length, "Problem:", "Problems:"));
  problems.sort((l, r) => {
    const nameCompare = l.file.localeCompare(r.file);
    if (nameCompare !== 0) return nameCompare;
    const lineCompare = (l.location?.line ?? 0) - (r.location?.line ?? 0);
    if (lineCompare !== 0) return lineCompare;
    return (l.location?.column ?? 0) - (r.location?.column ?? 0);
  });
  const groupedProblems = problems.reduce((acc, problem) => {
    const locationHash = `${problem.file}:${problem.location?.line}:${problem.location?.column}`;
    const list = acc.get(locationHash) ?? [];
    list.push(problem);
    acc.set(locationHash, list);
    return acc;
  }, new Map<string, Problem[]>());
  console.log([...groupedProblems.values()].map(renderProblemGroup).join("\n"));

  // Print files
  const files = Object.entries(
    problems.reduce<Record<string, number>>((acc, problem) => {
      const file = "." + sep + relative(process.cwd(), problem.file);
      acc[file] ??= 0;
      acc[file]++;
      return acc;
    }, {}),
  );
  const maxLength = files.reduce(
    (prev, [file]) => Math.max(prev, file.length),
    0,
  );
  console.log();
  console.log("Across " + plural(files.length, "File:", "Files:"));
  files.forEach(([file, count]) => {
    console.log(`${cyan(file.padEnd(maxLength, " "))} ${count}`);
  });

  // Exit based on number of commands that exited with code >= 1
  console.log();
  process.exit(problems.length);
}

async function findInstalledTools(
  opts: Parameters<ToolDefinition>[0],
): Promise<Tool[]> {
  const status = await Promise.all(
    ALL_TOOLS.map(async (def) => {
      const tool = await def(opts);
      const isInstalled =
        !!opts.packageJson.devDependencies?.[tool.packageName];
      return { tool, isInstalled };
    }),
  );

  if (isDebug()) {
    const getTools = (isInstalled: boolean) =>
      status
        .filter((item) => item.isInstalled === isInstalled)
        .map((item) => item.tool.name)
        .join(", ");
    const installed = getTools(true);
    debugLog(`Installed: ${installed || "(none)"}`);
    const skipped = getTools(false);
    debugLog(`Skipping: ${skipped || "(none)"} `);
  }
  return status
    .filter(({ isInstalled }) => isInstalled)
    .map((item) => item.tool);
}

function plural(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural} `;
}

export function renderProblemGroup(problems: Problem[]): string {
  const renderedProblems = problems.map(renderProblem);
  const problem = problems[0];
  const path = relative(process.cwd(), problem.file);
  const location = problem.location
    ? `${path}:${problem.location.line}:${problem.location.column}`
    : path;
  const link = dim(`→ .${sep}${location}`);
  return `${renderedProblems.join("\n")}\n  ${link}`;
}

export function renderProblem(problem: Problem): string {
  const icon = problem.kind === "warning" ? bold(yellow("⚠")) : bold(red("✗"));
  const source = problem.rule ? dim(` (${problem.rule})`) : "";
  return `${icon} ${problem.message}${source}`;
}

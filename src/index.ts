import { ALL_TOOLS } from "./tools";
import type { CheckOptions, Tool, Problem } from "./types";
import { p } from "@antfu/utils";
import { bold, cyan, debug, dim, humanMs, isDebug, red, yellow } from "./utils";
import { createTaskList } from "./tasklist";
import { relative, resolve, sep } from "node:path";

export type * from "./types";

export async function check(options: CheckOptions = {}) {
  const { debug, fix, root } = options;
  if (debug) {
    process.env.DEBUG = "true";
  }
  console.log();

  const tools = await findInstalledTools(root);
  if (tools.length === 0) {
    console.log("No tools detected! Run with --debug for more info");
    console.log();
    process.exit(1);
  }
  const results = await createTaskList(
    tools,
    async ({ input: tool, fail, succeed, warn }) => {
      const startTime = performance.now();
      // Run checks
      const fn = fix ? tool.fix ?? tool.check : tool.check;
      const output = await fn(root);
      if ("problems" in output) {
        // Ensure problems are absolute paths relative to the root dir
        output.problems.forEach((problem) => {
          problem.file = resolve(root ?? process.cwd(), problem.file);
        });
      }
      const duration = humanMs(performance.now() - startTime);

      const title = `${tool.name} ${dim(`(${duration})`)}`;
      if (output.type === "error") fail(title);
      else if (output.type === "warning") warn(title);
      else succeed(title);

      return output;
    },
  );

  const problems = results
    .flatMap((result) => (result.type === "success" ? [] : result.problems))
    .sort((l, r) => {
      const nameCompare = l.file.localeCompare(r.file);
      if (nameCompare !== 0) return nameCompare;
      const lineCompare = (l.location?.line ?? 0) - (r.location?.line ?? 0);
      if (lineCompare !== 0) return lineCompare;
      return (l.location?.column ?? 0) - (r.location?.column ?? 0);
    });

  console.log();
  if (problems.length === 0) {
    process.exit(0);
  }

  // Print problems
  console.log(plural(problems.length, "Problem:", "Problems:"));
  problems.forEach((problem) => {
    console.log(renderProblem(problem));
  });

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
  const failedChecks = results.filter((res) => res.type === "error").length;
  process.exit(failedChecks);
}

async function findInstalledTools(root: string | undefined): Promise<Tool[]> {
  const status = await p(ALL_TOOLS).map(async (tool) => ({
    tool,
    isInstalled: await tool.isInstalled(root),
  })).promise;

  if (isDebug()) {
    const getTools = (isInstalled: boolean) =>
      status
        .filter((item) => item.isInstalled === isInstalled)
        .map((item) => item.tool.name)
        .join(", ");
    const installed = getTools(true);
    debug(`Installed: ${installed || "(none)"}`);
    const skipped = getTools(false);
    debug(`Skipping: ${skipped || "(none)"} `);
  }
  return status
    .filter(({ isInstalled }) => isInstalled)
    .map((item) => item.tool);
}

function plural(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural} `;
}

export function renderProblem(problem: Problem): string {
  const icon = problem.kind === "warning" ? bold(yellow("⚠")) : bold(red("✗"));
  const path = relative(process.cwd(), problem.file);
  const location = problem.location
    ? `${path}:${problem.location.line}:${problem.location.column}`
    : path;
  const source = problem.rule ? dim(` (${problem.rule})`) : "";
  const link = dim(`→ .${sep}${location}`);
  return `${icon} ${problem.message}${source}\n  ${link}`;
}
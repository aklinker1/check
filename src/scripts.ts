import { existsSync } from "node:fs";
import { join } from "node:path";

import type { Tool } from "./types";
import { debug, execAndParse } from "./utils";

const SCRIPT_PREFIX = "check:";

/**
 * Find all `check:*` scripts in the package.json and convert them to tools. If a script exits with
 * a non-zero code, its output is reported as an error.
 */
export function findScriptTools(root: string, packageJson: any): Tool[] {
  const scripts: Record<string, unknown> = packageJson.scripts ?? {};
  const names = Object.keys(scripts).filter(
    (name) => name.startsWith(SCRIPT_PREFIX) && name.length > SCRIPT_PREFIX.length,
  );
  debug(`Check scripts: ${names.join(", ") || "(none)"}`);
  if (names.length === 0) return [];

  const run = getRunCommand(root, packageJson);
  return names.map((script) => ({
    name: script,
    // Not tied to a dev dependency, so it's always ran
    packageName: script,
    check: () => execAndParse(`${run} ${script}`, root, () => []),
  }));
}

function getRunCommand(root: string, packageJson: any): string {
  const declared = String(packageJson.packageManager ?? "").split("@")[0];
  if (declared === "bun" || declared === "pnpm" || declared === "yarn") return `${declared} run`;
  if (declared === "npm") return "npm run";

  if (existsSync(join(root, "bun.lock")) || existsSync(join(root, "bun.lockb"))) return "bun run";
  if (existsSync(join(root, "pnpm-lock.yaml"))) return "pnpm run";
  if (existsSync(join(root, "yarn.lock"))) return "yarn run";
  return "npm run";
}

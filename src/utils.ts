import { spawn } from "node:child_process";
import type { OutputParser, Problem } from "./types";

function exec(
  cmd: string,
  args: string[],
  opts?: { cwd?: string },
): Promise<{ stderr: string; stdout: string; exitCode: number | null }> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { ...opts, shell: true });
    let stderr = "";
    let stdout = "";
    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });
    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });
    child.on("error", (error) => {
      reject(error);
    });
    child.on("close", (exitCode) => {
      resolve({ stderr, stdout, exitCode });
    });
  });
}

export async function execAndParse(
  bin: string,
  args: string[],
  cwd: string,
  parser: OutputParser,
): Promise<Problem[]> {
  const res = await exec(bin, args, { cwd });
  if (res.exitCode == null) throw Error("Exit code was null");
  if (isDebug()) console.debug({ bin, args, cwd, ...res });
  return parser({
    code: res.exitCode,
    stderr: res.stderr,
    stdout: res.stdout,
  });
}

export function isDebug(): boolean {
  return process.env.DEBUG === "true" || process.env.DEBUG === "1";
}

export const bold = (str: string) => `\x1b[1m${str}\x1b[0m`;
export const dim = (str: string) => `\x1b[2m${str}\x1b[0m`;
export const red = (str: string) => `\x1b[31m${str}\x1b[0m`;
export const green = (str: string) => `\x1b[32m${str}\x1b[0m`;
export const yellow = (str: string) => `\x1b[33m${str}\x1b[0m`;
export const cyan = (str: string) => `\x1b[36m${str}\x1b[0m`;

export function humanMs(ms: number): string {
  const minutes = Math.floor(ms / 60e3); // Convert to minutes
  const seconds = ((ms % 60e3) / 1e3).toFixed(minutes > 0 ? 0 : 3);
  return `${minutes > 0 ? `${minutes}m ` : ""}${seconds}s`;
}

export function debug(message: string) {
  if (isDebug()) console.debug(dim("⚙ " + message));
}

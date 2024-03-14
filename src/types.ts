export interface CheckOptions {
  /**
   * Set to true to fix problems that can be automatically fixed.
   *
   * Defaults to `true` outside CI, and `false` inside CI.
   */
  fix?: boolean;
  /**
   * Directory to run commands in.
   */
  root?: string;
  /**
   * Set to true to enable debug logs.
   */
  debug?: boolean;
}

export interface Tool {
  /**
   * Name of tool shown in the console output.
   */
  name: string;
  /**
   * Check if the tool is installed.
   */
  isInstalled: (root: string | undefined) => Promise<boolean>;
  /**
   * Run the tool, only checking for problems.
   */
  check: (root: string | undefined) => Promise<Problem[]>;
  /**
   * Run the tool, but fix problems if possible. If the tool doesn't support fixing problems, `check` will be called instead.
   */
  fix?: (root: string | undefined) => Promise<Problem[]>;
}

export interface Problem {
  location?: CodeLocation;
  message: string;
  file: string;
  kind: ProblemKind;
  rule?: string;
}

export interface CodeLocation {
  line: number;
  column: number;
}

export type ProblemKind = "warning" | "error";

export type OutputParser = (data: {
  code: number;
  stdout: string;
  stderr: string;
}) => Problem[];

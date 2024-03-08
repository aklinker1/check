import { cyan, dim, green, red, yellow } from "../utils";
import readline from "node:readline";

export async function createTaskList<
  TInput extends { name: string },
  TResult = void,
>(
  inputs: TInput[],
  run: (ctx: {
    input: TInput;
    succeed: (title?: string) => void;
    warn: (title?: string) => void;
    fail: (title?: string) => void;
  }) => Promise<TResult>,
): Promise<TResult[]> {
  console.log(process.stderr.isTTY);
  const states = inputs.map((item) => ({
    title: item.name,
    state: "pending" as TaskState,
  }));
  const isTty = process.stderr.isTTY;

  let tick = 0;
  const render = (opts?: { firstRender?: boolean; lastRender?: boolean }) => {
    if (!opts?.firstRender) {
      // Don't move the cursor for the first render otherwise it will overwrite
      // output above the task list
      readline.moveCursor(process.stderr, 0, -1 * states.length);
    }
    states.forEach(({ state, title }) => {
      readline.clearLine(process.stderr, 0);
      const frames = SPINNER_FRAMES[state];
      process.stderr.write(`${frames[tick % frames.length]} ${title}\n`);
    });
    tick++;
  };

  render({ firstRender: true });
  const renderInterval = setInterval(render, SPINNER_INTERVAL_MS);

  try {
    const result = Promise.all(
      inputs.map(async (input, i) => {
        const succeed = (title?: string) => {
          if (title != null) states[i].title = title;
          states[i].state = "success";
          render();
        };
        const warn = (title?: string) => {
          if (title != null) states[i].title = title;
          states[i].state = "warning";
          render();
        };
        const fail = (title?: string) => {
          if (title != null) states[i].title = title;
          states[i].state = "error";
          render();
        };
        try {
          states[i].state = "in-progress";
          render();
          const res = await run({ input, succeed, warn, fail });
          if (states[i].state === "in-progress") {
            states[i].state = "success";
            render();
          }
          return res;
        } catch (err) {
          if (err instanceof Error) fail(err.message);
          else fail(String(err));
          throw err;
        }
      }),
    );
    render({ lastRender: true });
    return await result;
  } finally {
    clearInterval(renderInterval);
  }
}

const SPINNER_INTERVAL_MS = 80;

type TaskState = "pending" | "in-progress" | "success" | "warning" | "error";

const SPINNER_FRAMES: Record<TaskState, string[]> = {
  pending: [dim("□")],
  "in-progress": ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"].map(cyan),
  success: [green("✔")],
  warning: [yellow("⚠")],
  error: [red("✗")],
};

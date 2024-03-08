import { defineCommand, runMain } from "citty";
import { check } from ".";

const main = defineCommand({
  meta: {
    name: "check",
    description: "@aklinker1/check",
  },
  args: {
    root: {
      type: "positional",
      description: "Root directory to run commands from",
      required: false,
    },
    fix: {
      type: "boolean",
      alias: "f",
      description: "Fix problems if possible instead of just reporting them",
    },
    debug: {
      type: "boolean",
      alias: "d",
      description: "Enable debug logs",
    },
  },
  async run(ctx) {
    await check(ctx.args);
  },
});

runMain(main);

import { isCI } from "ci-info";
import { check } from ".";
import { version } from "../package.json" with { type: "json" };
import { ALL_TOOLS } from "./tools";

const help = `\x1b[34m\x1b[1mcheck\x1b[0m runs all your project checks at once, standardizing and combining the output. \x1b[2m(${version})\x1b[0m

\x1b[1mSupported Tools:\x1b[0m
  ${ALL_TOOLS.map((tool) => `\x1b[32m${tool.name}\x1b[0m`)
    .sort()
    .join(", ")}

\x1b[1mUsage:\x1b[0m
  \x1b[1mcheck\x1b[0m \x1b[1m\x1b[36m[flags]\x1b[0m [root]

\x1b[1mArguments:\x1b[0m
  root       Directory to run commands from (default: .)

\x1b[1mFlags\x1b[0m:
  \x1b[36m-f\x1b[0m, \x1b[36m--fix\x1b[0m      Fix problems when possible (default: false in CI, true everywhere else)
  \x1b[36m-d\x1b[0m, \x1b[36m--debug\x1b[0m    Enable debug logs
  \x1b[36m-h\x1b[0m, \x1b[36m--help\x1b[0m     Show this help message and exit`;

const args = process.argv.slice(2);
const boolArg = (arg: string): boolean | undefined =>
  args.includes(arg) || undefined;

const showHelp = boolArg("-h") || boolArg("--help");
if (showHelp) {
  console.log(help);
  process.exit(0);
}

await check({
  fix: boolArg("-f") ?? boolArg("--fix") ?? !isCI,
  debug: boolArg("-d") ?? boolArg("--debug") ?? false,
  root: args.find((arg) => !arg.startsWith("-")) ?? ".",
});

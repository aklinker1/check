---
name: list-tools
description:
  List the code quality tools enabled in a project and the exact commands `check` will run.
---

# Listing tools with `@aklinker1/check`

Use `check tools` to find out which tools `check` will run in a project, and the exact shell command
for each one, without running them. This is useful for answering "what does `check` run here?", for
reproducing a single tool's command by hand, or for confirming a tool was detected after installing
it.

## Usage

```bash
pnpm check tools
```

Example output:

```text
Oxfmt → oxfmt .
Oxlint → oxlint . --format=unix --deny-warnings --fix
Publint → publint
TypeScript → tsc --noEmit --pretty false
```

## Which tools are listed

Supported tools installed as `devDependencies` in the project's `package.json`.

If nothing is detected, it prints `No tools detected!` and exits with code `1`.

## Fix vs. check commands

The listed command matches what a normal `check` run would execute:

- Locally (default), or with `--fix`: the fix command, when the tool has one.
- In CI: the check-only command.

```bash
# Show the commands that run when fixing
check tools --fix
```

Tools without a fix mode (CSpell, Publint, TypeScript) show the same command in both modes.

## Arguments and flags

```bash
check tools [flags] [root]
```

- `root` - Directory to read the `package.json` from (default: `.`)
- `-f, --fix` - Show fix commands when available
- `-d, --debug` - Enable debug logs showing how tools were detected

## Troubleshooting

If a tool is missing from the list, make sure it's installed as a dev dependency:

```bash
pnpm add -D prettier
```

Then run `check tools --debug` to see which tools were installed and which were skipped.

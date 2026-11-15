<div align="center">

# `@aklinker1/check`

[![NPM Version](https://img.shields.io/npm/v/%40aklinker1%2Fcheck?logo=npm&labelColor=red&color=white)](https://www.npmjs.com/package/@aklinker1/check)
[![Install Size](https://pkg-size.dev/badge/install/22026)](https://pkg-size.dev/@aklinker1%2Fcheck)

Opinionated CLI that runs all your project's linters, formatters, and type checkers at once, with
unified output.

https://github.com/aklinker1/check/assets/10101283/c8089e5c-e25f-4f59-8897-d2a6f97a3139

</div>

```sh
pnpm add -D @aklinker1/check
bun  add -D @aklinker1/check
npm  i   -D @aklinker1/check
```

## Usage

Add a script to your `package.json`:

```json
{
  "scripts": {
    "check": "check"
  }
}
```

Then run it:

```sh
# Run all checks, fixing problems when possible
pnpm check

# Explicitly fix problems
pnpm check --fix
```

`check` only exits with code `0` when no problems exist. Otherwise, the exit code is the number of
problems found.

## Features

- 🔍 Auto-detects tools from your `devDependencies`, no config required
- ⚡ Runs all tools in parallel
- 🧩 Unified task list and problem output
- 🛠️ Auto-fixes problems when supported by the tool
- 🤖 CI aware: fixes locally, check-only in CI
- 🧠 Includes an agent skill

## Supported Tools

To enable a tool, install it as a dev dependency. `check` runs any of the following tools listed in
your `package.json`'s `devDependencies`:

| Tool                                                              | Package            | Fixes |
| ----------------------------------------------------------------- | ------------------ | ----- |
| [CSpell](https://cspell.org)                                      | `cspell`           | ❌    |
| [ESLint](https://eslint.org)                                      | `eslint`           | ✅    |
| [Markdownlint](https://github.com/igorshubovych/markdownlint-cli) | `markdownlint-cli` | ✅    |
| [Oxfmt](https://oxc.rs)                                           | `oxfmt`            | ✅    |
| [Oxlint](https://oxc.rs)                                          | `oxlint`           | ✅    |
| [Prettier](https://prettier.io)                                   | `prettier`         | ✅    |
| [Publint](https://publint.dev)                                    | `publint`          | ❌    |
| [rumdl](https://github.com/rvben/rumdl)                           | `rumdl`            | ✅    |
| [TypeScript](https://www.typescriptlang.org)                      | `typescript`       | ❌    |
| [TypeScript (Vue)](https://github.com/vuejs/language-tools)       | `vue-tsc`          | ❌    |

```sh
pnpm add -D prettier oxlint typescript
```

## CLI

```sh
check [flags] [root]
```

| Argument | Description                                   |
| -------- | --------------------------------------------- |
| `root`   | Directory to run commands from (default: `.`) |

| Flag          | Description                                                           |
| ------------- | --------------------------------------------------------------------- |
| `-f, --fix`   | Fix problems when possible (default: `false` in CI, `true` elsewhere) |
| `-d, --debug` | Enable debug logs, including which tools are detected and run         |
| `-h, --help`  | Show help and exit                                                    |

```sh
# Run from a different directory
pnpm check ./packages/app

# See why a tool isn't being run
pnpm check --debug
DEBUG=check pnpm check
```

## CI

In CI, `check` defaults to check-only mode so nothing is modified:

```yaml
# GitHub Actions
- name: Run checks
  run: pnpm check
```

## Agent Skill

The package ships with agent skills in `skills/` that teach coding agents how to use `check`:

- `run-checks` (`skills/run-checks`): run checks and fix problems.
- `list-tools` (`skills/list-tools`): list enabled tools and the commands that will be ran.

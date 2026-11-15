---
name: run-checks
description: Run code quality checks in parallel with unified output.
---

# Using `@aklinker1/check`

`@aklinker1/check` is an opinionated CLI tool that runs multiple code quality checks (linters,
formatters, type checkers, etc.) all at once with unified output.

## Basic Usage

```bash
# Check for issues
pnpm check

# Check and auto-fix issues where possible
pnpm check --fix
```

> Some package managers, like `bun`, include a `check` command. You can override it by adding a `check` script to the project's `package.json`.
>
> ```json
> {
>   "scripts": {
>     "check": "check"
>   }
> }
> ```

## Supported Tools

`check` automatically detects and runs any of these tools if they're installed as dev dependencies:

- **CSpell** - Spell checker for code
- **ESLint** - JavaScript/TypeScript linter
- **Markdownlint** - Markdown linter
- **Oxfmt** - Fast formatter
- **Oxlint** - Fast linter
- **Prettier** - Code formatter
- **Publint** - Package.json validator
- **rumdl** - Markdown linter (Rust-based)
- **TypeScript** - Type checker (also supports `vue-tsc`)

To enable any tool, just install it:

```bash
pnpm add -D prettier eslint typescript cspell
```

## Command Line Options

```bash
check [flags] [root]
```

### Arguments

- `root` - Directory to run commands from (default: `.`)

### Flags

- `-f, --fix` - Fix problems when possible (default: `false` in CI, `true` elsewhere)
- `-d, --debug` - Enable debug logs to see what commands are being run
- `-h, --help` - Show help message

## Output Format

`check` provides unified, easy-to-read output:

- **Task list**: Shows each tool as it runs with spinner/status icons
- **Problem grouping**: Groups problems by file location
- **Summary**: Shows total problems and affected files
- **Exit code**: Returns non-zero if any problems exist

## Examples

### Check specific directory

```bash
pnpm check ./src
```

### Debug mode

```bash
bun check --debug
# or
DEBUG=1 bun check
```

### Fix mode

```bash
npm run check --fix
```

## CI Integration

`check` automatically detects CI environments and defaults to check-only mode (no auto-fix):

```yaml
# GitHub Actions
- name: Run checks
  run: pnpm check
```

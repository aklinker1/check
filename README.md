<div align="center">

# `@aklinker1/check`

[![NPM Version](https://img.shields.io/npm/v/%40aklinker1%2Fcheck?logo=npm&labelColor=red&color=white)](https://www.npmjs.com/package/@aklinker1/check)
[![Install Size](https://pkg-size.dev/badge/install/22026)](https://pkg-size.dev/@aklinker1%2Fcheck)

An opinionated CLI tool to run all your checks all at once. The command will only exit with code 0
when no problems exist.

https://github.com/aklinker1/check/assets/10101283/c8089e5c-e25f-4f59-8897-d2a6f97a3139

</div>

```sh
pnpm i @aklinker1/check
pnpm check
pnpm check --fix
```

To enable checks for any of the following modules, just install them as dev dependencies:

```sh
pnpm add -D cspell
pnpm add -D eslint
pnpm add -D markdownlint-cli
pnpm add -D oxlint
pnpm add -D prettier
pnpm add -D publint
pnpm add -D rumdl
pnpm add -D typescript
pnpm add -D @typescript/native-preview # Deprecated: check supports TypeScript 7
```

`check` will run any of the above tools if they are listed in the `package.json`'s `devDependencies`
section.

## Contributing

This project is built using [`bun`](https://bun.sh).

```sh
# Setup
bun i

# Build NPM package
bun run build

# Run checks
bun check --help
bun check

# Debug commands used
DEBUG=1 bun check
```

### Adding Tools

1. Copy and rename `src/tools/prettier.ts` and `src/tools/prettier.test.ts` accordingly
2. Implement and update tests for your new tool
3. Add your tool to the `ALL_TOOLS` array in `src/tools/index.ts`
4. Add the tool's NPM package to the first section of this README

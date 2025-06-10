# Check

An opinionated CLI tool to run all your checks all at once. The command will only exit with code 0 when no problems exist.

https://github.com/aklinker1/check/assets/10101283/c8089e5c-e25f-4f59-8897-d2a6f97a3139

```sh
pnpm i @aklinker1/check
pnpm check
pnpm check --fix
```

To enable checks for any of the following modules, just install them:

```sh
pnpm i -D typescript oxlint prettier publint eslint markdownlint-cli
```

## Contributing

This project is built using [`bun`](https://bun.sh). Demo project uses PNPM.

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

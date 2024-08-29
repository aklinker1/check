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
pnpm i -D typescript oxlint prettier publint eslint
```

## Contributing

This project is built using [`bun`](https://bun.sh). Demo project uses PNPM.

```sh
# Setup
bun i
pushd demo
    pnpm i
popd

# Build NPM package
bun run build

# Run checks
bun check --help
bun check
bun check demo
```

### Adding Tools

I've added everything I use, so if you want to add support for another tool, feel free.

Just copy `src/tools/prettier.ts` and `src/tools/prettier.test.ts`, update the implementations (yes, tests are required), and add your new tool to `src/tools/index.ts`'s `ALL_TOOLS` export.

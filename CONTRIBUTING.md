# Contributing

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

## Adding Tools

1. Copy and rename `src/tools/prettier.ts` and `src/tools/prettier.test.ts` accordingly
2. Implement and update tests for your new tool
3. Add your tool to the `ALL_TOOLS` array in `src/tools/index.ts`
4. Add the tool to the [Supported Tools](README.md#supported-tools) table in `README.md`

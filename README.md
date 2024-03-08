# Check

> [!WARNING]
> I have not actually published this to NPM yet.

```sh
pnpm i @aklinker1/check
pnpm check
pnpm check --fix
```

https://github.com/aklinker1/check/assets/10101283/c8089e5c-e25f-4f59-8897-d2a6f97a3139

To enable TS, ESLint, or Prettier, just install the package:

```sh
pnpm i -D typescript eslint prettier
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

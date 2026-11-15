# Changelog

## v3.0.2

[compare changes](https://github.com/aklinker1/check/compare/v3.0.1...v3.0.2)

### 🩹 Fixes

- Add description ([`d6f60d9`](https://github.com/aklinker1/check/commit/d6f60d92367ae8670ea03882ecd7e2ca9f00cc21))

### ❤️ Contributors

- [@aklinker1](https://github.com/aklinker1)


## v3.0.1

[compare changes](https://github.com/aklinker1/check/compare/v3.0.0...v3.0.1)

### 📖 Documentation

- Fix typo ([`340363b`](https://github.com/aklinker1/check/commit/340363b3378d16ee5b5e2ddf19b2c5be9079d558))
- Fix typo ([`b9927f1`](https://github.com/aklinker1/check/commit/b9927f17163ecb954f950268717462572ca39866))

### ❤️ Contributors

- [@aklinker1](https://github.com/aklinker1)

## v3.0.0

[compare changes](https://github.com/aklinker1/check/compare/v2.5.0...v3.0.0)

### 🚀 Features

- `check tools` to list tools and their commands ([`46ecc95`](https://github.com/aklinker1/check/commit/46ecc95572ac25a2d1111750a28bee52724a8c98))

### 🩹 Fixes

- Don't set default values for ignored paths ([`2548ca8`](https://github.com/aklinker1/check/commit/2548ca809abbf11b435fe77e518e48e65adc9479))
- Drop support for `@typescript/native-preview` ([`ca2bc63`](https://github.com/aklinker1/check/commit/ca2bc6313563e119a0e2592f53f3c4587690435b))
- Respect `--debug` flag ([`f7430e9`](https://github.com/aklinker1/check/commit/f7430e9bd87b089d1b0cdb826f16605e0839e01a))

### 📖 Documentation

- Update README ([`53e2af6`](https://github.com/aklinker1/check/commit/53e2af60df08ca253021ba24bf618d32b44f853d))
- Simplify README ([`86057ee`](https://github.com/aklinker1/check/commit/86057eeefb66ca1f2802fe40a7d4aecaf09e842d))

### 🏡 Chore

- Fix `package.json` repository field ([`30b3cbf`](https://github.com/aklinker1/check/commit/30b3cbfef763d45fdfacb98c0739ec31fc670bd8))
- **debug**: Use `DEBUG=check` to enable debug messages from env vars ([`3bbd0ee`](https://github.com/aklinker1/check/commit/3bbd0eebf2ed1f73280f6aaec4b1eaeeb618f531))

### 🤖 CI

- Remove extra build step from `publish` workflow ([`db64b49`](https://github.com/aklinker1/check/commit/db64b49e7618254a5144270b47ea4455c0dd9360))

### ⚠️ Breaking Changes

- [`2548ca8`](https://github.com/aklinker1/check/commit/2548ca809abbf11b435fe77e518e48e65adc9479): For `markdownlint-cli`, `oxlint`, and `rumdl`, don't apply any default ignore paths. Projects must set their own ignore paths in the config files.
- [`ca2bc63`](https://github.com/aklinker1/check/commit/ca2bc6313563e119a0e2592f53f3c4587690435b): Upgrade to `typescript@^7` instead of using `@typescript/native-preview`
- [`3bbd0ee`](https://github.com/aklinker1/check/commit/3bbd0eebf2ed1f73280f6aaec4b1eaeeb618f531): Use `DEBUG=check` instead of `DEBUG=1` to enable debug messages via env vars.

### ❤️ Contributors

- [@aklinker1](https://github.com/aklinker1)

## v2.5.0

[compare changes](https://github.com/aklinker1/check/compare/v2.4.1...v2.5.0)

### 🚀 Features

- Add rumdl support ([#14](https://github.com/aklinker1/check/pull/14))
- Include position of first problem in bottom file list ([`19c75ae`](https://github.com/aklinker1/check/commit/19c75ae729a48fda6c1ea45ccb11614d12abbaca))
- Add skill for running checks ([`9361260`](https://github.com/aklinker1/check/commit/9361260edd98aa2b1ae35af75e48be5a895e89d1))

### 🩹 Fixes

- **eslint**: Use `json` formatter instead of `compact` ([`7df40bf`](https://github.com/aklinker1/check/commit/7df40bfafafe3209b565823aa3f532bddabf693d))
- Report error when command fails to run but no problems are reported ([`140d536`](https://github.com/aklinker1/check/commit/140d5360801b1fb1d5baa274cbfc051db4cf96e5))

### 📖 Documentation

- Update README tool list ([`dc12bed`](https://github.com/aklinker1/check/commit/dc12bedc642ddf1abde1a19a8bbdb854b6a8cdb7))
- Fix typos, improve clarity ([`57dc5cb`](https://github.com/aklinker1/check/commit/57dc5cbd30afd94d4157c1d155194d00fcfdefc0))

### 🏡 Chore

- Use `.tool-versions` file ([`048671b`](https://github.com/aklinker1/check/commit/048671baf5008356fda1d16f0ca1717a2232d5bb))
- Fix formatting ([`0143cd9`](https://github.com/aklinker1/check/commit/0143cd95c19300121d5c73d66d012e38b85811f8))
- Fix lockfile ([`b640237`](https://github.com/aklinker1/check/commit/b64023753cc1e856bcde2eaedcdcb59e27ede6dd))

### 🤖 CI

- Use zero-changelog for releases ([`eaca472`](https://github.com/aklinker1/check/commit/eaca472ebd1df52a3da1bb8e324cf8615253379d))
- Fix dry-run flag ([`e630494`](https://github.com/aklinker1/check/commit/e630494e9727f8bfe2fae98b5b4183ced9b8231e))
- Publish with npm instead of bun ([`2d14956`](https://github.com/aklinker1/check/commit/2d14956c77c956c9bb0314f7738f34d775bb421b))

### ❤️ Contributors

- [@suveshmoza](https://github.com/suveshmoza)
- [@aklinker1](https://github.com/aklinker1)

## v2.4.1

[compare changes](https://github.com/aklinker1/check/compare/v2.4.0...v2.4.1)

### 🩹 Fixes

- Fix weird spacing in CI and aggregate package manager scripts ([6f33b22](https://github.com/aklinker1/check/commit/6f33b22))

### 📖 Documentation

- Use my standard package header ([3d98f9c](https://github.com/aklinker1/check/commit/3d98f9c))

### ❤️ Contributors

- Aaron ([@aklinker1](https://github.com/aklinker1))

## v2.4.0

[compare changes](https://github.com/aklinker1/check/compare/v2.3.1...v2.4.0)

### 🚀 Enhancements

- Add cspell ([cf00fda](https://github.com/aklinker1/check/commit/cf00fda))

### 🏡 Chore

- Upgrade bun setup action ([88265b5](https://github.com/aklinker1/check/commit/88265b5))

### ❤️ Contributors

- Aaron ([@aklinker1](https://github.com/aklinker1))

## v2.3.1

[compare changes](https://github.com/aklinker1/check/compare/v2.3.0...v2.3.1)

### 🔥 Performance

- Compile regex once ([77f9a18](https://github.com/aklinker1/check/commit/77f9a18))
- Optimize `process.cwd()` calls ([83e2d8c](https://github.com/aklinker1/check/commit/83e2d8c))
- Only check debug env once ([5209489](https://github.com/aklinker1/check/commit/5209489))

### 🩹 Fixes

- Add back jenkins detection ([08ff31d](https://github.com/aklinker1/check/commit/08ff31d))

### 🏡 Chore

- Remove prepublish hook ([e7d3e72](https://github.com/aklinker1/check/commit/e7d3e72))
- Remove dead code from oxlint ([519ad12](https://github.com/aklinker1/check/commit/519ad12))
- Remove ci-info ([7070c66](https://github.com/aklinker1/check/commit/7070c66))

### ❤️ Contributors

- Aaron ([@aklinker1](https://github.com/aklinker1))

## v2.3.0

[compare changes](https://github.com/aklinker1/check/compare/v2.2.0...v2.3.0)

### 🚀 Enhancements

- Add `oxfmt` support ([#11](https://github.com/aklinker1/check/pull/11))

### 📖 Documentation

- Indicate `@typescript/native-preview` support ([f4068f4](https://github.com/aklinker1/check/commit/f4068f4))

### ❤️ Contributors

- Aaron ([@aklinker1](https://github.com/aklinker1))

## v2.2.0

[compare changes](https://github.com/aklinker1/check/compare/v2.1.2...v2.2.0)

### 🚀 Enhancements

- Support `tsgo` via `@typescript/native-preview` ([d1c8f61](https://github.com/aklinker1/check/commit/d1c8f61))

### 🏡 Chore

- Upgrade to Bun 1.3.2 ([160cffb](https://github.com/aklinker1/check/commit/160cffb))

### ❤️ Contributors

- Aaron ([@aklinker1](https://github.com/aklinker1))

## v2.1.2

[compare changes](https://github.com/aklinker1/check/compare/v2.1.1...v2.1.2)

### 🩹 Fixes

- Don't use `args` when spawning child processes, resolves DEP0190 ([#10](https://github.com/aklinker1/check/pull/10))

### ❤️ Contributors

- Aaron ([@aklinker1](https://github.com/aklinker1))

## v2.1.1

[compare changes](https://github.com/aklinker1/check/compare/v2.1.0...v2.1.1)

### 🩹 Fixes

- Correctly check CLI flags ([5eb70dc](https://github.com/aklinker1/check/commit/5eb70dc))

### 🏡 Chore

- Refactor and support provence ([3ccfa33](https://github.com/aklinker1/check/commit/3ccfa33))
- Upgrade to bun 1.3 ([35df310](https://github.com/aklinker1/check/commit/35df310))
- Remove `@antfu/utils` dependency ([12145b5](https://github.com/aklinker1/check/commit/12145b5))
- Cleanup dependencies ([6c3ae58](https://github.com/aklinker1/check/commit/6c3ae58))
- Drop `citty` to reduce dep footprint ([47b9416](https://github.com/aklinker1/check/commit/47b9416))
- Use `tsdown` for bundling over `unbuild` ([05256ba](https://github.com/aklinker1/check/commit/05256ba))
- Update build script to use tsdown ([27098fd](https://github.com/aklinker1/check/commit/27098fd))

### 🤖 CI

- User version of Bun specified in `package.json` ([faa4879](https://github.com/aklinker1/check/commit/faa4879))
- Remove JSR from publish workflow ([fb4bec2](https://github.com/aklinker1/check/commit/fb4bec2))

### ❤️ Contributors

- Aaron ([@aklinker1](https://github.com/aklinker1))

## v2.1.0

[compare changes](https://github.com/aklinker1/check/compare/v2.0.0...v2.1.0)

### 🚀 Enhancements

- Add `markdownlint-cli` support ([#9](https://github.com/aklinker1/check/pull/9))

## v2.0.0

[compare changes](https://github.com/aklinker1/check/compare/v1.4.5...v2.0.0)

### 🩹 Fixes

- ⚠️  Detect tools by looking in package.json ([#8](https://github.com/aklinker1/check/pull/8))

#### ⚠️ Breaking Changes

- ⚠️  Detect tools by looking in package.json ([#8](https://github.com/aklinker1/check/pull/8))

## v1.4.5

[compare changes](https://github.com/aklinker1/check/compare/v1.4.4...v1.4.5)

### 🩹 Fixes

- **oxlint:** Default to using .oxlintignore ([573d1e4](https://github.com/aklinker1/check/commit/573d1e4))

## v1.4.4

[compare changes](https://github.com/aklinker1/check/compare/v1.4.3...v1.4.4)

## v1.4.3

[compare changes](https://github.com/aklinker1/check/compare/v1.4.2...v1.4.3)

### 🩹 Fixes

- Fix missing errors from oxlint and prettier ([e3ad041](https://github.com/aklinker1/check/commit/e3ad041))

## v1.4.2

[compare changes](https://github.com/aklinker1/check/compare/v1.4.1...v1.4.2)

### 🩹 Fixes

- Use correct format for oxlint ([7df1102](https://github.com/aklinker1/check/commit/7df1102))

## v1.4.1

[compare changes](https://github.com/aklinker1/check/compare/v1.4.0...v1.4.1)

### 🩹 Fixes

- Fail oxlint on warnings, ignore folders by default ([c419433](https://github.com/aklinker1/check/commit/c419433))

## v1.4.0

[compare changes](https://github.com/aklinker1/check/compare/v1.3.1...v1.4.0)

### 🚀 Enhancements

- Add oxlint support ([#7](https://github.com/aklinker1/check/pull/7))

## v1.3.1

[compare changes](https://github.com/aklinker1/check/compare/v1.3.0...v1.3.1)

### 🩹 Fixes

- Improve debug logs ([5603bd4](https://github.com/aklinker1/check/commit/5603bd4))

### 🏡 Chore

- Fix type error ([3e351ba](https://github.com/aklinker1/check/commit/3e351ba))

## v1.3.0

[compare changes](https://github.com/aklinker1/check/compare/v1.2.0...v1.3.0)

### 🚀 Enhancements

- Add custom `binDir` option ([#4](https://github.com/aklinker1/check/pull/4))

### 🏡 Chore

- Upgrade bun to 1.1, enable windows tests ([#5](https://github.com/aklinker1/check/pull/5))

## v1.2.0

[compare changes](https://github.com/aklinker1/check/compare/v1.1.1...v1.2.0)

### 🚀 Enhancements

- Use vue-tsc for TypeScript if installed ([4728f56](https://github.com/aklinker1/check/commit/4728f56))

## v1.1.1

[compare changes](https://github.com/aklinker1/check/compare/v1.1.0...v1.1.1)

### 🩹 Fixes

- **windows:** Use `shell: true` when spawning commands ([4cc63a9](https://github.com/aklinker1/check/commit/4cc63a9))

## v1.1.0

[compare changes](https://github.com/aklinker1/check/compare/v1.0.5...v1.1.0)

### 🚀 Enhancements

- Report location once if multiple problems are in the same location ([98a2cd5](https://github.com/aklinker1/check/commit/98a2cd5))

### 🏡 Chore

- Use named regex capture groups ([3931c0c](https://github.com/aklinker1/check/commit/3931c0c))

## v1.0.5

[compare changes](https://github.com/aklinker1/check/compare/v1.0.4...v1.0.5)

### 🩹 Fixes

- Release workflow ([df7cac0](https://github.com/aklinker1/check/commit/df7cac0))

## v1.0.4

[compare changes](https://github.com/aklinker1/check/compare/v1.0.3...v1.0.4)

### 🩹 Fixes

- Add NPM package metadata ([fdae83b](https://github.com/aklinker1/check/commit/fdae83b))

## v1.0.3

[compare changes](https://github.com/aklinker1/check/compare/v1.0.2...v1.0.3)

### 🩹 Fixes

- **prettier:** Handle --fix errors and non-error output correctly ([95bdaf6](https://github.com/aklinker1/check/commit/95bdaf6))

## v1.0.2

[compare changes](https://github.com/aklinker1/check/compare/v1.0.1...v1.0.2)

### 🩹 Fixes

- Debug commands and output ([5aa3525](https://github.com/aklinker1/check/commit/5aa3525))

### 🏡 Chore

- Remove email from changelogs ([5e754d7](https://github.com/aklinker1/check/commit/5e754d7))

## v1.0.1

[compare changes](https://github.com/aklinker1/check/compare/v1.0.0...v1.0.1)

### 🩹 Fixes

- Proper rendering during CI when stderr isn't TTY ([2164104](https://github.com/aklinker1/check/commit/2164104))
- `--fix` by default outside CI ([#2](https://github.com/aklinker1/check/pull/2))

### 📖 Documentation

- Fix typo in README ([a9adee1](https://github.com/aklinker1/check/commit/a9adee1))
- Remove NPM warning README ([6d03340](https://github.com/aklinker1/check/commit/6d03340))

### 🏡 Chore

- Run unbuild inside bun ([358145e](https://github.com/aklinker1/check/commit/358145e))

### 🤖 CI

- Add validation workflow ([#1](https://github.com/aklinker1/check/pull/1))
- Add release workflow ([0e0393b](https://github.com/aklinker1/check/commit/0e0393b))
- Fix prepublish script ([ee2e2db](https://github.com/aklinker1/check/commit/ee2e2db))

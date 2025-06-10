# Changelog

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

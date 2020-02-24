# Symbol-sdk for TypeScript and JavaScript

[![npm version](https://badge.fury.io/js/symbol-sdk.svg)](https://badge.fury.io/js/symbol-sdk)
[![Build Status](https://api.travis-ci.org/nemtech/symbol-sdk-typescript-javascript.svg?branch=master)](https://travis-ci.org/nemtech/symbol-sdk-typescript-javascript)
[![Coverage Status](https://coveralls.io/repos/github/nemtech/symbol-sdk-typescript-javascript/badge.svg?branch=travis-ci)](https://coveralls.io/github/nemtech/symbol-sdk-typescript-javascript?branch=travis-ci)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

The official symbol-sdk for TypeScript and JavaScript, available for browsers, mobile applications, and NodeJS, to work
with the Symbol (a.k.a Catapult)

## Important Notes

### _Fushicho_ Network Compatibility (catapult-server@0.9.3.1)

Due to a network upgrade with [catapult-server@Fushicho](https://github.com/nemtech/catapult-server/releases/tag/v0.9.3.1) version, **it is recommended to use this package's 0.17.0 version and upwards to use this package with Fushicho versioned networks**.

The upgrade to this package's [version v0.17.0](https://github.com/nemtech/symbol-sdk-typescript-javascript/releases/tag/v0.17.0) is mandatory for **fushicho compatibility**.

You can find the complete changelog [here](CHANGELOG.md).

## Requirements

### NodeJS

- NodeJS 8.9.X
- NodeJS 9.X.X
- NodeJS 10.X.X

## Installation

```bash
npm install symbol-sdk rxjs
```

## Usage

Surf the [NEM Developer Center][docs] to get started into NEM development. You will find self-paced guides and useful code snippets using the TypeScript/Javascript SDK.

To get the full description of the available classes and their functions, check the [SDK reference][sdk-ref].

## Getting help

Use the following available resources to get help:

- [symbol-sdk-typescript-javascript documentation][docs]
- If you found a bug, [open a new issue][issues]

## Contributing

This project is developed and maintained by NEM Foundation. Contributions are welcome and appreciated. You can find [symbol-sdk on GitHub][self].

Feel free to start an issue or create a pull request. Check [CONTRIBUTING](CONTRIBUTING.md) before start.

You can also find useful notes for developers under our documentation [guidelines][guidelines] section.

## License

Copyright (c) 2018-2019 NEM
Licensed under the [Apache License 2.0](LICENSE)

[self]: https://github.com/nemtech/symbol-sdk-typescript-javascript
[docs]: http://nemtech.github.io/getting-started/setup-workstation.html
[issues]: https://github.com/nemtech/symbol-sdk-typescript-javascript/issues
[sdk-ref]: http://nemtech.github.io/symbol-sdk-typescript-javascript
[guidelines]: https://nemtech.github.io/contribute/contributing.html#sdk

# nem2-sdk for TypeScript and JavaScript

[![npm version](https://badge.fury.io/js/nem2-sdk.svg)](https://badge.fury.io/js/nem2-sdk)
[![Build Status](https://api.travis-ci.org/nemtech/nem2-sdk-typescript-javascript.svg?branch=master)](https://travis-ci.org/nemtech/nem2-sdk-typescript-javascript)
[![Coverage Status](https://coveralls.io/repos/github/nemtech/nem2-sdk-typescript-javascript/badge.svg?branch=travis-ci)](https://coveralls.io/github/nemtech/nem2-sdk-typescript-javascript?branch=travis-ci)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

The official nem2-sdk for TypeScript and JavaScript, available for browsers, mobile applications, and NodeJS, to work
with the NEM2 (a.k.a Catapult)

## Important Notes

### _Fushicho_ Network Compatibility (catapult-server@0.9.3.1)

Due to a network upgrade with [catapult-server@Fushicho](https://github.com/nemtech/catapult-server/releases/tag/v0.9.3.1) version, **it is recommended to use this package's 0.17.0 version and upwards to use this package with Fushicho versioned networks**.

The upgrade to this package's [version v0.17.0](https://github.com/nemtech/nem2-sdk-typescript-javascript/releases/tag/v0.17.0) is mandatory for **fushicho compatibility**.

### _Elephant_ Network Compatibility (catapult-server@0.7.0.1)

Due to a network upgrade with [catapult-server@elephant3](https://github.com/nemtech/catapult-server/releases/tag/v0.7.0.1) version, **it is recommended to use this package's 0.13.4 version and upwards to use this package with Elephant versioned networks**.

The upgrade to this package's [version v0.13.3](https://github.com/nemtech/nem2-sdk-typescript-javascript/releases/tag/v0.13.3) is mandatory for **elephant compatibility**.

### _Dragon_ Network Compatibility (catapult-server@0.4.0.1)

Due to a network upgrade with [catapult-server@dragon](https://github.com/nemtech/catapult-server/releases/tag/v0.4.0.1) version, **it is recommended to use this package's 0.12.4 version and upwards to use this package with Dragon versioned networks**.

The upgrade to this package's [version v0.12.4](https://github.com/nemtech/nem2-sdk-typescript-javascript/releases/tag/v0.12.4) is mandatory for **dragon compatibility**.

### _Cow_ Network Compatibility (catapult-server@0.3.0.2)

[version v0.11.6](https://github.com/nemtech/nem2-sdk-typescript-javascript/releases/tag/v0.11.6) is the latest locked version for **cow compatibility**.

Due to a network upgrade with [catapult-server@cow](https://github.com/nemtech/catapult-server/releases/tag/v0.3.0.2) version, **transactions from Alpaca & Bison are not compatible with cow versioned networks**.

### _Alpaca_ / _Bison_ Network Compatibility (catapult-server@0.1 & 0.2)

To be able to use this package with _Alpaca_ or _Bison_ versioned network, you must use [version v0.10.1-beta](https://github.com/nemtech/nem2-sdk-typescript-javascript/releases/tag/v0.10.1-beta).

You can find the complete changelog [here](CHANGELOG.md).

## Requirements

### NodeJS

- NodeJS 8.9.X
- NodeJS 9.X.X
- NodeJS 10.X.X

## Installation

```bash
npm install nem2-sdk rxjs
```

## Usage

Surf the [NEM Developer Center][docs] to get started into NEM development. You will find self-paced guides and useful code snippets using the TypeScript/Javascript SDK.

To get the full description of the available classes and their functions, check the [SDK reference][sdk-ref].
 
## Getting help

Use the following available resources to get help:

- [nem2-sdk-typescript-javascript documentation][docs]
- If you found a bug, [open a new issue][issues]

## Contributing

This project is developed and maintained by NEM Foundation. Contributions are welcome and appreciated. You can find [nem2-sdk on GitHub][self].

Feel free to start an issue or create a pull request. Check [CONTRIBUTING](CONTRIBUTING.md) before start.

You can also find useful notes for developers under our documentation [guidelines][guidelines] section.

## License 

Copyright (c) 2018-2019 NEM
Licensed under the [Apache License 2.0](LICENSE)

[self]: https://github.com/nemtech/nem2-sdk-typescript-javascript
[docs]: http://nemtech.github.io/getting-started/setup-workstation.html
[issues]: https://github.com/nemtech/nem2-sdk-typescript-javascript/issues
[sdk-ref]: http://nemtech.github.io/nem2-sdk-typescript-javascript
[guidelines]: https://nemtech.github.io/contribute/contributing.html#sdk

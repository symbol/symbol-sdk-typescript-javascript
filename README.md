# nem2-sdk for TypeScript and JavaScript

[![npm version](https://badge.fury.io/js/nem2-sdk.svg)](https://badge.fury.io/js/nem2-sdk)
[![Build Status](https://api.travis-ci.org/nemtech/nem2-sdk-typescript-javascript.svg?branch=master)](https://travis-ci.org/nemtech/nem2-sdk-typescript-javascript)
[![Coverage Status](https://coveralls.io/repos/github/nemtech/nem2-sdk-typescript-javascript/badge.svg?branch=travis-ci)](https://coveralls.io/github/nemtech/nem2-sdk-typescript-javascript?branch=travis-ci)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

The official nem2-sdk for TypeScript and JavaScript, available for browsers, mobile applications and NodeJS, to work 
with the NEM2 (a.k.a Catapult)

## Important Notes

Due to a network upgrade with [catapult-server@cow](https://github.com/nemtech/catapult-server/releases/tag/v0.3.0.2) version, **transactions from Alpaca&Bison are not compatible anymore**.

The upgrade to this SDK's [version v0.11.5](https://github.com/nemtech/nem2-sdk-typescript-javascript/releases/tag/v0.11.5) is mandatory for **cow compatibility**.

Other versions like [version v0.10.1-beta](https://github.com/nemtech/nem2-sdk-typescript-javascript/releases/tag/v0.10.1-beta) can be used for **bison** network version.

## Requirements

### NodeJS

- NodeJS 8.9.X
- NodeJS 9.X.X
- NodeJS 10.X.X

## Installation

```npm install nem2-sdk rxjs```

## Documentation and Getting Started

Get started and learn more about nem2-sdk-typescript-javascript, check the [official documentation][docs].

Check SDK reference [here][sdk-ref]

## nem2-sdk Releases

The release notes for the nem2-sdk can be found [here](CHANGELOG.md).

## Contributing

This project is developed and maintained by NEM Foundation. Contributions are welcome and appreciated. You can find [nem2-sdk on GitHub][self]; 
Feel free to start an issue or create a pull request. Check [CONTRIBUTING](CONTRIBUTING.md) before start.

## Getting help

We use GitHub issues for tracking bugs and have limited bandwidth to address them.
Please, use the following available resources to get help:

- [nem2-cli documentation][docs]
- If you found a bug, [open a new issue][issues]

## Changelog

Important versions listed below. Refer to the [Changelog](CHANGELOG.md) for a full history of the project.

- [0.11.6](CHANGELOG.md#0116-03-Jun-2019) - **Cow compatible** - 03.06.2019
- [0.11.5](CHANGELOG.md#0115-18-Apr-2019) - **Cow compatible** - 18.04.2019
- [0.11.4](CHANGELOG.md#0114-17-Apr-2019) - **Cow compatible** - 17.04.2019
- [0.11.3](CHANGELOG.md#0113-10-Apr-2019) - **Cow compatible** - 10.04.2019
- [0.11.2](CHANGELOG.md#0112-1-Apr-2019) - **Cow compatible** - 01.04.2019
- [0.11](CHANGELOG.md#011-14-Mar-2019) - **Cow compatible** - 14.03.2019
- [0.10.1-beta](CHANGELOG.md#v0101-beta) - **Alpaca compatible** 07.2018
- [0.9.5](CHANGELOG.md#095-27-Jun-2018) - **Alpaca compatible** 07.2018

## License

Copyright (c) 2018-2019 NEM
Licensed under the [Apache License 2.0](LICENSE)

[self]: https://github.com/nemtech/nem2-sdk-typescript-javascript
[docs]: http://nemtech.github.io/getting-started/setup-workstation.html
[issues]: https://github.com/nemtech/nem2-sdk-typescript-javascript/issues
[sdk-ref]: http://nemtech.github.io/nem2-sdk-typescript-javascript

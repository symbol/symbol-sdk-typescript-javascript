# Changelog
All notable changes to this project will be documented in this file.

The changelog format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.11.2] - 1-Apr-2019
- Todo.

## [0.11.1] - 18-Mar-2019
- Todo.
## [0.11] - 14-Mar-2019

## Added
- UInt64.fromHex and UInt64.toHex functions have been exposed.
- Error message when a developer tries to add an aggregate as an inner transaction.
- AccountLink Transaction to enable delegated harvesting.
- Support for AliasTransaction.
- TransferTransactions can be sent to an alias instead of an address.

## Changed
- Mosaics were splited from namespaces. MosaicDefinition does not have a related namespaceId, but instead a MosaicNonce.
- SecretLockTransaction to work with Sha3_256 instead of Sha3_512
- Network and nem2-library (0.9.8) required update to be compatible with catpault-server 0.3.
- XEM class splited into NetworkCurrencyMosaic and NetworkHarvestMosaic.

## [0.10.1-beta] - 27-Jun-2018

## Added
- Transaction deadline has been exposed to the public.

## Changed
- Compatibility with rxjs v6.

## Fixed
- Several linter errors.

## [0.9.5] - 27-Jun-2018

## Added
- An account can sign strings with its private key, and verify the signature later.

## Changed
- Compatibility with Node.js 10.

## [0.9.0] - 30-Mar-2018
### Added
- Initial code release.

[0.11.2]: https://github.com/nemtech/nem2-sdk-typescript-javascript/compare/v0.11.1...v0.11.2
[0.11.1]: https://github.com/nemtech/nem2-sdk-typescript-javascript/compare/v0.11.0...v0.11.1
[0.11]: https://github.com/nemtech/nem2-sdk-typescript-javascript/compare/v0.10.1-beta...v0.11.0
[0.10.1-beta]: https://github.com/nemtech/nem2-sdk-typescript-javascript/compare/v0.9.5...v0.10.1-beta
[0.9.5]: https://github.com/nemtech/nem2-sdk-typescript-javascript/compare/v0.9.0...v0.9.5
[0.9.0]: https://github.com/nemtech/nem2-sdk-typescript-javascript/releases/tag/v0.9.0

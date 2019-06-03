# CHANGELOG
All notable changes to this project will be documented in this file.

The changelog format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.11.6] - 03-Jun-2019

- Version lock for cow compatibility
- Fixed #150, AccountHttp.transactions outputs aggregate transactions supplementary data

## [0.11.5] - 18-Apr-2019

- Fixed #125, maxFee DTO value errors with in-aggregate MosaicSupplyChange and HashLock transactions  

## [0.11.4] - 17-Apr-2019

- Fixed #117, Typo in AddressAliasTransaction and MosaicAliasTransaction comments
- Fixed several typos in documentation
- Fixed CreateTransactionFromDTO to allow `message` to be undefined
- Added transaction/EncryptedMessage
- Added QueryParams.order order parameter

## [0.11.3] - 10-Apr-2019

- Added `Transaction.maxFee` optional property in `create()` methods. (fixes #53)
- Added `service/AggregateTransactionService` with `isComplete()` validates cosigners (fixes #4)
- Fixed issue in `createFromDTO` with JSON format (fixes #107)
- Added `model/transaction/EncryptedMessage` for encrypted message payloads
- Fixed `MosaicProperties` to make *duration*  optional (fixes #109)
- Added `service/AggregateTransactionService` with `validateCosignatories` for completeness check (fixes #4)

## [0.11.2] - 1-Apr-2019

- Added TransactionMapping (fixes #56 )
- Added CreateTransactionFromPayload (fixes #56 )
- Added SerializeTransactionToJSON
- Added several toDTO() methods for serialization (fixes #56 )
- Added multisigAccountAdded in Listener
- Added accountAddedToMultisig in Listener

## [0.11.1] - 18-Mar-2019

- Todo

## [0.11] - 14-Mar-2019

- Fixed NetworkCurrencyMosaic, NetworkHarvestMosaic
- Added exposed UInt64.fromHex and UInt64.toHex
- Added MosaicId.createFromNonce
- Added MosaicNonce, MosaicNonce.createRandom
- Fixed AliasDTO.mosaicId to be UInt64
- Added nem2-library@v0.9.8 version update (cow compatibility)
- Added cow network update *base* compatibility
- Added AliasTransaction, AddressAliasTransaction, MosaicAliasTransaction
- Changed MosaicDefinition to hold MosaicNonce
- Changed SecretLock transaction to work with Sha3_256 instead of Sha3_512
- Added delegated harvesting
- Fixed #38: error message for aggregate as inner tx
- Added TransferTransaction.recipient NamespaceId argument type

## [0.10.1-beta] - 27-Jun-2018

- added replyGiven in Transaction model
- several linter fixes

## [0.10.0-beta] - 27-Jun-2018

- update rxjs to v6
- use observableFrom

## [0.9.5] - 27-Jun-2018

- data signatures
- nodejs version 10 updates

## [0.9.0] - 30-Mar-2018
- Initial code release.


[0.11.3]: https://github.com/nemtech/nem2-sdk-typescript-javascript/compare/v0.11.2...v0.11.3
[0.11.2]: https://github.com/nemtech/nem2-sdk-typescript-javascript/compare/v0.11.1...v0.11.2
[0.11.1]: https://github.com/nemtech/nem2-sdk-typescript-javascript/compare/v0.11.0...v0.11.1
[0.11]: https://github.com/nemtech/nem2-sdk-typescript-javascript/compare/v0.10.1-beta...v0.11.0
[0.10.1-beta]: https://github.com/nemtech/nem2-sdk-typescript-javascript/compare/v0.9.5...v0.10.1-beta
[0.9.5]: https://github.com/nemtech/nem2-sdk-typescript-javascript/compare/v0.9.0...v0.9.5
[0.9.0]: https://github.com/nemtech/nem2-sdk-typescript-javascript/releases/tag/v0.9.0

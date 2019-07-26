# CHANGELOG
All notable changes to this project will be documented in this file.

The changelog format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.13.1] - 26-Jul-2019

**Milestone**: Elephant

- Added Mosaic Restriction (New models and transactions)
- Fixed RXJS compatibility issue (after run `npm update`)
- Fixed `signTransactionGivenSignatures` signature not verified issue
- Fixed version texts in Readme.md

## [0.13.0] - 03-Jul-2019

**Milestone**: Elephant

- Added SignSchema to make KeyPair generation compatible with either of Catapult and NIS.
- Added SignSchema with KECCAK_REVERSED_KEY and SHA3. The SDK by default uses SHA3 which is the Catapult signature schema.
- Fixed transaction versions back to version 1
- Added `signTransactionGivenSignatures` to cope with off chain aggregated complete transaction co signing.

## [0.12.4] - 03-Jul-2019

**Milestone**: Dragon

- Added export for Sha3Hasher
- Added export for nacl_catapult
- Added changelog milestone attribution

## [0.12.3] - 20-Jun-2019

**Milestone**: Dragon

- Fixed null mosaic property in MosaicHttp
- Added NodeHttp
- Fixed Uint8 conversions (control char added)
- Fixed ResolutionStatementDTO in exports

## [0.12.2] - 17-Jun-2019

**Milestone**: Dragon

- Removed nem2-library dependency
- Added `infrastructure/model/` with DTOs
- Added `infrastructure/api` with APIs
- Added `infrastructure/buffers` and `infrastructure/schemas`

## [0.12.1] - 05-Jun-2019

**Milestone**: Dragon

- Fixed alias and modification type field names in Http

## [0.12.0] - 04-Jun-2019

**Milestone**: Dragon

- Added 'Receipt'
- Added 'generationHash' to transaction.sign(...) to prevent transactions from being replayed on different networks by prepending the network generation hash to transaction data prior to signing and verifying.
- Added 'recipient' (unresolved address) field to SecretProofTransaction.
- BlockChainHttp routes into 3 routes (Block, Chain, Diagnostic).
- New endpoints
    1. AccountHttp: getAccountsNames(accountIds: Address[]): Observable<AccountNames[]>;
    2. MosaicHttp: getMosaicsNames(mosaicIds: MosaicId[]): Observable<MosaicNames[]>;
- Updated Dto models from latest rest swagger doc.
- Fixed / updated e2e tests.
- Removed Mosaic Levy property from both model and transaction.

## [0.11.6] - 03-Jun-2019

**Milestone**: Cow

- Version lock for cow compatibility
- Fixed #150, AccountHttp.transactions outputs aggregate transactions supplementary data

## [0.11.5] - 18-Apr-2019

**Milestone**: Cow

- Fixed #125, maxFee DTO value errors with in-aggregate MosaicSupplyChange and HashLock transactions  

## [0.11.4] - 17-Apr-2019

**Milestone**: Cow

- Fixed #117, Typo in AddressAliasTransaction and MosaicAliasTransaction comments
- Fixed several typos in documentation
- Fixed CreateTransactionFromDTO to allow `message` to be undefined
- Added transaction/EncryptedMessage
- Added QueryParams.order order parameter

## [0.11.3] - 10-Apr-2019

**Milestone**: Cow

- Added `Transaction.maxFee` optional property in `create()` methods. (fixes #53)
- Added `service/AggregateTransactionService` with `isComplete()` validates cosigners (fixes #4)
- Fixed issue in `createFromDTO` with JSON format (fixes #107)
- Added `model/transaction/EncryptedMessage` for encrypted message payloads
- Fixed `MosaicProperties` to make *duration*  optional (fixes #109)
- Added `service/AggregateTransactionService` with `validateCosignatories` for completeness check (fixes #4)

## [0.11.2] - 1-Apr-2019

**Milestone**: Cow

- Added TransactionMapping (fixes #56 )
- Added CreateTransactionFromPayload (fixes #56 )
- Added SerializeTransactionToJSON
- Added several toDTO() methods for serialization (fixes #56 )
- Added multisigAccountAdded in Listener
- Added accountAddedToMultisig in Listener

## [0.11.1] - 18-Mar-2019

- Todo

## [0.11] - 14-Mar-2019

**Milestone**: Cow

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

**Milestone**: Cow

- added replyGiven in Transaction model
- several linter fixes

## [0.10.0-beta] - 27-Jun-2018

**Milestone**: Cow

- update rxjs to v6
- use observableFrom

## [0.9.5] - 27-Jun-2018

**Milestone**: Alpaca

- data signatures
- nodejs version 10 updates

## [0.9.0] - 30-Mar-2018

**Milestone**: Alpaca

- Initial code release.
[0.13.0]: https://github.com/nemtech/nem2-sdk-typescript-javascript/compare/v0.13.0...v0.13.1
[0.13.0]: https://github.com/nemtech/nem2-sdk-typescript-javascript/compare/v0.12.4...v0.13.0
[0.12.4]: https://github.com/nemtech/nem2-sdk-typescript-javascript/compare/v0.12.3...v0.12.4
[0.12.3]: https://github.com/nemtech/nem2-sdk-typescript-javascript/compare/v0.12.2...v0.12.3
[0.12.2]: https://github.com/nemtech/nem2-sdk-typescript-javascript/compare/v0.12.1...v0.12.2
[0.12.1]: https://github.com/nemtech/nem2-sdk-typescript-javascript/compare/v0.12.0...v0.12.1
[0.12.0]: https://github.com/nemtech/nem2-sdk-typescript-javascript/compare/v0.11.6...v0.12.0
[0.11.6]: https://github.com/nemtech/nem2-sdk-typescript-javascript/compare/v0.11.5...v0.11.6
[0.11.5]: https://github.com/nemtech/nem2-sdk-typescript-javascript/compare/v0.11.4...v0.11.5
[0.11.4]: https://github.com/nemtech/nem2-sdk-typescript-javascript/compare/v0.11.3...v0.11.4
[0.11.3]: https://github.com/nemtech/nem2-sdk-typescript-javascript/compare/v0.11.2...v0.11.3
[0.11.2]: https://github.com/nemtech/nem2-sdk-typescript-javascript/compare/v0.11.1...v0.11.2
[0.11.1]: https://github.com/nemtech/nem2-sdk-typescript-javascript/compare/v0.11.0...v0.11.1
[0.11]: https://github.com/nemtech/nem2-sdk-typescript-javascript/compare/v0.10.1-beta...v0.11.0
[0.10.1-beta]: https://github.com/nemtech/nem2-sdk-typescript-javascript/compare/v0.9.5...v0.10.1-beta
[0.9.5]: https://github.com/nemtech/nem2-sdk-typescript-javascript/compare/v0.9.0...v0.9.5
[0.9.0]: https://github.com/nemtech/nem2-sdk-typescript-javascript/releases/tag/v0.9.0

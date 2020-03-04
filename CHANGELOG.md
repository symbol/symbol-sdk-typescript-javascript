# CHANGELOG
All notable changes to this project will be documented in this file.

The changelog format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.17.3] - 04-Mar-2020

**Milestone**: Fushicho.4(RC3 0.9.3.1)
 Versions  |   |
---|---|---
SDK Core| v0.17.3 | https://www.npmjs.com/package/symbol-sdk
Catbuffer | v0.0.11 | https://www.npmjs.com/package/catbuffer-typescript
Client Library | v0.8.5  | https://www.npmjs.com/package/symbol-openapi-typescript-node-client

- Fixed `MosaicNonce` issue handling signed integer from rest payload.
- **[BREAKING CHANGE]** Updated `NodeTime` model to use `UInt64`.

## [0.17.2] - 02-Mar-2020

**Milestone**: Fushicho.4(RC3 0.9.3.1)
 Versions  |   |
---|---|---
SDK Core| v0.17.2 | https://www.npmjs.com/package/symbol-sdk
Catbuffer | v0.0.11 | https://www.npmjs.com/package/catbuffer-typescript
Client Library | v0.8.5  | https://www.npmjs.com/package/symbol-openapi-typescript-node-client

- **[BREAKING CHANGE]** Added `s-part` of transaction signature to transaction hash.
- Added `numStatements` to `blockInfo` model.
- Fixed `mosaicNonce` issue in `createTransactionFromPayload`.
- Improved error handling in WS `listener` and `TransactionService`.
- Improved test coverage.

## [0.17.1] - 24-Feb-2020

**Milestone**: Fushicho.4(RC3 0.9.3.1)
 Versions  |   |
---|---|---
SDK Core| v0.17.1 | https://www.npmjs.com/package/symbol-sdk
Catbuffer | v0.0.11 | https://www.npmjs.com/package/catbuffer-typescript
Client Library | v0.8.5  | https://www.npmjs.com/package/symbol-openapi-typescript-node-client

- Rebranded `nem2-sdk` to `symbol-sdk`. Please be noted the package name changes.
- **[BREAKING CHANGE]** Changed `QueryParameters` and `TransactionFilter` to use deconstructed argument (JSON object) in the constructor.
- Added `node/peers` endpoint.
- Fixed security issues reported by github.

## [0.17.0] - 17-Feb-2020

**Milestone**: Fushicho.4(RC3 0.9.3.1)
 Versions  |   |
---|---|---
SDK Core | v0.17.0 | https://www.npmjs.com/package/nem2-sdk
catbuffer | v0.0.11 | https://www.npmjs.com/package/catbuffer
Client Library | v0.8.4  | https://www.npmjs.com/package/nem2-sdk-openapi-typescript-node-client

- **[BREAKING CHANGE]** Changed hashing algorithm to cope catapult-server changes. All Key derivation and signing are now using `SHA512`. Removed `SignSchema` so `NetworkType` is no longer bonded to the schema anymore (sha3 / keccak). This change will affect all existing keypairs / address (derived from public key) and  transaction signatures.
- **[BREAKING CHANGE]** Added new `TransactionFilter` parameter to `AccountHttp` which is now support filtering with list of transaction type.
- Added `GenerationHash` to the payload in `node/info` endpoint.
- Added enum for block merkle path item positions (`left / right`) to replace previous number type value (`1 / 2`).
- Added new `BlockService` for `Transaction` and `Receipt` block merkle proof auditing.
- Added new node type `Dual` to the existing `RoleTypeEnum`.
- Added new endpoint `node/health` in `NodeHttp`.
- Moved `getStorageInfo` and `getServerInfo` from `DiagnosticHttp` to `NodeHttp` repository.
- Improved e2e testing by using `async / await`.
- General legacy code refactoring and cleanup.

## [0.16.5] - 30-Jan-2020

**Milestone**: Fushicho.4(RC3)
 Versions  |   |
---|---|---
SDK Core| v0.16.5 | https://www.npmjs.com/package/nem2-sdk
catbuffer Library| v0.0.11 | https://www.npmjs.com/package/catbuffer
Client Library | v0.7.20-beta.7  | https://www.npmjs.com/package/nem2-sdk-openapi-typescript-node-client

- Fixed circular reference issue after removed `InnerTransaction` class.

## [0.16.4] - 30-Jan-2020

**Milestone**: Fushicho.4(RC3)
 Versions  |   |
---|---|---
SDK Core| v0.16.4 | https://www.npmjs.com/package/nem2-sdk
catbuffer Library| v0.0.11 | https://www.npmjs.com/package/catbuffer
Client Library | v0.7.20-beta.7  | https://www.npmjs.com/package/nem2-sdk-openapi-typescript-node-client

- Core 0.9.2.1 compatible. Changed hash algorithm for shared key derivation to `HKDF-HMAC-Sha256`.
- Removed `senderPrivateKey` in `Persistent Delegation Request Transaction`. Instead, it uses an `ephemeral key pair` and the `EphemeralPublicKey` is now attached in the `PersistentDelegationMessage` payload.
- Removed `salt` encryption and decryption functions which uses `HKDF-HMAC-Sha256` instead. This only affects the encrypted payload.
- Added missing export in `Infrastructure` classes / interfaces.
- Applied latest `catbuffer` builder codes for `ResolutionStatement`.
- Updated `TransactionType` & `TransactionVersion` enum key name to match `catabuffer` schema definition.
- Changed signature type for `Height` from `numeric string` to `UInt64` in `Block` & `Receipt` respostiories
- Fixed a few ts lint issues.

## [0.16.3] - 09-Jan-2020

**Milestone**: Fushicho.3
 Versions  |   |
---|---|---
SDK Core| v0.16.3 | https://www.npmjs.com/package/nem2-sdk
catbuffer Library| v0.0.7 | https://www.npmjs.com/package/catbuffer
Client Library | v0.7.20-beta.6  | https://www.npmjs.com/package/nem2-sdk-openapi-typescript-node-client

- Fixed http client (OpenAPI client package) does not support ES6 issue.

## [0.16.2] - 06-Jan-2020

**Milestone**: Fushicho.3
 Versions  |   |
---|---|---
SDK Core| v0.16.2 | https://www.npmjs.com/package/nem2-sdk
catbuffer Library| v0.0.7 | https://www.npmjs.com/package/catbuffer
Client Library | v0.7.20-alpha.6  | https://www.npmjs.com/package/nem2-sdk-openapi-typescript-node-client

- Refactored to replace generated codes by public library package for both `catbuffer` and `OpenAPI Http Client`.
- Added unresolved (mosaicId, address) support in `MosaicRestrictionTransaction`.
- Added `toHex()` in `MosaicNonce` class.
- Exposed `MultisigAccountGraphInfo` class constructor to public.
- Fixed `transaction status` issue in both `Http` and `Websocket` due to schema update.

## [0.16.1] - 23-Dec-2019

**Milestone**: Fushicho.3

- Added basic `operations for UInt64` (Add(), Substract()).
- Added `RepositoryFactoryHttp` which creates concrete http classes in a factory patten.
- Added `NetworkType` and `GenerationHash` cache for all Http repositories which reduces the number of rest calls.
- Added static mathod to create `SimpleWallet` from rest DTO payload.
- Added `TransactionType filter` in `AccountHttp` which can be used for filtering account transactions by type.
- Added `IntegrationTestHelper` which optimised e2e / integration tests by automatically tracking the changes from catapult rest. Also support loading test accounts directly from catapult-bootstrap-server generated nemesis addresses.
- Replaced `Records limitation steps (25,50,75,100)` with just number input.
- Fixed `TrandactionStatus` not returning correct error code bug.
- Fixed `spread operation issue` in `SetMaxFee and ResolveAlias` which results in missing super class properties bug.
- Fixed `epochAdjustment` static value not in UTC bug.
- Fixed known issues in `catbuffer Typescript Generator` over `EntityTypeDto` and `AggregateTransactionBuilder`. Aggregate transaction's `InnerTransactions` and `Cosignatures` are now in array format (`EmbeddedTransactionBuilder` and `CosignatureBuilder`) instead of using `Uint8Array`.

## [0.16.0] - 09-Dec-2019

**Milestone**: Fushicho.3

- Added epochAdjustment introduced in catapult-server v0.9.1.1 (Fushicho.3)
- Added `setMaxFee` to `Transaction` which calculate max transaction fee using `feeMultiplier * transaction.size`.
- Optimised `resolveAlias` implementation in transaction using object spread operator.
- Fixed couple of bugs in `blockHttp` and unit tests

## [0.15.1] - 06-Dec-2019

**Milestone**: Fushicho.2

- Added `networkType` as an optional paramter in `Http` abstract to recude the number of requests to the catapult-rest server
- Added `resolveAlias` in transaction for resolving `UnresolvedAddress` and `UnresolvedMosaic` inside a transaction.
- Added `TransactionService` class.
- Added `resolveAlias` service in `TransactionService` which resolves alias(es) in transaction(s) from block `ResolutionStatement`.
- Consolicated transaction announcement and websocket `confirmed` listener into one service call in `TransactionService`.
- Consolidated `AggregateBonded` tranaction announcement (aggregateBonded + lockFund) into one service call in `TransactionService`.

## [0.15.0] - 21-Nov-2019

**Milestone**: Fushicho.2

- Applied latest `Fushicho2` schema changes to both transaction serialization and http client codes.
- Added `addCosignatures` method for filling cosignatures offline.
- Added `compare` function in UInt64 class for unsigned 64 bytes numbers comparison.

## [0.14.4] - 31-Oct-2019

**Milestone**: Fushicho.1

- Added `Address.isValidAddress` for plain address string validation.
- Added `Address filter` in transaction status websocket listener channel.
- Changed `MetadataTransactionService` return type from `Transaction` to `Union types`.
- Made `decodeHex` method and `EmptyAlias` class public.
- Fixed const network type used in `AliasToRecipient` method.
- Fixed `SecretLock` and `SecretProof` transaction not using `UnresolvedAddress` issue.
- Fixed `Size` method issues for transactions.
- Fixed other JSDoc issues.

## [0.14.3] - 18-Oct-2019

**Milestone**: Fushicho.1

- Fixed `MetadataTransactionSercie` value delta issue.

## [0.14.2] - 18-Oct-2019

**Milestone**: Fushicho.1

- Fixed `Address alias deserialization` issue from catapult-rest dto payload.
- Fixed `MosaicSupplyChangeTransaction` schema mismatch issue.

## [0.14.1] - 14-Oct-2019

**Milestone**: Fushicho.1

- Added `Receipt serializer & hash generator` for auditing receipt merkle proof.
- Added `Unresolved (NamespaceId)` support on `MosaicRestriction` and `MosaicMetadata` transactions.
- Fixed `Mosaic array ordering` in `TransferTransaction`.
- Fixed issues in `PersistentDelegationRequestTransaction`.
- Other small fixes from community feedbacks.

## [0.14.0] - 08-Oct-2019

**Milestone**: Fushicho.1

- Added `KeyGenerator` class for generating UInt64 Keys from string.
- Fixed `MosaicAmountView` issue. Now return observable of array.
- Optimised `Account restriction` endpoints by returning simple payload.
- Fixed http repository `error handling` issues.
- Fixed bugs in `Alias` interface.
- Fixed `MosaicId significant byte` not detected properly in TransactionPayload.
- Fixed only `MIJIN_TEST` network type allowed in NetworkTypeHttp.
- Applied latest OpenAPI doc (`v0.7.19`).
- Changed `SignedTransaction` class constructor to public.
- Changed `MosaicRestrictionKey` format to be Hexadecimal.
- Other small fixes.

## [0.13.4] - 04-Oct-2019

**Milestone**: Elephant.3 / Fuschicho.1

- Added `Metadata` rest api endpoints and DTOs
- Added `MosaicRestriction` rest api endpoints and DTOs
- Added `MetadataTransactionService` which eases the meta data transaction creation without knowing previous meta data values
- Added `MosaicRestrictionTransactionService` which eases the mosaic restriction transaction creation without knowing previous restriction details.
- Changed `MetadataTransaction` and `Metadata state` value to use raw string (utf8 encoding).
- Fixed  `Namespace/Names` endpoint issue
- Fixed `Mosaic` endpoint issue
- Improved unit and e2e tests

## [0.13.3] - 27-Sep-2019

**Milestone**: Elephant.3

- Added new alias transaction `PersistentDelegationRequestTransaction` which extends `TransferTransaction` to send special message to server for persistent delegation harvesting unlock request.
- Added new message type `PersistentHarvestingDelegationMessage`
- Fixed websorket listener notitification issue when cosignatory added through MultisigModifictionTransaction.
- Changed `value` parameter in MetadataTransactions from Uint8Array to `string` (utf8 encoding)
- Added `utf8ToUint8` and `uint8ToUtf8` converters for above changes
- Made `previousRestrictionValue` optional in `MosaicAddressRestrictionTransaction`
- Made `referenceMosaicId` optional in `MosaicGlobalRestrictionTransaction`
- Made `EncryptedPrivateKey` class public
- Made `createFromRawAddress` in `Address` class public
- Fixed a few JSDoc issues
- Fixed NPM audit vulnerabilities

## [0.13.2] - 20-Sep-2019

**Milestone**: Elephant.3

- Added Metadata Transactions (Account, Mosaic and Namespace).
- Added new account restriction type to support `Outgoing` addresses and transaction types.
- catbuffer builder codes fully implemented. Flatbuffer codes removed.
- Models and services updated to be compatible with latest server (milestone Elephant: patch-3) schema updates.
- Refactored `Uint64` to support `UInt64 to/from: numeric/hex string`.
- Refactored `Signature Schema` to support both `NIS1` and `Catapult`. `Network idendifier` is now used to identify `Signature Schema` on model level. PrivateKey reversal has been removed for `NIS1` schema.
- Added new `Namespace Pruned` receipt type.
- Added new static method `addTransactions` to `AggregateTransction` to support offline embedded transactions' manipulation.
- Mosaic definition / info model refactored with `MosaicProperties` removed.
- Various bugs fixed in http repositories.
- Various bugs fixed in model and core components

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

[0.17.3]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.17.2...v0.17.3
[0.17.2]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.17.1...v0.17.2
[0.17.1]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.17.0...v0.17.1
[0.17.0]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.16.5...v0.17.0
[0.16.5]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.16.4...v0.16.5
[0.16.4]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.16.3...v0.16.4
[0.16.3]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.16.2...v0.16.3
[0.16.2]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.16.1...v0.16.2
[0.16.1]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.16.0...v0.16.1
[0.16.0]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.15.1...v0.16.0
[0.15.1]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.15.0...v0.15.1
[0.15.0]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.14.4...v0.15.0
[0.14.4]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.14.3...v0.14.4
[0.14.3]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.14.2...v0.14.3
[0.14.2]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.14.1...v0.14.2
[0.14.1]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.14.0...v0.14.1
[0.14.0]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.13.4...v0.14.0
[0.13.4]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.13.3...v0.13.4
[0.13.3]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.13.2...v0.13.3
[0.13.2]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.13.1...v0.13.2
[0.13.1]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.13.0...v0.13.1
[0.13.0]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.12.4...v0.13.0
[0.12.4]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.12.3...v0.12.4
[0.12.3]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.12.2...v0.12.3
[0.12.2]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.12.1...v0.12.2
[0.12.1]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.12.0...v0.12.1
[0.12.0]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.11.6...v0.12.0
[0.11.6]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.11.5...v0.11.6
[0.11.5]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.11.4...v0.11.5
[0.11.4]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.11.3...v0.11.4
[0.11.3]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.11.2...v0.11.3
[0.11.2]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.11.1...v0.11.2
[0.11.1]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.11.0...v0.11.1
[0.11]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.10.1-beta...v0.11.0
[0.10.1-beta]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.9.5...v0.10.1-beta
[0.9.5]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.9.0...v0.9.5
[0.9.0]: https://github.com/nemtech/symbol-sdk-typescript-javascript/releases/tag/v0.9.0

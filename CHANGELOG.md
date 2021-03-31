# CHANGELOG

All notable changes to this project will be documented in this file.

The changelog format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.0] - 13-Mar-2021

**Milestone**: Symbol Mainnet
 Package  | Version  | Link
---|---|---
SDK Core| v1.0.0 | [symbol-sdk](https://www.npmjs.com/package/symbol-sdk)
Catbuffer | v0.1.1 | [catbuffer-typescript](https://www.npmjs.com/package/catbuffer-typescript)
Client Library | v0.11.1  | [symbol-openapi-typescript-fetch-client](https://www.npmjs.com/package/symbol-openapi-typescript-fetch-client)

- Added callback function in websocket listener for client to handle unsolicited websocket close event.
- Release for Symbol mainnet.

## [0.23.3] - 5-Mar-2021

**Milestone**: Catapult-server main(0.10.0.8)
 Package  | Version  | Link
---|---|---
SDK Core| v0.23.3 | [symbol-sdk](https://www.npmjs.com/package/symbol-sdk)
Catbuffer | v0.1.1 | [catbuffer-typescript](https://www.npmjs.com/package/catbuffer-typescript)
Client Library | v0.11.1  | [symbol-openapi-typescript-fetch-client](https://www.npmjs.com/package/symbol-openapi-typescript-fetch-client)

- Fixed `NodeVersion` schema issue.
- Added `onclose` event listener to capture unsolicited ws close event.

## [0.23.2] - 15-Feb-2021

**Milestone**: Catapult-server main(0.10.0.7)
 Package  | Version  | Link
---|---|---
SDK Core| v0.23.2 | [symbol-sdk](https://www.npmjs.com/package/symbol-sdk)
Catbuffer | v0.1.1 | [catbuffer-typescript](https://www.npmjs.com/package/catbuffer-typescript)
Client Library | v0.11.1  | [symbol-openapi-typescript-fetch-client](https://www.npmjs.com/package/symbol-openapi-typescript-fetch-client)

- Fixed subnamespaceId generation issue in `NamespaceRegistrationTransaction`.
- Fixed `mosaicRestrictionTransactionService` error handling issue.
- Fixed `finalizationEpoch` issue in the dto model.
- Changed WebSocket listener subscription to use `UnresolvedAddress` without querying the rest-gateway.

## [0.23.1] - 02-Feb-2021

**Milestone**: Catapult-server main(0.10.0.6)
 Package  | Version  | Link
---|---|---
SDK Core| v0.23.1 | [symbol-sdk](https://www.npmjs.com/package/symbol-sdk)
Catbuffer | v0.1.1 | [catbuffer-typescript](https://www.npmjs.com/package/catbuffer-typescript)
Client Library | v0.11.1  | [symbol-openapi-typescript-fetch-client](https://www.npmjs.com/package/symbol-openapi-typescript-fetch-client)

- Added `FromHeight` and `ToHeight` filters in `Receipt` search endpoint.
- Added optional parameter in websocket listener channels to automatically subscribe multisig account for cosigners.

## [0.23.0] - 14-Jan-2021

**Milestone**: Catapult-server main(0.10.0.5)
 Package  | Version  | Link
---|---|---
SDK Core| v0.23.0 | [symbol-sdk](https://www.npmjs.com/package/symbol-sdk)
Catbuffer | v0.1.1 | [catbuffer-typescript](https://www.npmjs.com/package/catbuffer-typescript)
Client Library | v0.11.1  | [symbol-openapi-typescript-fetch-client](https://www.npmjs.com/package/symbol-openapi-typescript-fetch-client)

- **Re track to catapult-server main branch**
- **All entity versions reset to v1 for Symbol mainnet release**
- **[BREAKING CHANGE]** Finalization proof modle removed `messageGroup.schemaVersion` and `BMTreeSignaure.top`
- **[BREAKING CHANGE]** Removed `VotingKeyLinkV1Transaction`.
- **[BREAKING CHANGE]** `PrivateTest` network type changed from `0x80` to `0xA8`.
- Added **Node** specific property: `minFeeMultipler` in transactionFees.
- Removed padding buffer in account state serialization.
- Voting key length set to 32 bytes.

## [0.22.2] - 12-Dec-2020

**Milestone**: Catapult-server finality(0.10.0.4)
 Package  | Version  | Link
---|---|---
SDK Core| v0.22.2 | [symbol-sdk](https://www.npmjs.com/package/symbol-sdk)
Catbuffer | v0.0.25 | [catbuffer-typescript](https://www.npmjs.com/package/catbuffer-typescript)
Client Library | v0.10.5-1  | [symbol-openapi-typescript-fetch-client](https://www.npmjs.com/package/symbol-openapi-typescript-fetch-client)

- **[BREAKING CHANGE]** `Deadline.create` requires the configurable `epochAdjustment` from the network properties. The value can be retrieved using ``RepositoryFactory.getEpochAdjustment()`` or calling catapult-rest's `network/properties` endpoint.
- **[BREAKING CHANGE]** `NetworkCurrency` subclasses replaced with `Currency` objects. You can retrieve the network currencies with ``RepositoryFactory.getCurrencies()``.
- **[BREAKING CHANGE]** `SecretLockRepository.getSecretLock` has been updated. It now takes the composite hash as parameter.
- **[BREAKING CHANGE]** Replaced ``BlockInfo`` with the new block types: ``NormalBlockInfo`` and ``NemesisImportanceBlockInfo``.
- Added `FinalizationRepository`.
- Added `transferMosaicId`, `fromTransferAmount`, `toTransferAmount` to transaction searches.
- Added `CurrencyService` to allow loading Network and custom `Currency` objects from the rest API.
- Added `UnlockedAccount` endpoint in `NodeRepository` to check harvester's unlocking status on the selected node.
- Added `StateProofService` to verify the different states.
- Added `serialize()` to state objects `AccountInfo`, `MosaicInfo`, `NamespaceInfo`, `MultisigAccountInfo`, `AccountRestrictions`, `MosaicGlobalRestriction`, `MosaicAddressRestriction`, `MetadataEntry`, `SecretLockInfo`, `HashLockInfo` to generate the state proof hashes.
- Added `version` field to state objects.
- Added `/merkle` endpoints to the repositories of the different states which returns the state Merkle-Patricia tree.
- Added `stremer()` to repositories to simplify `PaginationStreamer` objects creation.
- Improved `search` endpoints allowing "empty" criteria in order to paginate over all the objects.
- `Listener` now accepts address aliases as `UnresolvedAddress` objects.
- Added V1 and V2 Voting Key transaction support.
- Updated `FinalizationProof` object with the new ``SignatureSchema`` for catapult-server tree testnet/v3.
- Fixed finalization proof schema version compatibility issue.

## [0.21.0] - 25-Sep-2020

**Milestone**: Catapult-server finality(0.10.0.3)
 Package  | Version  | Link
---|---|---
SDK Core| v0.21.0 | [symbol-sdk](https://www.npmjs.com/package/symbol-sdk)
Catbuffer | v0.0.22 | [catbuffer-typescript](https://www.npmjs.com/package/catbuffer-typescript)
Client Library | v0.10.0-3  | [symbol-openapi-typescript-fetch-client](https://www.npmjs.com/package/symbol-openapi-typescript-fetch-client)

- **[BREAKING CHANGE]** Updated `MetadataRepository` replacing old endpoints with new search endpoint.
- **[BREAKING CHANGE]** Updated `ReceiptRepository` replacing old endpoints with new search endpoint.
- **[BREAKING CHANGE]** Updated `ChainRepository` merging Height and Score into Info object. Added finalized block information.
- **[BREAKING CHANGE]** Updated `RestrictionMosaicRepository` replacing old endpoints with new search endpoint.
- **[BREAKING CHANGE]** Updated `RestrictionAccountRepository` removed `getAccountRestrictionsFromAccounts` endpoint.
- **[BREAKING CHANGE]** Updated `TransactionRepository` search endpoint. Added `fromHeith` and `toHeight` search criteria.
- **[BREAKING CHANGE]** Updated `toDTO` method in `Message` class. Removed `payload` and `type` returns only message string in hexadecimal format.
- **[BREAKING CHANGE]** Updated property names in `BlockInfo`:
    1. Changed ``numTransactions`` to ``totalTransactionsCount``.
    2. Changed ``numStatements`` to ``statementsCount``.
    3. Added ``transactionsCount``.
- **[BREAKING CHANGE]** Removed `totalPages` and `TotalEntries` from 'Page' object for all pagination endpoints.
- Added `SecretLockRepository` and `HashLockRepository`
- Added support for topic/data payload wrapper in WS Listener allowing users to reuse the connection for different channels.
- Added `finalizedBlock` WS Listener subscription
- Added [symbol-bootstrap](https://github.com/nemtech/symbol-bootstrap) integration for automated e2e testing.
- Fixed bug in websocket listener's `isOpen()` method for injected ws instance.
- Updated `message` extraction method (internal) which now takes message string (hex) rather than object from rest response payload.

## [0.20.7] - 14-Aug-2020

**Milestone**: Gorilla.1(0.9.6.4)
 Package  | Version  | Link
---|---|---
SDK Core| v0.20.7 | [symbol-sdk](https://www.npmjs.com/package/symbol-sdk)
Catbuffer | v0.0.21 | [catbuffer-typescript](https://www.npmjs.com/package/catbuffer-typescript)
Client Library | v0.9.6  | [symbol-openapi-typescript-fetch-client](https://www.npmjs.com/package/symbol-openapi-typescript-fetch-client)

- **[BREAKING CHANGE]** Refactored `Account`, `Namespace`, `Receipt` and `Metadata` endpoints. Added new search endpoints and removed old endpoints.
- **[BREAKING CHANGE]** Updated encryption / decryption algorithm from `AES-CBC` to `AES-GCM` to meet the security standard.
- **[BREAKING CHANGE]** Updated PersistentDelegatedHarvesting message marker. Also added VRF private key parameter in PersistentDelegatedHarvesting message & transaction creation.
- Added optional parameter `TransactionHash` in `AggregateTransaction.signWith` method.
- Updated encoding methods to support emoji in message payload.

## [0.20.6] - 02-Jul-2020

**Milestone**: Gorilla.1(0.9.6.2)
 Package  | Version  | Link
---|---|---
SDK Core| v0.20.6 | [symbol-sdk](https://www.npmjs.com/package/symbol-sdk)
Catbuffer | v0.0.21 | [catbuffer-typescript](https://www.npmjs.com/package/catbuffer-typescript)
Client Library | v0.9.4  | [symbol-openapi-typescript-fetch-client](https://www.npmjs.com/package/symbol-openapi-typescript-fetch-client)

- Changed to use default fetchAPI (`node-fetch`) in repository construction (not relying on repository factory builders).

## [0.20.5] - 30-Jun-2020

**Milestone**: Gorilla.1(0.9.6.2)
 Package  | Version  | Link
---|---|---
SDK Core| v0.20.5 | [symbol-sdk](https://www.npmjs.com/package/symbol-sdk)
Catbuffer | v0.0.21 | [catbuffer-typescript](https://www.npmjs.com/package/catbuffer-typescript)
Client Library | v0.9.4  | [symbol-openapi-typescript-fetch-client](https://www.npmjs.com/package/symbol-openapi-typescript-fetch-client)

- Added `maxVotingKeysPerAccount`, `minVotingKeyLifetime` and `maxVotingKeyLifetime` in **ChainProperties**.
- Updated fetch client version to `0.9.4`.

## [0.20.4] - 29-Jun-2020

**Milestone**: Gorilla.1(0.9.6.2)
 Package  | Version  | Link
---|---|---
SDK Core| v0.20.4 | [symbol-sdk](https://www.npmjs.com/package/symbol-sdk)
Catbuffer | v0.0.21 | [catbuffer-typescript](https://www.npmjs.com/package/catbuffer-typescript)
Client Library | v0.9.3-1  | [symbol-openapi-typescript-fetch-client](https://www.npmjs.com/package/symbol-openapi-typescript-fetch-client)

- Fixed **symbol-openapi-typescript-fetch-client** Typescript 3+ compatibility issue.
- Fixed **window.fetch** default value issue in `RepositoryFactory`.

## [0.20.3] - 26-Jun-2020

**Milestone**: Gorilla.1(0.9.6.2)
 Package  | Version  | Link
---|---|---
SDK Core| v0.20.3 | [symbol-sdk](https://www.npmjs.com/package/symbol-sdk)
Catbuffer | v0.0.21 | [catbuffer-typescript](https://www.npmjs.com/package/catbuffer-typescript)
Client Library | v0.9.3  | [symbol-openapi-typescript-fetch-client](https://www.npmjs.com/package/symbol-openapi-typescript-fetch-client)

- **[BREAKING CHANGE]** Added `startPoint` and `endPoint` in `VotingKeyLinkTransaction`.
- **[BREAKING CHANGE]** Renamed `SupplementalAccountKeys` to `SupplementalPublicKeys`. The new `SupplementalPublicKeys` has been changed from `array` type to an `object` containing: `linked`, `node`, `vrf` and `voting` key(s).
- **[BREAKING CHANGE]** Changed to use the SDK's own enums for `order`, `orderBy`, `blockOrderBy` and `meklePosition`.
- **[BREAKING CHANGE]** Added `TransactionGroup` parameter in `getTransactionsById` which can query `unconfirmed` and `partial` transactions now.
- Changed base client library from `symbol-openapi-typescript-node-client` to `symbol-openapi-typescript-fetch-client` for better client / brower usability. There is no need to browserify the packages or special webpack processing
- Made `Fetch API` injectable via `RepositoryFactory` which works like the injected `websocket` in `Listener`.

## [0.20.2] - 18-Jun-2020

**Milestone**: Gorilla.1(0.9.6.1)
 Package  | Version  | Link
---|---|---
SDK Core| v0.20.2 | [symbol-sdk](https://www.npmjs.com/package/symbol-sdk)
Catbuffer | v0.0.20 | [catbuffer-typescript](https://www.npmjs.com/package/catbuffer-typescript)
Client Library | v0.9.2  | [symbol-openapi-typescript-node-client](https://www.npmjs.com/package/symbol-openapi-typescript-node-client)

- Fixed missing `TransactionGroup` export issue.
- Added contributors..
- Fixed issues in travis scripts.

## [0.20.0] - 18-Jun-2020

**Milestone**: Gorilla.1(0.9.6.1)
 Package  | Version  | Link
---|---|---
SDK Core| v0.20.0 | [symbol-sdk](https://www.npmjs.com/package/symbol-sdk)
Catbuffer | v0.0.20 | [catbuffer-typescript](https://www.npmjs.com/package/catbuffer-typescript)
Client Library | v0.9.2  | [symbol-openapi-typescript-node-client](https://www.npmjs.com/package/symbol-openapi-typescript-node-client)

- **[BREAKING CHANGE]** Model property name changes:
    1. **MetadataEntry**: senderPublicKey: string => sourceAddress: Address; targetPublicKey: string => targetAddress: Address
    2. **MultisigAccountGraphInfo**: multisigAccounts => multisigEntries
    3. **MultisigAccountInfo**: account: PublicAccount => accountAddress: Address; cosignatories: PublicAccount[] => cosignatoryAddresses: Address; multisigAccounts: PublicAccount[] => multisigAddresses: Address[]
    4. **BlockInfo / NewBlock**: beneficiaryPublicKey: PublicAccount | undefined => beneficiaryAddress: Address | undefined
    5. **MosaicId**: owner: PublicAccount => ownerAddress: Address
    6. **MosaicInfo**: owner: PublicAccount => ownerAddress: Address; height => startHeight.
    7. **NamespaceInfo**: owner: PublicAccount => ownerAddress: Address
    8. **ChainProperties**: harvestNetworkFeeSinkPublicKey => harvestNetworkFeeSinkAddress
    9. **MosaicNetworkProperties**: mosaicRentalFeeSinkPublicKey => mosaicRentalFeeSinkAddress
    10. **NamespaceNetworkProperties**: namespaceRentalFeeSinkPublicKey => namespaceRentalFeeSinkAddress
    11. **NetworkProperties**: publicKey => nemesisSignerPublicKey
    12. **BalanceChangeReceipt**: targetPublicAccount: PublicAccount => targetAddress: Address
    13. **BalanceTransferReceipt**: sender: PublicAccount => senderAddress: Address
- **[BREAKING CHANGE]** Transaction property name changes:
    1. **AccountMetadataTransaction**: targetPublicKey: string => targetAddress: UnresolvedAddress
    2. **MosaicMetadataTransaction**: targetPublicKey: string => targetAddress: UnresolvedAddress
    3. **NamespaceMetadataTransaction**: targetPublicKey: string => targetAddress: UnresolvedAddress
    4. **MultisigAccountModificationTransaction**: publicKeyAdditions: PublicAccount[] => addressAdditions: UnresolvedAddress[]; publicKeyDeletions: PublicAccount[] => addressDeletions: UnresolvedAddress[]
    5. **AggregateTransactionService**: cosignatories: string[] => cosignatories: Address[]
- **[BREAKING CHANGE]** **Address** format changed from 25 bytes to 24 bytes. See new address test vector [here](https://github.com/nemtech/test-vectors/blob/master/1.test-address.json).
- **[BREAKING CHANGE]** MosaicId creation (from Nonce) changed from using **PublicKey** to **Address**. See new mosaicId test vector [here](https://github.com/nemtech/test-vectors/blob/master/5.test-mosaic-id.json).
- **[BREAKING CHANGE]** Added 8 bytes (uint64) **version** field in `CosignatureSignedTransaction` and `AggregateTransactionCosignature` with default value `0`.
- **[BREAKING CHANGE]** Removed all transaction get endpoints from **AccountHttp** and **BlockHttp**.
- **[BREAKING CHANGE]** Added `TransactionGroup (required)` parameter in `getTransaction` endpoint in `TransactionHttp`.
- Added `Search` endpoints to TransactionHttp, BlockHttp, and MosaicHttp.

    **Note:**

    1. Search endpoints returns pagination payload (`Page<t>`) rather than raw arraes.
    2. For **AggregateTransaction**, transaction search endpoint only returns the aggregate wrapper transaction **WITHOUT** embedded transactions. `complete` aggregate payload can be get from `getTransaction` or `getTransactionByIds` endpoints.
- Added SearchCriteria interfaces for the new search endpoints.
- **group** filter in `TransactionSearchCriteria` to be mandatory due to rest endpoint changes.
- Added **streamer** for the 3 new search endpoints (block, mosaic, transaction) to improve pagination querying.
- Added `size` in `BlockInfo` model.

## [0.19.2] - 26-May-2020

**Milestone**: Gorilla.1(0.9.5.1)
 Package  | Version  | Link
---|---|---
SDK Core| v0.19.2 | [symbol-sdk](https://www.npmjs.com/package/symbol-sdk)
Catbuffer | v0.0.19 | [catbuffer-typescript](https://www.npmjs.com/package/catbuffer-typescript)
Client Library | v0.8.11  | [symbol-openapi-typescript-node-client](https://www.npmjs.com/package/symbol-openapi-typescript-node-client)

- **[BREAKING CHANGE]** Replaced constructor parameter `config` with `url` in `Listener` class. The constructor is now **only using a complete websocket url (e.g. [http://localhost:3000/ws](http://localhost:3000/ws) or ws://localhost:3000/ws) but not rest-gateway url anymore (It will NOT append `/ws` suffix to the input url)**.
- **[BREAKING CHANGE]** `RepositoryFactory`: Optional constructor parameters has been moved into `RepositoryFactoryConfig` interface (optional).
- **[BREAKING CHANGE]** Added `websocketInjected` (optional) parameter to the `RepositoryFactoryConfig` interface. `RepositoryFactory.createListener()` can now take injected websocket instance to create `Listener` object.
- **[BREAKING CHANGE]** Added `websocketUrl` (optional) parameter to the `RepositoryFactoryConfig` interface. it allows custom websocket url to be used to create the `Listener` object. By default (not provided), the factory will use rest-gateway url with '/ws' suffix appended (e.g. [http://localhost:3000/ws](http://localhost:3000/ws)
- **[BREAKING CHANGE]** `Listener.newBlock` channel is now returning new object `NewBlock` rather than sharing with `BlockInfo` used by rest-gateway payload.
- Added `stateHashSubCacheMerkleRoots` to `BlockInfo`.

## [0.19.1] - 21-May-2020

**Milestone**: Gorilla.1(0.9.5.1)
 Package  | Version  | Link
---|---|---
SDK Core| v0.19.1 | [symbol-sdk](https://www.npmjs.com/package/symbol-sdk)
Catbuffer | v0.0.19 | [catbuffer-typescript](https://www.npmjs.com/package/catbuffer-typescript)
Client Library | v0.8.11  | [symbol-openapi-typescript-node-client](https://www.npmjs.com/package/symbol-openapi-typescript-node-client)

- **[BREAKING CHANGE]** `RemotePublicKey` has been renamed to `LinkedPublicKey` in `AccountKeyLinkTransaction`.
- **[BREAKING CHANGE]** `AccountRestrictionFlags` has been split into 3 separate flags: `AddressRestrictionFlag`, `MosaicRestrictionFlag` and `OperationRestrictionFlag` for better compile time and runtime validation.
- **[BREAKING CHANGE]** Added `NamaspaceRepository` interface to `Listener` constructor parameters for resolving alias purpose. `Listener` object can still be instantiated by using `RepositoryFactory.createListener()` with no coding change.
- Added `signer` and `signature` as optional parameters to the `create` methods in transaction classes. `TransactionMapping.createFromPayload` is now including `signer` and `signature`.
- Refactored address filter in websocket listener channels which now filters on `recipientAddress`, `targetAccount`, `signerPublicKey` fields in all transaction types. The Listener can filter on `unresolved (alias)` addresses now.
- Added optional `transactionHash` parameter in websocket listener channel subscribers which can be used for specific transaction monitoring now.

## [0.19.0] - 15-May-2020

**Milestone**: Gorilla.1(0.9.5.1)
 Package  | Version  | Link
---|---|---
SDK Core| v0.19.0 | [symbol-sdk](https://www.npmjs.com/package/symbol-sdk)
Catbuffer | v0.0.18 | [catbuffer-typescript](https://www.npmjs.com/package/catbuffer-typescript)
Client Library | v0.8.10  | [symbol-openapi-typescript-node-client](https://www.npmjs.com/package/symbol-openapi-typescript-node-client)

- **[BREAKING CHANGE]** `Transaction signing` is now using `GenerationHashSeed` from `NodeInfo` or `NetworkProperties`. GenerationHash on Nemesis block (block:1) is `NOT` used for signing purposes.
- **[BREAKING CHANGE]** Renamed `AccountLinkTransaction` to `AccountKeyLinkTransaction`.
- **[BREAKING CHANGE]** Renamed `networkGenerationHash` to `networkGenerationHashSeed` in `NodeInfo`.
- **[BREAKING CHANGE]** replaced `linkedPublickKey` with `supplementalAccountKeys` array in `AccountInfo`.
- Added new transaction `VrfKeyLinkTransaction`.
- Added new transaction `VotingKeyLinkTransaction`.
- Added new transaction `NodeKeyLinkTransaction`.
- Added new properties `proofGamma`, `proofScalar`, `proofVarificationHash` in `BlockInfo`
- Added new properties `harvestNetworkPercentage`, `harvestNetworkFeeSinkPublicKey` in `NetworkProperties`.
- Added new `KeyType`: Unset / Linked / VRF / Voting / Node / All.
- Added package `shx` for cross-platform building purpose.
- Fixed `AggregateTransaction.getMaxCosignatures()` to return distinct cosignature set.
- Fixed a few documentaion issues.

## [0.18.0] - 20-Apr-2020

**Milestone**: Fushicho.4(RC3 0.9.3.2)
 Package  | Version  | Link
---|---|---
SDK Core| v0.18.0 | [symbol-sdk](https://www.npmjs.com/package/symbol-sdk)
Catbuffer | v0.0.11 | [catbuffer-typescript](https://www.npmjs.com/package/catbuffer-typescript)
Client Library | v0.8.9  | [symbol-openapi-typescript-node-client](https://www.npmjs.com/package/symbol-openapi-typescript-node-client)

- **[BREAKING CHANGE]** Stopped NodeJS v8 and v9 support. From this version (`v0.18.0`) onwards, Symbol-SDK will target on Node v10+.
- **[BREAKING CHANGE]** Removed `Keccac_256` from `LockHashAlgorithm` (enum index changed).
- **[BREAKING CHANGE]** Updated enum name `HashType` to `LockHashAlgorithm`.
- **[BREAKING CHANGE]** Updated property name `hashType` to `hashAlgorithm` in `SecretLockTransaction` and `SecretProofTransaction`.
- **[BREAKING CHANGE]** Removed redundant argument `NetworkType` from `Transaction.createTransactionHash()` and `Address.isValidRawAddress()`.
- **[BREAKING CHANGE]** Added `setMaxFeeForAggregate()` for `AggregateTransaction`. `Transaction.setMaxFee()` can only be used by standalone transaction objects.
- **[BREAKING CHANGE]** Refactored `SimpleWallet` model and wallet private key `Encryption / Decryption` methods to patch potential security risk.
- Added `AccountService` to resolve mosaic alias and return namespace name.
- Migrated from `TSLint` to `ESLint`. Added `Prettier` support.
- Removed metadata value size validation (1024 bytes).
- Fixed `PublicAccount.verifySignature` bug when verify string in hexadecimal format.
- Added check on `UInt64.compact()` which throw exception on over flow.
- Added `Network currency resolver` for e2e tests.

## [0.17.4] - 07-Apr-2020

**Milestone**: Fushicho.4(RC3 0.9.3.2)
 Package  | Version  | Link
---|---|---
SDK Core| v0.17.4 | [symbol-sdk](https://www.npmjs.com/package/symbol-sdk)
Catbuffer | v0.0.11 | [catbuffer-typescript](https://www.npmjs.com/package/catbuffer-typescript)
Client Library | v0.8.9  | [symbol-openapi-typescript-node-client](https://www.npmjs.com/package/symbol-openapi-typescript-node-client)

- Added `SimpleWallet.toDTO()` method which returns JSON serialized object.
- Applied latest Symbol OpenAPI generated code (`v0.8.9`).
- Added automated release scripts for Travis.
- Added multiple version spport for TS-Doc.
- Optimised unit tests and improved test coverage.
- Changed internal method `getSigningByte` to public.
- Removed constant of namespace `MaxDepth (default: 3)` which can be retrieved from network properties endpoint.
- Fixed Github security alert on `minimist` package.

## [0.17.3] - 04-Mar-2020

**Milestone**: Fushicho.4(RC3 0.9.3.1)
 Package  | Version  | Link
---|---|---
SDK Core| v0.17.3 | [symbol-sdk](https://www.npmjs.com/package/symbol-sdk)
Catbuffer | v0.0.11 | [catbuffer-typescript](https://www.npmjs.com/package/catbuffer-typescript)
Client Library | v0.8.5  | [symbol-openapi-typescript-node-client](https://www.npmjs.com/package/symbol-openapi-typescript-node-client)

- Fixed `MosaicNonce` issue handling signed integer from rest payload.
- **[BREAKING CHANGE]** Updated `NodeTime` model to use `UInt64`.

## [0.17.2] - 02-Mar-2020

**Milestone**: Fushicho.4(RC3 0.9.3.1)
 Package  | Version  | Link
---|---|---
SDK Core| v0.17.2 | [symbol-sdk](https://www.npmjs.com/package/symbol-sdk)
Catbuffer | v0.0.11 | [catbuffer-typescript](https://www.npmjs.com/package/catbuffer-typescript)
Client Library | v0.8.5  | [symbol-openapi-typescript-node-client](https://www.npmjs.com/package/symbol-openapi-typescript-node-client)

- **[BREAKING CHANGE]** Added `s-part` of transaction signature to transaction hash.
- Added `numStatements` to `blockInfo` model.
- Fixed `mosaicNonce` issue in `createTransactionFromPayload`.
- Improved error handling in WS `listener` and `TransactionService`.
- Improved test coverage.

## [0.17.1] - 24-Feb-2020

**Milestone**: Fushicho.4(RC3 0.9.3.1)
 Package  | Version  | Link
---|---|---
SDK Core| v0.17.1 | [symbol-sdk](https://www.npmjs.com/package/symbol-sdk)
Catbuffer | v0.0.11 | [catbuffer-typescript](https://www.npmjs.com/package/catbuffer-typescript)
Client Library | v0.8.5  | [symbol-openapi-typescript-node-client](https://www.npmjs.com/package/symbol-openapi-typescript-node-client)

- Rebranded `nem2-sdk` to `symbol-sdk`. Please be noted the package name changes.
- **[BREAKING CHANGE]** Changed `QueryParameters` and `TransactionFilter` to use deconstructed argument (JSON object) in the constructor.
- Added `node/peers` endpoint.
- Fixed security issues reported by github.

## [0.17.0] - 17-Feb-2020

**Milestone**: Fushicho.4(RC3 0.9.3.1)
 Package  | Version  | Link
---|---|---
SDK Core | v0.17.0 | [nem2-sdk](https://www.npmjs.com/package/nem2-sdk)
catbuffer | v0.0.11 | [catbuffer](https://www.npmjs.com/package/catbuffer)
Client Library | v0.8.4  | [nem2-sdk-openapi-typescript-node-client](https://www.npmjs.com/package/nem2-sdk-openapi-typescript-node-client)

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
 Package  | Version  | Link
---|---|---
SDK Core| v0.16.5 | [nem2-sdk](https://www.npmjs.com/package/nem2-sdk)
catbuffer Library| v0.0.11 | [catbuffer](https://www.npmjs.com/package/catbuffer)
Client Library | v0.7.20-beta.7  | [nem2-sdk-openapi-typescript-node-client](https://www.npmjs.com/package/nem2-sdk-openapi-typescript-node-client)

- Fixed circular reference issue after removed `InnerTransaction` class.

## [0.16.4] - 30-Jan-2020

**Milestone**: Fushicho.4(RC3)
 Package  | Version  | Link
---|---|---
SDK Core| v0.16.4 | [nem2-sdk](https://www.npmjs.com/package/nem2-sdk)
catbuffer Library| v0.0.11 | [catbuffer](https://www.npmjs.com/package/catbuffer)
Client Library | v0.7.20-beta.7  | [nem2-sdk-openapi-typescript-node-client](https://www.npmjs.com/package/nem2-sdk-openapi-typescript-node-client)

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
 Package  | Version  | Link
---|---|---
SDK Core| v0.16.3 | [nem2-sdk](https://www.npmjs.com/package/nem2-sdk)
catbuffer Library| v0.0.7 | [catbuffer](https://www.npmjs.com/package/catbuffer)
Client Library | v0.7.20-beta.6  | [nem2-sdk-openapi-typescript-node-client](https://www.npmjs.com/package/nem2-sdk-openapi-typescript-node-client)

- Fixed http client (OpenAPI client package) does not support ES6 issue.

## [0.16.2] - 06-Jan-2020

**Milestone**: Fushicho.3
 Package  | Version  | Link
---|---|---
SDK Core| v0.16.2 | [nem2-sdk](https://www.npmjs.com/package/nem2-sdk)
catbuffer Library| v0.0.7 | [catbuffer](https://www.npmjs.com/package/catbuffer)
Client Library | v0.7.20-alpha.6  | [nem2-sdk-openapi-typescript-node-client](https://www.npmjs.com/package/nem2-sdk-openapi-typescript-node-client)

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
- Fixed only `PRIVATE_TEST` network type allowed in NetworkTypeHttp.
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

[0.21.0]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.20.7...v0.21.0
[0.20.7]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.20.6...v0.20.7
[0.20.6]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.20.5...v0.20.6
[0.20.5]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.20.4...v0.20.5
[0.20.4]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.20.3...v0.20.4
[0.20.3]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.20.2...v0.20.3
[0.20.2]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.20.0...v0.20.2
[0.20.0]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.19.2...v0.20.0
[0.19.2]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.19.1...v0.19.2
[0.19.1]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.19.0...v0.19.1
[0.19.0]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.18.0...v0.19.0
[0.18.0]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.17.4...v0.18.0
[0.17.4]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.17.3...v0.17.4
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

# nem2-sdk for TypeScript and JavaScript

[![npm version](https://badge.fury.io/js/nem2-sdk.svg)](https://badge.fury.io/js/nem2-sdk)
[![Build Status](https://api.travis-ci.org/nemtech/nem2-sdk-typescript-javascript.svg?branch=master)](https://travis-ci.org/nemtech/nem2-sdk-typescript-javascript)
[![Coverage Status](https://coveralls.io/repos/github/nemtech/nem2-sdk-typescript-javascript/badge.svg?branch=travis-ci)](https://coveralls.io/github/nemtech/nem2-sdk-typescript-javascript?branch=travis-ci)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

The official nem2-sdk for TypeScript and JavaScript, available for browsers, mobile applications and NodeJS, to work 
with the NEM2 (a.k.a Catapult)

## Important Notes


### _Dragon_ Network Compatibility (catapult-server@0.4.0.1)

Due to a network upgrade with [catapult-server@dragon](https://github.com/nemtech/catapult-server/releases/tag/v0.4.0.1) version, **it is recommended to use this package's 0.12.1 version and upwards in order to use this package with Dragon versioned networks**.

The upgrade to this package's [version v0.12.1](https://github.com/nemtech/nem2-sdk-typescript-javascript/releases/tag/v0.12.1) is mandatory for **dragon compatibility**.

### _Cow_ Network Compatibility (catapult-server@0.3.0.2)

[version v0.11.6](https://github.com/nemtech/nem2-sdk-typescript-javascript/releases/tag/v0.11.6) is the latest locked version for **cow compatibility**.

Due to a network upgrade with [catapult-server@cow](https://github.com/nemtech/catapult-server/releases/tag/v0.3.0.2) version, **transactions from Alpaca & Bison are not compatible with cow versioned networks**.

### _Alpaca_ / _Bison_ Network Compatibility (catapult-server@0.1 & 0.2)

In order to be able to use this package with _Alpaca_ or _Bison_ versioned network, you must use [version v0.10.1-beta](https://github.com/nemtech/nem2-sdk-typescript-javascript/releases/tag/v0.10.1-beta).

## Requirements

### NodeJS

- NodeJS 8.9.X
- NodeJS 9.X.X
- NodeJS 10.X.X

## Installation

```bash
npm install nem2-sdk rxjs
```

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

- [0.12.1](CHANGELOG.md#0121-05-Jun-2019) - **Dragon compatible** - 05.06.2019
- [0.11.6](CHANGELOG.md#0116-03-Jun-2019) - **Cow compatible** - 03.06.2019
- [0.11.5](CHANGELOG.md#0115-18-Apr-2019) - **Cow compatible** - 18.04.2019
- [0.11.4](CHANGELOG.md#0114-17-Apr-2019) - **Cow compatible** - 17.04.2019
- [0.11.3](CHANGELOG.md#0113-10-Apr-2019) - **Cow compatible** - 10.04.2019
- [0.11.2](CHANGELOG.md#0112-1-Apr-2019) - **Cow compatible** - 01.04.2019
- [0.11](CHANGELOG.md#011-14-Mar-2019) - **Cow compatible** - 14.03.2019
- [0.10.1-beta](CHANGELOG.md#v0101-beta) - **Alpaca compatible** 07.2018
- [0.9.5](CHANGELOG.md#095-27-Jun-2018) - **Alpaca compatible** 07.2018

## Notes on generation of catapult-rest DTO and API client

Following command can be used to generate DTOs and Api clients for the [nem2-sdk-typescript-javascript](https://github.com/nemtech/nem2-sdk-typescript-javascript) :

1. Download latest NEM2 swagger definition
    ```bash
    $ git clone git@github.com:nemtech/nem2-docs
    $ cd nem2-docs && mkdir sdks && cd sdks
    $ cp ../source/resources/collections/swagger.yaml .
    ```
 2. Copy OpenAPI generator template
 
    Copy the `templates` folder from {nem2-sdk-typescript-javascript}/infrastructure/ into `sdk` folder

3. Download OpenAPI generator and generate codes
    ```bash
    $ brew install openapi-generator
    $ openapi-generator generate -i ./swagger2.yaml -g typescript-node -t templates/ -o ./nem2-ts-sdk/ && rm -R nem2-ts-sdk/test
    ```
    ** Note openapi-generator is also available on docker. (`https://hub.docker.com/r/openapitools/openapi-generator`)
4. Fix enum type definitions
    
    As the generator doesn't recognize `enum` type alias, we need to manually move enum classes in to the `enumsMap` list.
    - Open generated file `./nem2-ts-sdk/model/models.ts` in editor
    - Search for line contains `let enumsMap: {[index: string]: any}`.
    - Move all `xxxTypeEnum` entries from below `typeMap` into `enumsMap`.

    example below:
    ```js
    let enumsMap: {[index: string]: any} = {
        "AccountPropertyTypeEnum": AccountPropertyTypeEnum,
        "AliasTypeEnum": AliasTypeEnum,
        "ResolutionStatementDTO": ResolutionStatementDTO,
        "MosaicPropertyIdEnum": MosaicPropertyIdEnum,
        "MultisigModificationTypeEnum": MultisigModificationTypeEnum,
        "NamespaceTypeEnum": NamespaceTypeEnum,
        "ReceiptTypeEnum": ReceiptTypeEnum,
        "RolesTypeEnum": RolesTypeEnum,
    }

    let typeMap: {[index: string]: any} = {
        "AccountDTO": AccountDTO,
        "AccountIds": AccountIds,
        "AccountInfoDTO": AccountInfoDTO,
        "AccountMetaDTO": AccountMetaDTO,
        "AccountNamesDTO": AccountNamesDTO,
        "AccountPropertiesDTO": AccountPropertiesDTO,
        "AccountPropertiesInfoDTO": AccountPropertiesInfoDTO,
        "AccountPropertyDTO": AccountPropertyDTO,
        "AliasDTO": AliasDTO,
        "AnnounceTransactionInfoDTO": AnnounceTransactionInfoDTO,
        "BlockDTO": BlockDTO,
        "BlockInfoDTO": BlockInfoDTO,
        "BlockMetaDTO": BlockMetaDTO,
        "BlockchainScoreDTO": BlockchainScoreDTO,
        "CommunicationTimestamps": CommunicationTimestamps,
        "Cosignature": Cosignature,
        "HeightInfoDTO": HeightInfoDTO,
        "MerklePathItem": MerklePathItem,
        "MerkleProofInfo": MerkleProofInfo,
        "MerkleProofInfoDTO": MerkleProofInfoDTO,
        "MosaicDTO": MosaicDTO,
        "MosaicDefinitionDTO": MosaicDefinitionDTO,
        "MosaicIds": MosaicIds,
        "MosaicInfoDTO": MosaicInfoDTO,
        "MosaicMetaDTO": MosaicMetaDTO,
        "MosaicNamesDTO": MosaicNamesDTO,
        "MosaicPropertyDTO": MosaicPropertyDTO,
        "MultisigAccountGraphInfoDTO": MultisigAccountGraphInfoDTO,
        "MultisigAccountInfoDTO": MultisigAccountInfoDTO,
        "MultisigDTO": MultisigDTO,
        "NamespaceDTO": NamespaceDTO,
        "NamespaceIds": NamespaceIds,
        "NamespaceInfoDTO": NamespaceInfoDTO,
        "NamespaceMetaDTO": NamespaceMetaDTO,
        "NamespaceNameDTO": NamespaceNameDTO,
        "NetworkTypeDTO": NetworkTypeDTO,
        "NodeInfoDTO": NodeInfoDTO,
        "NodeTimeDTO": NodeTimeDTO,
        "ResolutionEntryDTO": ResolutionEntryDTO,
        "ServerDTO": ServerDTO,
        "ServerInfoDTO": ServerInfoDTO,
        "SourceDTO": SourceDTO,
        "StatementsDTO": StatementsDTO,
        "StorageInfoDTO": StorageInfoDTO,
        "TransactionHashes": TransactionHashes,
        "TransactionIds": TransactionIds,
        "TransactionInfoDTO": TransactionInfoDTO,
        "TransactionMetaDTO": TransactionMetaDTO,
        "TransactionPayload": TransactionPayload,
        "TransactionStatementDTO": TransactionStatementDTO,
        "TransactionStatusDTO": TransactionStatusDTO,
    }
    ```

## License 

Copyright (c) 2018-2019 NEM
Licensed under the [Apache License 2.0](LICENSE)

[self]: https://github.com/nemtech/nem2-sdk-typescript-javascript
[docs]: http://nemtech.github.io/getting-started/setup-workstation.html
[issues]: https://github.com/nemtech/nem2-sdk-typescript-javascript/issues
[sdk-ref]: http://nemtech.github.io/nem2-sdk-typescript-javascript

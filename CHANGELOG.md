# CHANGELOG
All notable changes to this project will be documented in this file.

The changelog format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.9.5-beta1] - 06-Mar-2020

### Milestone: [catapult-server@v0.9.3.1](https://github.com/nemtech/catapult-server/releases/tag/v0.9.3.1)

#### Added

- Added TransactionService methods handling transaction signature
- Added TransactionService methods handling transaction broadcast
- Added store actions for better reactivity across components
- Added endpoints database table
- Improved `FormTransactionBase` to make use of `isCosignatoryMode` state change
- Added automatic **funds lock** creation for multi-signature transactions (aggregate bonded)
- Added possibility to _aggregate transactions_ that are _signed_ and _on-stage_ (used in `FormMosaicDefinitionTransaction`)
- Added rebranded account creation pages
- Added and fixed account import pages
- Fixed unconfirmed and partial transaction removal from lists
- Added `FormMultisigAccountModificationTransaction` with common form for conversion and modifications

#### Known Issues

- Missing harvesting setup (account link & persistent delegation requests)
- Some missing UI fixes for Symbol rebrand

## [0.9.4-beta] - 25-Feb-2020

### Milestone: [catapult-server@v0.9.2.1](https://github.com/nemtech/catapult-server/releases/tag/v0.9.2.1)

#### Added

- `FormAccountUnlock`: standardize practice of unlocking account across app
- `FormTransactionBase`: base abstraction layer for transaction forms
- `SignerSelector`: generic transaction signer selector, works with multisig to change owned assets states
- General change of views files (*.vue) paths with result :
    * Components in src/components/
    * Modal Dialogs in src/views/modals/
    * Pages in src/views/pages/
    * Layouts in src/components/
    * Forms in src/views/forms/
- Added namespaced vuex Store managing application state changes
- Added namespaces vuex Store managing REST requests changing state (action REST_*)
- Added src/core/database/ with LocalStorageBackend, models and tables schemas
- Added repository abstraction layer to work with persistent storage
- Added business layer implementations in src/services/*
- Rewrote all route names and use route names instead of paths for redirects

#### Known Issues

- Missing harvesting setup (account link & persistent delegation requests)
- Some missing UI fixes for Symbol rebrand
- Mosaic definition *multi-signature* feature bug with signer selection (aggregate bonded only)

## All versions

[v0.9.5-beta1]: https://github.com/nemtech/symbol-sdk-typescript-javascript/compare/v0.9.4-beta...v0.9.5-beta1
[v0.9.4-beta]: https://github.com/nemtech/symbol-sdk-typescript-javascript/releases/tag/v0.9.4-beta

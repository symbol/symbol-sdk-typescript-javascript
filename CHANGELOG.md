# CHANGELOG
All notable changes to this project will be documented in this file.

The changelog format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [v0.9.8][v0.9.8] -

### Milestone: [catapult-server@v0.9.3.2](https://github.com/nemtech/catapult-server/releases/tag/v0.9.3.2)

### [v0.9.8-beta1][v0.9.8-beta1] - 17-Apr-2020

#### Added

- Added transaction status filters and multisig account selector (fixes #183)

#### Fixed

- Fixed wallet import in subwallet creation (fixes #214)


## [v0.9.7][v0.9.7] - 06-Apr-2020 

### Milestone: [catapult-server@v0.9.3.2](https://github.com/nemtech/catapult-server/releases/tag/v0.9.3.2)

### [v0.9.7-beta1][v0.9.7-beta1] - 06-Apr-2020

#### Added

- Added refresh button for namespace list (fixes #186)
- Added refresh button for mosaics list (fixes #146)
- Added automatic generation of QR Code for Invoices (fixes #168)
- Added eslint and linter configuration (fixes #166)

#### Fixed

- SignerSelector address format bug starting with A (fixes #205)
- Password change related bug fixes (fixes #195)
- Fix incorrect max fee display (fixes #188)
- Fixed mosaic balance panel list Close button (fixes #151)


## [v0.9.6][v0.9.6] - 21-Mar-2020

### Milestone: [catapult-server@v0.9.3.1](https://github.com/nemtech/catapult-server/releases/tag/v0.9.3.1)

### [v0.9.6-beta2][v0.9.6-beta2] - 21-Mar-2020

#### Added

- Added aliases to wallet details (fixes #26)
- Added multisig accounts transaction list link (fixes #84)

#### Changed

- Added usage of repository factory for REST (fixes #131)

#### Fixed

- Fixed account import cancellation (fixes #135)
- Fixed transaction pagination (fixes #112)
- Fixed dashboard CSS (fixes #111)
- Fixed SignerSelector mutation (fixes #115)
- Fixed form submit behaviour (fixes #98)

### [v0.9.6-beta1][v0.9.6-beta1] - 17-Mar-2020

#### Added

- Permit to query partial transactions of multisig accounts (fixes #68)
- Skip expired mosaics in transfer form (fixes #61)

#### Changed

- Changed navigation bar logos to use Symbol branding (fixes #72)
- Add reactivity to confirmed transaction events (fixes #69)

#### Fixed

- Fixed sub wallet creation form (fixes #103)
- Added unsubscription from websocket channels (fixes #99)
- Fixed duplicate words in mnemonic passphrases (fixes #87)
- Reset cosignatories from multisig form (fixes #85)
- Fix reactivity of account balance panel (fixes #79)


## [v0.9.5][v0.9.5] - 11-Mar-2020

### Milestone: [catapult-server@v0.9.3.1](https://github.com/nemtech/catapult-server/releases/tag/v0.9.3.1)

### [v0.9.5-beta6][v0.9.5-beta6] - 11-Mar-2020

#### Fixed

- Fixed password field input validation (fixes #57)
- Added new Symbol icons (fixes #72)
- Fixed child account creation (fixes #64)
- Fixed namespace state updates (fixes #67)
- Fixed MosaicBalanceList reactivity

### [v0.9.5-beta5][v0.9.5-beta5] - 10-Mar-2020

#### Fixed

- Fixed namespaces and mosaics database schema to hold hex instead of UInt64 (fixes #59)
- Hide expired mosaics in transfer inputs, (fixes #61)
- Fix mosaic balance list, (fixes #65)
- Type store / mosaic state
- Persist mosaic hidden state to database

### [v0.9.5-beta4][v0.9.5-beta4] - 09-Mar-2020

#### Fixed

- Patched windows build postcss properties
- Fixed PeerSelector component with loading state (fixes #23)
- Fixed transaction list layout for better readability
- Added beautified empty messages for table displays
- Fixed FormAliasTransaction for mosaic aliases
- Fixed pagination component layout
- Fixed mnemonic import wallet selection screen

### [v0.9.5-beta2][v0.9.5-beta2] - 06-Mar-2020

#### Fixed

- Fixed WalletSelectorPanel balances listing (fixes #27)
- Fixed account import pages (fixes #54)
- Fixed newly added transfer mosaic attachments

### [v0.9.5-beta1][v0.9.5-beta1] - 06-Mar-2020

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

## [v0.9.4-beta][v0.9.4-beta] - 25-Feb-2020

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


[v0.9.8]: https://github.com/nemfoundation/symbol-desktop-wallet/releases/tag/v0.9.8-beta1
[v0.9.8-beta1]: https://github.com/nemfoundation/symbol-desktop-wallet/compare/v0.9.7-beta1...v0.9.8-beta1
[v0.9.7]: https://github.com/nemfoundation/symbol-desktop-wallet/releases/tag/v0.9.7-beta1
[v0.9.7-beta1]: https://github.com/nemfoundation/symbol-desktop-wallet/compare/v0.9.6...v0.9.7-beta1
[v0.9.6]: https://github.com/nemfoundation/symbol-desktop-wallet/releases/tag/v0.9.6-beta2
[v0.9.6-beta2]: https://github.com/nemfoundation/symbol-desktop-wallet/compare/v0.9.6-beta1...v0.9.6-beta2
[v0.9.6-beta1]: https://github.com/nemfoundation/symbol-desktop-wallet/compare/v0.9.5-beta6...v0.9.6-beta1
[v0.9.5]: https://github.com/nemfoundation/symbol-desktop-wallet/releases/tag/v0.9.5-beta6
[v0.9.5-beta6]: https://github.com/nemfoundation/symbol-desktop-wallet/compare/v0.9.5-beta5...v0.9.5-beta6
[v0.9.5-beta5]: https://github.com/nemfoundation/symbol-desktop-wallet/compare/v0.9.5-beta4...v0.9.5-beta5
[v0.9.5-beta4]: https://github.com/nemfoundation/symbol-desktop-wallet/compare/v0.9.5-beta2...v0.9.5-beta4
[v0.9.5-beta2]: https://github.com/nemfoundation/symbol-desktop-wallet/compare/v0.9.5-beta1...v0.9.5-beta2
[v0.9.5-beta1]: https://github.com/nemfoundation/symbol-desktop-wallet/compare/v0.9.4-beta...v0.9.5-beta1
[v0.9.4-beta]: https://github.com/nemfoundation/symbol-desktop-wallet/releases/tag/v0.9.4-beta

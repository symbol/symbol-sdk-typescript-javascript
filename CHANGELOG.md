# CHANGELOG

# v0.11

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

# v0.10.1-beta

- added replyGiven in Transaction model
- several linter fixes

# v0.10.0-beta

- update rxjs to v6
- use observableFrom

# v0.9.5

- data signatures
- nodejs version 10 updates

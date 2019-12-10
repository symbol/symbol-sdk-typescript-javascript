import {Message} from '@/config'
import {CUSTOM_VALIDATORS_NAMES} from './customValidators'

export const customMessages = {
 [CUSTOM_VALIDATORS_NAMES.address]: () => Message.ADDRESS_INVALID,
 [CUSTOM_VALIDATORS_NAMES.addressNetworkType]: () => Message.NETWORK_TYPE_INVALID,
 [CUSTOM_VALIDATORS_NAMES.addressOrAliasNetworkType]: () => Message.NETWORK_TYPE_INVALID,
 [CUSTOM_VALIDATORS_NAMES.amountDecimals]: () => Message.DIVISIBILITY_INVALID,
 [CUSTOM_VALIDATORS_NAMES.confirmLock]: () => Message.WRONG_PASSWORD_ERROR,
 [CUSTOM_VALIDATORS_NAMES.confirmPassword]: () => Message.PASSWORDS_NOT_MATCHING,
 [CUSTOM_VALIDATORS_NAMES.confirmWalletPassword]: () => Message.WRONG_PASSWORD_ERROR,
 [CUSTOM_VALIDATORS_NAMES.mosaicMaxAmount]: () => Message.VALUE_TOO_BIG,
 [CUSTOM_VALIDATORS_NAMES.namespaceOrMosaicId]: () => Message.INVALID_NAMESPACE_OR_MOSAIC_ID,
 [CUSTOM_VALIDATORS_NAMES.otherField]: () => Message.MOSAIC_NOT_SET,
 [CUSTOM_VALIDATORS_NAMES.privateKey]: () => Message.PRIVATE_KEY_INVALID_ERROR,
 [CUSTOM_VALIDATORS_NAMES.publicKey]: () => Message.PUBLIC_KEY_INVALID,
 [CUSTOM_VALIDATORS_NAMES.remoteAccountPrivateKey]: () => Message.PRIVATE_KEY_INVALID_ERROR,
}

export const customFieldMessages = {
 newDuration: {max_value: () => Message.NAMESPACE_MAX_DURATION},
 namespaceDuration: {max_value: () => Message.NAMESPACE_MAX_DURATION},
 currentAmount: {is_not: () => Message.AMOUNT_LESS_THAN_0_ERROR},
}

import {CUSTOM_VALIDATORS_NAMES} from './customValidators'
import {networkConfig, NETWORK_CONSTANTS, APP_PARAMS} from '@/config'

const {maxMosaicAtomicUnits, maxMosaicDivisibility, NAMESPACE_MAX_LENGTH} = networkConfig

const {MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH} = APP_PARAMS

const {
    GENERATION_HASH_LENGTH,
    MAX_MESSAGE_LENGTH,
    MAX_MOSAIC_DURATION,
    MAX_NAMESPACE_DURATION,
    MIN_NAMESPACE_DURATION,
    PRIVATE_KEY_LENGTH,
} = NETWORK_CONSTANTS


export const validation = {
    address: 'required|address|addressNetworkType:currentAccount',
    accountPassword: 'required|confirmLock:accountPassword',
    addressOrAlias: `required|${CUSTOM_VALIDATORS_NAMES.addressOrAlias}|addressOrAliasNetworkType:currentAccount`,
    amount: 'excluded:""|is_not:0|decimal:6|min_value:0|otherField:selectedMosaic|amountDecimals:selectedMosaic|mosaicMaxAmount:selectedMosaic',
    confirmPassword: 'required|confirmPassword:newPassword',
    divisibility: `required|min_value:0|max_value:${maxMosaicDivisibility}|integer`,
    duration: `required|min_value:0|max_value:${MAX_MOSAIC_DURATION}`,
    generationHash: `required|min:${GENERATION_HASH_LENGTH}|max:${GENERATION_HASH_LENGTH}`,
    invoiceAmount: `decimal:6|min_value:0|max_value:${maxMosaicAtomicUnits}`,
    mosaicId: 'required|mosaicId',
    message: `max:${MAX_MESSAGE_LENGTH}`,
    namespaceDuration: `required|min_value:${MIN_NAMESPACE_DURATION}|max_value:${MAX_NAMESPACE_DURATION}`,
    namespaceName: {
        required: true,
        regex: `^[a-z0-9-_]{1,${NAMESPACE_MAX_LENGTH}}$`,
    },
    password: {
        required: true,
        min: MIN_PASSWORD_LENGTH,
        max: MAX_PASSWORD_LENGTH,
    },
    previousPassword: 'required|confirmLock:cipher',
    privateKey: `min:${PRIVATE_KEY_LENGTH}|max:${PRIVATE_KEY_LENGTH}|privateKey`,
    recipientPublicKey: 'required|publicKey',
    supply: `required|integer|min_value: 1|max_value:${maxMosaicAtomicUnits}`,
    walletPassword: 'required|confirmWalletPassword:wallet',
    subNamespaceName: {
        required: true,
        regex: `^[a-z0-9-_.]{1,${NAMESPACE_MAX_LENGTH}}$`,
    },
    nodeUrl: {
        required: true,
        url: {require_protocol: true}
    }

}

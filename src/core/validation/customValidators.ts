import {MosaicId, Account, Address, NetworkType} from 'nem2-sdk'
import {networkConfig} from '@/config/constants'
import {getAbsoluteMosaicAmount} from "@/core/utils"
import {AppAccounts, ValidationObject, AppWallet, CurrentAccount, AppMosaic} from "@/core/model"
import {validateAddress, validatePublicKey, validateAlias, validateMosaicId, validateNamespace} from './validators'

const {PUBLIC_KEY_LENGTH, maxMosaicAtomicUnits} = networkConfig

const getOtherFieldValue = (otherField, validator) => {
    const validatorFields = validator.Validator.$vee._validator.fields.items
    const field = validatorFields.find(field => field.name === otherField)
    if (field === undefined) throw new Error('The targeted confirmation field was not found')
    return field.value
}

export const CUSTOM_VALIDATORS_NAMES = {
    address: 'address',
    addressNetworkType: 'addressNetworkType',
    addressOrAlias: 'addressOrAlias',
    addressOrAliasNetworkType: 'addressOrAliasNetworkType',
    addressOrPublicKey: 'addressOrPublicKey',
    alias: 'alias',
    amountDecimals: 'amountDecimals',
    confirmLock: 'confirmLock',
    confirmPassword: 'confirmPassword',
    confirmWalletPassword: 'confirmWalletPassword',
    mosaicId: 'mosaicId',
    mosaicMaxAmount: 'mosaicMaxAmount',
    namespaceOrMosaicId: 'namespaceOrMosaicId',
    otherField: 'otherField',
    privateKey: 'privateKey',
    publicKey: 'publicKey',
    remoteAccountPrivateKey: 'remoteAccountPrivateKey',
}

const aliasValidator = (context): Promise<ValidationObject> => {
    return context.Validator.extend(
        CUSTOM_VALIDATORS_NAMES.alias,
        (alias) => new Promise((resolve) => {
            resolve(validateAlias(alias))
        }),
    )
}

const publicKeyValidator = (context): Promise<ValidationObject> => {
    return context.Validator.extend(
        CUSTOM_VALIDATORS_NAMES.publicKey,
        (publicKey) => new Promise((resolve) => {
            resolve(validatePublicKey(publicKey))
        }),
    )
}

const confirmLockValidator = (context): Promise<ValidationObject> => {
    return context.Validator.extend(
        CUSTOM_VALIDATORS_NAMES.confirmLock,
        (password, [otherField]) => new Promise((resolve) => {
            const passwordCipher = getOtherFieldValue(otherField, context)
            if (AppAccounts().decryptString(passwordCipher, password) !== password) resolve({valid: false})
            resolve({valid: true})
        }),
        {hasTarget: true},
    )
}

const remoteAccountPrivateKeyValidator = (context): Promise<ValidationObject> => {
    return context.Validator.extend(
        CUSTOM_VALIDATORS_NAMES.remoteAccountPrivateKey,
        (privateKey, [otherField]) => new Promise((resolve) => {
            const wallet: AppWallet = getOtherFieldValue(otherField, context)
            if (!(wallet instanceof AppWallet)) resolve({valid: false})

            try {
                const account = Account.createFromPrivateKey(privateKey, wallet.networkType)
                if (wallet.linkedAccountKey && wallet.linkedAccountKey !== account.publicKey) {
                    resolve({valid: false})
                }
                resolve({valid: true})
            } catch (error) {
                resolve({valid: false})
            }
        }),
        {hasTarget: true},
    )
}

const confirmPasswordValidator = (context): Promise<ValidationObject> => {
    return context.Validator.extend(
        CUSTOM_VALIDATORS_NAMES.confirmPassword,
        (password, [otherField]) => new Promise((resolve) => {
            const otherValue = getOtherFieldValue(otherField, context)
            if (otherValue !== password) resolve({valid: false})
            resolve({valid: password})
        }),
        {hasTarget: true},
    )
}

const confirmWalletPasswordValidator = (context): Promise<ValidationObject> => {
    return context.Validator.extend(
        CUSTOM_VALIDATORS_NAMES.confirmWalletPassword,
        (password, [otherField]) => new Promise((resolve) => {
            const wallet = getOtherFieldValue(otherField, context)
            if (!(wallet instanceof AppWallet)) resolve({valid: false})
            resolve({valid: wallet.checkPassword(password)})
        }),
        {hasTarget: true},
    )
}

const mosaicIdValidator = (context): Promise<ValidationObject> => {
    return context.Validator.extend(
        CUSTOM_VALIDATORS_NAMES.mosaicId,
        (mosaicId) => new Promise((resolve) => {
            try {
                new MosaicId(mosaicId)
                resolve({valid: mosaicId})
            } catch (error) {
                resolve({valid: false})
            }
        }),
    )
}

const namespaceOrMosaicIdValidator = (context): Promise<ValidationObject> => {
    return context.Validator.extend(
        CUSTOM_VALIDATORS_NAMES.namespaceOrMosaicId,
        (namespaceOrMosaicId) => new Promise((resolve) => {
            const isValidNamespace = validateMosaicId(namespaceOrMosaicId)
            const isValidMosaicId = validateNamespace(namespaceOrMosaicId)

            if (isValidNamespace.valid || isValidMosaicId.valid) {
                resolve({valid: namespaceOrMosaicId})
            } else {
                resolve({valid: false})
            }
        }),
    )
}

const addressOrAliasValidator = (context): Promise<ValidationObject> => {
    return context.Validator.extend(
        CUSTOM_VALIDATORS_NAMES.addressOrAlias,
        (addressOrAlias) => new Promise(async (resolve) => {
            const isValidAddress = validateAddress(addressOrAlias)
            const isValidAlias = validateAlias(addressOrAlias)

            if (isValidAddress.valid || isValidAlias.valid) {
                resolve({valid: addressOrAlias})
            } else {
                resolve({valid: false})
            }
        }),
    )
}

const addressValidator = (context): Promise<ValidationObject> => {
    return context.Validator.extend(
        CUSTOM_VALIDATORS_NAMES.address,
        (address) => new Promise(async (resolve) => {
            resolve(validateAddress(address))
        }),
    )
}

const addressNetworkTypeValidator = (context): Promise<ValidationObject> => {
    return context.Validator.extend(
        CUSTOM_VALIDATORS_NAMES.addressNetworkType,
        (address, [otherField]) => new Promise((resolve) => {
            const currentAccount: CurrentAccount = getOtherFieldValue(otherField, context)
            try {
                const _address = Address.createFromRawAddress(address)
                if (_address.networkType === currentAccount.networkType) resolve({valid: address})
                resolve({valid: false})
            } catch (error) {
                resolve({valid: false})
            }
        }),
        {hasTarget: true},
    )
}

const addressOrAliasNetworkTypeValidator = (context): Promise<ValidationObject> => {
    return context.Validator.extend(
        CUSTOM_VALIDATORS_NAMES.addressOrAliasNetworkType,
        (addressOrAlias, [otherField]) => new Promise((resolve) => {
            const currentAccount: CurrentAccount = getOtherFieldValue(otherField, context)
            try {
                if (!validateAddress(addressOrAlias).valid) resolve({valid: addressOrAlias})
                const _address = Address.createFromRawAddress(addressOrAlias)
                if (_address.networkType === currentAccount.networkType) resolve({valid: addressOrAlias})
                resolve({valid: false})
            } catch (error) {
                resolve({valid: false})
            }
        }),
        {hasTarget: true},
    )
}

const privateKeyValidator = (context): Promise<ValidationObject> => {
    return context.Validator.extend(
        CUSTOM_VALIDATORS_NAMES.privateKey,
        (privateKey) => new Promise(async (resolve) => {
            try {
                /** NetworkType does not matter here  */
                Account.createFromPrivateKey(privateKey, NetworkType.MAIN_NET)
                resolve({valid: true})
            } catch (error) {
                resolve({valid: false})
            }
        }),
    )
}

/** Verified if the value of a cross-validation field is set */
const otherFieldValidator = (context): Promise<ValidationObject> => {
    return context.Validator.extend(
        CUSTOM_VALIDATORS_NAMES.otherField,
        (field, [otherField]) => new Promise((resolve) => {
            try {
                const otherValue = getOtherFieldValue(otherField, context)
                if (!otherValue) resolve({valid: false})
                resolve({valid: true})
            } catch (error) {
                resolve({valid: false})
            }
        }),
        {hasTarget: true},
    )
}

const amountDecimalsValidator = (context): Promise<ValidationObject> => {
    return context.Validator.extend(
        CUSTOM_VALIDATORS_NAMES.amountDecimals,
        (amount, [otherField]) => new Promise((resolve) => {
            try {
                const decimalPart: string = (amount + "").split(".")[1]
                if (!decimalPart) return resolve({valid: true})
                const numberOfDecimals = decimalPart.length
                const appMosaic: AppMosaic = getOtherFieldValue(otherField, context)
                if (numberOfDecimals > appMosaic.properties.divisibility) resolve({valid: false})
                resolve({valid: true})
            } catch (error) {
                resolve({valid: false})
            }
        }),
        {hasTarget: true},
    )
}

const mosaicAmountValidator = (context): Promise<ValidationObject> => {
    return context.Validator.extend(
        CUSTOM_VALIDATORS_NAMES.mosaicMaxAmount,
        (amount, [otherField]) => new Promise((resolve) => {
            try {
                const appMosaic: AppMosaic = getOtherFieldValue(otherField, context)
                const absoluteAmount = getAbsoluteMosaicAmount(amount, appMosaic.properties.divisibility)
                if (isNaN(absoluteAmount)) resolve({valid: false})
                if (absoluteAmount > maxMosaicAtomicUnits) resolve({valid: false})
                resolve({valid: true})
            } catch (error) {
                resolve({valid: false})
            }
        }),
        {hasTarget: true},
    )
}

const addressOrPublicKeyValidator = (context): Promise<ValidationObject> => {
    return context.Validator.extend(
        CUSTOM_VALIDATORS_NAMES.addressOrPublicKey,
        (addressOrPublicKey) => new Promise(async (resolve) => {
            if (addressOrPublicKey.length === PUBLIC_KEY_LENGTH) {
                resolve(validatePublicKey(addressOrPublicKey))
            }
            resolve(validateAddress(addressOrPublicKey))
        }),
    )
}

const customValidatorFactory = {
    [CUSTOM_VALIDATORS_NAMES.address]: addressValidator,
    [CUSTOM_VALIDATORS_NAMES.addressNetworkType]: addressNetworkTypeValidator,
    [CUSTOM_VALIDATORS_NAMES.addressOrAlias]: addressOrAliasValidator,
    [CUSTOM_VALIDATORS_NAMES.addressOrAliasNetworkType]: addressOrAliasNetworkTypeValidator,
    [CUSTOM_VALIDATORS_NAMES.addressOrPublicKey]: addressOrPublicKeyValidator,
    [CUSTOM_VALIDATORS_NAMES.alias]: aliasValidator,
    [CUSTOM_VALIDATORS_NAMES.amountDecimals]: amountDecimalsValidator,
    [CUSTOM_VALIDATORS_NAMES.confirmLock]: confirmLockValidator,
    [CUSTOM_VALIDATORS_NAMES.confirmPassword]: confirmPasswordValidator,
    [CUSTOM_VALIDATORS_NAMES.confirmWalletPassword]: confirmWalletPasswordValidator,
    [CUSTOM_VALIDATORS_NAMES.mosaicId]: mosaicIdValidator,
    [CUSTOM_VALIDATORS_NAMES.mosaicMaxAmount]: mosaicAmountValidator,
    [CUSTOM_VALIDATORS_NAMES.namespaceOrMosaicId]: namespaceOrMosaicIdValidator,
    [CUSTOM_VALIDATORS_NAMES.otherField]: otherFieldValidator,
    [CUSTOM_VALIDATORS_NAMES.privateKey]: privateKeyValidator,
    [CUSTOM_VALIDATORS_NAMES.publicKey]: publicKeyValidator,
    [CUSTOM_VALIDATORS_NAMES.remoteAccountPrivateKey]: remoteAccountPrivateKeyValidator,
}

const CustomValidator = (name, Validator) => ({
    name,
    Validator,
    register() {
        return customValidatorFactory[this.name](this)
    },
})

export const registerCustomValidators = (Validator) => {
    Object.keys(CUSTOM_VALIDATORS_NAMES)
        .forEach(name => CustomValidator(name, Validator).register())
}
 
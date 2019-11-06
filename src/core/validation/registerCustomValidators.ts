import {Address, MosaicId, NamespaceId} from 'nem2-sdk'
import {networkConfig} from '@/config/constants'
import {AppAccounts} from "@/core/model"

const {maxNameSize} = networkConfig

interface ValidationObject {
    valid: false | string
}

const getOtherFieldValue = (otherField, validator) => {
    const validatorFields = validator.Validator.$vee._validator.fields.items
    const field = validatorFields.find(field => field.name === otherField)
    if (field === undefined) throw new Error('The targeted confirmation field was not found')
    return field.value
}

export const CUSTOM_VALIDATORS_NAMES = {
    address: 'address',
    confirmPassword: 'confirmPassword',
    confirmLock: 'confirmLock',
    mosaicId: 'mosaicId',
    addressOrAlias: 'addressOrAlias',
    alias: 'alias',
}

const validateAddress = (address): ValidationObject => {
    try {
        Address.createFromRawAddress(address)
        return {valid: address}
    } catch (error) {
        return {valid: false}
    }
}

const validateAlias = (alias): ValidationObject => {
    if (alias.length > maxNameSize) return {valid: false}
    try {
        new NamespaceId(alias)
        return {valid: alias}
    } catch (error) {
        return {valid: false}
    }
}

const aliasValidator = (context): Promise<ValidationObject> => {
    return context.Validator.extend(
        CUSTOM_VALIDATORS_NAMES.alias,
        (alias) => new Promise((resolve) => {
            resolve(validateAlias(alias))
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

const customValidatorFactory = {
    [CUSTOM_VALIDATORS_NAMES.address]: addressValidator,
    [CUSTOM_VALIDATORS_NAMES.confirmLock]: confirmLockValidator,
    [CUSTOM_VALIDATORS_NAMES.confirmPassword]: confirmPasswordValidator,
    [CUSTOM_VALIDATORS_NAMES.mosaicId]: mosaicIdValidator,
    [CUSTOM_VALIDATORS_NAMES.addressOrAlias]: addressOrAliasValidator,
    [CUSTOM_VALIDATORS_NAMES.alias]: aliasValidator,
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

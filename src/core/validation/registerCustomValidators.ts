import {Address, MosaicId} from 'nem2-sdk'
import {AppLock} from '@/core/utils/appLock'

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
}

const addressValidator = (context) => {
    return context.Validator.extend(
        CUSTOM_VALIDATORS_NAMES.address,
        (address) => new Promise((resolve) => {
            if (address.indexOf('@') !== -1) {
                resolve({valid: address})
                return address
            }
            try {
                Address.createFromRawAddress(address)
                resolve({valid: address})
            } catch (error) {
                resolve({valid: false})
            }
        }),
    )
}

const confirmLockValidator = (context) => {
    return context.Validator.extend(
        CUSTOM_VALIDATORS_NAMES.confirmLock,
        (password, [otherField]) => new Promise((resolve) => {
            const cipher = getOtherFieldValue(otherField, context)
            if (!new AppLock().verifyLock(password, cipher)) resolve({valid: false})
            resolve({valid: password})
        }),
        {hasTarget: true},
    )
}

const confirmPasswordValidator = (context) => {
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

const mosaicIdValidator = (context) => {
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

const customValidatorFactory = {
    [CUSTOM_VALIDATORS_NAMES.address]: addressValidator,
    [CUSTOM_VALIDATORS_NAMES.confirmLock]: confirmLockValidator,
    [CUSTOM_VALIDATORS_NAMES.confirmPassword]: confirmPasswordValidator,
    [CUSTOM_VALIDATORS_NAMES.mosaicId]: mosaicIdValidator,
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

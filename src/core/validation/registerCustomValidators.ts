import { AppLock } from '@/core/utils/AppLock'

const getOtherFieldValue = (otherField, validator) => {
  const validatorFields = validator.Validator.$vee._validator.fields.items
  const field = validatorFields.find(field => field.name === otherField)
  if (field === undefined) throw new Error('The targeted confirmation field was not found')
  return field.value
}

export const CUSTOM_VALIDATORS_NAMES = {
 confirmPassword: 'confirmPassword',
 confirmLock: 'confirmLock'
};

const confirmPasswordValidator = (context) => {
 return context.Validator.extend(
  CUSTOM_VALIDATORS_NAMES.confirmPassword,
  (password, [otherField]) => new Promise((resolve) => {
    const otherValue = getOtherFieldValue(otherField, context)
    if (otherValue !== password) resolve({ valid: false })
    resolve({ valid: password });
  }),
  { hasTarget: true },
 )
}

const confirmLockValidator = (context) => {
 return context.Validator.extend(
  CUSTOM_VALIDATORS_NAMES.confirmLock,
  (password, [otherField]) => new Promise((resolve) => {
    const cipher = getOtherFieldValue(otherField, context)
    if (!new AppLock().verifyLock(password, cipher)) resolve({ valid: false })
    resolve({ valid: password });
  }),
  { hasTarget: true },
 )
}

const customValidatorFactory = {
 [CUSTOM_VALIDATORS_NAMES.confirmPassword]: confirmPasswordValidator,
 [CUSTOM_VALIDATORS_NAMES.confirmLock]: confirmLockValidator,
};

const CustomValidator = (name, Validator) => ({
 name,
 Validator,
 register() { return customValidatorFactory[this.name](this) },
});

export default function registerCustomValidators(Validator) {
 Object.keys(CUSTOM_VALIDATORS_NAMES)
   .forEach(name => CustomValidator(name, Validator).register());
}
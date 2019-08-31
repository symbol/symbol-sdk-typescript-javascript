export const MIN_PASSWORD_LENGTH = 6
export const MAX_PASSWORD_LENGTH = 32
export const ALLOWED_SPECIAL_CHAR = '-_!@#$&*"~+=%'
const PASSWORD_REGEXP = new RegExp(`[${ALLOWED_SPECIAL_CHAR}${`\\w\\s`}]{${MIN_PASSWORD_LENGTH},${MAX_PASSWORD_LENGTH}}`, 'g')

export const passwordValidator = (password: string): boolean => PASSWORD_REGEXP
    .test(password)

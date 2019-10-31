import i18n from '@/language'
import VeeValidate from 'vee-validate'
import en from 'vee-validate/dist/locale/en'
import zhCN from 'vee-validate/dist/locale/zh_CN'
import {registerCustomValidators} from '@/core/validation'

// @TODO: refactor dictionaries import
const customMessagesEn = {
    address: () => `this address is invalid`,
    confirmLock: () => `this password is incorrect`,
    confirmPassword: () => 'passwords do not match',
    max_value:()=>'current value is too big',
    decimal:()=>'current value does not match divisibility'
}
const customMessagesZh = {
    address: () => `地址错误`,
    confirmLock: () => `密码错误`,
    confirmPassword: () => '密码不匹配',
    max_value:()=>'输入的值太大',
    decimal:()=>'当前值与可分性不匹配'
}

export const veeValidateConfig = {
    i18n,
    fieldsBagName: 'fieldBags',
    dictionary: {
        'en-US': {
            messages: {...en.messages, ...customMessagesEn},
        },
        'zh-CN': {
            messages: {...zhCN.messages, ...customMessagesZh},
        },
    },
    inject: {
        $validator: '$validator',
    },
}

registerCustomValidators(VeeValidate.Validator)

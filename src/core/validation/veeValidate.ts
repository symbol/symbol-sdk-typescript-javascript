import i18n from '@/language'
import VeeValidate from 'vee-validate'
import en from 'vee-validate/dist/locale/en'
import ja from 'vee-validate/dist/locale/ja'
import zhCN from 'vee-validate/dist/locale/zh_CN'
import {registerCustomValidators} from './customValidators'
import {NotificationType} from '@/core/Helpers'

export const veeValidateConfig = {
  i18n,
  fieldsBagName: 'fieldBags',
  dictionary: {
    'en-US': {
      messages: {
        ...en.messages,
        "address": () => NotificationType.ADDRESS_INVALID,
        "addressNetworkType": () => NotificationType.NETWORK_TYPE_INVALID,
        "addressOrAliasNetworkType": () => NotificationType.NETWORK_TYPE_INVALID,
        "amountDecimals": () => NotificationType.DIVISIBILITY_INVALID,
        "confirmLock": () => NotificationType.WRONG_PASSWORD_ERROR,
        "confirmPassword": () => NotificationType.PASSWORDS_NOT_MATCHING,
        "confirmWalletPassword": () => NotificationType.WRONG_PASSWORD_ERROR,
        "mosaicMaxAmount": () => NotificationType.VALUE_TOO_BIG,
        "namespaceOrMosaicId": () => NotificationType.INVALID_NAMESPACE_OR_MOSAIC_ID,
        "otherField": () => NotificationType.MOSAIC_NOT_SET,
        "privateKey": () => NotificationType.PRIVATE_KEY_INVALID_ERROR,
        "publicKey": () => NotificationType.PUBLIC_KEY_INVALID,
        "remoteAccountPrivateKey": () => NotificationType.PRIVATE_KEY_INVALID_ERROR,
        "newAccountName": () => NotificationType.ACCOUNT_NAME_EXISTS_ERROR,
      },
      custom: {
        newDuration: {max_value: () => NotificationType.NAMESPACE_MAX_DURATION},
        namespaceDuration: {max_value: () => NotificationType.NAMESPACE_MAX_DURATION},
        currentAmount: {is_not: () => NotificationType.AMOUNT_LESS_THAN_0_ERROR},
        password:{regex:()=> NotificationType.PASSWORD_IS_INVALID_ERROR},
      },
    },
    'zh-CN': {
      messages: {...zhCN.messages},
    },
    'ja-JP': {
      messages: {...ja.messages},
    },
  },
  inject: {
    $validator: '$validator',
  },
}

registerCustomValidators(VeeValidate.Validator)

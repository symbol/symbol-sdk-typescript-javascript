/**
 * Copyright 2020 NEM Foundation (https://nem.io)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import VeeValidate from 'vee-validate'
import en from 'vee-validate/dist/locale/en'
import ja from 'vee-validate/dist/locale/ja'
import zhCN from 'vee-validate/dist/locale/zh_CN'

// internal dependencies
import i18n from '@/language'
import {NotificationType} from '@/core/utils/NotificationType'
import {ValidatorFactory} from './ValidatorFactory'

export const VeeValidateConfig = {
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

/// region register custom validators for vee-validate
export const registerCustomValidators = () => {
  ValidatorFactory.customValidators.map((name: string) => {
    ValidatorFactory.create(name)
  })
}
/// end-region register custom validators for vee-validate

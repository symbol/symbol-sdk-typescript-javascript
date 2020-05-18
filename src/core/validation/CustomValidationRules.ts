// external dependencies
import { extend } from 'vee-validate'
import i18n from '@/language'
import { Account, Address, NetworkType, Password } from 'symbol-sdk'
// internal dependencies
import { ProfileService } from '@/services/ProfileService'
import { NotificationType } from '@/core/utils/NotificationType'
import { AppStore } from '@/app/AppStore'
// configuration
import networkConfig from '../../../config/network.conf.json'
import appConfig from '../../../config/app.conf.json'
import { AddressValidator, AliasValidator, MaxDecimalsValidator, PublicKeyValidator, UrlValidator } from './validators'
import { ProfileModel } from '@/core/database/entities/ProfileModel'
import { AccountService } from '@/services/AccountService'
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel'

// TODO CustomValidationRules needs to be created when the network configuration is resolved, UI
// needs to use the resolved CustomValidationRules
// ATM rules are using the hardcoded file
const currentNetwork: NetworkConfigurationModel = networkConfig.networkConfigurationDefaults
const { MIN_PASSWORD_LENGTH } = appConfig.constants

export class CustomValidationRules {
  /**
   * Registers custom validation rules
   * @static
   */
  public static register(): void {
    extend('address', {
      validate: (value) => {
        return AddressValidator.validate(value)
      },
      message: `${i18n.t(`${NotificationType.ADDRESS_INVALID}`)}`,
    })

    extend('maxDecimals', {
      validate: (value, args: any) => {
        const { maxDecimalNumber } = args
        return MaxDecimalsValidator.validate(value, maxDecimalNumber)
      },
      message: `${i18n.t('max_decimal_number_error')}`,
      params: ['maxDecimalNumber'],
    })

    extend('addressOrAlias', {
      validate: (value) => {
        const isValidAddress = AddressValidator.validate(value)
        const isValidAlias = AliasValidator.validate(value)
        if (isValidAddress || isValidAlias) return true
        return false
      },
      message: `${i18n.t('error_incorrect_field')}`,
    })

    extend('addressOrAliasNetworkType', {
      validate: (value, args: any) => {
        const { networkType } = args
        if (!AddressValidator.validate(value)) return true
        return Address.createFromRawAddress(value).networkType == networkType
      },
      message: `${i18n.t(`${NotificationType.NETWORK_TYPE_INVALID}`)}`,
      params: ['networkType'],
    })

    extend('url', {
      validate: (value) => {
        return UrlValidator.validate(value)
      },
      message: `${i18n.t('error_incorrect_url')}`,
    })

    extend('confirmPassword', {
      validate(value, args: any) {
        const { target } = args
        return value === target
      },
      message: `${i18n.t(`${NotificationType.PASSWORDS_NOT_MATCHING}`)}`,
      params: ['target'],
    })

    extend('newAccountName', {
      validate(value) {
        return !new ProfileService().getProfileByName(value)
      },
      message: `${i18n.t(`${NotificationType.PROFILE_NAME_EXISTS_ERROR}`)}`,
    })

    extend('profilePassword', {
      validate(value) {
        if (!value || value.length < 8) {
          return false
        }

        const currentProfile: ProfileModel = AppStore.getters['profile/currentProfile']
        const currentHash = currentProfile.password
        const inputHash = ProfileService.getPasswordHash(new Password(value))
        return inputHash === currentHash
      },
      message: `${i18n.t(`${NotificationType.WRONG_PASSWORD_ERROR}`)}`,
    })

    extend('profileAccountName', {
      validate(value) {
        const accountService = new AccountService()

        // - fetch current profile accounts
        const currentProfile: ProfileModel = AppStore.getters['profile/currentProfile']
        const knownAccounts = Object.values(accountService.getKnownAccounts(currentProfile.accounts))
        return undefined === knownAccounts.find((w) => value === w.name)
      },
      message: `${i18n.t(`${NotificationType.ERROR_ACCOUNT_NAME_ALREADY_EXISTS}`)}`,
    })

    extend('privateKey', {
      validate(value) {
        try {
          Account.createFromPrivateKey(value, NetworkType.MIJIN_TEST)
          return true
        } catch (e) {
          return false
        }
      },
      message: `${i18n.t(`${NotificationType.PROFILE_NAME_EXISTS_ERROR}`)}`,
    })

    extend('addressOrPublicKey', {
      validate: (value) => {
        const isValidAddress = AddressValidator.validate(value)
        const isValidPublicKey = PublicKeyValidator.validate(value)
        if (isValidAddress || isValidPublicKey) return true
        return false
      },
      message: `${i18n.t('error_incorrect_field')}`,
    })

    extend('maxNamespaceDuration', {
      validate: (value) => {
        return value <= currentNetwork.maxNamespaceDuration
      },
      message: `${i18n.t('error_new_namespace_duration_max_value', {
        maxValue: currentNetwork.maxNamespaceDuration,
      })}`,
    })

    extend('passwordRegex', {
      validate: (value) => {
        return new RegExp(`(?=.*[0-9])(?=.*[a-zA-Z])(.{${MIN_PASSWORD_LENGTH},})$`).test(value)
      },
      message: `${i18n.t('error_new_password_format')}`,
    }),
      extend('in', {
        validate: (value, array: string[]) => {
          if (!array) return false
          return array.includes(value)
        },
        message: `${i18n.t('error_not_exist')}`,
      })
  }
}

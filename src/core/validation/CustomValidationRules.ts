// external dependencies
import {extend} from 'vee-validate'
import i18n from '@/language'
import {Address, Password, Account, NetworkType} from 'symbol-sdk'

// internal dependencies
import {AccountsRepository} from '@/repositories/AccountsRepository'
import {WalletsRepository} from '@/repositories/WalletsRepository'
import {AccountService} from '@/services/AccountService'
import {NotificationType} from '@/core/utils/NotificationType'
import {AppStore} from '@/app/AppStore'

// configuration
import networkConfig from '../../../config/network.conf.json'
import appConfig from '../../../config/app.conf.json'
const currentNetwork = networkConfig.networks['testnet-publicTest']
const {MIN_PASSWORD_LENGTH} = appConfig.constants

import {
  AddressValidator,
  AliasValidator,
  MaxDecimalsValidator,
  UrlValidator,
  PublicKeyValidator,
} from './validators'

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
        const {maxDecimalNumber} = args
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
        const {networkType} = args
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
        const {target} = args
        return value === target
      },
      message: `${i18n.t(`${NotificationType.PASSWORDS_NOT_MATCHING}`)}`,
      params: ['target'],
    })

    extend('newAccountName', {
      validate(value) {
        return new AccountsRepository().find(value) === false
      },
      message: `${i18n.t(`${NotificationType.ACCOUNT_NAME_EXISTS_ERROR}`)}`,
    })

    extend('accountPassword', {
      validate(value) {
        if (!value || value.length < 8) {
          return false
        }

        const currentAccount = AppStore.getters['account/currentAccount']
        const currentHash = currentAccount.values.get('password')
        const inputHash = new AccountService(AppStore).getPasswordHash(new Password(value))
        return inputHash === currentHash
      },
      message: `${i18n.t(`${NotificationType.WRONG_PASSWORD_ERROR}`)}`,
    })

    extend('accountWalletName', {
      validate(value) {
        const accountsRepository = new AccountsRepository()
        const walletsRepository = new WalletsRepository()

        // - fetch current account wallets
        const currentAccount = AppStore.getters['account/currentAccount']
        const knownWallets = Array.from(accountsRepository.fetchRelations(
          walletsRepository,
          currentAccount,
          'wallets',
        ).values())

        return undefined === knownWallets.find(w => value === w.values.get('name'))
      },
      message: `${i18n.t(`${NotificationType.ERROR_WALLET_NAME_ALREADY_EXISTS}`)}`,
    })

    extend('privateKey', {
      validate(value) {
        try {
          Account.createFromPrivateKey(value, NetworkType.MIJIN_TEST)
          return true
        }
        catch (e) {
          return false
        }
      },
      message: `${i18n.t(`${NotificationType.ACCOUNT_NAME_EXISTS_ERROR}`)}`,
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
        return value <= currentNetwork.properties.maxNamespaceDuration
      },
      message: `${i18n.t('error_new_namespace_duration_max_value', {maxValue: currentNetwork.properties.maxNamespaceDuration})}`,
    })

    extend('passwordRegex', {
      validate: (value) => {
        return new RegExp(`(?=.*[0-9])(?=.*[a-zA-Z])(.{${MIN_PASSWORD_LENGTH},})$`).test(value)
      },
      message: `${i18n.t('error_new_password_format')}`,
    })
  }
}


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
import {Account, Address, MosaicId, MosaicInfo, NetworkType} from 'nem2-sdk'

// internal dependencies
import {AddressValidator} from './AddressValidator'
import {AliasValidator} from './AliasValidator'
import {MosaicIdValidator} from './MosaicIdValidator'
import {NamespaceIdValidator} from './NamespaceIdValidator'
import {PublicKeyValidator} from './PublicKeyValidator'
import {AccountsRepository} from '@/repositories/AccountsRepository'
import {AccountsModel} from '@/core/database/entities/AccountsModel'
import {MosaicWithInfoView} from '@/core/views/MosaicWithInfoView'

// configuration
import networkConfig from '@/../config/network.conf.json'

/// region internal helpers
export const getOtherFieldValue = (otherField, validator) => {
  const validatorFields = validator.Validator.$vee._validator.fields.items
  const field = validatorFields.find(field => field.name === otherField)
  if (field === undefined) throw new Error('The targeted confirmation field was not found')
  return field.value
}
/// end-region internal helpers

export class ValidatorFactory {

  /**
   * List of known custom validators
   * @var {string}
   */
  public static customValidators: string[] = [
    'newAccountName',
    'alias',
    'publicKey',
    'confirmLock',
    'remoteAccountPrivateKey',
    'confirmPassword',
    'confirmWalletPassword',
    'mosaicId',
    'namespaceOrMosaicId',
    'addressOrAlias',
    'address',
    'addressNetworkType',
    'addressOrAliasNetworkType',
    'addressOrPublicKey',
    'privateKey',
    'otherField',
    'amountDecimals',
    'mosaicMaxAmount',
  ]

  /**
   * Private constructor (singleton)
   * @access private
   */
  private constructor() {}

  /**
   * Create a validator instance around \a context
   * @param {any} context
   */
  public static create(name, context): Promise<{valid: boolean|string}> {
    switch(name) {
    case 'newAccountName': return ValidatorFactory.newAccountNameValidator(context)
    case 'alias': return ValidatorFactory.aliasValidator(context)
    case 'publicKey': return ValidatorFactory.publicKeyValidator(context)
    case 'confirmPassword': return ValidatorFactory.confirmPasswordValidator(context)
    case 'mosaicId': return ValidatorFactory.mosaicIdValidator(context)
    case 'namespaceOrMosaicId': return ValidatorFactory.namespaceOrMosaicIdValidator(context)
    case 'addressOrAlias': return ValidatorFactory.addressOrAliasValidator(context)
    case 'address': return ValidatorFactory.addressValidator(context)
    case 'addressNetworkType': return ValidatorFactory.addressNetworkTypeValidator(context)
    case 'addressOrAliasNetworkType': return ValidatorFactory.addressOrAliasNetworkTypeValidator(context)
    case 'addressOrPublicKey': return ValidatorFactory.addressOrPublicKeyValidator(context)
    case 'privateKey': return ValidatorFactory.privateKeyValidator(context)
    case 'otherField': return ValidatorFactory.otherFieldValidator(context)
    case 'amountDecimals': return ValidatorFactory.amountDecimalsValidator(context)
    case 'mosaicMaxAmount': return ValidatorFactory.mosaicAmountValidator(context)
    default: break
    }

    throw new Error('No validator registered with name \'' + name + '\'')
  }

  protected static newAccountNameValidator(context): Promise<{valid: boolean|string}> {
    return context.Validator.extend(
      'newAccountName',
      (accountName) => new Promise((resolve) => {
        const repository = new AccountsRepository()
        const accountExists = repository.find(accountName)

        // - account must not exist
        resolve({valid: !accountExists})
      }),
    )
  }

  protected static aliasValidator(context): Promise<{valid: boolean|string}> {
    return context.Validator.extend(
      'alias',
      (alias) => new Promise((resolve) => {
        resolve(new AliasValidator().validate(alias))
      }),
    )
  }

  protected static publicKeyValidator(context): Promise<{valid: boolean|string}> {
    return context.Validator.extend(
      'publicKey',
      (publicKey) => new Promise((resolve) => {
        resolve(new PublicKeyValidator().validate(publicKey))
      }),
    )
  }

  protected static confirmPasswordValidator(context): Promise<{valid: boolean|string}> {
    return context.Validator.extend(
      'confirmPassword',
      (password, [otherField]) => new Promise((resolve) => {
        const otherValue = getOtherFieldValue(otherField, context)
        if (otherValue !== password) resolve({valid: false})
        resolve({valid: password})
      }),
      {hasTarget: true},
    )
  }

  protected static mosaicIdValidator(context): Promise<{valid: boolean|string}> {
    return context.Validator.extend(
      'mosaicId',
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
  
  protected static namespaceOrMosaicIdValidator(context): Promise<{valid: boolean|string}> {
    return context.Validator.extend(
      'namespaceOrMosaicId',
      (namespaceOrMosaicId) => new Promise((resolve) => {
        const isValidMosaicId = new MosaicIdValidator().validate(namespaceOrMosaicId)
        const isValidNamespace = new NamespaceIdValidator().validate(namespaceOrMosaicId)
  
        if (isValidNamespace.valid || isValidMosaicId.valid) {
          resolve({valid: namespaceOrMosaicId})
        } else {
          resolve({valid: false})
        }
      }),
    )
  }
  
  protected static addressOrAliasValidator(context): Promise<{valid: boolean|string}> {
    return context.Validator.extend(
      'addressOrAlias',
      (addressOrAlias) => new Promise((resolve) => {
        const isValidAddress = new AddressValidator().validate(addressOrAlias)
        const isValidAlias = new AliasValidator().validate(addressOrAlias)
  
        if (isValidAddress.valid || isValidAlias.valid) {
          resolve({valid: addressOrAlias})
        } else {
          resolve({valid: false})
        }
      }),
    )
  }
  
  protected static addressValidator(context): Promise<{valid: boolean|string}> {
    return context.Validator.extend(
      'address',
      (address) => new Promise((resolve) => {
        resolve(new AddressValidator().validate(address))
      }),
    )
  }
  
  protected static addressNetworkTypeValidator(context): Promise<{valid: boolean|string}> {
    return context.Validator.extend(
      'addressNetworkType',
      (address, [otherField]) => new Promise((resolve) => {
        const currentAccount: AccountsModel = getOtherFieldValue(otherField, context)
        const networkType: NetworkType = currentAccount.values.get('networkType') as NetworkType
        try {
          const _address = Address.createFromRawAddress(address)
          if (_address.networkType === networkType) resolve({valid: address})
          resolve({valid: false})
        } catch (error) {
          resolve({valid: false})
        }
      }),
      {hasTarget: true},
    )
  }
  
  protected static addressOrAliasNetworkTypeValidator(context): Promise<{valid: boolean|string}> {
    return context.Validator.extend(
      'addressOrAliasNetworkType',
      (addressOrAlias, [otherField]) => new Promise((resolve) => {
        const currentAccount: AccountsModel = getOtherFieldValue(otherField, context)
        const networkType: NetworkType = currentAccount.values.get('networkType') as NetworkType
        try {
          if (!new AddressValidator().validate(addressOrAlias).valid) resolve({valid: addressOrAlias})
          const _address = Address.createFromRawAddress(addressOrAlias)
          if (_address.networkType === networkType) resolve({valid: addressOrAlias})
          resolve({valid: false})
        } catch (error) {
          resolve({valid: false})
        }
      }),
      {hasTarget: true},
    )
  }
  
  protected static privateKeyValidator(context): Promise<{valid: boolean|string}> {
    return context.Validator.extend(
      'privateKey',
      (privateKey) => new Promise((resolve) => {
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
  protected static otherFieldValidator(context): Promise<{valid: boolean|string}> {
    return context.Validator.extend(
      'otherField',
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
  
  protected static amountDecimalsValidator(context): Promise<{valid: boolean|string}> {
    return context.Validator.extend(
      'amountDecimals',
      (amount, [otherField]) => new Promise((resolve) => {
        try {
          const decimalPart: string = (`${amount}`).split('.')[1]
          if (!decimalPart) return resolve({valid: true})
          const numberOfDecimals = decimalPart.length
          const mosaicInfo: MosaicInfo = getOtherFieldValue(otherField, context)
          if (numberOfDecimals > mosaicInfo.divisibility) resolve({valid: false})
          resolve({valid: true})
        } catch (error) {
          resolve({valid: false})
        }
      }),
      {hasTarget: true},
    )
  }
  
  protected static mosaicAmountValidator(context): Promise<{valid: boolean|string}> {
    return context.Validator.extend(
      'mosaicMaxAmount',
      (amount, [otherField]) => new Promise((resolve) => {
        try {
          const mosaicView: MosaicWithInfoView = getOtherFieldValue(otherField, context)
          const absoluteAmount = amount * Math.pow(10, mosaicView.mosaicInfo.divisibility)
          if (isNaN(absoluteAmount)) resolve({valid: false})
          if (absoluteAmount > mosaicView.mosaic.amount.compact()) resolve({valid: false})
          resolve({valid: true})
        } catch (error) {
          resolve({valid: false})
        }
      }),
      {hasTarget: true},
    )
  }
  
  protected static addressOrPublicKeyValidator(context): Promise<{valid: boolean|string}> {
    return context.Validator.extend(
      'addressOrPublicKey',
      (addressOrPublicKey) => new Promise((resolve) => {
        if (addressOrPublicKey.length === 64) {
          resolve(new PublicKeyValidator().validate(addressOrPublicKey))
        }
        resolve(new AddressValidator().validate(addressOrPublicKey))
      }),
    )
  }
}

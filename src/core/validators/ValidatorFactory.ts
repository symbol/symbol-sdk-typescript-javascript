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
import { Content } from 'view-design'

/// region internal helpers
export const getOtherFieldValue = (otherField) => {
  const validatorFields = this._vm.$vee._validator.fields.items
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
    'confirmPassword',
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
   * @param {string} name
   */
  public static create(name: string) {
    switch(name) {
    case 'newAccountName': return ValidatorFactory.newAccountNameValidator()
    case 'alias': return ValidatorFactory.aliasValidator()
    case 'publicKey': return ValidatorFactory.publicKeyValidator()
    case 'confirmPassword': return ValidatorFactory.confirmPasswordValidator()
    case 'mosaicId': return ValidatorFactory.mosaicIdValidator()
    case 'namespaceOrMosaicId': return ValidatorFactory.namespaceOrMosaicIdValidator()
    case 'addressOrAlias': return ValidatorFactory.addressOrAliasValidator()
    case 'address': return ValidatorFactory.addressValidator()
    case 'addressNetworkType': return ValidatorFactory.addressNetworkTypeValidator()
    case 'addressOrAliasNetworkType': return ValidatorFactory.addressOrAliasNetworkTypeValidator()
    case 'addressOrPublicKey': return ValidatorFactory.addressOrPublicKeyValidator()
    case 'privateKey': return ValidatorFactory.privateKeyValidator()
    case 'otherField': return ValidatorFactory.otherFieldValidator()
    case 'amountDecimals': return ValidatorFactory.amountDecimalsValidator()
    case 'mosaicMaxAmount': return ValidatorFactory.mosaicAmountValidator()
    default: break
    }

    throw new Error('No validator registered with name \'' + name + '\'')
  }

  protected static newAccountNameValidator() {
    return VeeValidate.Validator.extend(
      'newAccountName',
      (accountName) => new Promise((resolve) => {
        const repository = new AccountsRepository()
        const accountExists = repository.find(accountName)

        // - account must not exist
        resolve({valid: !accountExists})
      }),
    )
  }

  protected static aliasValidator() {
    return VeeValidate.Validator.extend(
      'alias',
      (alias) => new Promise((resolve) => {
        resolve(false !== new AliasValidator().validate(alias).valid)
      }),
    )
  }

  protected static publicKeyValidator() {
    return VeeValidate.Validator.extend(
      'publicKey',
      (publicKey) => new Promise((resolve) => {
        resolve(false !== new PublicKeyValidator().validate(publicKey).valid)
      }),
    )
  }

  protected static confirmPasswordValidator() {
    return VeeValidate.Validator.extend(
      'confirmPassword',
      (password, otherField) => new Promise((resolve) => {
        const otherValue = getOtherFieldValue(otherField)
        if (otherValue !== password) resolve({valid: false})
        resolve({valid: password})
      }),
      {hasTarget: true},
    )
  }

  protected static mosaicIdValidator() {
    return VeeValidate.Validator.extend(
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
  
  protected static namespaceOrMosaicIdValidator() {
    return VeeValidate.Validator.extend(
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
  
  protected static addressOrAliasValidator() {
    return VeeValidate.Validator.extend(
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
  
  protected static addressValidator() {
    return VeeValidate.Validator.extend(
      'address',
      (address) => new Promise((resolve) => {
        resolve(false !== new AddressValidator().validate(address).valid)
      }),
    )
  }
  
  protected static addressNetworkTypeValidator() {
    return VeeValidate.Validator.extend(
      'addressNetworkType',
      (address, otherField) => new Promise((resolve) => {
        const currentAccount: AccountsModel = getOtherFieldValue(otherField)
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
  
  protected static addressOrAliasNetworkTypeValidator() {
    return VeeValidate.Validator.extend(
      'addressOrAliasNetworkType',
      (addressOrAlias, otherField) => new Promise((resolve) => {
        const currentAccount: AccountsModel = getOtherFieldValue(otherField)
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
  
  protected static privateKeyValidator() {
    return VeeValidate.Validator.extend(
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
  protected static otherFieldValidator() {
    return VeeValidate.Validator.extend(
      'otherField',
      (field, otherField) => new Promise((resolve) => {
        try {
          const otherValue = getOtherFieldValue(otherField)
          if (!otherValue) resolve({valid: false})
          resolve({valid: true})
        } catch (error) {
          resolve({valid: false})
        }
      }),
      {hasTarget: true},
    )
  }
  
  protected static amountDecimalsValidator() {
    return VeeValidate.Validator.extend(
      'amountDecimals',
      (amount, otherField) => new Promise((resolve) => {
        try {
          const decimalPart: string = (`${amount}`).split('.')[1]
          if (!decimalPart) return resolve({valid: true})
          const numberOfDecimals = decimalPart.length
          const mosaicInfo: MosaicInfo = getOtherFieldValue(otherField)
          if (numberOfDecimals > mosaicInfo.divisibility) resolve({valid: false})
          resolve({valid: true})
        } catch (error) {
          resolve({valid: false})
        }
      }),
      {hasTarget: true},
    )
  }
  
  protected static mosaicAmountValidator() {
    return VeeValidate.Validator.extend(
      'mosaicMaxAmount',
      (amount, otherField) => new Promise((resolve) => {
        try {
          const mosaicView: MosaicWithInfoView = getOtherFieldValue(otherField)
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
  
  protected static addressOrPublicKeyValidator() {
    return VeeValidate.Validator.extend(
      'addressOrPublicKey',
      (addressOrPublicKey) => new Promise((resolve) => {
        if (addressOrPublicKey.length === 64) {
          resolve(false !== new PublicKeyValidator().validate(addressOrPublicKey).valid)
        }
        resolve(false !== new AddressValidator().validate(addressOrPublicKey).valid)
      }),
    )
  }
}

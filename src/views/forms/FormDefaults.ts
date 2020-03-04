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
import {NetworkType, MosaicSupplyChangeAction} from 'symbol-sdk'

// configuration
import networkConfig from '@/../config/network.conf.json'

export const formDataConfig = {
  settingPassword: {
    previousPassword: '',
    newPassword: '',
    confirmPassword: '',
    cipher: '',
  },
  createAccountForm: {
    accountName: '',
    password: '',
    passwordAgain: '',
    hint: '',
  },
  importKeystoreConfig: {
    walletName: 'keystore-wallet',
    keystoreStr: '',
    keystorePassword: '',
  },
  transferForm: {
    recipient: '',
    remark: '',
    multisigPublicKey: '',
    feeSpeed: 'NORMAL',
    mosaicTransferList: [],
    isEncrypted: true,
  },
  remoteForm: {
    remotePublicKey: '',
    feeSpeed: 'NORMAL',
    password: '',
  },
  mosaicAliasForm: {
    mosaicName: '',
    feeSpeed: 'NORMAL',
    password: '',
  },
  mosaicEditForm: {
    delta: 1,
    supplyType: MosaicSupplyChangeAction.Increase,
    feeSpeed: 'NORMAL',
  },
  mosaicUnAliasForm: {
    feeSpeed: 'NORMAL',
    password: '',
  },
  addressAliasForm: {
    address: '',
    feeSpeed: 'NORMAL',
    password: '',
  },
  alias: {
    feeSpeed: 'NORMAL',
    password: '',
  },
  mosaicTransactionForm: {
    restrictable: false,
    supply: 500000000,
    divisibility: 0,
    transferable: true,
    supplyMutable: true,
    permanent: true,
    duration: 1000,
    feeSpeed: 'NORMAL',
    multisigPublicKey: '',
  },
  multisigConversionForm: {
    minApproval: 1,
    minRemoval: 1,
    feeSpeed: 'NORMAL',
    multisigPublicKey: '',
  },
  multisigModificationForm: {
    minApproval: 0,
    minRemoval: 0,
    feeSpeed: 'NORMAL',
    multisigPublicKey: '',
  },
  namespaceEditForm: {
    name: '',
    duration: 1000,
    feeSpeed: 'NORMAL',
  },
  rootNamespaceForm: {
    duration: networkConfig.networks['testnet-publicTest'].properties.maxNamespaceDuration,
    rootNamespaceName: '',
    multisigPublicKey: '',
    feeSpeed: 'NORMAL',
  },
  subNamespaceForm: {
    rootNamespaceName: '',
    subNamespaceName: '',
    multisigPublicKey: '',
    feeSpeed: 'NORMAL',
  },
  walletImportMnemonicForm: {
    mnemonic: '',
    walletName: '',
  },
  walletImportPrivateKeyForm: {
    privateKey: '',
    walletName: 'wallet-privateKey',
  },
  trezorImportForm: {
    networkType: NetworkType.MIJIN_TEST,
    accountIndex: 0,
    walletName: 'Trezor Wallet',
  },
  walletCreateForm: {
    walletName: 'wallet-create',
    path: 0,
  },
}

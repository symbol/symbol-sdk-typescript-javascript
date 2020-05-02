/*
 * Copyright 2020 NEM Foundation (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
// external dependencies
import { SimpleWallet, Account, NetworkType, Password } from 'symbol-sdk'

// internal dependencies
import { AccountModel, AccountType } from '@/core/database/entities/AccountModel'

export const account1Params = {
  accountName: 'account_name',
  privateKey: '145160ba92878447cb45d6cb147d2ade035b0b47cab1b9e1551aa5679d92b314',
  networkType: NetworkType.MIJIN_TEST,
  password: new Password('password1'),
}

export const account1 = Account.createFromPrivateKey(account1Params.privateKey, account1Params.networkType)

export const simpleWallet1 = SimpleWallet.createFromPrivateKey(
  account1Params.accountName,
  account1Params.password,
  account1Params.privateKey,
  account1Params.networkType,
)

export const WalletsModel1: AccountModel = {
  id: 'someId',
  node: '',
  profileName: 'profile_name',
  name: account1Params.accountName,
  type: AccountType.PRIVATE_KEY,
  address: simpleWallet1.address.plain(),
  publicKey: account1.publicKey,
  encryptedPrivateKey: simpleWallet1.encryptedPrivateKey,
  path: '',
  isMultisig: false,
}

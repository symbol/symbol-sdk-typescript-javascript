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
// external dependencies
import {SimpleWallet, Account, NetworkType, Password} from 'symbol-sdk';

// internal dependencies
import {WalletsModel, WalletType} from '@/core/database/entities/WalletsModel';

export const wallet1Params = {
 walletName: 'wallet_name',
 privateKey: '145160ba92878447cb45d6cb147d2ade035b0b47cab1b9e1551aa5679d92b314',
 networkType: NetworkType.MIJIN_TEST,
 password: new Password('password1'),
}

export const wallet1Account = Account.createFromPrivateKey(
 wallet1Params.privateKey, wallet1Params.networkType,
)

export const simpleWallet1 = SimpleWallet.createFromPrivateKey(
 wallet1Params.walletName,
 wallet1Params.password,
 wallet1Params.privateKey,
 wallet1Params.networkType,
)

export const WalletsModel1 = new WalletsModel(
 new Map<string, any>([
  ['accountName', 'account_name'],
  ['name', wallet1Params.walletName],
  ['type', WalletType.fromDescriptor('Pk')],
  ['address', simpleWallet1.address.plain()],
  ['publicKey', wallet1Account.publicKey],
  ['encPrivate', simpleWallet1.encryptedPrivateKey.encryptedKey],
  ['encIv', simpleWallet1.encryptedPrivateKey.iv],
  ['path', ''],
  ['isMultisig', false],
 ])
)

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
import {Account, NetworkType} from 'symbol-sdk'

const TEST_ACCOUNTS = {
  "cosigner1": {
    networkType: NetworkType.MIJIN_TEST,
    privateKey: '27002B109810E4C25E8E6AE964FAF129CC3BFD1A95CB99062E0205060041D0C9'},
  "remoteTestnet": {
    networkType: NetworkType.TEST_NET,
    privateKey: '803040D4A33983C4B233C6C2054A24B9C655E8CAC6C06AECCED56B8FE424FF2B'},
  "remoteMijin": {
    networkType: NetworkType.MIJIN_TEST,
    privateKey: '803040D4A33983C4B233C6C2054A24B9C655E8CAC6C06AECCED56B8FE424FF2B'},
  "cosigner2": {
    networkType: NetworkType.MIJIN_TEST,
    privateKey: '8472FA74A64A97C85F0A285299D9FD2D44D71CB5698FE9C7E88C33001F9DD83F'},
  "multisig1": {
    networkType: NetworkType.MIJIN_TEST,
    privateKey: 'CAD57FEC0C7F2106AD8A6203DA67EE675A1A3C232C676945306448DF5B4124F8'},
  "multisig2": {
    networkType: NetworkType.MIJIN_TEST,
    privateKey: '72B08ACF80558B285EADA206BB1226A44038C65AC4649108B2284591641657B5'},
}

const TEST_CHILD_ACCOUNTS = {
  "hdAccount1": {
    networkType: NetworkType.MIJIN_TEST,
    password: 'password',  
    seed: 'exhibit skin wink broom issue truly'
        + 'unit toy copy foam cheese number'
        + 'vicious forum crater afford snow chef'
        + 'toss broccoli second jeans good reject',
    wallets: [
      {
        path: 'm/44\'/43\'/0\'/0\'/0\'',
        publicKey: 'C4B3DC11B41653AD52863B32159F771D847A1AFA6D117A64AB8305E0873F6506',
        address: 'SAJFKFAHB4UNEK4LJM76C7L5YMBSB74AKMSAXJJ7'
      },
      {
        path: 'm/44\'/43\'/1\'/0\'/0\'',
        publicKey: '33BC60F52A98C0BF83F523E022BE58EEF7A674B89BC76BA6FCE4C499DF235058',
        address: 'SCSAG54ILQGI3FYF66LQYXF4GLGZSKQD4MNAL7LD'
      },
      {
        path: 'm/44\'/43\'/2\'/0\'/0\'',
        publicKey: '85E51A7CFA9797BD274FF927BA628EAD3A9470931C14282D03C6D4EF460E0C64',
        address: 'SDSHGSEXS2G2YCVJIUBZFWX2RJ6QMBEUZQJAVQXD'
      },
      {
        path: 'm/44\'/43\'/3\'/0\'/0\'',
        publicKey: 'BBBACF42E9E2F1D338DEA2D28A2F612DE79C6ED153758327C3D9A768B5505D7A',
        address: 'SB5YAT47PX7S7NTDVZGH6DOWPCU6CSRQNSOATHOL'
      }
    ]    
  }
}

export const getTestAccount = (name: string): Account => {
  if (!TEST_ACCOUNTS.hasOwnProperty(name)) {
    throw new Error('Test account with name: ' + name + ' could not be found in __mocks__/accounts.ts')
  }

  const spec = TEST_ACCOUNTS[name]
  return Account.createFromPrivateKey(spec.privateKey, spec.networkType)
}

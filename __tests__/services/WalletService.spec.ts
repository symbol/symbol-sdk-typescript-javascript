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
import {NetworkType, Account} from 'symbol-sdk'
import {WalletService} from '@/services/WalletService'
import {MnemonicPassPhrase} from 'symbol-hd-wallets'

// Sample mnemonic passphrase
const mnemonic = new MnemonicPassPhrase('limit sing post cross matrix pizza topple rack cigar skirt girl hurt outer humble fancy elegant bunker pipe ensure grain regret bulk renew trim')

// Standard account paths
const standardPaths = {
  1: 'm/44\'/4343\'/0\'/0\'/0\'',
  2: 'm/44\'/4343\'/1\'/0\'/0\'',
  3: 'm/44\'/4343\'/2\'/0\'/0\'',
  4: 'm/44\'/4343\'/3\'/0\'/0\'',
  5: 'm/44\'/4343\'/4\'/0\'/0\'',
  6: 'm/44\'/4343\'/5\'/0\'/0\'',
  7: 'm/44\'/4343\'/6\'/0\'/0\'',
  8: 'm/44\'/4343\'/7\'/0\'/0\'',
  9: 'm/44\'/4343\'/8\'/0\'/0\'',
  10: 'm/44\'/4343\'/9\'/0\'/0\'',
}

// Expected private keys from derivation of mnemonic with standard account paths
const expectedPrivateKeys = {
  1: '017210E314BE6543480C2BB176F7047D6EEB04C2CEBEE5A80C44970858434E98',
  2: '82B4F074F64E35D889E5754A6063DAB8F0F2B23A91039E79EBBBA47C18BA304B',
  3: '2C4795674D21D3BEED4229FBD76FF6F41D8BF11F1F5A880EF8132160DC787BEC',
  4: '1AFFF99425848E1D41721969F55163AABD7E92E6692C9DF94C7A89F709688C92',
  5: '0F152C24CD1FD2F45A37391278884C894CFB1AF337C0E78C535B18873255ADAF',
  6: 'B6A609BEA9A5C88A46A5ADF06592E6D1131B7BF6D1BDB4030DF1ABA932CE687D',
  7: '2D94F2EEB8A234A2B4306127475BEF5C7C87896236B267E513865EFE106CD4CD',
  8: '3A32FA8CD870AD92EBE4734304FD6EFBE40524D01D937B8F3F73473E9E59CA7F',
  9: '7EF8AF9E5D6F9E14F78905E5042553D099A7B3B2934CC435465D1418C0E10F81',
  10: 'F16E786C4C34C3CD4D4C9F078E117D66557690630913C4DB057DE541DC7B1F64',
}

// Accounts from private keys
const expectedAccounts = Object.values(expectedPrivateKeys).map(
  key => Account.createFromPrivateKey(key, NetworkType.TEST_NET),
)

// Addresses from Accounts
const expectedAddresses = expectedAccounts.map(({address}) => address)

describe('services/WalletServices ==>', () => {
  describe('generateAccountsFromMnemonic() should', () => {
    it('produce 10 accounts', () => {
      const accounts = new WalletService().generateAccountsFromMnemonic(
        mnemonic,
        NetworkType.TEST_NET,
      )
      
      expect(accounts).toStrictEqual(expectedAccounts)
    })
  })

  describe('generateAccountsFromPaths() should', () => {
    it('produce 10 accounts', () => {
      const accounts = new WalletService().generateAccountsFromPaths(
        mnemonic,
        NetworkType.TEST_NET,
        Object.values(standardPaths),
      )

      expect(accounts).toStrictEqual(expectedAccounts)
    })
  })

  describe('getAddressesFromMnemonic() should', () => {
    it('produce 10 addresses', () => {
      const addresses = new WalletService().getAddressesFromMnemonic(
        mnemonic,
        NetworkType.TEST_NET,
      )

      expect(addresses).toEqual(expectedAddresses)
    })
  })

  describe('getAccountByPath() should', () => {
    it('produce expected accounts', () => {
      const networkType = NetworkType.TEST_NET

      expect(new WalletService().getAccountByPath(mnemonic, networkType, standardPaths[1]))
        .toEqual(expectedAccounts[0])
       
      expect(new WalletService().getAccountByPath(mnemonic, networkType, standardPaths[8]))
        .toEqual(expectedAccounts[7])
    })
  })
})

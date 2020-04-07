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
import {NetworkType, Account, Password} from 'symbol-sdk'
import {WalletService} from '@/services/WalletService'
import {MnemonicPassPhrase} from 'symbol-hd-wallets'
import {wallet1Params, WalletsModel1} from '@MOCKS/Wallets'

// Sample mnemonic passphrase
const mnemonic = new MnemonicPassPhrase('limit sing post cross matrix pizza topple rack cigar skirt girl hurt outer humble fancy elegant bunker pipe ensure grain regret bulk renew trim')

// Standard account paths
const standardPaths = {
  1: 'm/44\'/4343\'/0\'/0\'/0\'',
  2: 'm/44\'/4343\'/1\'/0\'/0\'',
  3: 'm/44\'/4343\'/2\'/0\'/0\'',
}

// Expected private keys from derivation of mnemonic with standard account paths
const expectedPrivateKeys = {
  1: '017210E314BE6543480C2BB176F7047D6EEB04C2CEBEE5A80C44970858434E98',
  2: '82B4F074F64E35D889E5754A6063DAB8F0F2B23A91039E79EBBBA47C18BA304B',
  3: '2C4795674D21D3BEED4229FBD76FF6F41D8BF11F1F5A880EF8132160DC787BEC',
}

// Accounts from private keys
const expectedAccounts = Object.values(expectedPrivateKeys).map(
  key => Account.createFromPrivateKey(key, NetworkType.TEST_NET),
)

// max 2+2 generations
const generatedAccounts = new WalletService().generateAccountsFromMnemonic(
  mnemonic,
  NetworkType.TEST_NET,
  2,
)
const generatedAddresses = new WalletService().getAddressesFromMnemonic(
  mnemonic,
  NetworkType.TEST_NET,
  2,
)

describe('services/WalletServices', () => {
  describe('generateAccountsFromMnemonic() should', () => {
    test('generate correct child account given mnemonic', () => {
      expect(generatedAccounts).toBeDefined()
      expect(generatedAccounts.length).toBe(2)
      expect(generatedAccounts[0].privateKey).toBe(expectedAccounts[0].privateKey)
      expect(generatedAccounts[0].publicKey).toBe(expectedAccounts[0].publicKey)
      expect(generatedAccounts[0].address.plain()).toBe(expectedAccounts[0].address.plain())
    })

    test('generate multiple correct children accounts given mnemonic and count', () => {
      expect(generatedAccounts).toBeDefined()
      expect(generatedAccounts.length).toBe(2)
      expect(generatedAccounts[0].privateKey).toBe(expectedAccounts[0].privateKey)
      expect(generatedAccounts[1].privateKey).toBe(expectedAccounts[1].privateKey)
    })
  })

  describe('generateAccountsFromPaths() should', () => {
    test('generate correct account given mnemonic and paths', () => {
      const accounts = new WalletService().generateAccountsFromPaths(
        mnemonic,
        NetworkType.TEST_NET,
        Object.values(standardPaths).slice(0, 1),
      )

      expect(accounts).toBeDefined()
      expect(accounts.length).toBe(1)
      expect(accounts[0].privateKey).toBe(expectedAccounts[0].privateKey)
      expect(accounts[0].publicKey).toBe(expectedAccounts[0].publicKey)
      expect(accounts[0].address.plain()).toBe(expectedAccounts[0].address.plain())
    })
  })

  describe('getAddressesFromMnemonic() should', () => {
    test('generate correct address given mnemonic', () => {
      expect(generatedAddresses).toBeDefined()
      expect(generatedAddresses.length).toBe(2)
      expect(generatedAddresses[0].plain()).toBe(expectedAccounts[0].address.plain())
    })

    test('generate multiple correct addresses given mnemonic and count', () => {
      expect(generatedAddresses).toBeDefined()
      expect(generatedAddresses.length).toBe(2)
      expect(generatedAddresses[0].plain()).toBe(expectedAccounts[0].address.plain())
      expect(generatedAddresses[1].plain()).toBe(expectedAccounts[1].address.plain())
    })
  })

  describe('getAccountByPath() should', () => {
    test('generate correct account given mnemonic and path', () => {
      const account_3 = new WalletService().getAccountByPath(mnemonic, NetworkType.TEST_NET, standardPaths[3])

      expect(account_3.privateKey).toBe(expectedAccounts[2].privateKey)
    })
  })

  describe('updateWalletPassword', () => {
    test('should update a wallet password', () => {
      // initialize wallet service
      const service = new WalletService()

      // get initial encrypted private key values
      const initialEncPrivate = WalletsModel1.values.get('encPrivate')
      const initialEncIv = WalletsModel1.values.get('encIv')

      // update the model
      const encryptedKey = service.updateWalletPassword(
        WalletsModel1, wallet1Params.password, new Password('password2'),
      )

      // decrypt the new model's private key
      const privateKey = encryptedKey.decrypt(new Password('password2'))

      // assert the encrypted private key changed
      expect(encryptedKey.encryptedKey).not.toBe(initialEncPrivate)
      expect(encryptedKey.iv).not.toBe(initialEncIv)

      // assert the plain private key did not change
      expect(privateKey).toBe(wallet1Params.privateKey)
    })

    test('should throw if provided with an incorrect password', () => {
      const service = new WalletService()
      expect(() => {
        service.updateWalletPassword(
          WalletsModel1,new Password('wrong_password'), new Password('password2'),
        )
      }).toThrow()
    })
  })
})

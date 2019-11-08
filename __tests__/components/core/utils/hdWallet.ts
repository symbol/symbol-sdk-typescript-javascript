import * as hdWallet from '@/core/utils/hdWallet'
  // @ts-ignore
import { hdAccount, hdAccountData } from "@@/mock/conf/conf.spec"

describe('hdWallet', () => {
  it('createMnemonic should create a 24 words array', () => {
    expect(hdWallet.createMnemonic().split(' ').length).toBe(24)
  })
})

describe('hdWallet', () => {
   it('getPath should return a correct value', () => {
      expect(hdWallet.getPath(0)).toBe(`m/44'/43'/0'/0'/0'`)
      expect(hdWallet.getPath(1)).toBe(`m/44'/43'/1'/0'/0'`)
   })

   it('getPath should throw when incorrect params are provided', () => {
      expect(() => { hdWallet.getPath(null) }).toThrow();
      expect(() => { hdWallet.getPath(undefined) }).toThrow();
    })

  it('createSubWalletByPathNumber should return proper addresses', () => {
      const account0 = hdWallet.createSubWalletByPathNumber(hdAccountData.mnemonic, 0)
      expect(account0.address.plain()).toBe(hdAccount.wallets[0].address)

      const account1 = hdWallet.createSubWalletByPathNumber(hdAccountData.mnemonic, 1)
      expect(account1.address.plain()).toBe('SA645GRNEDNGZXBU5BEML6C3KGMPOY7SMX4LXKOP')
  })

  it('randomizeMnemonicWordArray should shuffle an array of string', () => {
      const initialArray = ['a', 'b', 'c', 'd', 'e']
      let randomizedArray = hdWallet.randomizeMnemonicWordArray([...initialArray])
      expect(randomizedArray.length).toBe(initialArray.length)
      initialArray.forEach((word)=> randomizedArray.splice(randomizedArray.indexOf(word), 1))
      expect(randomizedArray.length).toBe(0)
  })
})

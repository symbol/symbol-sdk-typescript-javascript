import * as hdWallet from '@/core/utils/hdWallet.ts'

// @ts-ignore
import {hdAccount, hdAccountData, hdAccountTestNet} from "@@/mock/conf/conf.spec"
import {NetworkType} from 'nem2-sdk'
import {Network} from 'nem2-hd-wallets'

describe('hdWallet', () => {
  it('createMnemonic should create a 24 words array', () => {
    expect(hdWallet.createMnemonic().split(' ').length).toBe(24)
  })
})

describe('getPath', () => {
  it('should return a correct value', () => {
    expect(hdWallet.getPath(0)).toBe(`m/44'/43'/0'/0'/0'`)
    expect(hdWallet.getPath(1)).toBe(`m/44'/43'/1'/0'/0'`)
    expect(hdWallet.getPath(2)).toBe(`m/44'/43'/2'/0'/0'`)
    expect(hdWallet.getPath(3)).toBe(`m/44'/43'/3'/0'/0'`)
    expect(hdWallet.getPath(4)).toBe(`m/44'/43'/4'/0'/0'`)
    expect(hdWallet.getPath(5)).toBe(`m/44'/43'/5'/0'/0'`)
    expect(hdWallet.getPath(6)).toBe(`m/44'/43'/6'/0'/0'`)
    expect(hdWallet.getPath(7)).toBe(`m/44'/43'/7'/0'/0'`)
    expect(hdWallet.getPath(8)).toBe(`m/44'/43'/8'/0'/0'`)
    expect(hdWallet.getPath(9)).toBe(`m/44'/43'/9'/0'/0'`)
  })

  it('should throw when incorrect params are provided', () => {
    expect(() => {hdWallet.getPath(null)}).toThrow();
    expect(() => {hdWallet.getPath(undefined)}).toThrow();
  })
})


describe('getAccountFromPathNumber', () => {
  it('should return proper addresses for a MIJIN_TEST account', () => {
    const account0 = hdWallet.getAccountFromPathNumber(hdAccountData.mnemonic, 0, hdAccount.networkType)
    expect(account0.address.plain()).toBe(hdAccount.wallets[0].address)

    const account1 = hdWallet.getAccountFromPathNumber(hdAccountData.mnemonic, 1, hdAccount.networkType)
    expect(account1.address.plain()).toBe(hdAccount.wallets[1].address)

    const account2 = hdWallet.getAccountFromPathNumber(hdAccountData.mnemonic, 2, hdAccount.networkType)
    expect(account2.address.plain()).toBe(hdAccount.wallets[2].address)

    const account3 = hdWallet.getAccountFromPathNumber(hdAccountData.mnemonic, 3, hdAccount.networkType)
    expect(account3.address.plain()).toBe(hdAccount.wallets[3].address)
  })
})


describe('getAccountFromPathNumber', () => {
  it('should return proper addresses for a TEST_NET account', () => {
    const account0 = hdWallet.getAccountFromPathNumber(hdAccountData.mnemonic, 0, hdAccountTestNet.networkType)
    expect(account0.address.plain()).toBe(hdAccountTestNet.wallets[0].address)

    const account1 = hdWallet.getAccountFromPathNumber(hdAccountData.mnemonic, 1, hdAccountTestNet.networkType)
    expect(account1.address.plain()).toBe(hdAccountTestNet.wallets[1].address)

    const account2 = hdWallet.getAccountFromPathNumber(hdAccountData.mnemonic, 2, hdAccountTestNet.networkType)
    expect(account2.address.plain()).toBe(hdAccountTestNet.wallets[2].address)

    const account3 = hdWallet.getAccountFromPathNumber(hdAccountData.mnemonic, 3, hdAccountTestNet.networkType)
    expect(account3.address.plain()).toBe(hdAccountTestNet.wallets[3].address)
  })
})


describe('randomizeMnemonicWordArray', () => {
  it('should shuffle an array of string', () => {
    const initialArray = ['a', 'b', 'c', 'd', 'e']
    let randomizedArray = hdWallet.randomizeMnemonicWordArray([...initialArray])
    expect(randomizedArray.length).toBe(initialArray.length)
    initialArray.forEach((word) => randomizedArray.splice(randomizedArray.indexOf(word), 1))
    expect(randomizedArray.length).toBe(0)
  })
})


describe('getNetworkFromNetworkType', () => {
  it('should return the correct Network when provided a valid NetworkType', () => {
    expect(hdWallet.getNetworkFromNetworkType(NetworkType.MIJIN_TEST)).toEqual(Network.CATAPULT)
    expect(hdWallet.getNetworkFromNetworkType(NetworkType.MIJIN)).toEqual(Network.CATAPULT)
    expect(hdWallet.getNetworkFromNetworkType(NetworkType.TEST_NET)).toEqual(Network.CATAPULT_PUBLIC)
    expect(hdWallet.getNetworkFromNetworkType(NetworkType.MAIN_NET)).toEqual(Network.CATAPULT_PUBLIC)
  })

  it('should throw when provided an invalid networkType', () => {
    expect(() => {hdWallet.getNetworkFromNetworkType(0)}).toThrow();
    expect(() => {hdWallet.getNetworkFromNetworkType(null)}).toThrow();
    expect(() => {hdWallet.getNetworkFromNetworkType(undefined)}).toThrow();
  })
})
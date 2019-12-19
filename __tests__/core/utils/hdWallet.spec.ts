import * as hdWallet from '@/core/utils/hdWallet.ts'

import {hdAccount, hdAccountData, hdAccountTestNet} from "@MOCKS/conf/conf"
import {NetworkType, Address} from 'nem2-sdk'
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

describe('getTenAddressesFromMnemonic', () => {
  it('should return 10 proper addresses for a TEST_NET account', () => {
    expect(hdWallet.getTenAddressesFromMnemonic(hdAccountData.mnemonic, hdAccount.networkType))
      .toEqual([
        Address.createFromRawAddress('SAJFKFAHB4UNEK4LJM76C7L5YMBSB74AKMSAXJJ7'),
        Address.createFromRawAddress('SCSAG54ILQGI3FYF66LQYXF4GLGZSKQD4MNAL7LD'),
        Address.createFromRawAddress('SDSHGSEXS2G2YCVJIUBZFWX2RJ6QMBEUZQJAVQXD'),
        Address.createFromRawAddress('SB5YAT47PX7S7NTDVZGH6DOWPCU6CSRQNSOATHOL'),
        Address.createFromRawAddress('SA26GLXILCYZP2ROF5GJBTQEGYRHXLH6MKYMGBVM'),
        Address.createFromRawAddress('SC6VUM5MDFE3VIRNYE5SF4HUW4CQGVAEC7TJXVTW'),
        Address.createFromRawAddress('SD5X3IEOITG6ACARHNK5FCPO3OKEW35LX2GN63MO'),
        Address.createFromRawAddress('SDDSZNKC5NSRUA7YHGNFGFSQOJ3IGV7XEHOB2IDF'),
        Address.createFromRawAddress('SBR25YXDXJXYER4C6VUNCGTJ4FXNFIIXY3G42P46'),
        Address.createFromRawAddress('SCIUGE27NJLXC3OJS54WICKHCACNLYKQCYLHP5TU'),
      ])
  })

  it('should return 10 proper addresses for a MIJIN_TEST account', () => {
    expect(hdWallet.getTenAddressesFromMnemonic(hdAccountData.mnemonic, hdAccountTestNet.networkType))
      .toEqual([
        Address.createFromRawAddress('TDI5MK645MRVXGEZF52J5OW25DCPNHXVQ5FEMLFR'),
        Address.createFromRawAddress('TA77TDXXSBEHTY72FPTFYNJGGUONJ2NT467YVE34'),
        Address.createFromRawAddress('TBV45KMJKBMIBMOSZ435FULAIC5HE7WFUJPJFRML'),
        Address.createFromRawAddress('TDJXJIDKOLX3WNI4EEGB54GLNB6BKJXTYTS5W76Y'),
        Address.createFromRawAddress('TCUKSN253F4OWYPDVZDCKIZN3ZHYIS4ZIN6ANHVW'),
        Address.createFromRawAddress('TB32PN7OACR35V7B6URPL7RY2FBKV5T3AG532O4E'),
        Address.createFromRawAddress('TB2JBDAG6KBMDDGECVASHGUONDA6XIU5CUF5WHUA'),
        Address.createFromRawAddress('TAPY4HAURO4SQMCZ5QPJPWAI5EVTIWMVJPRYK5M6'),
        Address.createFromRawAddress('TBT3M23LBTT5WFE75VLDLV2ALY3MGWKBMS7GDLUK'),
        Address.createFromRawAddress('TCYHXYZKBUVHK52L5N4D4F7PRHGBWGEGQ7EU2G3B'),
      ])
  })
})

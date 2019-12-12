import * as hdWallet from '@/core/utils/hdWallet.ts'

// @ts-ignore
import {hdAccount, hdAccountData, hdAccountTestNet} from "@@/mock/conf/conf.spec"
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
        Address.createFromRawAddress('SBEYUNT2UUBIYNYN4R43JL4CVJP4MD7YECJOKBC4'),
        Address.createFromRawAddress('SDLMJUJRUBX2D55PNZF53HKNYK34PPSQLOC7TN65'),
        Address.createFromRawAddress('SDYEFYSEPRJMDMNCSHNK73FF5AO6PHGEJVPBHDHZ'),
        Address.createFromRawAddress('SBMMMSA2S5BF75G2V2IUHXJCPDPIAGCLXCJ5TTGF'),
        Address.createFromRawAddress('SBURXG7XWQEWYZCPDGYRXKZAXNOFWPMO5BFM2RW5'),
        Address.createFromRawAddress('SANLUNBO44GBILU7HH2572JDORQ5KKQGPPXF6VUH'),
        Address.createFromRawAddress('SC2YVGWUGBJM3Y2CT75GRSLQPGOTYIIZYVEUYNE2'),
        Address.createFromRawAddress('SA2QRUVBBXYA7Y77YRD6XOF2R33EKRO57IJXANYO'),
        Address.createFromRawAddress('SADZE24RNZVWP5KOVO5X5KXAW2O4K3C3WLV6BF4I'),
        Address.createFromRawAddress('SCZBMP63WYMB6KXFQ5ERRXHYKUFH5BAOWX6C7HRD'),
      ])
  })

  it('should return 10 proper addresses for a MIJIN_TEST account', () => {
    expect(hdWallet.getTenAddressesFromMnemonic(hdAccountData.mnemonic, hdAccountTestNet.networkType))
      .toEqual([
        Address.createFromRawAddress('TCCKTZH5N4S23F25AKZHCCX3KHXKNHNLNMPTPP4T'),
        Address.createFromRawAddress('TAJPOQOKNAFFPBTOH5NC56747AX2PJ4RCTOVVBZ2'),
        Address.createFromRawAddress('TAYZHEPO6D4H65FITFWQJ37KCYNU44ZXAYJCFVHW'),
        Address.createFromRawAddress('TAYOVWWMGTKMWP7SKYBWKPIZZIZDJ3LHBRBLXWH3'),
        Address.createFromRawAddress('TCWXK7R6OEI3QKAMD7RRSA353DOECD3HXLOC4R35'),
        Address.createFromRawAddress('TD2WBCWVVA4OXZU63JRYLS64IOHIGG4CVXP4URMM'),
        Address.createFromRawAddress('TDRVI5TV3CXSIT7GC2OGINNFLNPH6FGBZLZTFJ5Q'),
        Address.createFromRawAddress('TDVEKBKVTFJPWOMG5HOWS6CWULM6DH3R572UZNJA'),
        Address.createFromRawAddress('TCSLZSX26RDB3QPZSUFPPZTRMZPAKBWCNCMNIE7X'),
        Address.createFromRawAddress('TAP4TGOH7MT6ADJMHG3BEXK56BRNVOJ74Q42SC5U'),
      ])
  })
})

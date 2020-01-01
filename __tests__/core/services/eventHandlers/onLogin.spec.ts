import {onLogin} from '@/core/services/eventHandlers/onLogin.ts'
import {setWalletsBalances} from '@/core/services'
import * as localStorage from '@/core/utils'
import {hdAccount} from "@MOCKS/index"
import {AppWallet, CurrentAccount} from '@/core/model'

const mockCommit = jest.fn()
const store = {
  commit: mockCommit,
}

jest.mock('@/core/utils')
jest.mock('@/core/services/')

describe('onLogin', () => {
  it('should throw when no data found in localStorage', () => {
    // @ts-ignore
    expect(() => {onLogin('accountName', store)}).toThrow()
  })

  it('should throw when account name not found in localStorage', () => {
    // @ts-ignore
    localStorage.localRead = () => JSON.stringify({notThisName: {}})
    // @ts-ignore
    expect(() => {onLogin('accountName', store)}).toThrow()
  })

  it('should throw when cannot parse data from localStorage', () => {
    // @ts-ignore
    localStorage.localRead = () => 'string'
    // @ts-ignore
    expect(() => {onLogin('accountName', store)}).toThrow()
  })

  it('should throw when no wallet found in localStorage', () => {
    // @ts-ignore
    localStorage.localRead = () => JSON.stringify({accountName: {}})
    // @ts-ignore
    expect(() => {onLogin('accountName', store)}).toThrow()
  })

  it('should not throw when more than one wallet was found in localStorage', () => {
    // @ts-ignore
    localStorage.localRead = () => JSON.stringify({testWallet: hdAccount})
    // @ts-ignore
    onLogin('testWallet', store)
    // @ts-ignore
    expect(mockCommit.mock.calls[0][0]).toBe('SET_WALLET_LIST')
    // @ts-ignore
    const hdAccountWallets = hdAccount.wallets.map(wallet => AppWallet.createFromDTO(wallet))
    expect(mockCommit.mock.calls[0][0]).toBe('SET_WALLET_LIST')
    expect(mockCommit.mock.calls[1][0]).toBe('SET_WALLET')
    expect(mockCommit.mock.calls[2][0]).toBe('SET_ACCOUNT_DATA')

    const resultWallets = mockCommit.mock.calls[0][1]
    resultWallets.forEach((item,index)=>{
      expect(hdAccountWallets[index].simpleWallet.address).toStrictEqual(item.simpleWallet.address)
      expect(hdAccountWallets[index].encryptedMnemonic).toStrictEqual(item.encryptedMnemonic)
      expect(hdAccountWallets[index].name).toStrictEqual(item.simpleWallet.name)
    })
    expect(mockCommit.mock.calls[1][1].simpleWallet.address).toStrictEqual(hdAccountWallets[0].simpleWallet.address)
    expect(mockCommit.mock.calls[1][1].encryptedMnemonic).toStrictEqual(hdAccountWallets[0].encryptedMnemonic)
    expect(mockCommit.mock.calls[1][1].name).toStrictEqual(hdAccountWallets[0].simpleWallet.name)

    const currentAccount = new CurrentAccount('testWallet', hdAccount.password, hdAccount.networkType)
    expect(mockCommit.mock.calls[2][1].name).toStrictEqual(currentAccount.name)
    expect(mockCommit.mock.calls[2][1].password).toStrictEqual(currentAccount.password)
    expect(mockCommit.mock.calls[2][1].networkType).toStrictEqual(currentAccount.networkType)

    expect(setWalletsBalances).toHaveBeenCalledTimes(1)
  })
})

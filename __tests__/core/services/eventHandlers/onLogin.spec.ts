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

  it('should throw when no wallet found in localStorage', () => {
    // @ts-ignore
    localStorage.localRead = () => JSON.stringify({testWallet: hdAccount})
    // @ts-ignore
    onLogin('testWallet', store)
    // @ts-ignore
    expect(mockCommit.mock.calls[0][0]).toBe('SET_WALLET_LIST')
    // @ts-ignore
    const hdAccountWallets = hdAccount.wallets.map(wallet => new AppWallet(wallet))
    expect(mockCommit.mock.calls[0][0]).toBe('SET_WALLET_LIST')
    expect(mockCommit.mock.calls[0][1]).toStrictEqual(hdAccountWallets)
    expect(mockCommit.mock.calls[1][0]).toBe('SET_WALLET')
    expect(mockCommit.mock.calls[1][1]).toStrictEqual(hdAccountWallets[0])
    expect(mockCommit.mock.calls[2][0]).toBe('SET_ACCOUNT_DATA')
    expect(mockCommit.mock.calls[2][1]).toStrictEqual(new CurrentAccount(
      'testWallet', hdAccount.password, hdAccount.networkType,
    ))
    expect(setWalletsBalances).toHaveBeenCalledTimes(1)
  })
})
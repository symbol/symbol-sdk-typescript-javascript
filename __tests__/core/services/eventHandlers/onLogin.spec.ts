import {onLogin} from '@/core/services/eventHandlers/onLogin.ts'
import {setWalletsBalances} from '@/core/services'
import {hdAccount} from "@MOCKS/index"
import {AppWallet, CurrentAccount} from '@/core/model'
import * as utils from '@/core/utils/utils'

const mockCommit = jest.fn()
const store = {
  commit: mockCommit,
}

jest.mock('@/core/utils')
jest.mock('@/core/services/')

describe('onLogin', () => {
  beforeEach(() => {
    // @ts-ignore
    setWalletsBalances.mockClear()
    mockCommit.mockClear()
  })

  it('should throw when no data found in localStorage', () => {
    // @ts-ignore
    expect(() => {onLogin('accountName', store)}).toThrow()
  })

  it('should throw when account name not found in localStorage', () => {
    jest.spyOn(utils, 'localRead').mockImplementation(() => JSON.stringify({notThisName: {}}))
    // @ts-ignore
    expect(() => {onLogin('accountName', store)}).toThrow()
  })

  it('should throw when cannot parse data from localStorage', () => {
    jest.spyOn(utils, 'localRead').mockImplementation(() => 'string')
    // @ts-ignore
    expect(() => {onLogin('accountName', store)}).toThrow()
  })

  it('should throw when no wallet found in localStorage', () => {
    jest.spyOn(utils, 'localRead').mockImplementation(() => JSON.stringify({accountName: {}}))
    // @ts-ignore
    expect(() => {onLogin('accountName', store)}).toThrow()
  })

  it('should initialize wallet and account data', () => {
    const accountMap = JSON.stringify({testWallet: hdAccount})
    jest.spyOn(utils, 'localRead').mockImplementationOnce(() => accountMap)

    // @ts-ignore
    onLogin('testWallet', store)
    expect(mockCommit.mock.calls[0][0]).toBe('SET_ACCOUNT_DATA')
    expect(mockCommit.mock.calls[0][1]).toStrictEqual(new CurrentAccount(
      'testWallet', hdAccount.password, hdAccount.networkType,
    ))
    expect(mockCommit.mock.calls[1][0]).toBe('SET_WALLET_LIST')
    expect(mockCommit.mock.calls[1][1]).toStrictEqual(hdAccount.wallets)
    expect(mockCommit.mock.calls[2][0]).toBe('SET_WALLET')
    expect(mockCommit.mock.calls[2][1].address).toBe(hdAccount.activeWalletAddress)
    expect(setWalletsBalances).toHaveBeenCalledTimes(1)
  })

  it('should initialize wallet and account data, when no activeWalletAddress is set', () => {
    const hdAccountNoActiveWalletAddress = {...hdAccount, activeWalletAddress: undefined}
    const accountMap = JSON.stringify({testWallet: hdAccountNoActiveWalletAddress})
    jest.spyOn(utils, 'localRead').mockImplementationOnce(() => accountMap)
    // @ts-ignore
    onLogin('testWallet', store)
    // @ts-ignore
    expect(mockCommit.mock.calls[0][0]).toBe('SET_ACCOUNT_DATA')
    expect(mockCommit.mock.calls[0][1]).toStrictEqual(new CurrentAccount(
      'testWallet', hdAccountNoActiveWalletAddress.password, hdAccountNoActiveWalletAddress.networkType,
    ))
    expect(mockCommit.mock.calls[1][0]).toBe('SET_WALLET_LIST')
    expect(mockCommit.mock.calls[1][1]).toStrictEqual(hdAccount.wallets)
    expect(mockCommit.mock.calls[2][0]).toBe('SET_WALLET')
    expect(mockCommit.mock.calls[2][1].address).toStrictEqual(hdAccount.wallets[0].address)
    expect(setWalletsBalances).toHaveBeenCalledTimes(1)
  })
})

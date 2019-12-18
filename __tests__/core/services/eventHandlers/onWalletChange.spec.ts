import {OnWalletChange} from '@/core/services/eventHandlers/onWalletChange.ts'
import {localRead} from '@/core/utils'
import { MultisigWallet, hdAccount,
  // @ts-ignore
} from '@@/mock/conf/conf.spec'
import flushPromises from 'flush-promises'
import {setMosaics, setNamespaces, setTransactionList} from '@/core/services'
import {Address} from 'nem2-sdk'

const mockCommit = jest.fn()
const mockSetAccountInfo = jest.fn()
const mockSetMultisigStatus = jest.fn()
const mockSwitchAddress = jest.fn()

jest.mock('@/core/services/mosaics/methods')
jest.mock('@/core/services/namespace/methods')
jest.mock('@/core/services/transactions')
jest.mock('@/core/utils')

MultisigWallet.setAccountInfo = mockSetAccountInfo
MultisigWallet.setMultisigStatus = mockSetMultisigStatus

const hdWallet = hdAccount.wallets[0]
hdWallet.setAccountInfo = mockSetAccountInfo
hdWallet.setMultisigStatus = mockSetMultisigStatus

const store = {
  commit: mockCommit,
  state: { account: {
    node: 'http://localhost:3000',
    wallet: hdWallet,
  },
  },
} 

const Listeners = {
  switchAddress: mockSwitchAddress,
}

describe('OnWalletChange', () => {
  beforeEach(async () => {
    mockCommit.mockClear()
    mockSetAccountInfo.mockClear()
    mockSetMultisigStatus.mockClear()
    // @ts-ignore
    setMosaics.mockClear()
    // @ts-ignore
    setNamespaces.mockClear()
    // @ts-ignore
    setTransactionList.mockClear()
    mockSwitchAddress.mockClear()
    // @ts-ignore
    localRead.mockClear()
  })

  it('should call all the methods', async (done) => {
    // @ts-ignore
    await OnWalletChange.trigger(store, Listeners, MultisigWallet)
    // @ts-ignore
    await flushPromises()
    expect(mockCommit.mock.calls[0][0]).toBe('SET_TRANSACTIONS_LOADING')
    expect(mockCommit.mock.calls[0][1]).toBe(true)
    expect(mockCommit.mock.calls[1][0]).toBe('SET_MOSAICS_LOADING')
    expect(mockCommit.mock.calls[1][1]).toBe(true)
    expect(mockCommit.mock.calls[2][0]).toBe('SET_NAMESPACE_LOADING')
    expect(mockCommit.mock.calls[2][1]).toBe(true)
    expect(mockCommit.mock.calls[3][0]).toBe('SET_MULTISIG_LOADING')
    expect(mockCommit.mock.calls[3][1]).toBe(true)
    expect(mockCommit.mock.calls[4][0]).toBe('RESET_TRANSACTION_LIST')
    expect(mockCommit.mock.calls[5][0]).toBe('RESET_MOSAICS')
    expect(mockCommit.mock.calls[6][0]).toBe('RESET_NAMESPACES')
    expect(mockSetAccountInfo).toHaveBeenCalledTimes(1)
    expect(mockSetMultisigStatus).toHaveBeenCalledTimes(1)
    expect(localRead).toHaveBeenCalledTimes(1)
    // @ts-ignore
    expect(localRead.mock.calls[0][0]).toBe(MultisigWallet.address)
    expect(setMosaics).toHaveBeenCalledTimes(1)
    expect(setNamespaces).toHaveBeenCalledTimes(1)
    expect(setTransactionList).toHaveBeenCalledTimes(1)
    expect(mockSwitchAddress).toHaveBeenCalledTimes(1)
    expect(mockSwitchAddress.mock.calls[0][0])
      .toEqual(Address.createFromRawAddress(MultisigWallet.address))
    expect(mockCommit.mock.calls[7][0]).toBe('SET_TRANSACTIONS_LOADING')
    expect(mockCommit.mock.calls[7][1]).toBe(false)
    expect(mockCommit.mock.calls[8][0]).toBe('SET_MOSAICS_LOADING')
    expect(mockCommit.mock.calls[8][1]).toBe(false)
    expect(mockCommit.mock.calls[9][0]).toBe('SET_NAMESPACE_LOADING')
    expect(mockCommit.mock.calls[9][1]).toBe(false)
    expect(mockCommit.mock.calls[10][0]).toBe('SET_MULTISIG_LOADING')
    expect(mockCommit.mock.calls[10][1]).toBe(false)
    done()
  })

  it('should use the wallet from the store when a wallet is not provided', async (done) => {
    // @ts-ignore
    await OnWalletChange.trigger(store, Listeners)
    await flushPromises()

    expect(localRead).toHaveBeenCalledTimes(1)
    // @ts-ignore
    expect(localRead.mock.calls[0][0]).toBe(hdWallet.address)
    expect(mockSwitchAddress).toHaveBeenCalledTimes(1)
    expect(mockSwitchAddress.mock.calls[0][0])
      .toEqual(Address.createFromRawAddress(hdWallet.address))
    done()
  })

  it('should return if no wallet available', async (done) => {
    const storeWithoutWallet = {...store}
    storeWithoutWallet.state.account.wallet = null
    // @ts-ignore
    await OnWalletChange.trigger(storeWithoutWallet, Listeners)
    await flushPromises()
    expect(mockCommit).toHaveBeenCalledTimes(0)
    done()
  })
})
import {OnWalletChange} from '@/core/services/eventHandlers/onWalletChange.ts'
import {localRead} from '@/core/utils'
import {MultisigWallet, hdAccount} from '@MOCKS/index'
import flushPromises from 'flush-promises'
import {setMosaics, setNamespaces, setTransactionList} from '@/core/services'
import {Address} from 'nem2-sdk'

const mockCommit = jest.fn()
const mockSetAccountInfo = (args) => {
  if (args.state.account.node === 'http://unkonwn.account:3000') {
    return {walletKnownByNetwork: false}
  }

  return {walletKnownByNetwork: true}
}

const mockSetMultisigStatus = jest.fn()
const mockSwitchAddress = jest.fn()
const mockSetPartialTransactions = jest.fn()

jest.mock('@/core/services/mosaics/methods')
jest.mock('@/core/services/namespace/methods')
jest.mock('@/core/services/transactions')
jest.mock('@/core/utils')

// @ts-ignore
MultisigWallet.setAccountInfo = (args) => mockSetAccountInfo(args)
// @ts-ignore
MultisigWallet.setMultisigStatus = mockSetMultisigStatus
// @ts-ignore
MultisigWallet.setPartialTransactions = mockSetPartialTransactions

const hdWallet = hdAccount.wallets[0]
// @ts-ignore
hdWallet.setAccountInfo = mockSetAccountInfo
// @ts-ignore
hdWallet.setMultisigStatus = mockSetMultisigStatus

const store = {
  commit: mockCommit,
  state: {
    account: {
      node: 'http://localhost:3000',
      wallet: hdWallet,
    },
    app: {
      listeners: {
        switchAddress: mockSwitchAddress,
      },
    },
  },
}

describe('OnWalletChange', () => {
  beforeEach(async () => {
    mockCommit.mockClear()
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
    mockSetPartialTransactions.mockClear()
  })

  it('should call all the methods', async (done) => {
    // @ts-ignore
    await OnWalletChange.trigger(store, MultisigWallet)
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
    expect(mockCommit.mock.calls[5][0]).toBe('RESET_TRANSACTIONS_TO_COSIGN')
    expect(mockCommit.mock.calls[6][0]).toBe('RESET_MOSAICS')
    expect(mockCommit.mock.calls[7][0]).toBe('RESET_NAMESPACES')
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
    expect(mockSetPartialTransactions).toHaveBeenCalledTimes(1)
    expect(mockCommit.mock.calls[8][0]).toBe('SET_TRANSACTIONS_LOADING')
    expect(mockCommit.mock.calls[8][1]).toBe(false)
    expect(mockCommit.mock.calls[9][0]).toBe('SET_MOSAICS_LOADING')
    expect(mockCommit.mock.calls[9][1]).toBe(false)
    expect(mockCommit.mock.calls[10][0]).toBe('SET_NAMESPACE_LOADING')
    expect(mockCommit.mock.calls[10][1]).toBe(false)
    expect(mockCommit.mock.calls[11][0]).toBe('SET_MULTISIG_LOADING')
    expect(mockCommit.mock.calls[11][1]).toBe(false)
    done()
  })

  it('should not call all the methods if the account is unknown by the network', async (done) => {
    const mockStore = store
    mockStore.state.account.node = 'http://unkonwn.account:3000'
    // @ts-ignore
    await OnWalletChange.trigger(mockStore, MultisigWallet)
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
    expect(mockCommit.mock.calls[5][0]).toBe('RESET_TRANSACTIONS_TO_COSIGN')
    expect(mockCommit.mock.calls[6][0]).toBe('RESET_MOSAICS')
    expect(mockCommit.mock.calls[7][0]).toBe('RESET_NAMESPACES')
    expect(mockSetMultisigStatus).toHaveBeenCalledTimes(0)
    expect(localRead).toHaveBeenCalledTimes(1)
    // @ts-ignore
    expect(localRead.mock.calls[0][0]).toBe(MultisigWallet.address)
    expect(setMosaics).toHaveBeenCalledTimes(0)
    expect(setNamespaces).toHaveBeenCalledTimes(0)
    expect(setTransactionList).toHaveBeenCalledTimes(0)
    expect(mockSwitchAddress).toHaveBeenCalledTimes(1)
    expect(mockSwitchAddress.mock.calls[0][0])
      .toEqual(Address.createFromRawAddress(MultisigWallet.address))
    expect(mockCommit.mock.calls[8][0]).toBe('SET_TRANSACTIONS_LOADING')
    expect(mockCommit.mock.calls[8][1]).toBe(false)
    expect(mockCommit.mock.calls[9][0]).toBe('SET_MOSAICS_LOADING')
    expect(mockCommit.mock.calls[9][1]).toBe(false)
    expect(mockCommit.mock.calls[10][0]).toBe('SET_NAMESPACE_LOADING')
    expect(mockCommit.mock.calls[10][1]).toBe(false)
    expect(mockCommit.mock.calls[11][0]).toBe('SET_MULTISIG_LOADING')
    expect(mockCommit.mock.calls[11][1]).toBe(false)
    done()
  })

  it('should use the wallet from the store when a wallet is not provided', async (done) => {
    // @ts-ignore
    await OnWalletChange.trigger(store)
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
    await OnWalletChange.trigger(storeWithoutWallet)
    await flushPromises()
    expect(mockCommit).toHaveBeenCalledTimes(0)
    done()
  })
})

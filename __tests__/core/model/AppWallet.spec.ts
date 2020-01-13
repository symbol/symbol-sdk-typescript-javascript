import {
  TransactionInfo, UInt64, Address, PublicAccount, NetworkType,
  SignedTransaction, CosignatureSignedTransaction, TransferTransaction,
  Deadline, Mosaic, MosaicId, PlainMessage, AggregateTransaction,
} from 'nem2-sdk'
import {AppWallet} from '@/core/model/AppWallet.ts'
import {from, throwError, of} from 'rxjs'
import {tap, map, catchError, mapTo} from 'rxjs/operators'
import {config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import {appState} from '@/store/app'
import {accountMutations, accountState} from '@/store/account'
import {networkConfig} from '@/config'
import VueRx from 'vue-rx'
import moment from 'vue-moment'
import {
  mosaicsLoading,
  multisigAccountInfo,
  mosaics,
  CosignWallet,
  hdAccount,
  networkCurrency,
  MultisigWallet,
} from '@MOCKS/index'
import Vue from 'vue'
const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(moment as any)
localVue.use(Vuex)
localVue.use(VueRx)
localVue.directive('focus', {
  inserted: function (el) {
    el.focus()
  },
})
import {Message} from '@/config'
import {Log, Notice, NoticeType, NetworkProperties} from '@/core/model'
jest.mock('@/core/model/Log')
jest.mock('@/core/model/Notice')

const mockErroredGetAccountsInfo = () => of('mock').pipe(
  mapTo(([])),
)

const mockGetAccountsInfo = () => of('mock').pipe(
  mapTo(([{
    importance: UInt64.fromUint(666),
    linkedAccountKey: networkConfig.EMPTY_PUBLIC_KEY,
  }])),
)

jest.mock('nem2-sdk/dist/src/infrastructure/AccountHttp', () => ({
  AccountHttp: jest.fn().mockImplementation(endpoint => {
    if (endpoint === 'http://errored.endpoint:3000') {
      return {getAccountsInfo: mockErroredGetAccountsInfo}
    }
    return {getAccountsInfo: mockGetAccountsInfo}
  }),
}))
// close warning
config.logModifiedComponents = false

describe('AppWallet', () => {
  let store
  beforeEach(() => {
    store = store = new Vuex.Store({
      modules: {
        account: {
          state: {
            ...Object.assign(accountState.state, {
              wallet: CosignWallet,
              mosaics,
              multisigAccountInfo,
            }),
          },
          mutations: accountMutations.mutations,
        },
        app: {
          state: Object.assign(appState.state, {mosaicsLoading}),
          mutations: {},
        },
      },
    })

    store.state.app.networkProperties = NetworkProperties.create(store)
  })

  it('AppWallet should instantiate properly hdWallet object from localStorage ', () => {
    const walletObject = hdAccount.wallets[0]
    const appWallet = AppWallet.createFromDTO(walletObject)
    expect(appWallet.simpleWallet.encryptedPrivateKey).toEqual(walletObject.simpleWallet.encryptedPrivateKey)
    expect(appWallet.simpleWallet.address).toEqual(walletObject.simpleWallet.address)
    expect(appWallet.name).toBe(walletObject.name)
    expect(appWallet.address).toBe(walletObject.address)
    expect(appWallet.publicKey).toBe(walletObject.publicKey)
    expect(appWallet.networkType).toBe(walletObject.networkType)
    expect(appWallet.path).toBe(walletObject.path)
    expect(appWallet.sourceType).toBe(walletObject.sourceType)
    expect(appWallet.encryptedMnemonic).toBe(walletObject.encryptedMnemonic)
  })

  it('gey publicAccount should return a public account', () => {
    const appWallet = AppWallet.createFromDTO(hdAccount.wallets[0])
    expect(appWallet.publicAccount).toEqual(
      PublicAccount.createFromPublicKey(appWallet.publicKey, appWallet.networkType),
    )
  })
})

const publicKey = '30CA0A8179477777AB3407611405EAAE6C4BA12156035E4DF8A73BD7651D6D9C'
const hash = 'CAD57FEC0C7F2106AD8A6203DA67EE675A1A3C232C676945306448DF5B4124F8'
const hash2 = '33BC60F52A98C0BF83F523E022BE58EEF7A674B89BC76BA6FCE4C499DF235058'
const generationHash = '72B08ACF80558B285EADA206BB1226A44038C65AC4649108B2284591641657B5'

describe('announceTransaction', () => {
  const appWallet = AppWallet.createFromDTO(hdAccount.wallets[0])

  const store = 'mock store'
  const announceNormalMock = jest.fn()
  const announceBondedMock = jest.fn()
  const announceCosignatureMock = jest.fn()
  appWallet.announceNormal = announceNormalMock
  appWallet.announceBonded = announceBondedMock
  appWallet.announceCosignature = announceCosignatureMock

  beforeEach(() => {
    announceNormalMock.mockClear()
    announceBondedMock.mockClear()
    announceCosignatureMock.mockClear()
  })

  it('should call announce normal with the proper arguments', () => {
    const signedTransaction = new SignedTransaction('', hash, publicKey, 1, NetworkType.TEST_NET)

    // @ts-ignore
    appWallet.announceTransaction(signedTransaction, store)
    expect(announceNormalMock).toHaveBeenCalledTimes(1)
    expect(announceBondedMock).toHaveBeenCalledTimes(0)
    expect(announceCosignatureMock).toHaveBeenCalledTimes(0)
    expect(announceNormalMock.mock.calls[0][0]).toEqual(signedTransaction)
    expect(announceNormalMock.mock.calls[0][1]).toEqual(store)
  })

  it('should call announce cosignature when signedTransaction is a CosignatureSignedTransaction', () => {
    const cosignatureSignedTransaction = new CosignatureSignedTransaction(generationHash, '', publicKey)

    // @ts-ignore
    appWallet.announceTransaction(cosignatureSignedTransaction, store)
    expect(announceNormalMock).toHaveBeenCalledTimes(0)
    expect(announceBondedMock).toHaveBeenCalledTimes(0)
    expect(announceCosignatureMock).toHaveBeenCalledTimes(1)
    expect(announceCosignatureMock.mock.calls[0][0]).toEqual(cosignatureSignedTransaction)
    expect(announceCosignatureMock.mock.calls[0][1]).toEqual(store)
  })

  it('should call announce bonded with the proper arguments when a signedLock is provided', () => {
    const signedTransaction1 = new SignedTransaction('signedTransaction1', hash, publicKey, 1, NetworkType.TEST_NET)
    const signedTransaction2 = new SignedTransaction('signedTransaction2', hash, publicKey, 1, NetworkType.TEST_NET)

    // @ts-ignore
    appWallet.announceTransaction(signedTransaction1, store, signedTransaction2)
    expect(announceNormalMock).toHaveBeenCalledTimes(0)
    expect(announceBondedMock).toHaveBeenCalledTimes(1)
    expect(announceCosignatureMock).toHaveBeenCalledTimes(0)
    expect(announceBondedMock.mock.calls[0][0]).toEqual(signedTransaction1)
    expect(announceBondedMock.mock.calls[0][1]).toEqual(signedTransaction2)
    expect(announceBondedMock.mock.calls[0][2]).toEqual(store)
  })
})

import {TransactionHttp} from 'nem2-sdk/dist/src/infrastructure/TransactionHttp'
import {Listener} from 'nem2-sdk/dist/src/infrastructure/Listener'
import flushPromises from 'flush-promises'
const mockAnnounceAggregateBondedCosignatureCall = jest.fn()
const mockAnnounceCall = jest.fn()
const mockConfirmedCall = jest.fn()
const mockAnnounceAggregateBondedCall = jest.fn()
const mockCommit = jest.fn()
const mockTriggerNotice = jest.fn()
const mockLogCreate = jest.fn()
Log.create = mockLogCreate
Notice.trigger = mockTriggerNotice

const mockAnnounceAggregateBondedCosignature = (...args) => from(args).pipe(
  tap(args => mockAnnounceAggregateBondedCosignatureCall(args)),
  map(args => {
    if (args === 'throw') throw new Error('I threw an error')
    return args
  }),
  catchError((error) => throwError(error)),
)

const mockAnnounce = (...args) => from(args).pipe(
  tap(args => mockAnnounceCall(args)),
  map(args => {
    if (args === 'throw') throw new Error('I threw an error')
    return args
  }),
  catchError((error) => throwError(error)),
)

const mockAnnounceAggregateBonded = (...args) => from(args).pipe(
  tap(args => mockAnnounceAggregateBondedCall(args)),
  map(args => {
    if (args === 'throw') throw new Error('I threw an error')
    return args
  }),
  catchError((error) => throwError(error)),
)

const signedLockWithInfo = new SignedTransaction('signed lock', hash2, publicKey, 1, NetworkType.TEST_NET)
// @ts-ignore
signedLockWithInfo.transactionInfo = new TransactionInfo(UInt64.fromUint(0), 0, '', hash2)

const mockListenerOpen = () => Promise.resolve()

const mockConfirmed = (...address) => from(address).pipe(
  tap(address => mockConfirmedCall(address)),
  mapTo(signedLockWithInfo),
)

jest.mock('nem2-sdk/dist/src/infrastructure/TransactionHttp', () => ({
  TransactionHttp: jest.fn().mockImplementation(() => ({
    announceAggregateBondedCosignature: mockAnnounceAggregateBondedCosignature,
    announce: mockAnnounce,
    announceAggregateBonded: mockAnnounceAggregateBonded,
  })),
}))

jest.mock('nem2-sdk/dist/src/infrastructure/Listener', () => ({
  Listener: jest.fn().mockImplementation(() => ({
    open: mockListenerOpen,
    confirmed: mockConfirmed,
  })),
}))

describe('valid transactions announces', () => {
  beforeEach(() => {
    mockAnnounceAggregateBondedCosignatureCall.mockClear()
    mockAnnounceCall.mockClear()
    mockCommit.mockClear()
    mockTriggerNotice.mockClear()
    // @ts-ignore
    TransactionHttp.mockClear()
    mockLogCreate.mockClear()
  })

  const appWallet = AppWallet.createFromDTO(hdAccount.wallets[0])
  const cosignatureSignedTransaction = new CosignatureSignedTransaction(hash, '', publicKey)
  const signedTransaction = new SignedTransaction('signed tx', hash, publicKey, 1, NetworkType.TEST_NET)
  const store = {
    state: {account: {node: 'http://localhost:3000'}},
    commit: mockCommit,
  }

  it('announceCosignature', async (done) => {
    // @ts-ignore
    appWallet.announceCosignature(cosignatureSignedTransaction, store)

    await Vue.nextTick()
    expect(TransactionHttp).toHaveBeenCalledTimes(1)
    expect(mockAnnounceAggregateBondedCosignatureCall).toHaveBeenCalledTimes(1)
    expect(mockAnnounceAggregateBondedCosignatureCall.mock.calls[0][0]).toBe(cosignatureSignedTransaction)
    expect(mockCommit).toHaveBeenCalledTimes(1)
    expect(mockCommit.mock.calls[0][0]).toBe('POP_TRANSACTION_TO_COSIGN_BY_HASH')
    expect(mockCommit.mock.calls[0][1]).toBe(hash)
    expect(mockTriggerNotice.mock.calls[0][0]).toBe(Message.SUCCESS)
    expect(mockTriggerNotice.mock.calls[0][1]).toBe(NoticeType.success)
    expect(mockTriggerNotice.mock.calls[0][2]).toEqual(store)
    expect(mockLogCreate).toHaveBeenCalledTimes(1)
    expect(mockLogCreate.mock.calls[0][0]).toBe('announceCosignature')
    expect(mockLogCreate.mock.calls[0][1]).toEqual(cosignatureSignedTransaction)
    expect(mockLogCreate.mock.calls[0][2]).toEqual(store)
    done()
  })

  it('announceNormal', async (done) => {
    // @ts-ignore
    appWallet.announceNormal(signedTransaction, store)

    await Vue.nextTick()
    expect(TransactionHttp).toHaveBeenCalledTimes(1)
    expect(mockAnnounceCall).toHaveBeenCalledTimes(1)
    expect(mockAnnounceCall.mock.calls[0][0]).toBe(signedTransaction)
    expect(mockTriggerNotice.mock.calls[0][0]).toBe(Message.SUCCESS)
    expect(mockTriggerNotice.mock.calls[0][1]).toBe(NoticeType.success)
    expect(mockTriggerNotice.mock.calls[0][2]).toEqual(store)
    expect(mockLogCreate).toHaveBeenCalledTimes(1)
    expect(mockLogCreate.mock.calls[0][0]).toBe('announceNormal')
    expect(mockLogCreate.mock.calls[0][1]).toEqual(signedTransaction)
    expect(mockLogCreate.mock.calls[0][2]).toEqual(store)
    done()
  })

  it('announceBonded', async (done) => {
    // @ts-ignore
    appWallet.announceBonded(signedTransaction, signedLockWithInfo, store)

    await flushPromises()
    await Vue.nextTick()
    await Vue.nextTick()
    expect(TransactionHttp).toHaveBeenCalledTimes(1)
    expect(mockAnnounceCall).toHaveBeenCalledTimes(1)
    expect(mockAnnounceCall.mock.calls[0][0]).toBe(signedLockWithInfo)
    expect(mockTriggerNotice).toHaveBeenCalledTimes(2)
    expect(mockTriggerNotice.mock.calls[0][0]).toBe(Message.SUCCESS)
    expect(mockTriggerNotice.mock.calls[0][1]).toBe(NoticeType.success)
    expect(mockTriggerNotice.mock.calls[0][2]).toEqual(store)
    expect(mockTriggerNotice.mock.calls[1][0]).toBe(Message.SUCCESS)
    expect(mockTriggerNotice.mock.calls[1][1]).toBe(NoticeType.success)
    expect(mockTriggerNotice.mock.calls[1][2]).toEqual(store)
    expect(Listener).toHaveBeenCalledTimes(1)
    expect(mockConfirmedCall).toHaveBeenCalledTimes(1)
    expect(mockConfirmedCall.mock.calls[0][0]).toEqual(Address.createFromRawAddress(appWallet.address))
    expect(mockAnnounceAggregateBondedCall).toHaveBeenCalledTimes(1)
    expect(mockAnnounceAggregateBondedCall.mock.calls[0][0]).toEqual(signedTransaction)
    expect(mockLogCreate).toHaveBeenCalledTimes(1)
    expect(mockLogCreate.mock.calls[0][0]).toBe('announceBonded')
    expect(mockLogCreate.mock.calls[0][1]).toEqual({signedTransaction, signedLock: signedLockWithInfo})
    expect(mockLogCreate.mock.calls[0][2]).toEqual(store)
    done()
  })
})


describe('invalid transactions announces', () => {
  Notice.trigger = mockTriggerNotice
  beforeEach(() => {
    mockAnnounceAggregateBondedCosignatureCall.mockClear()
    mockAnnounceCall.mockClear()
    mockCommit.mockClear()
    mockTriggerNotice.mockClear()
    // @ts-ignore
    TransactionHttp.mockClear()
    mockLogCreate.mockClear()
  })

  const appWallet = AppWallet.createFromDTO(hdAccount.wallets[0])

  const store = {
    state: {account: {node: 'http://localhost:3000'}, app: {}},
    commit: mockCommit,
  }

  // @ts-ignore
  store.state.app.networkProperties = NetworkProperties.create(store)

  it('announceCosignature', async (done) => {
    // @ts-ignore
    appWallet.announceCosignature('throw', store)

    await Vue.nextTick()
    expect(TransactionHttp).toHaveBeenCalledTimes(1)
    expect(mockAnnounceAggregateBondedCosignatureCall).toHaveBeenCalledTimes(1)
    expect(mockAnnounceAggregateBondedCosignatureCall.mock.calls[0][0]).toBe('throw')
    expect(mockCommit).toHaveBeenCalledTimes(0)
    expect(mockLogCreate).toHaveBeenCalledTimes(2)
    expect(mockLogCreate.mock.calls[0][0]).toBe('announceCosignature')
    expect(mockLogCreate.mock.calls[0][1]).toBe('throw')
    expect(mockLogCreate.mock.calls[0][2]).toEqual(store)
    expect(mockLogCreate.mock.calls[1][0]).toBe('announceCosignature -> error')
    expect(mockLogCreate.mock.calls[1][1]).not.toBe(undefined)
    expect(mockLogCreate.mock.calls[1][2]).toEqual(store)
    done()
  })

  it('announceNormal', async (done) => {
    // @ts-ignore
    appWallet.announceNormal('throw', store)

    await Vue.nextTick()
    expect(TransactionHttp).toHaveBeenCalledTimes(1)
    expect(mockAnnounceCall).toHaveBeenCalledTimes(1)
    expect(mockAnnounceCall.mock.calls[0][0]).toBe('throw')
    expect(mockCommit).toHaveBeenCalledTimes(0)
    expect(mockLogCreate).toHaveBeenCalledTimes(2)
    expect(mockLogCreate.mock.calls[0][0]).toBe('announceNormal')
    expect(mockLogCreate.mock.calls[0][1]).toBe('throw')
    expect(mockLogCreate.mock.calls[0][2]).toEqual(store)
    expect(mockLogCreate.mock.calls[1][0]).toBe('announceNormal -> error')
    expect(mockLogCreate.mock.calls[1][1]).not.toBe(undefined)
    expect(mockLogCreate.mock.calls[1][2]).toEqual(store)
    done()
  })

  it('announceBonded, error announcing lock', async (done) => {
    const signedTransaction = new SignedTransaction('signed tx', hash, publicKey, 1, NetworkType.TEST_NET)

    // @ts-ignore
    appWallet.announceBonded(signedTransaction, 'throw', store)

    await flushPromises()
    await Vue.nextTick()
    expect(TransactionHttp).toHaveBeenCalledTimes(1)
    expect(mockAnnounceCall).toHaveBeenCalledTimes(1)
    expect(mockAnnounceCall.mock.calls[0][0]).toBe('throw')
    expect(mockLogCreate).toHaveBeenCalledTimes(2)
    expect(mockLogCreate.mock.calls[0][0]).toBe('announceBonded')
    expect(mockLogCreate.mock.calls[0][1]).toEqual({signedTransaction, signedLock: 'throw'})
    expect(mockLogCreate.mock.calls[0][2]).toEqual(store)
    expect(mockLogCreate.mock.calls[1][0]).toBe('announceBonded -> error')
    expect(mockLogCreate.mock.calls[1][1]).not.toBe(undefined)
    expect(mockLogCreate.mock.calls[1][2]).toEqual(store)
    done()
  })

  it('announceBonded, error announcing aggregate', async (done) => {
    // @ts-ignore
    appWallet.announceBonded('throw', signedLockWithInfo, store)

    await flushPromises()
    await Vue.nextTick()
    expect(TransactionHttp).toHaveBeenCalledTimes(1)
    expect(mockAnnounceCall).toHaveBeenCalledTimes(1)
    expect(mockAnnounceCall.mock.calls[0][0]).toBe(signedLockWithInfo)
    expect(mockLogCreate).toHaveBeenCalledTimes(2)
    expect(mockLogCreate.mock.calls[0][0]).toBe('announceBonded')
    expect(mockLogCreate.mock.calls[0][1]).toEqual({signedTransaction: 'throw', signedLock: signedLockWithInfo})
    expect(mockLogCreate.mock.calls[0][2]).toEqual(store)
    expect(mockLogCreate.mock.calls[1][0]).toBe('announceBonded -> error')
    expect(mockLogCreate.mock.calls[1][1]).not.toBe(undefined)
    expect(mockLogCreate.mock.calls[1][2]).toEqual(store)
    done()
  })
})


describe('getSignedLockAndAggregateTransaction', () => {
  const appWallet = AppWallet.createFromDTO(hdAccount.wallets[0])
  const store = {state: {account: {networkCurrency, generationHash: hash}, app: {}}}

  // @ts-ignore
  store.state.app.networkProperties = NetworkProperties.create(store)
  // @ts-ignore
  store.state.app.networkProperties.generationHash = 'CAD57FEC0C7F2106AD8A6203DA67EE675A1A3C232C676945306448DF5B4124F8'

  const transaction = TransferTransaction.create(
    Deadline.create(),
    Address.createFromRawAddress('SBIWHDWZMPIXXM2BINCRXAK3H3MGA5VHB3D2PO5W'),
    [new Mosaic(new MosaicId(networkCurrency.hex), UInt64.fromUint(0))],
    PlainMessage.create(''),
    NetworkType.MIJIN_TEST,
  )

  const aggregateTransaction = AggregateTransaction.createBonded(
    Deadline.create(),
    [transaction.toAggregate(PublicAccount
      .createFromPublicKey(publicKey, NetworkType.MIJIN_TEST))],
    NetworkType.MIJIN_TEST,
    [],
  )

  it('should return a signedTransaction and an signedLock', () => {
    const {signedTransaction, signedLock} = appWallet.getSignedLockAndAggregateTransaction(
      aggregateTransaction,
      1,
      'password',
      // @ts-ignore
      store,
    )

    expect(signedTransaction).toBeInstanceOf(SignedTransaction)
    expect(signedTransaction.networkType).toBe(NetworkType.MIJIN_TEST)
    expect(signedTransaction.signerPublicKey).toBe(appWallet.publicKey)
    expect(signedLock).toBeInstanceOf(SignedTransaction)
    expect(signedLock.networkType).toBe(NetworkType.MIJIN_TEST)
    expect(signedLock.signerPublicKey).toBe(appWallet.publicKey)
    expect(signedTransaction).not.toEqual(signedLock)
  })
})

describe('SetAccountInfo', () => {
  it('should set properties and update the wallet', async (done) => {
    const appWallet = new AppWallet(MultisigWallet)
    const mockUpdateWallet = jest.fn()
    const mockStore = {
      state: {
        account: {
          node: 'http://valid.node:3000',
          wallet: {
            address: MultisigWallet.address,
          },
        },
      },
    }

    appWallet.updateWallet = mockUpdateWallet

    // @ts-ignore
    await appWallet.setAccountInfo(mockStore)
    expect(mockUpdateWallet).toHaveBeenCalledTimes(1)
    done()
  })

  it('should throw when wallet is unknown to the network', async (done) => {
    const appWallet = new AppWallet(MultisigWallet)
    const mockStore = {
      state: {
        account: {
          node: 'http://errored.endpoint:3000',
          wallet: {
            address: MultisigWallet.address,
          },
        },
      },
    }
    // @ts-ignore
    expect(appWallet.setAccountInfo(mockStore)).rejects.toThrow()
    done()
  })
})

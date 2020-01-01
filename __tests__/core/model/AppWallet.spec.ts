
import {AppWallet} from '@/core/model/AppWallet.ts'
import {from, throwError} from 'rxjs'
import {tap, map, catchError, mapTo} from 'rxjs/operators'
import * as sdk from 'nem2-sdk'
import {config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import {appState} from '@/store/app'
import {accountMutations, accountState} from '@/store/account'
import VueRx from "vue-rx"
import moment from 'vue-moment'
import {
    mosaicsLoading,
    multisigAccountInfo,
    mosaics,
    CosignWallet,
    hdAccount,
    networkCurrency,
} from "@MOCKS/index"
import Vue from 'vue'
const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(moment as any)
localVue.use(Vuex)
localVue.use(VueRx)
localVue.directive('focus', {
    inserted: function (el, binding) {
        el.focus()
    }
})
import {Message} from '@/config'
import {Log, Notice, NoticeType, NetworkProperties} from '@/core/model'
jest.mock('@/core/model/Log')
jest.mock('@/core/model/Notice')

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
                    mutations: accountMutations.mutations
                },
                app: {
                    state: Object.assign(appState.state, {mosaicsLoading}),
                    mutations: {}
                }
            }
        })

        store.state.app.NetworkProperties = NetworkProperties.create(store)
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
        expect(appWallet.balance).toBe(walletObject.balance)
    })

    it('createAndStoreRemoteAccount should throw if the password provided is not correct', () => {
        const appWallet = AppWallet.createFromDTO(hdAccount.wallets[0])
        expect(() => {
            appWallet.createAndStoreRemoteAccount('wrong password', '', store)
        }).toThrowError();
    })

    it('createAndStoreRemoteAccount should throw if the privateKey is invalid', () => {
        const invalidPrivateKey = '4546C6EC07DC5884AC2581063FBC3A7C970306EB3D234C65893CC7E3FE8A4062'
        const appWallet = AppWallet.createFromDTO(hdAccount.wallets[0])
        expect(() => {
            appWallet.createAndStoreRemoteAccount('wrong password', invalidPrivateKey, store)
        }).toThrowError();
    })

    it('createAndStoreRemoteAccount should create a RemoteAccount object when importing an account', () => {
        const privateKey = '4546C6EC07DC5884AC2581063FBC3A7C970306EB3D234C65893CC7E3FE8A4062'
        const address = 'SDO7L5Q4URACE732MCFC7XKKW3KKXCCLN73R2KJ5'
        const updateWalletMock = jest.fn()
        const appWallet = AppWallet.createFromDTO(hdAccount.wallets[0])
        appWallet.updateWallet = updateWalletMock

        const returnedPrivatekey = appWallet
            .createAndStoreRemoteAccount('password', privateKey, store)

        expect(appWallet.remoteAccount.publicKey.length).toBe(64)
        expect(appWallet.remoteAccount.simpleWallet).toBeInstanceOf(sdk.SimpleWallet)
        expect(appWallet.remoteAccount.simpleWallet.address.plain()).toBe(address)
        expect(updateWalletMock).toHaveBeenCalled()
        expect(returnedPrivatekey).toBe(returnedPrivatekey)
    })

    it('createAndStoreRemoteAccount should create a RemoteAccount object when creating an account', () => {
        const updateWalletMock = jest.fn()
        const appWallet = AppWallet.createFromDTO(hdAccount.wallets[0])
        appWallet.updateWallet = updateWalletMock

        const returnedPrivatekey = appWallet
            .createAndStoreRemoteAccount('password', false, store)

        expect(appWallet.remoteAccount.publicKey.length).toBe(64)
        expect(appWallet.remoteAccount.simpleWallet).toBeInstanceOf(sdk.SimpleWallet)
        expect(updateWalletMock).toHaveBeenCalled()
        expect(returnedPrivatekey.length).toBe(64)
    })

    it('createAndStoreRemoteAccount should throw if not matching an already linked remotePublicKey', () => {
        const privateKey = '4546C6EC07DC5884AC2581063FBC3A7C970306EB3D234C65893CC7E3FE8A4062'
        const publicKey = '7772FD51AB2B2182D37E5F05EDAAD5DD97DAC2870F9132350F7AF317460B9174'
        const updateWalletMock = jest.fn()
        const appWallet = AppWallet.createFromDTO(hdAccount.wallets[0])

        appWallet.linkedAccountKey = publicKey
        appWallet.updateWallet = updateWalletMock

        expect(() => {
            appWallet.createAndStoreRemoteAccount('wrong password', privateKey, store)
        }).toThrowError();
    })

    it('getRemoteAccountPrivateKey should return remote account private key', () => {
        const privateKey = '4546C6EC07DC5884AC2581063FBC3A7C970306EB3D234C65893CC7E3FE8A4062'
        const updateWalletMock = jest.fn()
        const appWallet = AppWallet.createFromDTO(hdAccount.wallets[0])
        appWallet.updateWallet = updateWalletMock

        appWallet.createAndStoreRemoteAccount('password', privateKey, store)
        const returnedPrivateKey = appWallet.getRemoteAccountPrivateKey('password')
        expect(returnedPrivateKey).toBe(privateKey)
    })

    it('getRemoteAccountPrivateKey should throw when provided a wrong password', () => {
        const privateKey = '4546C6EC07DC5884AC2581063FBC3A7C970306EB3D234C65893CC7E3FE8A4062'
        const updateWalletMock = jest.fn()
        const appWallet = AppWallet.createFromDTO(hdAccount.wallets[0])
        appWallet.updateWallet = updateWalletMock

        appWallet.createAndStoreRemoteAccount('password', privateKey, store)
        expect(() => {
            appWallet.getRemoteAccountPrivateKey('wrong password')
        }).toThrowError();
    })

    it('getRemoteAccountPrivateKey should throw when wallet has no remoteAccount', () => {
        const appWallet = AppWallet.createFromDTO(hdAccount.wallets[0])
        appWallet.remoteAccount = null
        expect(() => {
            appWallet.getRemoteAccountPrivateKey('password')
        }).toThrowError();
    })

    it('gey publicAccount should return a public account', () => {
        const appWallet = AppWallet.createFromDTO(hdAccount.wallets[0])
        expect(appWallet.publicAccount).toEqual(PublicAccount.createFromPublicKey(appWallet.publicKey, appWallet.networkType))
    })
})

const publicKey = '30CA0A8179477777AB3407611405EAAE6C4BA12156035E4DF8A73BD7651D6D9C'
const hash = 'CAD57FEC0C7F2106AD8A6203DA67EE675A1A3C232C676945306448DF5B4124F8'
const hash2 = '33BC60F52A98C0BF83F523E022BE58EEF7A674B89BC76BA6FCE4C499DF235058'
const generationHash = '72B08ACF80558B285EADA206BB1226A44038C65AC4649108B2284591641657B5'

describe('announceTransaction', () => {
    const appWallet = AppWallet.createFromDTO(hdAccount.wallets[0])

    const store = 'mock store'
    let announceNormalMock = jest.fn()
    let announceBondedMock = jest.fn()
    let announceCosignatureMock = jest.fn()
    appWallet.announceNormal = announceNormalMock
    appWallet.announceBonded = announceBondedMock
    appWallet.announceCosignature = announceCosignatureMock

    beforeEach(() => {
        announceNormalMock.mockClear()
        announceBondedMock.mockClear()
        announceCosignatureMock.mockClear()
    })

    it('should call announce normal with the proper arguments', () => {
        const signedTransaction = new sdk.SignedTransaction('', hash, publicKey, 1, sdk.NetworkType.TEST_NET)

        // @ts-ignore
        appWallet.announceTransaction(signedTransaction, store)
        expect(announceNormalMock).toHaveBeenCalledTimes(1)
        expect(announceBondedMock).toHaveBeenCalledTimes(0)
        expect(announceCosignatureMock).toHaveBeenCalledTimes(0)
        expect(announceNormalMock.mock.calls[0][0]).toEqual(signedTransaction)
        expect(announceNormalMock.mock.calls[0][1]).toEqual(store)
    });

    it('should call announce cosignature when signedTransaction is a CosignatureSignedTransaction', () => {
        const cosignatureSignedTransaction = new sdk.CosignatureSignedTransaction(generationHash, '', publicKey)

        // @ts-ignore
        appWallet.announceTransaction(cosignatureSignedTransaction, store)
        expect(announceNormalMock).toHaveBeenCalledTimes(0)
        expect(announceBondedMock).toHaveBeenCalledTimes(0)
        expect(announceCosignatureMock).toHaveBeenCalledTimes(1)
        expect(announceCosignatureMock.mock.calls[0][0]).toEqual(cosignatureSignedTransaction)
        expect(announceCosignatureMock.mock.calls[0][1]).toEqual(store)
    });

    it('should call announce bonded with the proper arguments when a signedLock is provided', () => {
        const signedTransaction1 = new sdk.SignedTransaction('signedTransaction1', hash, publicKey, 1, sdk.NetworkType.TEST_NET)
        const signedTransaction2 = new sdk.SignedTransaction('signedTransaction2', hash, publicKey, 1, sdk.NetworkType.TEST_NET)

        // @ts-ignore
        appWallet.announceTransaction(signedTransaction1, store, signedTransaction2)
        expect(announceNormalMock).toHaveBeenCalledTimes(0)
        expect(announceBondedMock).toHaveBeenCalledTimes(1)
        expect(announceCosignatureMock).toHaveBeenCalledTimes(0)
        expect(announceBondedMock.mock.calls[0][0]).toEqual(signedTransaction1)
        expect(announceBondedMock.mock.calls[0][1]).toEqual(signedTransaction2)
        expect(announceBondedMock.mock.calls[0][2]).toEqual(store)
    });
});

import {TransactionHttp} from 'nem2-sdk/dist/src/infrastructure/TransactionHttp'
import {Listener} from 'nem2-sdk/dist/src/infrastructure/Listener'
import {TransactionInfo, UInt64, Address, PublicAccount, NetworkType} from 'nem2-sdk'
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

const signedLockWithInfo = new sdk.SignedTransaction('signed lock', hash2, publicKey, 1, sdk.NetworkType.TEST_NET)
// @ts-ignore
signedLockWithInfo.transactionInfo = new TransactionInfo(UInt64.fromUint(0), 0, '', hash2)

const mockListenerOpen = () => Promise.resolve()

const mockConfirmed = (...address) => from(address).pipe(
    tap(address => mockConfirmedCall(address)),
    mapTo(signedLockWithInfo)
)

jest.mock('nem2-sdk/dist/src/infrastructure/TransactionHttp', () => ({
    TransactionHttp: jest.fn().mockImplementation(() => ({
        announceAggregateBondedCosignature: mockAnnounceAggregateBondedCosignature,
        announce: mockAnnounce,
        announceAggregateBonded: mockAnnounceAggregateBonded,
    }))
}))

jest.mock('nem2-sdk/dist/src/infrastructure/Listener', () => ({
    Listener: jest.fn().mockImplementation(() => ({
        open: mockListenerOpen,
        confirmed: mockConfirmed,
    }))
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
    const cosignatureSignedTransaction = new sdk.CosignatureSignedTransaction(hash, '', publicKey)
    const signedTransaction = new sdk.SignedTransaction('signed tx', hash, publicKey, 1, sdk.NetworkType.TEST_NET)
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
    store.state.app.NetworkProperties = NetworkProperties.create(store)

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
        const signedTransaction = new sdk.SignedTransaction('signed tx', hash, publicKey, 1, sdk.NetworkType.TEST_NET)

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
    store.state.app.NetworkProperties = NetworkProperties.create(store)
    // @ts-ignore
    store.state.app.NetworkProperties.generationHash = 'CAD57FEC0C7F2106AD8A6203DA67EE675A1A3C232C676945306448DF5B4124F8'

    const transaction = sdk.TransferTransaction.create(
        sdk.Deadline.create(),
        sdk.Address.createFromRawAddress('SBIWHDWZMPIXXM2BINCRXAK3H3MGA5VHB3D2PO5W'),
        [new sdk.Mosaic(new sdk.MosaicId([2429385668, 814683207]), new UInt64([0, 0]))],
        sdk.PlainMessage.create(''),
        sdk.NetworkType.MIJIN_TEST,
    )

    const aggregateTransaction = sdk.AggregateTransaction.createBonded(
        sdk.Deadline.create(),
        [transaction.toAggregate(PublicAccount
            .createFromPublicKey(publicKey, sdk.NetworkType.MIJIN_TEST))],
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

        expect(signedTransaction).toBeInstanceOf(sdk.SignedTransaction)
        expect(signedTransaction.networkType).toBe(sdk.NetworkType.MIJIN_TEST)
        expect(signedTransaction.signerPublicKey).toBe(appWallet.publicKey)
        expect(signedLock).toBeInstanceOf(sdk.SignedTransaction)
        expect(signedLock.networkType).toBe(sdk.NetworkType.MIJIN_TEST)
        expect(signedLock.signerPublicKey).toBe(appWallet.publicKey)
        expect(signedTransaction).not.toEqual(signedLock)
    });
});

import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'view-design'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
// @ts-ignore
import TransactionConfirmation from '@/components/transaction-confirmation/TransactionConfirmation.vue'
import {accountState} from '@/store/account'
import {appMutations, appState} from '@/store/app'
import {veeValidateConfig} from "@/core/validation"
import VueRx from "vue-rx"
import {transactionConfirmationObservable} from '@/core/services/transactions'

import {
    mosaicsLoading,
    multisigAccountInfo,
    mosaics,
    hdAccount,
    networkCurrency,
    // @ts-ignore
} from "@@/mock/conf/conf.spec"
import {LockParams, Notice, NoticeType, SignTransaction, AppWallet, NetworkProperties} from '@/core/model'
jest.mock('@/core/model/Notice')
import Vue from 'vue'
import {
    Deadline, Address, Mosaic, MosaicId, UInt64, PlainMessage,
    NetworkType, TransferTransaction, SignedTransaction, PublicAccount, AggregateTransaction, TransactionInfo, AggregateTransactionInfo, CosignatureSignedTransaction,
} from 'nem2-sdk'
import {Message} from '@/config'
// @ts-ignore
const localVue = createLocalVue()
const router = new VueRouter()
localVue.use(VueRouter)
localVue.use(iView)
localVue.use(Vuex)
localVue.use(VeeValidate, veeValidateConfig)
localVue.use(VueRx)
localVue.directive('focus', {
    inserted: function (el) {
        el.focus()
    }
})
// close warning
config.logModifiedComponents = false

const mockTriggerNotice = jest.fn()
Notice.trigger = mockTriggerNotice

describe('TransactionConfirmation when staged transaction isn\'t set', () => {
    let store
    let wrapper
    let state
    beforeEach(() => {
        store = store = new Vuex.Store({
            modules: {
                account: {
                    state: Object.assign(accountState.state, {
                        wallet: hdAccount.wallets[0],
                        mosaics,
                        networkCurrency,
                        multisigAccountInfo,
                        currentAccount: {
                            name: hdAccount.name,
                            password: hdAccount.password,
                            networkType: hdAccount.networkType,
                        }
                    }),
                },
                app: {
                    state: Object.assign(appState.state, {mosaicsLoading}),
                    mutations: appMutations.mutations
                }
            }
        })

        store.state.app.NetworkProperties = NetworkProperties.create(store)
        store.state.app.NetworkProperties.generationHash = 'C646720D7A5FF322D6CC5D47D2761643A6CD4E165FCBDB3324F8D3BAD40D4644'

        wrapper = shallowMount(TransactionConfirmation, {
            sync: false,
            mocks: {
                $t: (msg) => msg,
            },
            localVue,
            store,
            router,
        })

        mockTriggerNotice.mockClear()
    })

    it('Should not show', () => {
        expect(wrapper.vm.show).toBeFalsy()
    })

    it('show should be set to false when there is no staged transaction', () => {
        expect(wrapper).not.toBeNull()
        expect(wrapper.vm.show).toBeFalsy()
    })
})


describe('TransactionConfirmation when staged transaction is set', () => {
    let store
    let wrapper
    let state

    const transaction = TransferTransaction.create(
        Deadline.create(),
        Address.createFromRawAddress('SBIWHDWZMPIXXM2BINCRXAK3H3MGA5VHB3D2PO5W'),
        [new Mosaic(new MosaicId([2429385668, 814683207]), new UInt64([0, 0]))],
        PlainMessage.create(''),
        NetworkType.MIJIN_TEST,
    )

    const stagedTransaction = {
        isAwaitingConfirmation: true,
        lockParams: LockParams.default(),
        transactionToSign: transaction,
    }

    beforeEach(() => {
        store = store = new Vuex.Store({
            modules: {
                account: {
                    state: Object.assign(accountState.state, {
                        wallet: hdAccount.wallets[0],
                    }),
                },
                app: {
                    state: {stagedTransaction},
                    mutations: appMutations.mutations,
                }
            }
        })

        store.state.app.NetworkProperties = NetworkProperties.create(store)
        store.state.app.NetworkProperties.generationHash = 'C646720D7A5FF322D6CC5D47D2761643A6CD4E165FCBDB3324F8D3BAD40D4644'

        wrapper = shallowMount(TransactionConfirmation, {
            sync: false,
            mocks: {
                $t: (msg) => msg,
            },
            localVue,
            store,
            router,
        })

        mockTriggerNotice.mockClear()
    })

    it('should return the right values and set show to true when staged transaction is set', async (done) => {
        expect(wrapper.vm.show).toBeTruthy()
        expect(wrapper.vm.stagedTransaction).toEqual(stagedTransaction)
        done()
    })

    it('Should emit close when show is set to false', () => {
        wrapper.setData({show: false})
        expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('Should trigger a notice when the password is wrong', async (done) => {
        wrapper.setData({password: 'wrongPassword'})
        wrapper.vm.submit()
        await Vue.nextTick()

        expect(mockTriggerNotice).toHaveBeenCalledTimes(1)
        expect(mockTriggerNotice.mock.calls[0][0]).toBe(Message.WRONG_PASSWORD_ERROR)
        expect(mockTriggerNotice.mock.calls[0][1]).toBe(NoticeType.error)
        expect(mockTriggerNotice.mock.calls[0][2]).toBe(wrapper.vm.$store)
        done()
    })

    it('Should pass the right object to transactionConfirmationObservable', async (done) => {
        wrapper.setData({password: 'password'})

        transactionConfirmationObservable.subscribe((result: SignTransaction) => {
            expect(result.success).toBeTruthy()
            expect(result.signedTransaction).toBeInstanceOf(SignedTransaction)
            expect(result.error).toBeNull()
            done()
        })

        wrapper.vm.submit()
        expect(mockTriggerNotice).toHaveBeenCalledTimes(0)
    })
})


describe('TransactionConfirmation when staged transaction is a lock', () => {
    let store
    let wrapper
    let state

    const wallet = new AppWallet(hdAccount.wallets[0])
    const {publicKey, networkType} = wallet

    const transaction = TransferTransaction.create(
        Deadline.create(),
        Address.createFromRawAddress('SBIWHDWZMPIXXM2BINCRXAK3H3MGA5VHB3D2PO5W'),
        [new Mosaic(new MosaicId([2429385668, 814683207]), new UInt64([0, 0]))],
        PlainMessage.create(''),
        NetworkType.MIJIN_TEST,
    )

    const aggregateTransaction = AggregateTransaction.createBonded(
        Deadline.create(),
        [transaction.toAggregate(PublicAccount.createFromPublicKey(publicKey, networkType))],
        NetworkType.MIJIN_TEST,
        [],
    )

    const stagedTransaction = {
        isAwaitingConfirmation: true,
        lockParams: new LockParams(true, 1),
        transactionToSign: aggregateTransaction,
    }

    beforeEach(() => {
        store = store = new Vuex.Store({
            modules: {
                account: {
                    state: Object.assign(accountState.state, {wallet}),
                },
                app: {
                    state: {stagedTransaction},
                    mutations: appMutations.mutations,
                }
            }
        })

        store.state.app.NetworkProperties = NetworkProperties.create(store)
        store.state.app.NetworkProperties.generationHash = 'C646720D7A5FF322D6CC5D47D2761643A6CD4E165FCBDB3324F8D3BAD40D4644'

        wrapper = shallowMount(TransactionConfirmation, {
            sync: false,
            mocks: {
                $t: (msg) => msg,
                transactionFormatter: (tx) => tx
            },
            localVue,
            store,
            router,
        })

        mockTriggerNotice.mockClear()
    })

    it('should return the right values and set show to true when staged transaction is set', async (done) => {
        expect(wrapper.vm.show).toBeTruthy()
        expect(wrapper.vm.stagedTransaction).toEqual(stagedTransaction)
        done()
    })

    it('Should pass the right object to transactionConfirmationObservable', async (done) => {
        wrapper.setData({password: 'password'})

        transactionConfirmationObservable.subscribe((result: SignTransaction) => {
            expect(result.success).toBeTruthy()
            expect(result.signedTransaction).toBeInstanceOf(SignedTransaction)
            expect(result.signedLock).toBeInstanceOf(SignedTransaction)
            expect(result.signedLock.networkType).toBe(networkType)
            expect(result.signedLock.payload).not.toBeNull()
            expect(result.error).toBeNull()
            done()
        })

        wrapper.vm.submit()
        expect(mockTriggerNotice).toHaveBeenCalledTimes(0)
    })
})


describe('TransactionConfirmation when staged transaction is a cosignature', () => {
    let store
    let wrapper
    let state

    const wallet = new AppWallet(hdAccount.wallets[0])
    const {publicKey, networkType} = wallet

    const aggregateTransaction = new AggregateTransaction(
        NetworkType.MIJIN_TEST,
        16961,
        36865,
        Deadline.create(),
        UInt64.fromUint(300000),
        [new TransferTransaction(
            NetworkType.MIJIN_TEST,
            36865,
            Deadline.create(),
            UInt64.fromUint(300000),
            Address.createFromRawAddress('SBPZIWCDGJXMN3Z5PUQJBYNEC4AWB5C4RM2KFR4F'),
            [new Mosaic(new MosaicId('4B1278B5DD004110'), UInt64.fromUint(12000000))],
            PlainMessage.create(''), "1B576277C51E4CA394DF5A14E2B490FFC558318722757CBED8AA630D4DA107097C7392A1E4EE52C8B1384F64E44BE061699910F3EFC70CC8E20BEA21B5BEC50E",
            PublicAccount.createFromPublicKey(
                "C646720D7A5FF322D6CC5D47D2761643A6CD4E165FCBDB3324F8D3BAD40D4644",
                NetworkType.MIJIN_TEST,
            ),
            new AggregateTransactionInfo(
                UInt64.fromUint(0),
                0,
                "5DE73561ED57151DCC588F6D",
                "FA257728424E34EA9B2FCDF81349575657151A090DF8907F6AF4092C320A6AB6",
                "5DE73561ED57151DCC588F6D",
            )
        )],
        [], "1B576277C51E4CA394DF5A14E2B490FFC558318722757CBED8AA630D4DA107097C7392A1E4EE52C8B1384F64E44BE061699910F3EFC70CC8E20BEA21B5BEC50E",
        PublicAccount.createFromPublicKey(
            "C646720D7A5FF322D6CC5D47D2761643A6CD4E165FCBDB3324F8D3BAD40D4644",
            NetworkType.MIJIN_TEST,
        ),
        new TransactionInfo(
            UInt64.fromUint(666),
            0,
            "5DE73561ED57151DCC588F6D",
            "FA257728424E34EA9B2FCDF81349575657151A090DF8907F6AF4092C320A6AB6",
            "0000000000000000000000000000000000000000000000000000000000000000",
        )
    )
    const stagedTransaction = {
        isAwaitingConfirmation: true,
        lockParams: LockParams.default(),
        transactionToSign: aggregateTransaction,
    }

    beforeEach(() => {
        store = store = new Vuex.Store({
            modules: {
                account: {
                    state: Object.assign(accountState.state, {wallet}),
                },
                app: {
                    state: {stagedTransaction},
                    mutations: appMutations.mutations,
                }
            }
        })

        store.state.app.NetworkProperties = NetworkProperties.create(store)
        store.state.app.NetworkProperties.generationHash = 'C646720D7A5FF322D6CC5D47D2761643A6CD4E165FCBDB3324F8D3BAD40D4644'
        
        wrapper = shallowMount(TransactionConfirmation, {
            sync: false,
            mocks: {
                $t: (msg) => msg,
            },
            localVue,
            store,
            router,
        })

        mockTriggerNotice.mockClear()
    })

    it('should return the right values and set show to true when staged transaction is set', async (done) => {
        expect(wrapper.vm.show).toBeTruthy()
        expect(wrapper.vm.stagedTransaction).toEqual(stagedTransaction)
        done()
    })

    it('Should pass the right object to transactionConfirmationObservable', async (done) => {
        wrapper.setData({password: 'password'})

        transactionConfirmationObservable.subscribe((result: SignTransaction) => {
            expect(result.success).toBeTruthy()
            expect(result.signedTransaction).toBeInstanceOf(CosignatureSignedTransaction)
            expect(result.signedLock).toBe(undefined)
            expect(result.error).toBeNull()
            done()
        })

        wrapper.vm.submit()
        expect(mockTriggerNotice).toHaveBeenCalledTimes(0)
    })
})
import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'view-design'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
// @ts-ignore
import TransactionForm from '@/views/monitor/monitor-transfer/transactions/TransactionForm.vue'
import {accountMutations, accountState} from '@/store/account'
import {appMutations, appState} from '@/store/app'
import {veeValidateConfig} from "@/core/validation"
import VueRx from "vue-rx"
import {FEE_SPEEDS} from "@/config"
import flushPromises from 'flush-promises'
import {
    Address, Deadline,
    Mosaic,
    AggregateTransaction,
    MosaicId,
    NetworkType,
    TransactionType,
    TransferTransaction,
    UInt64
} from "nem2-sdk"
import {
    CosignAccount,
    mosaicsLoading,
    multisigAccountInfo,
    mosaics,
    MultisigAccount,
    Multisig2Account,
    CosignWallet
    // @ts-ignore
} from "@@/mock/conf/conf.spec"
import {AppWallet} from "@/core/model"
// @ts-ignore
const localVue = createLocalVue()
const router = new VueRouter()
localVue.use(VueRouter)
localVue.use(iView)
localVue.use(Vuex)
localVue.use(VeeValidate, veeValidateConfig)
localVue.use(VueRx)
localVue.directive('focus', {
    inserted: function (el, binding) {
        el.focus()
    }
})
// close warning
config.logModifiedComponents = false

describe('MonitorDashBoard', () => {
    let store
    let wrapper
    let state
    beforeEach(() => {
            store = store = new Vuex.Store({
                    modules: {
                        account: {
                            state: Object.assign(accountState.state, {
                                wallet: CosignWallet,
                                mosaics,
                                multisigAccountInfo
                            }),
                            mutations: accountMutations.mutations
                        },
                        app: {
                            state: Object.assign(appState.state, {mosaicsLoading}),
                            mutations: appMutations.mutations
                        }
                    }
                }
            )
            wrapper = shallowMount(TransactionForm, {
                sync: false,
                mocks: {
                    $t: (msg) => msg,
                },
                localVue,
                store,
                router,
            })
        }
    )

    it('Component TransactionForm is not null ', () => {
        expect(wrapper).not.toBeNull()
    })

    it('should create a normal transfer transaction object while did not choose multisig public key', async () => {
        wrapper.setData({
            formItems: {
                recipient: CosignAccount.address.toDTO().address,
                remark: 'unit test',
                multisigPublicKey: '',
                feeSpeed: FEE_SPEEDS.NORMAL,
                mosaicTransferList: [new Mosaic(new MosaicId('308F144790CD7BC4'), UInt64.fromUint(0))],
                isEncrypted: false,
            },
        })
        wrapper.vm.submit()
        await flushPromises()
        const transferTransaction = wrapper.vm.transactionList[0]
        expect(transferTransaction).toBeInstanceOf(TransferTransaction)
        expect(wrapper.vm.isSelectedAccountMultisig).toBe(false)
        expect(transferTransaction.type).toBe(TransactionType.TRANSFER)
        expect(transferTransaction.networkType).toBe(NetworkType.MIJIN_TEST)
        expect(transferTransaction.version).toBe(1)
        expect(transferTransaction.deadline).toBeInstanceOf(Deadline)
        expect(transferTransaction.maxFee).toBeInstanceOf(UInt64)
        expect(transferTransaction.recipientAddress).toBeInstanceOf(Address)
        transferTransaction.mosaics.forEach(item => {
            expect(item).toBeInstanceOf(Mosaic)
        })
    })

    it('should create an aggregate complete transaction object while choose 1-of-1 multisig', async () => {
        wrapper.setData({
            formItems: {
                recipient: CosignAccount.address.toDTO().address,
                remark: 'unit test',
                multisigPublicKey: MultisigAccount.publicKey,
                feeSpeed: FEE_SPEEDS.NORMAL,
                mosaicTransferList: [new Mosaic(new MosaicId('308F144790CD7BC4'), UInt64.fromUint(0))],
                isEncrypted: false
            },
        })
        store.commit('SET_ACTIVE_MULTISIG_ACCOUNT', MultisigAccount.publicKey)
        wrapper.vm.submit()
        await flushPromises()

        const aggregateTransaction = wrapper.vm.transactionList[0]
        const innerTransferTransaction = aggregateTransaction.innerTransactions[0]

        expect(wrapper.vm.isSelectedAccountMultisig).toBe(true)
        expect(aggregateTransaction).toBeInstanceOf(AggregateTransaction)
        expect(aggregateTransaction.type).toBe(TransactionType.AGGREGATE_COMPLETE)
        expect(aggregateTransaction.networkType).toBe(NetworkType.MIJIN_TEST)
        expect(aggregateTransaction.version).toBe(1)
        expect(aggregateTransaction.deadline).toBeInstanceOf(Deadline)
        expect(aggregateTransaction.maxFee).toBeInstanceOf(UInt64)

        expect(innerTransferTransaction.type).toBe(TransactionType.TRANSFER)
        expect(innerTransferTransaction.networkType).toBe(NetworkType.MIJIN_TEST)
        expect(innerTransferTransaction.version).toBe(1)
        expect(innerTransferTransaction.deadline).toBeInstanceOf(Deadline)
        expect(innerTransferTransaction.maxFee).toBeInstanceOf(UInt64)
        expect(innerTransferTransaction.recipientAddress).toBeInstanceOf(Address)
        innerTransferTransaction.mosaics.forEach(item => {
            expect(item).toBeInstanceOf(Mosaic)
        })
    })

    it('should create an aggregate bonded transaction object while choose 2-of-2 multisig', async () => {
        wrapper.setData({
            formItems: {
                recipient: CosignAccount.address.toDTO().address,
                remark: 'unit test',
                multisigPublicKey: Multisig2Account.publicKey,
                feeSpeed: FEE_SPEEDS.NORMAL,
                mosaicTransferList: [new Mosaic(new MosaicId('308F144790CD7BC4'), UInt64.fromUint(0))],
                isEncrypted: false
            },
        })
        store.commit('SET_ACTIVE_MULTISIG_ACCOUNT', Multisig2Account.publicKey)
        wrapper.vm.submit()
        await flushPromises()

        const aggregateTransaction = wrapper.vm.transactionList[0]
        const innerTransferTransaction = aggregateTransaction.innerTransactions[0]
        expect(wrapper.vm.isSelectedAccountMultisig).toBe(true)
        expect(aggregateTransaction).toBeInstanceOf(AggregateTransaction)
        expect(aggregateTransaction.type).toBe(TransactionType.AGGREGATE_BONDED)
        expect(aggregateTransaction.networkType).toBe(NetworkType.MIJIN_TEST)
        expect(aggregateTransaction.version).toBe(1)
        expect(aggregateTransaction.deadline).toBeInstanceOf(Deadline)
        expect(aggregateTransaction.maxFee).toBeInstanceOf(UInt64)

        expect(innerTransferTransaction.type).toBe(TransactionType.TRANSFER)
        expect(innerTransferTransaction.networkType).toBe(NetworkType.MIJIN_TEST)
        expect(innerTransferTransaction.version).toBe(1)
        expect(innerTransferTransaction.deadline).toBeInstanceOf(Deadline)
        expect(innerTransferTransaction.maxFee).toBeInstanceOf(UInt64)
        expect(innerTransferTransaction.recipientAddress).toBeInstanceOf(Address)
        innerTransferTransaction.mosaics.forEach(item => {
            expect(item).toBeInstanceOf(Mosaic)
        })
    })

    it('should not create any transaction object while recipient is neither address nor alias', async () => {
        wrapper.setData({
            formItems: {
                recipient: 'IncorrectRecipient',
                remark: 'unit test',
                multisigPublicKey: "",
                feeSpeed: FEE_SPEEDS.NORMAL,
                mosaicTransferList: [new Mosaic(new MosaicId('308F144790CD7BC4'), UInt64.fromUint(0))],
                isEncrypted: false
            },
        })

        wrapper.vm.submit()
        await flushPromises()
        const transferTransaction = wrapper.vm.transactionList[0]
        expect(transferTransaction).toBeUndefined()
    })

    it('should create a transaction object while recipient is an alias', async () => {
        wrapper.setData({
            formItems: {
                recipient: 'alias',
                remark: 'unit test',
                multisigPublicKey: "",
                feeSpeed: FEE_SPEEDS.NORMAL,
                mosaicTransferList: [new Mosaic(new MosaicId('308F144790CD7BC4'), UInt64.fromUint(0))],
                isEncrypted: false
            },
        })
        wrapper.vm.submit()
        await flushPromises()
        const transferTransaction = wrapper.vm.transactionList[0]
        expect(transferTransaction).toBeInstanceOf(TransferTransaction)
    })

    it('should not create a transaction object while mosaic list is null', async () => {
        wrapper.setData({
            formItems: {
                recipient: 'alias',
                remark: 'unit test',
                multisigPublicKey: "",
                feeSpeed: FEE_SPEEDS.NORMAL,
                mosaicTransferList: [],
                isEncrypted: false
            },
        })
        wrapper.vm.submit()
        await flushPromises()
        const transferTransaction = wrapper.vm.transactionList[0]
        expect(transferTransaction).toBeUndefined()
    })

    it('should sort mosaics while add new mosaic', async () => {
        wrapper.setData({
            formItems: {
                recipient: 'alias',
                remark: 'unit test',
                multisigPublicKey: "",
                feeSpeed: FEE_SPEEDS.NORMAL,
                mosaicTransferList: [new Mosaic(new MosaicId('4EB2D6C822D8A9F7'), UInt64.fromUint(0))],
                isEncrypted: false
            },
            currentMosaic: '308F144790CD7BC4',
            currentAmount: 0
        })

        wrapper.vm.submit()
        await flushPromises()
        wrapper.vm.addMosaic()

        const transferTransaction = wrapper.vm.transactionList[0]
        expect(transferTransaction.mosaics[0].id.toHex()).toBe('308F144790CD7BC4')
        expect(transferTransaction.mosaics[1].id.toHex()).toBe('4EB2D6C822D8A9F7')
    })

    it('should create a transaction object while message is null', async () => {
        wrapper.setData({
            formItems: {
                recipient: CosignAccount.address.toDTO().address,
                remark: '',
                multisigPublicKey: "",
                feeSpeed: FEE_SPEEDS.NORMAL,
                mosaicTransferList: [new Mosaic(new MosaicId('308F144790CD7BC4'), UInt64.fromUint(0))],
                isEncrypted: false
            },
        })
        wrapper.vm.submit()
        await flushPromises()
        const transferTransaction = wrapper.vm.transactionList[0]
        expect(transferTransaction).toBeInstanceOf(TransferTransaction)
    })

    it('should not create a transaction object while message length > 1023', async () => {
        let message = '1'
        while (message.length <= 2048) {
            message += message
        }
        wrapper.setData({
            formItems: {
                recipient: CosignAccount.address.toDTO().address,
                remark: message,
                multisigPublicKey: "",
                feeSpeed: FEE_SPEEDS.NORMAL,
                mosaicTransferList: [new Mosaic(new MosaicId('308F144790CD7BC4'), UInt64.fromUint(0))],
                isEncrypted: false
            },
        })
        wrapper.vm.submit()
        await flushPromises()
        const transferTransaction = wrapper.vm.transactionList[0]
        expect(transferTransaction).toBeUndefined()
    })

    it('should not pass inspection while mosaic list length < 1', async () => {
        wrapper.setData({
            formItems: {
                recipient: CosignAccount.address.toDTO().address,
                remark: 'unit test',
                multisigPublicKey: "",
                feeSpeed: FEE_SPEEDS.NORMAL,
                mosaicTransferList: [],
                isEncrypted: false
            },
        })
        wrapper.vm.submit()
        await flushPromises()
        const transferTransaction = wrapper.vm.transactionList[0]
        expect(transferTransaction).toBeUndefined()
    })


})

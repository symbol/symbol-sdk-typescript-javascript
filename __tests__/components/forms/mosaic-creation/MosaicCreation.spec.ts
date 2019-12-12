import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'view-design'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
// @ts-ignore
import MosaicCreation from '@/components/forms/mosaic-creation/MosaicCreation.vue'
import {accountMutations, accountState} from '@/store/account'
import {appMutations, appState} from '@/store/app'
import {veeValidateConfig} from "@/core/validation"
import VueRx from "vue-rx"
import flushPromises from 'flush-promises'
import {FEE_SPEEDS} from "@/config"
import {
    MosaicSupplyChangeTransaction,
    AggregateTransaction,
    MosaicDefinitionTransaction,
    TransactionType,
} from "nem2-sdk"
import {
    mosaicsLoading,
    multisigAccountInfo,
    mosaics,
    MultisigAccount,
    Multisig2Account,
    CosignWallet
    // @ts-ignore
} from "@@/mock/conf/conf.spec"
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

describe('MosaicCreation', () => {
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
            wrapper = shallowMount(MosaicCreation, {
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

    it('Component MosaicCreation should render', () => {
        expect(wrapper).not.toBeNull()
    })


    it('should create a normal aggregate transaction while all params are right ', async () => {
        wrapper.setData({
            formItems: {
                restrictable: false,
                supply: 500000000,
                divisibility: 0,
                transferable: true,
                supplyMutable: true,
                permanent: true,
                duration: 1000,
                feeSpeed: FEE_SPEEDS.NORMAL,
                multisigPublicKey: CosignWallet.publicKey
            }
        })

        const signTransactionMock = jest.fn(x => x)
        wrapper.vm.signAndAnnounce = signTransactionMock
        wrapper.vm.submit()
        await flushPromises()

        const [{ transaction },] = signTransactionMock.mock.calls[0]

        const mosaicDefinitionTransaction = transaction.innerTransactions[0]
        const mosaicSupplyChangeTransaction = transaction.innerTransactions[1]

        expect(transaction).toBeInstanceOf(AggregateTransaction)
        expect(transaction.type).toBe(TransactionType.AGGREGATE_COMPLETE)
        expect(mosaicDefinitionTransaction).toBeInstanceOf(MosaicDefinitionTransaction)
        expect(mosaicSupplyChangeTransaction).toBeInstanceOf(MosaicSupplyChangeTransaction)
        expect(mosaicDefinitionTransaction.signer.publicKey).toBe(CosignWallet.publicKey)
        expect(mosaicSupplyChangeTransaction.signer.publicKey).toBe(CosignWallet.publicKey)
    })

    it('should create an aggregate complete transaction while choose 1-of-1 multisig ',  async () => {
        wrapper.setData({
            formItems: {
                restrictable: false,
                supply: 500000000,
                divisibility: 0,
                transferable: true,
                supplyMutable: true,
                permanent: true,
                duration: 1000,
                feeSpeed: FEE_SPEEDS.NORMAL,
                multisigPublicKey: MultisigAccount.publicKey
            }
        })

        store.commit('SET_ACTIVE_MULTISIG_ACCOUNT', MultisigAccount.publicKey)
        wrapper.vm.submit()
        await flushPromises()

        const aggregateTransaction = wrapper.vm.transactionList[0]
        const mosaicDefinitionTransaction = aggregateTransaction.innerTransactions[0]
        const mosaicSupplyChangeTransaction = aggregateTransaction.innerTransactions[1]

        expect(aggregateTransaction).toBeInstanceOf(AggregateTransaction)
        expect(aggregateTransaction.type).toBe(TransactionType.AGGREGATE_COMPLETE)
        expect(mosaicDefinitionTransaction).toBeInstanceOf(MosaicDefinitionTransaction)
        expect(mosaicSupplyChangeTransaction).toBeInstanceOf(MosaicSupplyChangeTransaction)
        expect(mosaicDefinitionTransaction.signer.publicKey).toBe(MultisigAccount.publicKey)
        expect(mosaicSupplyChangeTransaction.signer.publicKey).toBe(MultisigAccount.publicKey)
    })

    it('should create an aggregate bonded transaction while choose 2-of-2 multisig ',  async () => {
        wrapper.setData({
            formItems: {
                restrictable: false,
                supply: 500000000,
                divisibility: 0,
                transferable: true,
                supplyMutable: true,
                permanent: true,
                duration: 1000,
                feeSpeed: FEE_SPEEDS.NORMAL,
                multisigPublicKey: Multisig2Account.publicKey
            }
        })

        store.commit('SET_ACTIVE_MULTISIG_ACCOUNT', Multisig2Account.publicKey)
        wrapper.vm.submit()
        await flushPromises()

        const aggregateTransaction = wrapper.vm.transactionList[0]
        const mosaicDefinitionTransaction = aggregateTransaction.innerTransactions[0]
        const mosaicSupplyChangeTransaction = aggregateTransaction.innerTransactions[1]

        expect(aggregateTransaction).toBeInstanceOf(AggregateTransaction)
        expect(aggregateTransaction.type).toBe(TransactionType.AGGREGATE_BONDED)
        expect(mosaicDefinitionTransaction).toBeInstanceOf(MosaicDefinitionTransaction)
        expect(mosaicSupplyChangeTransaction).toBeInstanceOf(MosaicSupplyChangeTransaction)
        expect(mosaicDefinitionTransaction.signer.publicKey).toBe(Multisig2Account.publicKey)
        expect(mosaicSupplyChangeTransaction.signer.publicKey).toBe(Multisig2Account.publicKey)
    })

    it('should not create a transaction while divisibility < 0',  () => {
        wrapper.setData({
            formItems: {
                restrictable: false,
                supply: 500000000,
                divisibility: -1,
                transferable: true,
                supplyMutable: true,
                permanent: true,
                duration: 1000,
                feeSpeed: FEE_SPEEDS.NORMAL,
                multisigPublicKey: MultisigAccount.publicKey
            }
        })
        wrapper.vm.submit()
        expect(wrapper.vm.transactionList[0]).toBeUndefined()
    })

    it('should not create a transaction while divisibility > 6',  () => {
        wrapper.setData({
            formItems: {
                restrictable: false,
                supply: 500000000,
                divisibility: 7,
                transferable: true,
                supplyMutable: true,
                permanent: true,
                duration: 1000,
                feeSpeed: FEE_SPEEDS.NORMAL,
                multisigPublicKey: MultisigAccount.publicKey
            }
        })
        wrapper.vm.submit()
        expect(wrapper.vm.transactionList[0]).toBeUndefined()
    })

    it('should not create a transaction while absolute supply <= 0',  () => {
        wrapper.setData({
            formItems: {
                restrictable: false,
                supply: 0,
                divisibility: 7,
                transferable: true,
                supplyMutable: true,
                permanent: true,
                duration: 1000,
                feeSpeed: FEE_SPEEDS.NORMAL,
                multisigPublicKey: MultisigAccount.publicKey
            }
        })
        wrapper.vm.submit()
        expect(wrapper.vm.transactionList[0]).toBeUndefined()
    })
})

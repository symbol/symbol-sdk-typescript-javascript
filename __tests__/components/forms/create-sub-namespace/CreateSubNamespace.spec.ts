import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'view-design'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
// @ts-ignore
import CreateSubNamespace from '@/components/forms/create-sub-namespace/CreateSubNamespace.vue'
import {accountMutations, accountState} from '@/store/account'
import {appMutations, appState} from '@/store/app'
import {veeValidateConfig} from "@/core/validation"
import VueRx from "vue-rx"
import {DEFAULT_FEES, FEE_GROUPS, FEE_SPEEDS} from "@/config"
import {
    TransactionType,
    NamespaceRegistrationTransaction, NamespaceRegistrationType, UInt64, AggregateTransaction, NetworkType, Deadline,
} from "nem2-sdk"
import {
    mosaicsLoading,
    multisigAccountInfo,
    mosaics,
    networkCurrency,
    CosignWallet,
    Multisig2Account,
    MultisigAccount,
} from "@MOCKS/index"
import flushPromises from 'flush-promises'
import {getAbsoluteMosaicAmount} from "@/core/utils"
import {NetworkProperties} from '@/core/model'

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

describe('CreateSubNamespace', () => {
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
                        networkCurrency,
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

        store.state.app.NetworkProperties = NetworkProperties.create(store)
        store.state.app.NetworkProperties.height = 666

        wrapper = shallowMount(CreateSubNamespace, {
            sync: false,
            mocks: {
                $t: (msg) => msg,
            },
            localVue,
            store,
            router,
        })
    })


    it('Component CreateSubNamespace should render', () => {
        expect(wrapper).not.toBeNull()
    })


    it('should create a NamespaceRegistrationTransaction while all param is right ', async () => {
        wrapper.setData({
            formItems: {
                rootNamespaceName: 'abc',
                subNamespaceName: 'efg',
                multisigPublicKey: '',
                feeSpeed: FEE_SPEEDS.NORMAL,
            }
        })
        wrapper.vm.submit()
        await flushPromises()

        const namespaceRegistrationTransaction = wrapper.vm.transactionList[0]
        expect(namespaceRegistrationTransaction).toBeInstanceOf(NamespaceRegistrationTransaction)
        expect(namespaceRegistrationTransaction.type).toBe(TransactionType.REGISTER_NAMESPACE)
        expect(namespaceRegistrationTransaction.networkType).toBe(CosignWallet.networkType)
        expect(namespaceRegistrationTransaction.version).not.toBeUndefined()
        expect(namespaceRegistrationTransaction.deadline).not.toBeUndefined()
        expect(namespaceRegistrationTransaction.maxFee.compact()).toBe(getAbsoluteMosaicAmount(DEFAULT_FEES[FEE_GROUPS.SINGLE][1].value, networkCurrency.divisibility))
        expect(namespaceRegistrationTransaction.registrationType).toBe(NamespaceRegistrationType.SubNamespace)
        expect(namespaceRegistrationTransaction.namespaceName).toBe('efg')
    })

    it('should not create a NamespaceRegistrationTransaction while sub namespace is invalid ', async () => {
        wrapper.setData({
            formItems: {
                rootNamespaceName: 'asd',
                subNamespaceName: 'ASD',
                multisigPublicKey: '',
                feeSpeed: FEE_SPEEDS.NORMAL,
            }
        })
        wrapper.vm.submit()
        await flushPromises()

        expect(wrapper.vm.transactionList[0]).toBeUndefined()
    })

    it(' should create an aggregate complete transaction while account is a 1-of-1 multisig ', async () => {
        wrapper.setData({
            formItems: {
                rootNamespaceName: 'abc',
                subNamespaceName: 'efg',
                multisigPublicKey: MultisigAccount.publicKey,
                feeSpeed: FEE_SPEEDS.NORMAL,
            }
        })
        store.commit('SET_ACTIVE_MULTISIG_ACCOUNT', MultisigAccount.publicKey)
        wrapper.vm.submit()
        await flushPromises()

        const aggregateTransaction = wrapper.vm.transactionList[0]
        const namespaceRegistrationTransaction = aggregateTransaction.innerTransactions[0]

        expect(aggregateTransaction).toBeInstanceOf(AggregateTransaction)
        expect(aggregateTransaction.type).toBe(TransactionType.AGGREGATE_COMPLETE)
        expect(aggregateTransaction.networkType).toBe(NetworkType.MIJIN_TEST)
        expect(aggregateTransaction.version).toBe(1)
        expect(aggregateTransaction.deadline).toBeInstanceOf(Deadline)
        expect(aggregateTransaction.maxFee).toBeInstanceOf(UInt64)

        expect(namespaceRegistrationTransaction).toBeInstanceOf(NamespaceRegistrationTransaction)
        expect(namespaceRegistrationTransaction.type).toBe(TransactionType.REGISTER_NAMESPACE)
        expect(namespaceRegistrationTransaction.networkType).toBe(CosignWallet.networkType)
        expect(namespaceRegistrationTransaction.version).not.toBeUndefined()
        expect(namespaceRegistrationTransaction.deadline).not.toBeUndefined()
        expect(namespaceRegistrationTransaction.maxFee.compact()).toBe(getAbsoluteMosaicAmount(DEFAULT_FEES[FEE_GROUPS.SINGLE][1].value, networkCurrency.divisibility))
        expect(namespaceRegistrationTransaction.registrationType).toBe(NamespaceRegistrationType.SubNamespace)
        expect(namespaceRegistrationTransaction.namespaceName).toBe('efg')
    })

    it(' should create an aggregate bonded transaction while account is a 2-of-2 multisig ', async () => {
        wrapper.setData({
            formItems: {
                rootNamespaceName: 'abc',
                subNamespaceName: 'efg',
                multisigPublicKey: Multisig2Account.publicKey,
                feeSpeed: FEE_SPEEDS.NORMAL,
            }
        })
        store.commit('SET_ACTIVE_MULTISIG_ACCOUNT', Multisig2Account.publicKey)
        wrapper.vm.submit()
        await flushPromises()

        const aggregateTransaction = wrapper.vm.transactionList[0]
        const namespaceRegistrationTransaction = aggregateTransaction.innerTransactions[0]

        expect(aggregateTransaction).toBeInstanceOf(AggregateTransaction)
        expect(aggregateTransaction.type).toBe(TransactionType.AGGREGATE_BONDED)
        expect(aggregateTransaction.networkType).toBe(NetworkType.MIJIN_TEST)
        expect(aggregateTransaction.version).toBe(1)
        expect(aggregateTransaction.deadline).toBeInstanceOf(Deadline)
        expect(aggregateTransaction.maxFee).toBeInstanceOf(UInt64)

        expect(namespaceRegistrationTransaction).toBeInstanceOf(NamespaceRegistrationTransaction)
        expect(namespaceRegistrationTransaction.type).toBe(TransactionType.REGISTER_NAMESPACE)
        expect(namespaceRegistrationTransaction.networkType).toBe(CosignWallet.networkType)
        expect(namespaceRegistrationTransaction.version).not.toBeUndefined()
        expect(namespaceRegistrationTransaction.deadline).not.toBeUndefined()
        expect(namespaceRegistrationTransaction.maxFee.compact()).toBe(getAbsoluteMosaicAmount(DEFAULT_FEES[FEE_GROUPS.TRIPLE][0].value, networkCurrency.divisibility))
        expect(namespaceRegistrationTransaction.registrationType).toBe(NamespaceRegistrationType.SubNamespace)
        expect(namespaceRegistrationTransaction.namespaceName).toBe('efg')
    })

    it('should not create a namespace transaction while the length of sub namespace name is longer than 64', async () => {
        wrapper.setData({
            formItems: {
                rootNamespaceName: 'abc',
                subNamespaceName: 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklm',
                multisigPublicKey: '',
                feeSpeed: FEE_SPEEDS.NORMAL,
            }
        })
        wrapper.vm.submit()
        await flushPromises()
        expect(wrapper.vm.transactionList[0]).toBeUndefined()
    })

    it('should create a namespace transaction while the length of sub namespace name is 64', async () => {
        wrapper.vm.$store.state.account.activeMultisigAccount = null
        wrapper.vm.$store.state.account.hasMultisigAccounts = false

        wrapper.setData({
            formItems: {
                rootNamespaceName: 'abc',
                subNamespaceName: 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijkl',
                multisigPublicKey: '',
                feeSpeed: FEE_SPEEDS.NORMAL,
            }
        })
        wrapper.vm.submit()
        await flushPromises()
        const namespaceRegistrationTransaction = wrapper.vm.transactionList[0]
        expect(namespaceRegistrationTransaction).toBeInstanceOf(NamespaceRegistrationTransaction)
        expect(namespaceRegistrationTransaction.type).toBe(TransactionType.REGISTER_NAMESPACE)
        expect(namespaceRegistrationTransaction.networkType).toBe(CosignWallet.networkType)
        expect(namespaceRegistrationTransaction.version).not.toBeUndefined()
        expect(namespaceRegistrationTransaction.deadline).not.toBeUndefined()
        expect(namespaceRegistrationTransaction.maxFee.compact()).toBe(getAbsoluteMosaicAmount(DEFAULT_FEES[FEE_GROUPS.SINGLE][1].value, networkCurrency.divisibility))
        expect(namespaceRegistrationTransaction.registrationType).toBe(NamespaceRegistrationType.SubNamespace)
        expect(namespaceRegistrationTransaction.namespaceName).toBe('abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijkl')
    })
})

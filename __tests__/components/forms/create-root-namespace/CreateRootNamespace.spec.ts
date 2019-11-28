import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'view-design'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
// @ts-ignore
import CreateRootNamespace from '@/components/forms/create-root-namespace/CreateRootNamespace.vue'
import {accountMutations, accountState} from '@/store/account'
import {appMutations, appState} from '@/store/app'
import {veeValidateConfig} from "@/core/validation"
import VueRx from "vue-rx"
import {DEFAULT_FEES, FEE_GROUPS, FEE_SPEEDS, NETWORK_CONSTANTS} from "@/config"
import {
    TransactionType,
    NamespaceRegistrationTransaction,
    NamespaceRegistrationType, AggregateTransaction, NetworkType, Deadline, UInt64,
} from "nem2-sdk"
import {
    mosaicsLoading,
    multisigAccountInfo,
    mosaics,
    networkCurrency,
    CosignWallet
    // @ts-ignore
} from "@@/mock/conf/conf.spec"
import flushPromises from 'flush-promises'
import {getAbsoluteMosaicAmount} from "@/core/utils"
import {Multisig2Account, MultisigAccount} from "../../../mock/conf/conf.spec"
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

describe('CreateRootNamespace', () => {
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
            wrapper = shallowMount(CreateRootNamespace, {
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
    it('Component CreateRootNamespace should render', () => {
        expect(wrapper).not.toBeNull()
    })

    it('should create a NamespaceRegistrationTransaction while all param is right ', async () => {
        wrapper.setData({
            formItems: {
                duration: 1000000,
                rootNamespaceName: 'abc',
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
        expect(namespaceRegistrationTransaction.registrationType).toBe(NamespaceRegistrationType.RootNamespace)
        expect(namespaceRegistrationTransaction.namespaceName).toBe('abc')
        expect(namespaceRegistrationTransaction.duration.compact()).toBe(1000000)
    })
    it(' should create an aggregate complete transaction while account is a 1-of-1 multisig ', async () => {
        wrapper.setData({
            formItems: {
                duration: 1000000,
                rootNamespaceName: 'abc',
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
        expect(namespaceRegistrationTransaction.registrationType).toBe(NamespaceRegistrationType.RootNamespace)
        expect(namespaceRegistrationTransaction.namespaceName).toBe('abc')
        expect(namespaceRegistrationTransaction.duration.compact()).toBe(1000000)
    })

    it(' should create an aggregate bonded transaction while account is a 2-of-2 multisig ', async () => {
        wrapper.setData({
            formItems: {
                duration: 1000000,
                rootNamespaceName: 'abc',
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
        expect(namespaceRegistrationTransaction.registrationType).toBe(NamespaceRegistrationType.RootNamespace)
        expect(namespaceRegistrationTransaction.namespaceName).toBe('abc')
        expect(namespaceRegistrationTransaction.duration.compact()).toBe(1000000)
    })
    it('should not create a normal namespace create transaction while rootNamespaceName is substandard ', () => {
        wrapper.setData({
            formItems: {
                duration: 1000000,
                rootNamespaceName: 'nem',
                multisigPublicKey: '',
                feeSpeed: FEE_SPEEDS.NORMAL,
            }
        })
        wrapper.vm.submit()
        expect(wrapper.vm.transactionList[0]).toBeUndefined()
    })
    it('should not create a normal namespace create transaction while duration is less than 4', () => {
        wrapper.setData({
            formItems: {
                duration: NETWORK_CONSTANTS.MIN_NAMESPACE_DURATION - 1,
                rootNamespaceName: 'abc',
                multisigPublicKey: '',
                feeSpeed: FEE_SPEEDS.NORMAL,
            }
        })
        wrapper.vm.submit()
        expect(wrapper.vm.transactionList[0]).toBeUndefined()
    })

    it('should not create a normal namespace create transaction while duration is more than 2102400', () => {
        wrapper.setData({
            formItems: {
                duration: NETWORK_CONSTANTS.MAX_NAMESPACE_DURATION + 1,
                rootNamespaceName: 'abc',
                multisigPublicKey: '',
                feeSpeed: FEE_SPEEDS.NORMAL,
            }
        })
        wrapper.vm.submit()
        expect(wrapper.vm.transactionList[0]).toBeUndefined()
    })

    it('should not create a normal namespace transaction while namespace name is invalid', () => {
        wrapper.setData({
            formItems: {
                duration: 1000000,
                rootNamespaceName: 'Abc',
                multisigPublicKey: '',
                feeSpeed: FEE_SPEEDS.NORMAL,
            }
        })
        wrapper.vm.submit()
        expect(wrapper.vm.transactionList[0]).toBeUndefined()
    })
})

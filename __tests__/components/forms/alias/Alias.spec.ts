import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'view-design'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
import Alias from '@/components/forms/alias/Alias.vue'
import {accountMutations, accountState} from '@/store/account'
import {appMutations, appState} from '@/store/app'
import {veeValidateConfig} from "@/core/validation"
import VueRx from "vue-rx"
import flushPromises from 'flush-promises'
import {
    TransactionType,
    NamespaceId,
    NamespaceName,
    Account,
    NetworkType
} from "nem2-sdk"
import {
    mosaicsLoading,
    multisigAccountInfo,
    mosaics,
    hdAccountData,
    hdAccount,
} from "@MOCKS/index"
import {AppWallet, AppNamespace, BindTypes, CurrentAccount, NetworkProperties} from "@/core/model"
import Vue from 'vue'

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

describe('Alias from namespace', () => {
    let store
    let wrapper
    let state
    beforeEach(() => {
            store = store = new Vuex.Store({
                    modules: {
                        account: {
                            state: Object.assign(accountState.state, {
                                mosaics,
                                multisigAccountInfo,
                                // @ts-ignore
                                wallet: new AppWallet(hdAccount.wallets[0]),
                                currentAccount: new CurrentAccount(null, hdAccount.password, hdAccount.networkType)
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

            wrapper = shallowMount(Alias, {
                sync: false,
                mocks: {
                    $t: (msg) => msg,
                },
                localVue,
                store,
                router,
                propsData: {
                    visible: true, 
                    bind: true,
                    fromNamespace: true,
                    namespace: AppNamespace.fromNamespaceNames(
                       [new NamespaceName(
                           new NamespaceId([4082974126, 2563399553]),
                           'testnamespace',
                       )]
                    )[0]
                }
            })
        }
    )

    it('Should render', () => {
        expect(wrapper).not.toBeNull()
    })

    it('should create a mosaic alias transaction', async () => {
        wrapper.setData({
            formItems: {
                password: hdAccountData.password,
            },
                
            bindType: BindTypes.MOSAIC
        })
        await Vue.nextTick()
        wrapper.setData({
                target: '0550A29A06E0A16E',
        })
        const signTransactionMock = jest.fn(x => x)
        wrapper.vm.signAndAnnounce = signTransactionMock
        wrapper.vm.submit()
        await flushPromises()
        const [{ transaction },] = signTransactionMock.mock.calls[0]

        expect(signTransactionMock).toHaveBeenCalledTimes(1)
        expect(transaction.type).toBe(TransactionType.MOSAIC_ALIAS)
    })


    it('should create an address alias transaction', async () => {
        wrapper.setData({
            target: 'SBOENUE4JRGPMBV4HAOA2MIJGIY4AAHLI2YSKHRF',
        })
        const signTransactionMock = jest.fn(x => x)
        wrapper.vm.signAndAnnounce = signTransactionMock
        wrapper.vm.submit()
        await flushPromises()
        const [{ transaction },] = signTransactionMock.mock.calls[0]

        expect(signTransactionMock).toHaveBeenCalledTimes(1)
        expect(transaction.type).toBe(TransactionType.ADDRESS_ALIAS)
    })


    it('should not create an address alias transaction if address network type is different', async () => {
        wrapper.setData({
            target: Account.generateNewAccount(NetworkType.TEST_NET).address.plain()
        })
        const signTransactionMock = jest.fn(x => x)
        wrapper.vm.signAndAnnounce = signTransactionMock
        wrapper.vm.submit()
        await flushPromises()

        expect(signTransactionMock).toHaveBeenCalledTimes(0)
    })


    it('should not create an address alias transaction if the address is invalid', async () => {
        wrapper.setData({
            target: 'THISISANINVALIDADDRESS'
        })
        const signTransactionMock = jest.fn(x => x)
        wrapper.vm.signAndAnnounce = signTransactionMock
        wrapper.vm.submit()
        await flushPromises()

        expect(signTransactionMock).toHaveBeenCalledTimes(0)
    })
})

import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'view-design'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
// @ts-ignore
import MonitorInvoice from '@/views/monitor/monitor-invoice/MonitorInvoice.vue'
import {accountMutations, accountState} from '@/store/account'
import {appMutations, appState} from '@/store/app'
import {veeValidateConfig} from "@/core/validation"
import VueRx from "vue-rx"
import {
    TransferTransaction,
} from "nem2-sdk"
import {
    mosaicsLoading,
    multisigAccountInfo,
    mosaics,
    CosignWallet
    // @ts-ignore
} from "@@/mock/conf/conf.spec"
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

describe('MonitorInvoice', () => {
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

            store.state.app.NetworkProperties = NetworkProperties.create(store)
            store.state.app.NetworkProperties.height = 666
            
            wrapper = shallowMount(MonitorInvoice, {
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

    it('Should render', () => {
        expect(wrapper).not.toBeNull()
    })

    it('Should create a valid transfer transaction', () => {
        wrapper.setData({
            formItems: {
                mosaicAmount: 88888,
                message: 'this is a message',
            },
            selectedMosaicHex: '0550A29A06E0A16E'
        })

        expect(wrapper.vm.transferTransaction).toBeInstanceOf(TransferTransaction)
        expect(wrapper.vm.transferTransaction.message.payload).toEqual('this is a message')
        expect(wrapper.vm.transferTransaction.mosaics[0].amount.compact()).toEqual(88888)
    })

    it('Should not create a valid transfer transaction', () => {
        wrapper.setData({
            formItems: {
                mosaicAmount: 88888,
                remarks: 'this is a message',
            },
            selectedMosaicHex: ''
        })

        expect(wrapper.vm.transferTransaction).toEqual(null)
    })
})

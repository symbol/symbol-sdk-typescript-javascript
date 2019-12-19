import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
// @ts-ignore
import DisabledForms from '@/components/disabled-forms/DisabledForms.vue'
import {Alert} from 'view-design'
import {accountMutations, accountState} from '@/store/account'
import {appMutations, appState} from '@/store/app'
import {veeValidateConfig} from "@/core/validation"
import VueRx from "vue-rx"
import moment from 'vue-moment'
import {
    mosaicsLoading,
    multisigAccountInfo,
    mosaics,
    CosignWallet,
    MultisigWallet,
    networkCurrency
} from "@MOCKS/index"
// @ts-ignore
const localVue = createLocalVue()
const router = new VueRouter()
localVue.use(VueRouter)
localVue.use(moment as any)
localVue.component('Alert', Alert)
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
                                multisigAccountInfo,
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
            wrapper = shallowMount(DisabledForms, {
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

    it('should not exists while default mosaic has already set', async () => {
        store.commit('SET_NETWORK_CURRENCY', networkCurrency)
        expect(wrapper.find('.multisig_ban_container').exists()).toBe(true)
    })

    it('should exists while default mosaic is not set', async () => {
        expect(wrapper.find('multisig_ban_container').exists()).toBe(false)
    })

    it('should exists while activeAccount is a multisig', async () => {
        store.commit('SET_NETWORK_CURRENCY', networkCurrency)
        store.commit('SET_WALLET', MultisigWallet)
        expect(wrapper.find('multisig_ban_container').exists()).toBe(false)
    })
})

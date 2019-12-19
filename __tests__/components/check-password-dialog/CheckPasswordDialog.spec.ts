import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'view-design'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
// @ts-ignore
import CheckPasswordDialog from '@/components/check-password-dialog/CheckPasswordDialog.vue'
import {accountState} from '@/store/account'
import {appMutations, appState} from '@/store/app'
import {veeValidateConfig} from "@/core/validation"
import VueRx from "vue-rx"
import flushPromises from 'flush-promises'

import {
    mosaicsLoading,
    multisigAccountInfo,
    mosaics,
    hdAccount,
    networkCurrency,
    hdAccountData,
} from "@MOCKS/index"
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

describe('CheckPasswordDialog', () => {
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
                            name: hdAccount.accountName,
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
        }
        )
        wrapper = shallowMount(CheckPasswordDialog, {
            sync: false,
            mocks: {
                $t: (msg) => msg,
            },
            propsData: {
                visible: true,
            },
            localVue,
            store,
            router,
        })
    }
    )

    it('Should render ', () => {
        expect(wrapper).not.toBeNull()
    })

    it('Should emit true when provided a right password and when showPassword is set to false', async () => {
        wrapper.setProps({returnPassword: false})
        wrapper.setData({password: hdAccountData.password})
        wrapper.vm.submit()
        await flushPromises()

        expect(wrapper.emitted('passwordValidated').length).toBe(1)
        expect(wrapper.emitted('passwordValidated')).toEqual([[true]])
    })

    it('Should emit the password when provided a right password and when showPassword is set to true', async () => {
        wrapper.setProps({returnPassword: true})
        wrapper.setData({password: hdAccountData.password})
        wrapper.vm.submit()
        await flushPromises()

        expect(wrapper.emitted('passwordValidated').length).toBe(1)
        expect(wrapper.emitted('passwordValidated')).toEqual([[hdAccountData.password]])
    })

    it('Should emit false when a wrong password', async () => {
        wrapper.setProps({returnPassword: false})
        wrapper.setData({password: 'wrongPassword'})
        wrapper.vm.submit()
        await flushPromises()

        expect(wrapper.emitted('passwordValidated').length).toBe(1)
        expect(wrapper.emitted('passwordValidated')).toEqual([[false]])
    })
})

import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'view-design'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
// @ts-ignore
import SettingPassword from '@/views/setting/setting-password/SettingPassword.vue'
import {accountMutations, accountState} from '@/store/account'
import {appMutations, appState} from '@/store/app'
import {veeValidateConfig} from "@/core/validation"
import VueRx from "vue-rx"
import flushPromises from 'flush-promises'
import {
    mosaicsLoading,
    multisigAccountInfo,
    mosaics,
    hdAccount,
    hdAccountData,
    // @ts-ignore
} from "@@/mock/conf/conf.spec"
import {AppWallet, CurrentAccount} from "@/core/model"
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

describe('SettingPassword', () => {
    let store
    let wrapper
    let state
    beforeEach(() => {
        store = new Vuex.Store({
                modules: {
                    account: {
                        state: Object.assign(accountState.state, {
                            mosaics,
                            multisigAccountInfo,
                            wallet: new AppWallet(hdAccount.wallets[0]),
                            currentAccount: new CurrentAccount(hdAccount.accountName, hdAccount.password, hdAccount.networkType),
                        }),
                        mutations: accountMutations.mutations,
                    },
                    app: {
                        state: Object.assign(appState.state, {mosaicsLoading}),
                        mutations: appMutations.mutations
                    }
                }
            }
        )
        wrapper = shallowMount(SettingPassword, {
            sync: false,
            mocks: {
                $t: (msg) => msg,
            },
            localVue,
            store,
            router,
        })
    })

    it('Should render ', () => {
        expect(wrapper).not.toBeNull()
    })

    it('Should call saveNewPassword with the correct params ', async () => {
        const saveNewPasswordMock = jest.fn(x => x)
        const appAccountsMock = jest.fn().mockImplementation(function () {
            return {saveNewPassword: saveNewPasswordMock};
        });

        const previousPassword = hdAccountData.password
        const newPassword = 'thisIsANewPassword'
        const confirmPassword = 'thisIsANewPassword'

        wrapper.setData({
            formItems: {
                previousPassword,
                newPassword,
                confirmPassword,
            },
        })
        wrapper.vm.AppAccounts = appAccountsMock
        wrapper.vm.submit()
        await flushPromises()

        expect(saveNewPasswordMock).toHaveBeenCalledTimes(1)

        expect(saveNewPasswordMock).toHaveBeenCalledWith(
            previousPassword,
            newPassword,
            hdAccount.password,
            hdAccount.accountName,
            store,
        )
    })


    it('Should not call saveNewPassword when a wrong password is provided ', async () => {
        const saveNewPasswordMock = jest.fn(x => x)
        const appAccountsMock = jest.fn().mockImplementation(function () {
            return {saveNewPassword: saveNewPasswordMock};
        });
        wrapper.vm.AppAccounts = appAccountsMock

        wrapper.setData({
            formItems: {
                previousPassword: 'thisIsAWrongPassword',
                newPassword: 'thisIsANewPassword',
                confirmPassword: 'thisIsANewPassword',
            },
        })
        await flushPromises()
        wrapper.vm.submit()

        expect(saveNewPasswordMock).toHaveBeenCalledTimes(0)
    })


    it('Should not call saveNewPassword when passwords do not match', async () => {
        const saveNewPasswordMock = jest.fn(x => x)
        const appAccountsMock = jest.fn().mockImplementation(function () {
            return {saveNewPassword: saveNewPasswordMock};
        });
        wrapper.vm.AppAccounts = appAccountsMock

        wrapper.setData({
            formItems: {
                previousPassword: hdAccountData.password,
                newPassword: 'thisIsANewPassword',
                confirmPassword: 'thisIsADifferentNewPassword',
            },
        })
        await flushPromises()
        wrapper.vm.submit()

        expect(saveNewPasswordMock).toHaveBeenCalledTimes(0)
    })
})

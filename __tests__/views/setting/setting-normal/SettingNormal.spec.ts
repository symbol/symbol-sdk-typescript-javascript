import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'view-design'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
// @ts-ignore
import SettingNormal from '@/views/setting/setting-normal/SettingNormal.vue'
import {accountMutations, accountState} from '@/store/account'
import {appMutations, appState} from '@/store/app'
import {veeValidateConfig} from "@/core/validation"
import VueRx from "vue-rx"
import flushPromises from 'flush-promises'
import i18n from '@/language/index.ts'
import {hdAccount} from "@MOCKS/index"
import {AppWallet} from "@/core/model"
import {localRead} from "@/core/utils"
import {explorerLinkList} from "@/config"
// @ts-ignore
const localVue = createLocalVue()
const router = new VueRouter()
localVue.use(VueRouter)
localVue.use(iView)
localVue.use(Vuex)
localVue.use(VeeValidate, veeValidateConfig)
localVue.use(VueRx)
// close warning
config.logModifiedComponents = false

describe('SettingNormal', () => {
    let store
    let wrapper
    let state
    beforeEach(() => {
        store = new Vuex.Store({
                modules: {
                    account: {
                        state: Object.assign(accountState.state, {
                            wallet: AppWallet.createFromDTO(hdAccount.wallets[0])
                        }),
                        mutations: accountMutations.mutations,
                    },
                    app: {
                        state: Object.assign(appState.state),
                        mutations: appMutations.mutations
                    }
                }
            }
        )
        wrapper = shallowMount(SettingNormal, {
            sync: false,
            mocks: {
                $t: (msg) => msg,
            },
            i18n,
            localVue,
            store,
            router,
        })
    })

    it('SettingNormal should be render correctly', () => {
        expect(wrapper).not.toBeNull()
    })

    it('should not update while the url is not right', async () => {
        const testUrl = '1.2.3.4'
        wrapper.vm.currentExplorerLink = testUrl
        wrapper.vm.setExplorerBasePath()
        await flushPromises()

        expect(store.state.app.explorerBasePath).toBe(explorerLinkList[0].explorerBasePath)
    })

    it('should update correctly while the url is right', async () => {
        const testUrl = 'http://1.2.3.4'
        wrapper.vm.currentExplorerLink = testUrl
        wrapper.vm.setExplorerBasePath()
        await flushPromises()
        const explorerLinkList = JSON.parse(localRead('explorerLinkList'))

        expect(store.state.app.explorerBasePath).toBe(testUrl)
        expect(explorerLinkList.find(item => item.explorerBasePath == testUrl)).not.toBe(null)
    })
})

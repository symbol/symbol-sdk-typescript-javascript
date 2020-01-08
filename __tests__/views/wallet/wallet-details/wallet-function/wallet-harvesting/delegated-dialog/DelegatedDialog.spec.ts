import {config, createLocalVue, shallowMount} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'view-design'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
// @ts-ignore
import DelegatedDialog from '@/components/forms/delegated-dialog/DelegatedDialog.vue'
import {accountMutations, accountState} from '@/store/account/index.ts'
import {appMutations, appState} from '@/store/app/index.ts'
import {veeValidateConfig} from "@/core/validation/index.ts"
import VueRx from "vue-rx"
import {
    mosaicsLoading,
    hdAccountTestNet,
    //@ts-ignore
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
    inserted: function (el, binding) {
        el.focus()
    }
})
// close warning
config.logModifiedComponents = false

describe('DelegatedDialog', () => {
    let store
    let wrapper
    let state
    beforeEach(() => {
        store = store = new Vuex.Store({
            modules: {
                account: {
                    state: Object.assign(accountState.state, {
                        wallet: hdAccountTestNet.wallets[0],
                    }),
                    mutations: accountMutations.mutations
                },
                app: {
                    state: Object.assign(appState.state, {
                        mosaicsLoading,
                        loadingOverlay: {
                            temporaryInfo: {
                                password: ''
                            }
                        }
                    }),
                    mutations: appMutations.mutations
                }
            }
        })
        wrapper = shallowMount(DelegatedDialog, {
            sync: false,
            mocks: {
                $t: (msg) => msg,
            },
            localVue,
            store,
            router,
        })
        wrapper.setProps({visible: true})
    })
    it('Wrapper should emit close when show is set to false', async () => {
        wrapper.setData({show: false})
        expect(wrapper.emitted().closeDialog).toBeTruthy()
    })

})

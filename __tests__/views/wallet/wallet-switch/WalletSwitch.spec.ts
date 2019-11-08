import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
// @ts-ignore
import WalletSwitch from '@/views/wallet/wallet-switch/WalletSwitch.vue'
import {accountState} from '@/store/account'
import {appState} from '@/store/app'
import {veeValidateConfig} from "@/core/validation"
import {
    multisigAccountInfo,
    mosaics,
    networkCurrency,
    hdAccount,
    // @ts-ignore
} from "@@/mock/conf/conf.spec"


// @ts-ignore
const localVue = createLocalVue()
const router = new VueRouter()
localVue.use(VueRouter)
localVue.use(iView)
localVue.use(Vuex)
localVue.use(VeeValidate, veeValidateConfig)
localVue.directive('focus', {
    inserted: function (el, binding) {
        el.focus()
    }
})

jest.mock('nem2-qr-library')
// close warning
config.logModifiedComponents = false

describe('WalletSwitch', () => {
    let store
    let wrapper
    beforeEach(() => {
        store = store = new Vuex.Store({
                modules: {
                  account: {
                      state: Object.assign(accountState.state, {
                        wallet: hdAccount.wallets[0],
                        mosaics,
                        networkCurrency,
                        multisigAccountInfo,
                        accountName: hdAccount.accountName,
                      }),
                  },
                  app: {
                    state: Object.assign(appState.state, {
                      walletList: hdAccount.wallets
                    }),
                  },
                }
            })
        wrapper = shallowMount(WalletSwitch, {
            sync: false,
            mocks: {
                $t: (msg) => msg,
            },
            computed: {
                cipher() {
                    return hdAccount.password
                },
            },
            localVue,
            store,
            router,
        })
    })

    it('Component WalletSwitch is not null ', () => {
        expect(wrapper).not.toBeNull()
    })

    it('getPathNumber should return the appropriate value', () => {
      const seedPathList1 = []
      expect(wrapper.vm.getPathNumber(seedPathList1)).toBe(0)
      const seedPathList2 = ['1', '2', '3']
      expect(wrapper.vm.getPathNumber(seedPathList2)).toBe(0)
      const seedPathList3 = ['0', '1', '2', '3']
      expect(wrapper.vm.getPathNumber(seedPathList3)).toBe(4)
      const seedPathList4 = ['0', '1', '3']
      expect(wrapper.vm.getPathNumber(seedPathList4)).toBe(2)
    })
})

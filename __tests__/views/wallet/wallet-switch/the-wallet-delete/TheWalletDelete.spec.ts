import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'view-design'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
import flushPromises from 'flush-promises'
// @ts-ignore
import TheWalletDelete from '@/views/wallet/wallet-switch/the-wallet-delete/TheWalletDelete.vue'
import {accountMutations, accountState} from '@/store/account'
import {appMutations, appState} from '@/store/app'
import {veeValidateConfig} from "@/core/validation"
import {
  hdAccount,
  hdAccountData
} from "@MOCKS/index"


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
              currentAccount: hdAccount,
          }),
          mutations: accountMutations.mutations,
        },
        app: {
          state: Object.assign(appState.state, {
            walletList: hdAccount.wallets
          }),
          mutations: appMutations.mutations
        },
      }
    })
    wrapper = shallowMount(TheWalletDelete, {
      sync: false,
      mocks: {
        $t: (msg) => msg,
      },
      propsData: {
        showCheckPWDialog: true,
        walletToDelete: hdAccount.wallets[0]
      },
      localVue,
      store,
      router,
    })
  })

  it('Component TheWalletDelete should mount correctly ', () => {
    expect(wrapper).not.toBeNull()
  })


})

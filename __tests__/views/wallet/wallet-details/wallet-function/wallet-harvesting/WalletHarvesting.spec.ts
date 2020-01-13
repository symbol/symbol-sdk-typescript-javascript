import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'view-design'
import Vuex from 'vuex'
// @ts-ignore
import WalletHarvesting from '@/views/wallet/wallet-details/wallet-function/wallet-harvesting/WalletHarvesting.vue'
import {accountState, accountMutations} from '@/store/account'
import {appState} from '@/store/app'
import {networkCurrency, hdAccount} from '@MOCKS/index'


// @ts-ignore
const localVue = createLocalVue()
const router = new VueRouter()
localVue.use(VueRouter)
localVue.use(iView)
localVue.use(Vuex)
localVue.directive('focus', {
  inserted: function (el) {
    el.focus()
  },
})

jest.mock('nem2-qr-library')
// close warning
config.logModifiedComponents = false

describe('WalletHarvesting', () => {
  let store
  let wrapper
  beforeEach(() => {
    store = store = new Vuex.Store({
      modules: {
        account: {
          state: Object.assign(accountState.state, {
            wallet: hdAccount.wallets[0],
            networkCurrency,
          }),
          mutations: accountMutations.mutations,
        },
        app: {
          state: appState.state,
        },
      },
    })
    wrapper = shallowMount(WalletHarvesting, {
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

  it('Component WalletHarvesting should load rightly ', () => {
    expect(wrapper).not.toBeNull()
  })

  it('should show activate buttons while remote account is not set ', () => {
    expect(wrapper.vm.linkedAddress).not.toBe(null)
  })

  it('should not show activate public key and  while remote account is not set ', () => {
    store.commit('SET_WALLET', Object.assign(hdAccount.wallets[0], {linkedAccountKey: null}))
    expect(wrapper.vm.linkedAddress).toBe(null)
  })
})

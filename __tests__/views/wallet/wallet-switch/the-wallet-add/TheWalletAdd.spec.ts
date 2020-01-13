import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'view-design'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
// @ts-ignore
import TheWalletAdd from '@/views/wallet/wallet-switch/the-wallet-add/TheWalletAdd.vue'
import {accountState} from '@/store/account'
import {appMutations, appState} from '@/store/app'
import {veeValidateConfig} from '@/core/validation'
import {
  multisigAccountInfo,
  mosaics,
  networkCurrency,
  hdAccount,
} from '@MOCKS/index'

// @ts-ignore
const localVue = createLocalVue()
const router = new VueRouter()
localVue.use(VueRouter)
localVue.use(iView)
localVue.use(Vuex)
localVue.use(VeeValidate, veeValidateConfig)
localVue.directive('focus', {
  inserted: function (el) {
    el.focus()
  },
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
            walletList: hdAccount.wallets,
          }),
          mutations: appMutations.mutations,
        },
      },
    })
    wrapper = shallowMount(TheWalletAdd, {
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

  it('the initial pathToCreate should return 4', () => {
    expect(wrapper.vm.pathToCreate).toBe(4)
  })

  it('the initial pathToCreate should return 1', () => {
    wrapper.vm.$store.commit('SET_WALLET_LIST',[ hdAccount.wallets[0],hdAccount.wallets[2],hdAccount.wallets[3] ])
    expect(wrapper.vm.pathToCreate).toBe(1)
  })

  it('the initial pathToCreate should return 1', () => {
    wrapper.vm.$store.commit('SET_WALLET_LIST',[])
    expect(wrapper.vm.pathToCreate).toBe(0)
  })

  it('the initial pathToCreate should return 2', () => {
    wrapper.vm.$store.commit('SET_WALLET_LIST',[ hdAccount.wallets[0],hdAccount.wallets[1],hdAccount.wallets[3] ])
    expect(wrapper.vm.pathToCreate).toBe(2)
  })

  it('the initial pathToCreate should return 2', () => {
    wrapper.vm.$store.commit('SET_WALLET_LIST', [...Array(10)].map(() => hdAccount.wallets[0]))
    expect(wrapper.vm.pathToCreate).toBe(undefined)
  })
})

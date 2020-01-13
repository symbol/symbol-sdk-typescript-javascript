import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
// @ts-ignore
import DisabledForms from '@/components/disabled-forms/DisabledForms.vue'
import {Alert} from 'view-design'
import {accountMutations, accountState} from '@/store/account'
import {appMutations, appState} from '@/store/app'
import {veeValidateConfig} from '@/core/validation'
import VueRx from 'vue-rx'
import moment from 'vue-moment'
import {
  mosaicsLoading,
  multisigAccountInfo,
  mosaics,
  CosignWallet,
  MultisigWallet,
  networkProperties,
} from '@MOCKS/index'
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
  inserted: function (el) {
    el.focus()
  },
})
// close warning
config.logModifiedComponents = false

describe('DisabledForms', () => {
  let store
  let wrapper
  beforeEach(() => {
    store = store = new Vuex.Store({
      modules: {
        account: {
          state: Object.assign(accountState.state, {
            wallet: CosignWallet,
            mosaics,
            multisigAccountInfo,
          }),
          mutations: accountMutations.mutations,
        },
        app: {
          state: Object.assign(appState.state, {
            mosaicsLoading,

          }),
          mutations: appMutations.mutations,
        },
      },
    },
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
  },
  )

  it('should not exists while networkProperties is set and current wallet is not a multisig ', async () => {
    store.commit('SET_NETWORK_PROPERTIES', networkProperties)
    expect(wrapper.vm.active).toBe(false)
  })

  it('should exists while default mosaic is not set', async () => {
    store.commit('SET_NETWORK_PROPERTIES', {generationHash:''})
    expect(wrapper.vm.active).toBe(true)
  })

  it('should exists while activeAccount is a multisig', async () => {
    store.commit('SET_NETWORK_PROPERTIES', networkProperties)
    store.commit('SET_WALLET', MultisigWallet)
    expect(wrapper.vm.active).toBe(false)
  })
})

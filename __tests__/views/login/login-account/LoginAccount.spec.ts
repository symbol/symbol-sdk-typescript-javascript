import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'view-design'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
// @ts-ignore
import LoginAccount from '@/views/login/login-account/LoginAccount.vue'
import {accountMutations, accountState, accountActions} from '@/store/account'
import {veeValidateConfig} from '@/core/validation'
import VueRx from 'vue-rx'
import i18n from '@/language'
import {localSave} from '@/core/utils'
import {hdAccount, hdAccountData} from '@MOCKS/index'
import flushPromises from 'flush-promises'
import {appMutations,appState} from '@/store/app'

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
  },
})
// close warning
config.logModifiedComponents = false

describe('LoginAccount', () => {
  localSave('accountMap',JSON.stringify({testAccount:hdAccount}))
  let store
  let wrapper
  beforeEach(() => {

    store = store = new Vuex.Store({
      modules: {
        account: {
          state: accountState.state,
          mutations: accountMutations.mutations,
          actions: accountActions.actions,
        },
        app:{
          state: appState.state,
          mutations: appMutations.mutations,
        },
      },
    },
    )
    wrapper = shallowMount(LoginAccount, {
      sync: false,
      mocks: {
        $t: (msg) => msg,
      },
      i18n,
      localVue,
      store,
      router,
    })
  },
  )

  it('should save account and node info in store while password is right', async (done) => {
    wrapper.vm.$nextTick(()=>{ wrapper.vm.$validator.reset()})
    wrapper.vm.formItems.currentAccountName = 'testAccount'
    wrapper.vm.formItems.password = hdAccountData.password
    wrapper.vm.submit()
    await flushPromises()
    expect(wrapper.vm.errors.items.length).toBe(0)
    expect(wrapper.vm.$store.state.account.currentAccount.name).toBe('testAccount')
    expect(wrapper.vm.$store.state.account.currentAccount.networkType).toBe(hdAccount.networkType)
    expect(wrapper.vm.$store.state.account.node).toBe('http://localhost:3000')
    done()
  })

  it('should compute accountsClassifiedByNetworkType',async() => {
    const expectedResult = {
      '144': ['testAccount'],
    }
    expect(wrapper.vm.accountsClassifiedByNetworkType).toStrictEqual(expectedResult)
  })
})

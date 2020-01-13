import {config, createLocalVue, shallowMount} from '@vue/test-utils'
import iView from 'view-design'
import CreateAccountInfo from '@/components/forms/create-account-info/CreateAccountInfo.vue'
import flushPromises from 'flush-promises'
import Vuex from 'vuex'
import {accountMutations, accountState} from '@/store/account'
import {appMutations, appState} from '@/store/app'
import VeeValidate from 'vee-validate'
import {veeValidateConfig} from '@/core/validation'
import {localSave} from '@/core/utils'
// @ts-ignore
const localVue = createLocalVue()
localVue.use(iView)
localVue.use(VeeValidate, veeValidateConfig)
localVue.use(Vuex)
localVue.directive('focus', {
  inserted: function (el) {
    el.focus()
  },
})
const $route = {
  path: 'importMnemonic',
  meta: {
    nextPage:'importMnemonic',
  },
}
// close warning
config.logModifiedComponents = false

describe('CreateAccountInfo', () => {
  let store
  let wrapper
  beforeEach(() => {
    store = store = new Vuex.Store({
      modules: {
        account: {
          state: accountState.state,
          mutations: accountMutations.mutations,
        },
        app: {
          state: appState.state,
          mutations: appMutations.mutations,
        },
      },
    },
    )

    wrapper = shallowMount(CreateAccountInfo, {
      sync: false,
      mocks: {
        $t: (msg) => msg,
        $route,
        $router:{
          push:() => {/* ignored */},
        },
      },
      localVue,
      store,
    })
  },
  )

  afterEach(()=>{
    wrapper.vm.$nextTick(() => wrapper.vm.$validator.reset())
  })


  it('should create a new account when password is valid', async () => {
    wrapper.vm.formItem = {
      accountName: 'accountName',
      password: 'p1_+/. !@#$%^&*()<>?:"{}[];',
      passwordAgain: 'p1_+/. !@#$%^&*()<>?:"{}[];',
      hint: '',
    }
    wrapper.vm.submit()
    await flushPromises()
    expect(wrapper.vm.errors.items.length).toBe(0)
  })

  it('should not create a new account when accountName existed', async () => {
    localSave('accountMap', JSON.stringify({'accountName': {}}))
    wrapper.vm.formItem = {
      accountName: 'accountName',
      password: 'accountPassword',
      passwordAgain: 'accountPassword',
      hint: '',
    }
    wrapper.vm.submit()
    await flushPromises()
    expect(wrapper.vm.errors.items.length).not.toBe(0)
  })

  it('should not create a new account when two passwords are not same', async () => {
    wrapper.vm.formItem = {
      accountName: 'accountName',
      password: 'accountPassword',
      passwordAgain: 'errorAccountPassword',
      hint: '',
    }
    wrapper.vm.submit()
    await flushPromises()
    expect(wrapper.vm.errors.items.length).not.toBe(0)
  })

  it('should not create a new account when password only contains alpha characters', async () => {
    wrapper.vm.formItem = {
      accountName: 'accountName',
      password: 'accountPassword',
      passwordAgain: 'accountPassword',
      hint: '',
    }
    wrapper.vm.submit()
    await flushPromises()
    expect(wrapper.vm.errors.items.length).not.toBe(0)
  })
  it('should not create a new account when password only contains numerical characters', async () => {
    wrapper.vm.formItem = {
      accountName: 'accountName',
      password: '12345678910',
      passwordAgain: '12345678910',
      hint: '',
    }
    wrapper.vm.submit()
    await flushPromises()
    expect(wrapper.vm.errors.items.length).not.toBe(0)
  })

})

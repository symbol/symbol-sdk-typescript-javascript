import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
// @ts-ignore
import CheckPasswordDialog from '@/components/check-password-dialog/CheckPasswordDialog.vue'
import {Modal} from 'view-design'
import {accountMutations, accountState} from '@/store/account'
import {appMutations, appState} from '@/store/app'
import {veeValidateConfig} from "@/core/validation"
import VueRx from "vue-rx"
import moment from 'vue-moment'
import flushPromises from 'flush-promises'

import i18n from '@/language/index.ts'
// @ts-ignore
const localVue = createLocalVue()
const router = new VueRouter()
localVue.use(VueRouter)
localVue.use(moment as any)
localVue.component('Modal', Modal)
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

describe('CheckPasswordDialog', () => {
  let store
  let wrapper
  let state
  beforeEach(() => {
      store = store = new Vuex.Store({
          modules: {
            account: {
              state: accountState.state,
              mutations: accountMutations.mutations
            },
            app: {
              state: appState.state,
              mutations: appMutations.mutations
            }
          }
        }
      )
      wrapper = shallowMount(CheckPasswordDialog, {
        sync: false,
        mocks: {
          $t: (msg) => msg,
        },
        propsData: {
          visible:true,
          returnPassword:true,
          dialogTitle:''
        },
        localVue,
        i18n,
        store,
        router,
      })
    }
  )

  it('should call $emit("passwordValidated") after submit', async () => {
    wrapper.vm.passwordValidated()
    await flushPromises()
    expect(wrapper.emitted('passwordValidated')).toBeTruthy()
  })

  it('should call $emit("close") after set show', async () => {
    wrapper.vm.show = false
    await flushPromises()
    expect(wrapper.emitted('close')).toBeTruthy()
  })

})

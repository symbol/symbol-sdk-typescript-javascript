import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'view-design'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'

// @ts-ignore
import ShowMnemonic from '@/views/login/create-account/show-mnemonic/ShowMnemonic.vue'
import {accountMutations, accountState} from '@/store/account'
import {appMutations, appState} from '@/store/app'
import {veeValidateConfig} from "@/core/validation"
import VueRx from "vue-rx"
import {
 mosaicsLoading,
 multisigAccountInfo,
 mosaics,
 CosignWallet
} from "@MOCKS/index"
import {NetworkType} from 'nem2-sdk'
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

const expectedMnemonic = "mirror reject rookie talk pudding throw happy era myth already payment own sentence push head sting video explain letter bomb casual hotel rather garment"

describe('ShowMnemonic', () => {
 let store
 let wrapper
 let state
 beforeEach(() => {
  store = store = new Vuex.Store({
   modules: {
    account: {
     state: Object.assign(accountState.state, {
      wallet: CosignWallet,
      mosaics,
      multisigAccountInfo,
      temporaryLoginInfo: {
       password: 'password',
       mnemonic: expectedMnemonic,
      },
      currentAccount: {
       networkType: NetworkType.TEST_NET,
       name: 'current account name',
      },
     }),
     mutations: accountMutations.mutations
    },
    app: {
     state: Object.assign(appState.state, {mosaicsLoading}),
     mutations: appMutations.mutations
    }
   }
  }
  )
  wrapper = shallowMount(ShowMnemonic, {
   sync: false,
   mocks: {
    $t: (msg) => msg,
   },
   localVue,
   store,
   router,
  })
 }
 )

 it('should return a mnemonic word list', () => {
  expect(wrapper.vm.mnemonicWordsList).toStrictEqual([
   'mirror', 'reject', 'rookie', 'talk', 'pudding', 'throw',
   'happy', 'era', 'myth', 'already', 'payment', 'own', 'sentence',
   'push', 'head', 'sting', 'video', 'explain', 'letter', 'bomb',
   'casual', 'hotel', 'rather', 'garment',
  ])
 })
})

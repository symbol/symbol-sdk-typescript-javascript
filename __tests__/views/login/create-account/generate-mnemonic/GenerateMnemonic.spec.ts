import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'view-design'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
import flushPromises from 'flush-promises'

// @ts-ignore
import GenerateMnemonic from '@/views/login/create-account/generate-mnemonic/GenerateMnemonic'
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
import {NoticeType} from '@/core/model'
import {Message} from '@/config'
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
const mockCreateFromMnemonicCall = jest.fn()
jest.mock('@/core/model/AppWallet', () => ({
 AppWallet: jest.fn().mockImplementation((...args) => ({
  createFromMnemonic: (...args) => mockCreateFromMnemonicCall(args),
 }))
}))

const mockNoticeTrigger = jest.fn()
jest.mock('@/core/model/Notice', () => ({
 Notice: ({
  trigger: (...args) => mockNoticeTrigger(args),
 })
}))

const mockLocalSave = jest.fn()
jest.mock('@/core/utils/utils', (...args) => ({
 localSave: (...args) => mockLocalSave(args),
 localRead: x => x,
}))

describe('GenerateMnemonic', () => {
 let store
 let wrapper
 let state
 beforeEach(() => {
  mockNoticeTrigger.mockClear()

  store = store = new Vuex.Store({
   modules: {
    account: {
     state: Object.assign(accountState.state, {
      wallet: CosignWallet,
      mosaics,
      multisigAccountInfo,
      temporaryLoginInfo: {password: 'password'},
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
  })
  wrapper = shallowMount(GenerateMnemonic, {
   sync: false,
   mocks: {
    $t: (msg) => msg,
   },
   localVue,
   store,
   router,
  })
 })

 it('handleMousemove should generate entropy and increment percent', () => {
  wrapper.vm.handleMousemove({x: 1, y: 2})
  wrapper.vm.handleMousemove({x: 3, y: 4})
  wrapper.vm.handleMousemove({x: 5, y: 6})
  wrapper.vm.handleMousemove({x: 7, y: 8})

  expect(wrapper.vm.entropy).toBe('12345678')
  expect(wrapper.vm.percent).toBe(4)
 })

 it('it should commit a mnemonic when percent is 100', async (done) => {
  wrapper.setData({
   percent: 97,
  })

  wrapper.vm.handleMousemove({x: 1, y: 2})
  wrapper.vm.handleMousemove({x: 3, y: 4})
  wrapper.vm.handleMousemove({x: 5, y: 6})
  wrapper.vm.handleMousemove({x: 7, y: 8})
  await flushPromises()

  const expectedMnemonic = "mirror reject rookie talk pudding throw happy era myth already payment own sentence push head sting video explain letter bomb casual hotel rather garment"

  expect(wrapper.vm.entropy).toBe('123456')
  expect(wrapper.vm.$store.state.account.temporaryLoginInfo.mnemonic).toBe(expectedMnemonic)
  done()
 })

 it('it should trigger an error notice if the entropy is empty', async (done) => {
  wrapper.setData({
   percent: 100,
  })
  wrapper.vm.handleMousemove({x: null, y: null})

  await flushPromises()

  expect(mockNoticeTrigger.mock.calls[0][0]).toStrictEqual([
   Message.MNEMONIC_GENERATION_ERROR,
   NoticeType.error,
   wrapper.vm.$store,
  ])
  done()
 })
})

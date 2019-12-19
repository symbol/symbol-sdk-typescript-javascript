import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'view-design'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
import App from '@/app/App.vue'
import {accountMutations, accountState} from '@/store/account'
import {appMutations, appState, appActions} from '@/store/app'
import {veeValidateConfig} from '@/core/validation'
import VueRx from 'vue-rx'
import {mosaicsLoading, multisigAccountInfo, mosaics, MultisigWallet,
} from '@MOCKS/index'
import {NetworkProperties, NetworkManager, Listeners, Notice, NoticeType} from '@/core/model'
import {setMarketOpeningPrice} from '@/core/services'

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

jest.mock('@/core/services/marketData')
jest.mock('@/core/services/eventHandlers/onActiveMultisigAccountChange')
jest.mock('@/core/services/eventHandlers/onWalletChange')

config.logModifiedComponents = false

describe('App', () => {
  let store
  let wrapper

  beforeEach(() => {
    // @ts-ignore
    setMarketOpeningPrice.mockClear()
    store = store = new Vuex.Store({
      modules: {
        account: {
          state: Object.assign(accountState.state, {
            wallet: MultisigWallet,
            mosaics,
            multisigAccountInfo,
          }),
          mutations: accountMutations.mutations,
          actions: appActions.actions,
        },
        app: {
          state: Object.assign(appState.state, {mosaicsLoading}),
          mutations: appMutations.mutations,
        },
      },
    })

    store.state.app.NetworkProperties = NetworkProperties.create(store)
    store.state.app.NetworkProperties.height = 666

    wrapper = shallowMount(App, {
      sync: false,
      mocks: {
        $t:msg => msg,
      },
      localVue,
      store,
      router,
    })
  })

  it('Should call the initialization methods when created and mounted', () => {
    expect(wrapper.vm.Listeners).toBeInstanceOf(Listeners)
    expect(wrapper.vm.NetworkManager).toBeInstanceOf(NetworkManager)
    expect(store.state.app.NetworkProperties).toBeInstanceOf(NetworkProperties)
    expect(store.state.app.NetworkProperties).not.toBe(null)
  })

  it('The Notice should be triggered when TRIGGER_NOTICE is committed', () => {
    const mockNoticeDestroy = jest.fn()
    const mockNoticeSuccess = jest.fn()
    wrapper.vm.$Notice = {
      destroy: mockNoticeDestroy,
      success: mockNoticeSuccess,
    }
    // @ts-ignore
    store.commit('TRIGGER_NOTICE', new Notice('this is a message', NoticeType.success))
    expect(mockNoticeDestroy).toHaveBeenCalledTimes(1)
    expect(mockNoticeSuccess).toHaveBeenCalledTimes(1)
    expect(mockNoticeSuccess.mock.calls[0][0]).toStrictEqual({ title: 'this is a message' })
  })
})
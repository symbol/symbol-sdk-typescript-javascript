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
import {setMarketOpeningPrice, TransactionFormatter} from '@/core/services'

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

const mockActions = jest.fn()

config.logModifiedComponents = false

describe('App', () => {
  let store
  let wrapper

  beforeEach(() => {
    // @ts-ignore
    setMarketOpeningPrice.mockClear()
    mockActions.mockClear()
    store = store = new Vuex.Store({
      modules: {
        account: {
          state: Object.assign(accountState.state, {
            wallet: MultisigWallet,
            mosaics,
            multisigAccountInfo,
          }),
          mutations: accountMutations.mutations,
        },
        app: {
          state: Object.assign(appState.state, {mosaicsLoading}),
          mutations: appMutations.mutations,
          actions: appActions.actions,
        },
      },
    })

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
    expect(store.state.app.listeners).toBeInstanceOf(Listeners)
    expect(store.state.app.networkManager).toBeInstanceOf(NetworkManager)
    expect(store.state.app.networkProperties).toBeInstanceOf(NetworkProperties)
    expect(store.state.app.transactionFormatter).toBeInstanceOf(TransactionFormatter)
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
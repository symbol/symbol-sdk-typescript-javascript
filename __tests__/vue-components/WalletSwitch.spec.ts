import Vuex from 'vuex'
import vueStore from '@/store/index.ts'
import {shallowMount, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
// @ts-ignore
import WalletSwitch from '@/views/wallet/wallet-switch/WalletSwitch.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView);
const router = new VueRouter()

describe('WalletSwitch', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component WalletSwitch is not null', () => {
    const wrapper = shallowMount(WalletSwitch, {
        mocks: {
            $t: (msg) => msg
        },
        localVue,
        router,
        store
    })
    expect(wrapper).not.toBeNull()
})})


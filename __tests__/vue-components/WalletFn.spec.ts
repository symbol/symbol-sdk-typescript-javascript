import Vuex from 'vuex'
import vueStore from '@/store/index.ts'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView);
const router = new VueRouter()
// @ts-ignore
import WalletFn from '@/views/wallet/wallet-fn/WalletFn.vue'


describe('WalletFn', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component WalletFn is not null', () => {
    const wrapper = shallowMount(WalletFn, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


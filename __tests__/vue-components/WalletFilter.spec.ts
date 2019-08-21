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
import WalletFilter from '@/views/wallet/wallet-details/wallet-function/wallet-filter/WalletFilter.vue'


describe('WalletFilter', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component WalletFilter is not null', () => {
    const wrapper = shallowMount(WalletFilter, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


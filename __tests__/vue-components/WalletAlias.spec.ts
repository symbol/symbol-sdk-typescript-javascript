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
import WalletAlias from '@/views/wallet/wallet-details/wallet-function/wallet-alias/WalletAlias.vue'


describe('WalletAlias', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component WalletAlias is not null', () => {
    const wrapper = shallowMount(WalletAlias, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


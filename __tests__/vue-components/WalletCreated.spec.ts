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
import WalletCreated from '@/views/wallet/wallet-functions/wallet-created/WalletCreated.vue'


describe('WalletCreated', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component WalletCreated is not null', () => {
    const wrapper = shallowMount(WalletCreated, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


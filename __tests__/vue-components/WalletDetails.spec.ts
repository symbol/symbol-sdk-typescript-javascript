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
import WalletDetails from '@/views/wallet/wallet-details/WalletDetails.vue'


describe('WalletDetails', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component WalletDetails is not null', () => {
    const wrapper = shallowMount(WalletDetails, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


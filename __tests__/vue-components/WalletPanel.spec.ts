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
import WalletPanel from '@/views/wallet/wallet-panel/WalletPanel.vue'


describe('WalletPanel', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component WalletPanel is not null', () => {
    const wrapper = shallowMount(WalletPanel, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


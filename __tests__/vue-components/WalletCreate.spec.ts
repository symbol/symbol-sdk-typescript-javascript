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
import WalletCreate from '@/views/wallet/wallet-create/WalletCreate.vue'


describe('WalletCreate', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component WalletCreate is not null', () => {
    const wrapper = shallowMount(WalletCreate, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


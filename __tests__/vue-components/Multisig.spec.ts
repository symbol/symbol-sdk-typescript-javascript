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
import Multisig from '@/views/service/multisig/Multisig.vue'


describe('Multisig', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component Multisig is not null', () => {
    const wrapper = shallowMount(Multisig, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


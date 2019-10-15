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
import RootNamespace from '@/views/namespace/namespace-function/root-namespace/RootNamespace.vue'


describe('RootNamespace', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component RootNamespace is not null', () => {
    const wrapper = shallowMount(RootNamespace, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


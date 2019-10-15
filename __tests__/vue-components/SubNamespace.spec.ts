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
import SubNamespace from '@/views/namespace/namespace-function/sub-namespace/SubNamespace.vue'


describe('SubNamespace', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component SubNamespace is not null', () => {
    const wrapper = shallowMount(SubNamespace, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


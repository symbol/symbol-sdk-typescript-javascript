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
import NamespaceList from '@/views/service/namespace/namespace-function/namespace-list/NamespaceList.vue'


describe('NamespaceList', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component NamespaceList is not null', () => {
    const wrapper = shallowMount(NamespaceList, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


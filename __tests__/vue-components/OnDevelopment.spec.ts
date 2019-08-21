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
import OnDevelopment from '@/views/other/on-development/OnDevelopment.vue'


describe('OnDevelopment', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component OnDevelopment is not null', () => {
    const wrapper = shallowMount(OnDevelopment, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


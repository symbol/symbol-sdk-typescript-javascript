import Vuex from 'vuex'
import vueStore from '@/store/index.ts'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
// @ts-ignore
import Mosaic from '@/views/mosaic/Mosaic.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView);
const router = new VueRouter()

describe('Mosaic', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component Mosaic is not null', () => {
    const wrapper = shallowMount(Mosaic, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


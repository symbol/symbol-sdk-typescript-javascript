import vueStore from '@/store/index.ts'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView);
const router = new VueRouter()
// @ts-ignore
import ServiceSwitch from '@/views/service/service-switch/ServiceSwitch.vue'


describe('ServiceSwitch', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component ServiceSwitch is not null', () => {
    const wrapper = shallowMount(ServiceSwitch, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


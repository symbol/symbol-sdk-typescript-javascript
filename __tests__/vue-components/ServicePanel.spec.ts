import vueStore from '@/store/index.ts'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView);
const router = new VueRouter()
// @ts-ignore
import ServicePanel from '@/views/service/service-panel/ServicePanel.vue'


describe('ServicePanel', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component ServicePanel is not null', () => {
    const wrapper = shallowMount(ServicePanel, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


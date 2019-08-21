import vueStore from '@/store/index.ts'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
// @ts-ignore
import MonitorMarket from '@/views/monitor/monitor-market/MonitorMarket.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView);
const router = new VueRouter()

describe('MonitorMarket', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component MonitorMarket is not null', () => {
    const wrapper = shallowMount(MonitorMarket, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


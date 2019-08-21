import vueStore from '@/store/index.ts'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
// @ts-ignore
import MonitorPanel from '@/views/monitor/monitor-panel/MonitorPanel.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView);
const router = new VueRouter()

describe('MonitorPanel', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component MonitorPanel is not null', () => {
    const wrapper = shallowMount(MonitorPanel, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


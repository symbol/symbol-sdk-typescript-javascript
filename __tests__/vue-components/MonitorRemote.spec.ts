import vueStore from '@/store/index.ts'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
// @ts-ignore
import MonitorRemote from '@/views/monitor/monitor-remote/MonitorRemote.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView);
const router = new VueRouter()

describe('MonitorRemote', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component MonitorRemote is not null', () => {
    const wrapper = shallowMount(MonitorRemote, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


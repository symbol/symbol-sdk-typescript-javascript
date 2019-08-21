import Vuex from 'vuex'
import vueStore from '@/store/index.ts'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
// @ts-ignore
import MonitorTransfer from '@/views/monitor/monitor-transfer/MonitorTransfer.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView);
const router = new VueRouter()

describe('MonitorTransfer', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component MonitorTransfer is not null', () => {
    const wrapper = shallowMount(MonitorTransfer, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


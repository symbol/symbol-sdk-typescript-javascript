import {config, mount, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'view-design'
import Monitor from '@/views/monitor/monitor-dashboard/MonitorDashBoard.vue'
import vueStore from '@/store'
// @ts-ignore
const localVue = createLocalVue()
const router = new VueRouter()
localVue.use(VueRouter)
localVue.use(iView)
// close warning
config.logModifiedComponents = false
describe('MonitorDashBoard', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )

    it('Component MonitorDashBoard is not null ', () => {
        const wrapper = mount(Monitor, {
            mocks: {
                $t: (msg) => msg
            },
            localVue,
            router,
            store
        })
        expect(wrapper).not.toBeNull()
    })
})

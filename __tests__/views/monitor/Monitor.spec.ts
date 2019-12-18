import {shallowMount, config, mount, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'view-design'
// @ts-ignore
import Monitor from '@/views/monitor/Monitor.vue'
import vueStore from '@/store'
import {NetworkProperties} from '@/core/model'
// @ts-ignore
const localVue = createLocalVue()
const router = new VueRouter()
localVue.use(VueRouter)
localVue.use(iView)
// close warning
config.logModifiedComponents = false
describe('Monitor', () => {
    let store
    beforeEach(() => {
            store = vueStore
            store.state.app.NetworkProperties = NetworkProperties.create(store)
        }
    )

    it('Component Monitor is not null ', () => {
        const wrapper = shallowMount(Monitor, {
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

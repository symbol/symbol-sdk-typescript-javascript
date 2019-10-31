import {shallowMount, config, mount, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
// @ts-ignore
import Monitor from '@/views/monitor/Monitor.vue'
import vueStore from '@/store'
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

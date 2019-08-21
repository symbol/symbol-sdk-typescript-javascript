import Vuex from 'vuex'
import vueStore from '@/store/index.ts'
import {shallowMount, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
// @ts-ignore
import LineChartByDay from '@/common/vue/line-chart-by-day/LineChartByDay.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView);
const router = new VueRouter()

describe('LineChart', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )

    it('Component LineChartByDay is not null', () => {
        const wrapper = shallowMount(LineChartByDay, {
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

import Vuex from 'vuex'
import vueStore from '@/store/index.ts'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
// @ts-ignore
import LineChart from '@/common/vue/line-chart/LineChart.vue'

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
it('Component LineChart is not null', () => {
    const wrapper = shallowMount(LineChart, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


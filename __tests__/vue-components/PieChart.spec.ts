import vueStore from '@/store/index.ts'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView);
const router = new VueRouter()
// @ts-ignore
import PieChart from '@/views/community/vote/PieChart.vue'


describe('PieChart', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component CollectionRecord is not null', () => {
    const wrapper = shallowMount(PieChart, {
        mocks: {
            $t: (msg) => msg
        },
        localVue,
        router,
        store
    })
    expect(wrapper).not.toBeNull()
})})


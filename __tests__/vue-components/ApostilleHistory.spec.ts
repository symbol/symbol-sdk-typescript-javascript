import vueStore from '@/store/index.ts'
import {shallowMount, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
// @ts-ignore
import ApostilleHistory from '@/views/service/apostille/apostille-function/apostille-history/ApostilleHistory.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView);
const router = new VueRouter()

describe('ApostilleHistory', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
    it('Component ApostilleHistory is not null', () => {
        const wrapper = shallowMount(ApostilleHistory, {
            mocks: {
                $t: (msg) => msg
            }, localVue,
            router, store
        })
        expect(wrapper).not.toBeNull()
    })
})


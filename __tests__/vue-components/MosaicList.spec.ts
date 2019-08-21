import vueStore from '@/store/index.ts'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
// @ts-ignore
import MosaicList from '@/views/service/mosaic/mosaic-function/mosaic-list/MosaicList.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView);
const router = new VueRouter()

describe('MosaicList.vue', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component MosaicList should not be null', () => {
    const wrapper = shallowMount(MosaicList, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


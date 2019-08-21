import Vuex from 'vuex'
import vueStore from '@/store/index.ts'
import {shallowMount, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
// @ts-ignore
import MosaicTransaction from '@/views/service/mosaic/mosaic-function/mosaic-transaction/MosaicTransaction.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView);
const router = new VueRouter()

describe('MosaicTransaction', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component MosaicTransaction is not null', () => {
    const wrapper = shallowMount(MosaicTransaction, {
        mocks: {
            $t: (msg) => msg
        }, localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


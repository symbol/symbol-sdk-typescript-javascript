import Vuex from 'vuex'
import vueStore from '@/store/index.ts'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
// @ts-ignore
import MosaicEditDialog from '@/views/service/mosaic/mosaic-function/mosaic-list/mosaic-edit-dialog/MosaicEditDialog.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView);
const router = new VueRouter()

describe('MosaicEditDialog', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component MosaicEditDialog is not null', () => {
    const wrapper = shallowMount(MosaicEditDialog, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


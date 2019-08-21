import Vuex from 'vuex'
import vueStore from '@/store/index.ts'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView);
const router = new VueRouter()
// @ts-ignore
import MosaicUnAliasDialog from '@/views/service/mosaic/mosaic-function/mosaic-list/mosaic-unAlias-dialog/MosaicUnAliasDialog.vue'


describe('MosaicUnAliasDialog', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component MosaicUnAliasDialog is not null', () => {
    const wrapper = shallowMount(MosaicUnAliasDialog, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


import Vuex from 'vuex'
import vueStore from '@/store/index.ts'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
// @ts-ignore
import MosaicAliasDialog from '@/views/service/mosaic/mosaic-function/mosaic-list/mosaic-alias-dialog/MosaicAliasDialog.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView);
const router = new VueRouter()

describe('MosaicAliasDialog', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component MosaicAliasDialog is not null', () => {
    const wrapper = shallowMount(MosaicAliasDialog, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


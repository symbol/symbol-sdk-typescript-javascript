import Vuex from 'vuex'
import vueStore from '@/store/index.ts'
import {shallowMount, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
// @ts-ignore
import NamespaceEditDialog from '@/views/namespace/namespace-function/namespace-list/namespace-edit-dialog/NamespaceEditDialog.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView);
const router = new VueRouter()

describe('NamespaceEditDialog', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
    it('Component NamespaceEditDialog is not null', () => {
        const wrapper = shallowMount(NamespaceEditDialog, {
            mocks: {
                $t: (msg) => msg
            }, localVue,
            router, store
        })
        expect(wrapper).not.toBeNull()
    })
})


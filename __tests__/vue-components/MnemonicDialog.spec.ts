import Vuex from 'vuex'
import vueStore from '@/store/index.ts'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
// @ts-ignore
import MnemonicDialog from '@/views/wallet/mnemonic-dialog/MnemonicDialog.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView);
const router = new VueRouter()

describe('MnemonicDialog', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component MnemonicDialog is not null', () => {
    const wrapper = shallowMount(MnemonicDialog, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


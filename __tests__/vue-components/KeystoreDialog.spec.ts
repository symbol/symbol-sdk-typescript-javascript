import Vuex from 'vuex'
import vueStore from '@/store/index.ts'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
// @ts-ignore
import KeystoreDialog from '@/views/wallet/keystore-dialog/KeystoreDialog.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView);
const router = new VueRouter()

describe('KeystoreDialog', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component KeystoreDialog is not null', () => {
    const wrapper = shallowMount(KeystoreDialog, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


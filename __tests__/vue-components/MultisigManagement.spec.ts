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
import MultisigManagement from '@/views/service/multisig/multisig-functions/multisig-management/MultisigManagement.vue'


describe('MultisigManagement', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component MultisigManagement is not null', () => {
    const wrapper = shallowMount(MultisigManagement, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


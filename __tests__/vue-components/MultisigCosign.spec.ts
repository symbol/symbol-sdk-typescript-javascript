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
import MultisigCosign from '@/views/service/multisig/multisig-functions/multisig-cosign/MultisigCosign.vue'


describe('MultisigCosign', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component MultisigCosign is not null', () => {
    const wrapper = shallowMount(MultisigCosign, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


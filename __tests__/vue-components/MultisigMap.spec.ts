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
import MultisigMap from '@/views/service/multisig/multisig-functions/multisig-map/MultisigMap.vue'


describe('MultisigMap', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component MultisigMap is not null', () => {
    const wrapper = shallowMount(MultisigMap, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


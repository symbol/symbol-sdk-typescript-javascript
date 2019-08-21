import vueStore from '@/store/index.ts'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView)
const router = new VueRouter()
// @ts-ignore
import MultisigConversion from '@/views/service/multisig/multisig-functions/multisig-conversion/MultisigConversion.vue'


describe('MultisigConversion', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component MultisigConversion is not null', () => {
    const wrapper = shallowMount(MultisigConversion, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


import vueStore from '@/store/index.ts'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView);
const router = new VueRouter()
// @ts-ignore
import MultisigTransferTransaction from '@/views/monitor/monitor-transfer/transactions/multisig-transfer-transaction/MultisigTransferTransaction.vue'


describe('MultisigTransferTransaction', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component MultisigTransferTransaction is not null', () => {
    const wrapper = shallowMount(MultisigTransferTransaction, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


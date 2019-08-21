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
import TransferTransaction from '@/views/monitor/monitor-transfer/transactions/transfer-transaction/TransferTransaction.vue'


describe('TransferTransaction', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component TransferTransaction is not null', () => {
    const wrapper = shallowMount(TransferTransaction, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


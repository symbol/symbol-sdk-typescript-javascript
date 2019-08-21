import vueStore from '@/store/index.ts'
import {shallowMount, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
// @ts-ignore
import DeleteWalletCheck from '@/views/wallet/wallet-switch/delete-wallet-check/DeleteWalletCheck.vue'

const localVue = createLocalVue()
const router = new VueRouter()
localVue.use(VueRouter)
localVue.use(iView);
localVue.use(iView)

describe('DeleteWalletCheck', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
    it('Component DeleteWalletCheck is not null', () => {
        const wrapper = shallowMount(DeleteWalletCheck, {
            mocks: {
                $t: (msg) => msg
            }, localVue,
            router, store
        })
        expect(wrapper).not.toBeNull()
    })
})


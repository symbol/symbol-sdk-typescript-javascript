import vueStore from '@/store/index.ts'
import i18n from '@/language/index.ts'
import {shallowMount, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView);
const router = new VueRouter()
// @ts-ignore
import WalletUpdatePassword from '@/views/wallet/wallet-details/wallet-function/wallet-update-password/WalletUpdatePassword.vue'


describe('WalletUpdatePassword', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
    it('Component WalletUpdatePassword is not null', () => {
        const wrapper = shallowMount(WalletUpdatePassword, {
            mocks: {
                $t: (msg) => msg
            },
            localVue,
            router,
            store,
            i18n
        })
        expect(wrapper).not.toBeNull()
    })
})


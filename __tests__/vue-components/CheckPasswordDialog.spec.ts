import {shallowMount, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
// @ts-ignore
import CheckPasswordDialog from '@/components/check-password-dialog/CheckPasswordDialog.vue'
import vueStore from '@/store/index.ts'

const localVue = createLocalVue()
const router = new VueRouter()
localVue.use(VueRouter)
localVue.use(iView);
localVue.use(iView)

describe('CheckPasswordDialog', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )

    it('Component CheckPasswordDialog is not null', () => {
        const wrapper = shallowMount(CheckPasswordDialog, {
            mocks: {
                $t: (msg) => msg
            },
            localVue,
            router,
            store
        })
        expect(wrapper).not.toBeNull()
    })
})

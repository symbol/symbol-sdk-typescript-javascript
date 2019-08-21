import vueStore from '@/store/index.ts'
import {shallowMount, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
// @ts-ignore
import CreateLock from '@/views/login/login/login-view/create-lock/CreateLock.vue'

const router = new VueRouter()
const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView);
describe('CreateLock', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
    it('Component CollectionRecord is not null', () => {
        const wrapper = shallowMount(CreateLock, {
            mocks: {
                $t: (msg) => msg
            },
            localVue,
            router, store
        })
        expect(wrapper).not.toBeNull()
    })
})


import Vuex from 'vuex'
import vueStore from '@/store/index.ts'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
// @ts-ignore
import InputLock from '@/views/login/login/login-view/input-lock/InputLock.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView);
const router = new VueRouter()

describe('InputLock', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component InputLock is not null', () => {
    const wrapper = shallowMount(InputLock, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


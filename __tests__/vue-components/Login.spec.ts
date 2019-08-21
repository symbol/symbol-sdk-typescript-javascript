import Vuex from 'vuex'
import vueStore from '@/store/index.ts'
import {shallowMount, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
// @ts-ignore
import Login from '@/views/login/login/Login.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView);
const router = new VueRouter()

describe('Login', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )

    it('Component CollectionRecord is not null', () => {
        const wrapper = shallowMount(Login, {
            mocks: {
                $t: (msg) => msg
            }, localVue,
            router,
            store
        })
        expect(wrapper).not.toBeNull()
})
})

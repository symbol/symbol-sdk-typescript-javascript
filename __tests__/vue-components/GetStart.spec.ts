import vueStore from '@/store/index.ts'
import {shallowMount, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
// @ts-ignore
import GetStart from '@/views/login/login/login-view/get-start/GetStart.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView);
const router = new VueRouter()

describe('GetStart', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component GetStart is not null', () => {
    const wrapper = shallowMount(GetStart, {
        mocks: {
            $t: (msg) => msg
        },
        localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


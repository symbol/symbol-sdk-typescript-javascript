import {shallowMount, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
// @ts-ignore
import App from '@/App.vue'
import vueStore from '@/store/index.ts'

const localVue = createLocalVue()
const router = new VueRouter()
localVue.use(VueRouter)
localVue.use(iView);
describe('App', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
    it('Component App is not null ', () => {
        const wrapper = shallowMount(App, {
            mocks: {
                $t: (msg) => msg
            }, localVue,
            router, store
        })
        expect(wrapper).not.toBeNull()
    })
})

import vueStore from '@/store/index.ts'
import {shallowMount, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
// @ts-ignore
import Apostille from '@/views/service/apostille/Apostille.vue'


const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView);
const router = new VueRouter()

describe('Apostille', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
    it('Component Apostille is not null', () => {
        const wrapper = shallowMount(Apostille, {
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


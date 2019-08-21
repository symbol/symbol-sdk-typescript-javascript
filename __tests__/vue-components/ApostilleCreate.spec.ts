import Vuex from 'vuex'
import vueStore from '@/store/index.ts'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
// @ts-ignore
import ApostilleCreate from '@/views/service/apostille/apostille-function/apostille-create/ApostilleCreate.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView);
const router = new VueRouter()

describe('ApostilleCreate', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component ApostilleCreate is not null', () => {
    const wrapper = shallowMount(ApostilleCreate, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


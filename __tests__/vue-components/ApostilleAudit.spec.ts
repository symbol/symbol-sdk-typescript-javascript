import Vuex from 'vuex'
import vueStore from '@/store/index.ts'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
// @ts-ignore
import ApostilleAudit from '@/views/service/apostille/apostille-function/apostille-audit/ApostilleAudit.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView);
const router = new VueRouter()

describe('ApostilleAudit', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component ApostilleAudit is not null', () => {
    const wrapper = shallowMount(ApostilleAudit, {
        mocks: {
            $t: (msg) => msg
        },
        localVue,
        router,
        store
    })
    expect(wrapper).not.toBeNull()
})})


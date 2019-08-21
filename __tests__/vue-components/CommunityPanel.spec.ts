import Vuex from 'vuex'
import vueStore from '@/store/index.ts'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
// @ts-ignore
import CommunityPanel from '@/views/community/community-panel/CommunityPanel.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView);
const router = new VueRouter()

describe('CommunityPanel', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component CommunityPanel is not null', () => {
    const wrapper = shallowMount(CommunityPanel, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


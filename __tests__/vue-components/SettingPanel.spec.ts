import Vuex from 'vuex'
import vueStore from '@/store/index.ts'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView);
const router = new VueRouter()
// @ts-ignore
import SettingPanel from '@/views/setting/setting-panel/SettingPanel.vue'


describe('SettingPanel', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
it('Component SettingPanel is not null', () => {
    const wrapper = shallowMount(SettingPanel, {
        mocks: {
            $t: (msg) => msg
        },localVue,
        router,store
    })
    expect(wrapper).not.toBeNull()
})})


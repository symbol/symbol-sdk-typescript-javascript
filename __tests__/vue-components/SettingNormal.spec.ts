import vueStore from '@/store/index.ts'
import i18n from '@/language/index.ts'
import {shallowMount, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(iView);
const router = new VueRouter()
// @ts-ignore
import SettingNormal from '@/views/setting/setting-normal/SettingNormal.vue'


describe('SettingNormal', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
    it('Component SettingNormal is not null', () => {
        const wrapper = shallowMount(SettingNormal, {
            mocks: {
                $t: (msg) => msg
            },
            i18n,
            localVue,
            router,
            store
        })
        expect(wrapper).not.toBeNull()
    })
})


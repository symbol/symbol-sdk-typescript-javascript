import Vuex from 'vuex'
import vueStore from '@/store/index.ts'
import {shallowMount, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
// @ts-ignore
import CollectionRecord from '@/components/collection-record/CollectionRecord.vue'

const localVue = createLocalVue()
const router = new VueRouter()
localVue.use(VueRouter)
localVue.use(iView);
localVue.use(iView)


describe('CollectionRecord', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )
    it('Component CollectionRecord is not null', () => {
        const wrapper = shallowMount(CollectionRecord, {
            mocks: {
                $t: (msg) => msg
            }, localVue,
            router, store
        })
        expect(wrapper).not.toBeNull()
    })
})


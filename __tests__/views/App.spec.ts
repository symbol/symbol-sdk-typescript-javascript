import {shallowMount, config, mount, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'iview'
// @ts-ignore
import TransactionSummary from '@/components/transaction-summary/TransactionSummary.vue'
// @ts-ignore
import App from '@/App.vue'
import vueStore from '@/store/index.ts'
// @ts-ignore

const localVue = createLocalVue()
const router = new VueRouter()
localVue.use(VueRouter)
localVue.use(iView)
// close warning
config.logModifiedComponents = false
describe('App', () => {
    let store
    beforeEach(() => {
            store = vueStore
        }
    )

    it('Component App is not null ', () => {
        const wrapper = mount(App, {
            mocks: {
                $t: (msg) => msg
            },
            // sub components
            stubs: ['TransactionSummary', 'CosignatoriesTable', 'DisabledUiOverlay', 'MosaicTable', 'TransactionDetails', 'TransactionConfirmation'],
            localVue,
            router,
            store
        })
        expect(wrapper).not.toBeNull()
    })
})

import {config, createLocalVue, shallowMount} from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import TransactionInfoTemplate
    from '@/components/transaction-details/transaction-info-template/TransactionInfoTemplate.vue'
import {accountState} from '@/store/account'
import VueRx from "vue-rx"
import moment from 'vue-moment'
import {
    mosaics,
    CosignWallet,
    networkCurrency
    // @ts-ignore
} from "@@/mock/conf/conf.spec"

const localVue = createLocalVue()
const router = new VueRouter()
localVue.use(VueRouter)
localVue.use(moment as any)
localVue.use(Vuex)
localVue.use(VueRx)
localVue.directive('focus', {
    inserted: function (el, binding) {
        el.focus()
    }
})
// close warning
config.logModifiedComponents = false

describe('TransactionInfoTemplate', () => {
    let store
    let wrapper
    let state

    beforeEach(() => {
            store = store = new Vuex.Store({
                    modules: {
                        account: {
                            state: Object.assign(accountState.state, {
                                wallet: CosignWallet,
                                mosaics,
                            }),
                        },
                    }
                }
            )
            wrapper = shallowMount(TransactionInfoTemplate, {
                sync: false,
                mocks: {
                    $t: (msg) => msg,
                },
                localVue,
                store,
                router,
            })
        }
    )


    it('should show component TransactionInfoTemplate', () => {
        expect(wrapper).not.toBeNull()
    })

    it('should return string directly while address is not encrypted', () => {
        const address = 'SBKVJFUAB7O4CDKR6XSU3GGO42J23FGBWOK2EM6W'
        expect(wrapper.vm.decryptedAddress(address)).toBe(address)
    })


})


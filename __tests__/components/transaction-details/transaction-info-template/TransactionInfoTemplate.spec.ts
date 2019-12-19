import {config, createLocalVue, shallowMount} from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import TransactionInfoTemplate
    from '@/components/transaction-details/transaction-info-template/TransactionInfoTemplate.vue'
import {accountState} from '@/store/account'
import VueRx from "vue-rx"
import {Address, NetworkType} from 'nem2-sdk'
import moment from 'vue-moment'
import {
    mosaics,
    CosignWallet,
} from "@MOCKS/conf/conf"

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
    })

    it('should render', () => {
        expect(wrapper).not.toBeNull()
    })

    it('getFrom should return the active wallet address', () => {
        wrapper.vm.$store.state.account.activeMultisigAccount = null
        expect(wrapper.vm.getFrom()).toEqual(Address.createFromRawAddress(CosignWallet.address).pretty())
    })

    it('getFrom should return the active multisig account address when it\'s not null', () => {
        const publicKey = '30CA0A8179477777AB3407611405EAAE6C4BA12156035E4DF8A73BD7651D6D9C'
        wrapper.vm.$store.state.account.activeMultisigAccount = publicKey
        expect(wrapper.vm.getFrom()).toEqual(
            Address.createFromPublicKey(publicKey, NetworkType.MIJIN_TEST).pretty(),
        )
        expect(wrapper).not.toBeNull()
    })
})

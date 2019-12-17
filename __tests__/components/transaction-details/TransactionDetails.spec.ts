import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
// @ts-ignore
import TransactionDetails from '@/components/transaction-details/TransactionDetails.vue'
import {accountState} from '@/store/account'
import VueRx from "vue-rx"
import moment from 'vue-moment'
import {
    mosaics,
    CosignWallet,
    // @ts-ignore
} from "@@/mock/conf/conf.spec"
import {appMutations, appState} from "@/store/app"
// @ts-ignore
const localVue = createLocalVue()
const router = new VueRouter()
localVue.use(VueRouter)
localVue.use(moment as any)
localVue.use(Vuex)
localVue.use(VueRx)
// close warning
config.logModifiedComponents = false

const mockAggregateTransactionProp = {
    rawTx: {},
    txHeader: {
        hash: 'B2E0DEFA0621C0928AD092BCB765B2CC9DB4A33EC25E4A78CB6BBCCDDFB8A417',
        block: 1232432,
        time: new Date().valueOf(),
        tag: 'test tag',
        fee: 1.5
    },
    dialogDetailMap: '',
    formattedInnerTransactions: [{dialogDetailMap: 'MOCK_AGGREGATE_DIALOG_DETAIL_MAP_DATA'}],
    txBody: {},
    isTxUnconfirmed: false,
    store: {}
}
const mockNormalTransactionProp = {
    rawTx: {signer: 'mockADefinedSigner'},
    txHeader: {
        hash: 'B2E0DEFA0621C0928AD092BCB765B2CC9DB4A33EC25E4A78CB6BBCCDDFB8A417',
        block: 1232432,
        time: new Date().valueOf(),
        tag: 'test tag',
        fee: 1.5
    },
    dialogDetailMap: 'MOCK_NORMAL_DIALOG_DETAIL_MAP_DATA',
    txBody: {},
    isTxUnconfirmed: false,
    store: {}
}
describe('TransactionDetails', () => {
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
                    app: {
                        state: appState.state,
                    }
                }
            }
        )
        wrapper = shallowMount(TransactionDetails, {
            sync: false,
            mocks: {
                $t: (msg) => msg,
            },
            propsData: {
                transaction: mockAggregateTransactionProp
            },
            localVue,
            store,
            router,
        })
    })

    it('should render', () => {
        expect(wrapper).not.toBeNull()
    })

    it('should generate inner transaction info transactionDetails while transaction type is aggregate', () => {
        expect(wrapper.vm.transactionDetails[0]).toBe('MOCK_AGGREGATE_DIALOG_DETAIL_MAP_DATA')
    })

    it('should generate normal transaction info transactionDetails while transaction type is aggregate', () => {
        wrapper.setProps({
            transaction: mockNormalTransactionProp
        })
        expect(wrapper.vm.transactionDetails[0]).toBe('MOCK_NORMAL_DIALOG_DETAIL_MAP_DATA')
    })

    it('should print confirmed when transaction is confirmed', () => {
        wrapper.setProps({
            transaction: {...mockNormalTransactionProp, isTxConfirmed: false}
        })
        expect(wrapper.vm.getStatus()).toEqual('unconfirmed')
    })

    it('should print confirmed when transaction is confirmed', () => {
        wrapper.setProps({
            transaction: {...mockNormalTransactionProp, isTxConfirmed: true}
        })
        expect(wrapper.vm.getStatus()).toEqual('confirmed')
    })

    it('getStatus should be falsy when transaction has no signer', () => {
        wrapper.setProps({
            transaction: {...{...mockNormalTransactionProp, rawTx: {signer: undefined}}}
        })
        expect(wrapper.vm.getStatus()).toBeFalsy()
    })
})


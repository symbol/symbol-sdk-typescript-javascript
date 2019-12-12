import { shallowMount, config, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'view-design'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
// @ts-ignore
import MultisigAccountModification from '@/components/forms/multisig-account-modification/MultisigAccountModification.vue'
import { accountMutations, accountState } from '@/store/account'
import { appMutations, appState } from '@/store/app'
import { veeValidateConfig } from "@/core/validation"
import VueRx from "vue-rx"
import { FEE_SPEEDS } from "@/config"
import flushPromises from 'flush-promises'
import {
    Deadline,
    NetworkType,
    TransactionType,
    PublicAccount,
    MultisigAccountModificationTransaction
} from "nem2-sdk"
import {
    mosaicsLoading,
    multisigAccountInfo,
    mosaics,
    MultisigAccount,
    CosignWallet
    // @ts-ignore
} from "@@/mock/conf/conf.spec"
import {MULTISIG_FORM_MODES, AddOrRemove, CosignatoryModifications} from "@/core/model"
import {Cosign2Account} from "../../../mock/conf/conf.spec"
// @ts-ignore
const localVue = createLocalVue()
const router = new VueRouter()
localVue.use(VueRouter)
localVue.use(iView)
localVue.use(Vuex)
localVue.use(VeeValidate, veeValidateConfig)
localVue.use(VueRx)
localVue.directive('focus', {
    inserted: function (el, binding) {
        el.focus()
    }
})
// close warning
config.logModifiedComponents = false

describe('MultisigAccountModification', () => {
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
                        multisigAccountInfo
                    }),
                    mutations: accountMutations.mutations
                },
                app: {
                    state: Object.assign(appState.state, {mosaicsLoading}),
                    mutations: appMutations.mutations
                }
            }
        }
        )
        wrapper = shallowMount(MultisigAccountModification, {
            sync: false,
            mocks: {
                $t: (msg) => msg,
            },
            localVue,
            store,
            router,
        })
    })

    it('Should render ', () => {
        expect(wrapper).not.toBeNull()
    })

    it('should call signAndAnnounce with a proper transaction in conversion mode', async () => {
        wrapper.vm.$store.state.account.activeMultisigAccount = null
        wrapper.vm.$store.state.account.currentAccountMultisigInfo = null
        wrapper.setProps({mode: MULTISIG_FORM_MODES.CONVERSION})

        wrapper.setData({
            cosignatoryModifications: new CosignatoryModifications([{
                addOrRemove: AddOrRemove.ADD,
                cosignatory: PublicAccount.createFromPublicKey(Cosign2Account.publicKey, NetworkType.MIJIN_TEST),
            }]),
            formItems: {
                minApproval: 10,
                minRemoval: 10,
                feeSpeed: FEE_SPEEDS.NORMAL,
                multisigPublicKey: '',
            },
        })
        const signTransactionMock = jest.fn(x => x)
        wrapper.vm.signAndAnnounce = signTransactionMock
        wrapper.vm.submit()
        await flushPromises()

        const [{transaction},] = signTransactionMock.mock.calls[0]

        expect(signTransactionMock).toHaveBeenCalledTimes(1)
        expect(transaction.type).toBe(TransactionType.AGGREGATE_BONDED)
        expect(transaction.maxFee.compact()).toBe(3)
        expect(transaction.deadline).toBeInstanceOf(Deadline)

        const innerTransaction: MultisigAccountModificationTransaction = transaction.innerTransactions[0]
        expect(innerTransaction.type).toBe(TransactionType.MODIFY_MULTISIG_ACCOUNT)
        expect(innerTransaction.networkType).toBe(CosignWallet.networkType)
        expect(innerTransaction.maxFee.compact()).toBe(3)
        expect(innerTransaction.deadline).toBeInstanceOf(Deadline)
        expect(innerTransaction.signer.publicKey).toBe(CosignWallet.publicKey)
        expect(innerTransaction.minApprovalDelta).toBe(10)
        expect(innerTransaction.minRemovalDelta).toBe(10)
        expect(innerTransaction.publicKeyAdditions[0].publicKey).toBe(Cosign2Account.publicKey)
        expect(innerTransaction.publicKeyDeletions.length).toBe(0)
    })

    it('should call signAndAnnounce with a proper transaction in modification mode', async () => {
        wrapper.setData({
            cosignatoryModifications: new CosignatoryModifications([{
                addOrRemove: AddOrRemove.ADD,
                cosignatory: PublicAccount.createFromPublicKey(Cosign2Account.publicKey, NetworkType.MIJIN_TEST),
            }]),
            formItems: {
                minApproval: 10,
                minRemoval: 10,
                feeSpeed: FEE_SPEEDS.NORMAL,
                multisigPublicKey: MultisigAccount.publicKey,
            },
        })
        wrapper.setProps({mode: MULTISIG_FORM_MODES.MODIFICATION})
        const signTransactionMock = jest.fn(x => x)
        wrapper.vm.signAndAnnounce = signTransactionMock
        wrapper.vm.submit()
        await flushPromises()

        const [{transaction},] = signTransactionMock.mock.calls[0]

        expect(signTransactionMock).toHaveBeenCalledTimes(1)
        expect(transaction.type).toBe(TransactionType.AGGREGATE_BONDED)
        expect(transaction.maxFee.compact()).toBe(3)
        expect(transaction.deadline).toBeInstanceOf(Deadline)

        const [innerTransaction,] = transaction.innerTransactions
        expect(innerTransaction.type).toBe(TransactionType.MODIFY_MULTISIG_ACCOUNT)
        expect(innerTransaction.networkType).toBe(CosignWallet.networkType)
        expect(innerTransaction.maxFee.compact()).toBe(3)
        expect(innerTransaction.deadline).toBeInstanceOf(Deadline)
        expect(innerTransaction.signer.publicKey).toBe(MultisigAccount.publicKey)
        expect(innerTransaction.minApprovalDelta).toBe(10)
        expect(innerTransaction.minRemovalDelta).toBe(10)
        expect(innerTransaction.publicKeyAdditions[0].publicKey).toBe(Cosign2Account.publicKey)
        expect(innerTransaction.publicKeyDeletions.length).toBe(0)
    })
})

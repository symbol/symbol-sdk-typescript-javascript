import { shallowMount, config, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'view-design'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
// @ts-ignore
import MultisigTransactionForm from '@/views/multisig/multisig-transaction-form/MultisigTransactionForm.vue'
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
    MultisigCosignatoryModification,
    PublicAccount,
    CosignatoryModificationAction
} from "nem2-sdk"
import {
    mosaicsLoading,
    multisigAccountInfo,
    mosaics,
    MultisigAccount,
    CosignWallet
    // @ts-ignore
} from "@@/mock/conf/conf.spec"
import { MULTISIG_FORM_MODES } from "@/core/model"
import { Cosign2Account } from "../../../mock/conf/conf.spec"
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

describe('MultisigTransactionForm', () => {
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
                    state: Object.assign(appState.state, { mosaicsLoading }),
                    mutations: appMutations.mutations
                }
            }
        }
        )
        wrapper = shallowMount(MultisigTransactionForm, {
            sync: false,
            mocks: {
                $t: (msg) => msg,
            },
            localVue,
            store,
            router,
        })
    })

    it('Component MultisigTransactionForm is not null ', () => {
        expect(wrapper).not.toBeNull()
    })

    it('should call signTransaction with a proper transaction in conversion mode', async () => {
        wrapper.setData({
            formItems: {
                modificationList: [new MultisigCosignatoryModification(
                    CosignatoryModificationAction.Add,
                    PublicAccount.createFromPublicKey(Cosign2Account.publicKey, NetworkType.MIJIN_TEST),
                )],
                minApproval: 10,
                minRemoval: 10,
                feeSpeed: FEE_SPEEDS.NORMAL,
                multisigPublicKey: '',
            },
        })
        wrapper.setProps({ mode: MULTISIG_FORM_MODES.CONVERSION })
        const signTransactionMock = jest.fn(x => x)
        wrapper.vm.signTransaction = signTransactionMock
        wrapper.vm.submit()
        await flushPromises()

        const [{ transaction },] = signTransactionMock.mock.calls[0]

        expect(signTransactionMock).toHaveBeenCalledTimes(1)
        expect(transaction.type).toBe(TransactionType.AGGREGATE_BONDED)
        expect(transaction.maxFee.compact()).toBe(3)
        expect(transaction.deadline).toBeInstanceOf(Deadline)

        const innerTransaction = transaction.innerTransactions[0]
        expect(innerTransaction.type).toBe(TransactionType.MODIFY_MULTISIG_ACCOUNT)
        expect(innerTransaction.networkType).toBe(CosignWallet.networkType)
        expect(innerTransaction.maxFee.compact()).toBe(3)
        expect(innerTransaction.deadline).toBeInstanceOf(Deadline)
        expect(innerTransaction.signer.publicKey).toBe(CosignWallet.publicKey)
        expect(innerTransaction.minApprovalDelta).toBe(10)
        expect(innerTransaction.minRemovalDelta).toBe(10)
        expect(innerTransaction.modifications[0].cosignatoryPublicAccount.publicKey).toBe(Cosign2Account.publicKey)
        expect(innerTransaction.modifications[0].modificationAction).toBe(CosignatoryModificationAction.Add)

    })

    it('should call signTransaction with a proper transaction in modification mode', async () => {
        wrapper.setData({
            formItems: {
                modificationList: [new MultisigCosignatoryModification(
                    CosignatoryModificationAction.Add,
                    PublicAccount.createFromPublicKey(Cosign2Account.publicKey, NetworkType.MIJIN_TEST),
                )],
                minApproval: 10,
                minRemoval: 10,
                feeSpeed: FEE_SPEEDS.NORMAL,
                multisigPublicKey: MultisigAccount.publicKey,
            },
        })
        wrapper.setProps({ mode: MULTISIG_FORM_MODES.MODIFICATION })
        const signTransactionMock = jest.fn(x => x)
        wrapper.vm.signTransaction = signTransactionMock
        wrapper.vm.submit()
        await flushPromises()

        const [{ transaction },] = signTransactionMock.mock.calls[0]

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
        expect(innerTransaction.modifications[0].cosignatoryPublicAccount.publicKey).toBe(Cosign2Account.publicKey)
        expect(innerTransaction.modifications[0].modificationAction).toBe(CosignatoryModificationAction.Add)
    })

    it('should not call signTransaction when min approval < 0 in conversion mode', async () => {
        wrapper.setData({
            formItems: {
                modificationList: [new MultisigCosignatoryModification(
                    CosignatoryModificationAction.Add,
                    PublicAccount.createFromPublicKey(Cosign2Account.publicKey, NetworkType.MIJIN_TEST),
                )],
                minApproval: -1,
                minRemoval: 1,
                feeSpeed: FEE_SPEEDS.NORMAL,
                multisigPublicKey: '',
            },
        })
        wrapper.setProps({ mode: MULTISIG_FORM_MODES.CONVERSION })
        const signTransactionMock = jest.fn(x => x)
        wrapper.vm.signTransaction = signTransactionMock
        await flushPromises()
        wrapper.vm.submit()
        expect(signTransactionMock).toHaveBeenCalledTimes(0)
    })

    it('should not call signTransaction when cosigner list length is 0 ', async () => {
        wrapper.setData({
            formItems: {
                modificationList: [],
                minApproval: 2,
                minRemoval: 2,
                feeSpeed: FEE_SPEEDS.NORMAL,
                multisigPublicKey: MultisigAccount.publicKey,
            },
        })
        wrapper.setProps({ mode: MULTISIG_FORM_MODES.CONVERSION })
        const signTransactionMock = jest.fn(x => x)
        wrapper.vm.signTransaction = signTransactionMock
        await flushPromises()
        wrapper.vm.submit()
        expect(signTransactionMock).toHaveBeenCalledTimes(0)
    })

    it('should not call signTransaction when min approval > 10', async () => {
        wrapper.setData({
            formItems: {
                modificationList: [new MultisigCosignatoryModification(
                    CosignatoryModificationAction.Add,
                    PublicAccount.createFromPublicKey(Cosign2Account.publicKey, NetworkType.MIJIN_TEST),
                )],
                minApproval: 11,
                minRemoval: 10,
                feeSpeed: FEE_SPEEDS.NORMAL,
                multisigPublicKey: MultisigAccount.publicKey,
            },
        })
        wrapper.setProps({ mode: MULTISIG_FORM_MODES.MODIFICATION })
        const signTransactionMock = jest.fn(x => x)
        wrapper.vm.signTransaction = signTransactionMock
        await flushPromises()
        wrapper.vm.submit()
        expect(signTransactionMock).toHaveBeenCalledTimes(0)
    })

    it('should not create multisig convert transaction when min removal > 10', async () => {
        wrapper.setData({
            formItems: {
                modificationList: [new MultisigCosignatoryModification(
                    CosignatoryModificationAction.Add,
                    PublicAccount.createFromPublicKey(Cosign2Account.publicKey, NetworkType.MIJIN_TEST),
                )],
                minApproval: 10,
                minRemoval: 11,
                feeSpeed: FEE_SPEEDS.NORMAL,
                multisigPublicKey: MultisigAccount.publicKey,
            },
        })
        wrapper.setProps({ mode: MULTISIG_FORM_MODES.MODIFICATION })
        const signTransactionMock = jest.fn(x => x)
        wrapper.vm.signTransaction = signTransactionMock
        await flushPromises()
        wrapper.vm.submit()
        expect(signTransactionMock).toHaveBeenCalledTimes(0)
    })

    it('should add public key to the list while the public key is valid', async () => {
        wrapper.setData({
            cosignerToAdd: Cosign2Account.publicKey
        })
        wrapper.setProps({ mode: MULTISIG_FORM_MODES.MODIFICATION })
        wrapper.vm.addCosigner(CosignatoryModificationAction.Add)

        expect(wrapper.vm.formItems.modificationList.length).toBe(1)
    })

    it('should not add public key to the list while the public key is invalid', async () => {
        wrapper.setData({
            cosignerToAdd: 'invalidPublicKey'
        })
        wrapper.setProps({ mode: MULTISIG_FORM_MODES.MODIFICATION })
        await flushPromises()
        wrapper.vm.addCosigner(CosignatoryModificationAction.Add)
        expect(wrapper.vm.formItems.modificationList.length).toBe(0)
    })

    it('should remove public key from the list while call removeCosigner function', async () => {
        wrapper.setData({
            formItems: {
                modificationList: [new MultisigCosignatoryModification(
                    CosignatoryModificationAction.Add,
                    PublicAccount.createFromPublicKey(Cosign2Account.publicKey, NetworkType.MIJIN_TEST),
                )]
            },
        })
        wrapper.vm.removeCosigner(0)
        expect(wrapper.vm.formItems.modificationList.length).toBe(0)
    })

    it('should call addCosignerFromAddress if a valid address is entered as cosigner to add', async () => {
        wrapper.setData({
            cosignerToAdd: Cosign2Account.address
        })
        wrapper.setProps({ mode: MULTISIG_FORM_MODES.MODIFICATION })
        const addCosignerFromAddressMock = jest.fn(x => x)
        wrapper.vm.addCosignerFromAddress = addCosignerFromAddressMock
        expect(addCosignerFromAddressMock).toHaveBeenCalledTimes(0)
    })

    it('should not call addCosignerFromAddress if the cosigner to add entered is not a valid address', async () => {
        wrapper.setData({
            cosignerToAdd: 'thisisaninvalidaddress'
        })
        wrapper.setProps({ mode: MULTISIG_FORM_MODES.MODIFICATION })
        const addCosignerFromAddressMock = jest.fn(x => x)
        wrapper.vm.addCosignerFromAddress = addCosignerFromAddressMock
        expect(addCosignerFromAddressMock).toHaveBeenCalledTimes(0)
    })

    it('should not call addCosignerFromAddress if the cosigner to add entered is a public key', async () => {
        wrapper.setData({
            cosignerToAdd: Cosign2Account.publicKey
        })
        wrapper.setProps({ mode: MULTISIG_FORM_MODES.MODIFICATION })
        const addCosignerFromAddressMock = jest.fn(x => x)
        wrapper.vm.addCosignerFromAddress = addCosignerFromAddressMock
        expect(addCosignerFromAddressMock).toHaveBeenCalledTimes(0)
    })
})

import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'view-design'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
// @ts-ignore
import MultisigTransactionForm from '@/views/multisig/multisig-transaction-form/MultisigTransactionForm.vue'
import {accountMutations, accountState} from '@/store/account'
import {appMutations, appState} from '@/store/app'
import {veeValidateConfig} from "@/core/validation"
import VueRx from "vue-rx"
import {FEE_SPEEDS} from "@/config"
import flushPromises from 'flush-promises'
import {
    Address,
    Deadline,
    Mosaic,
    AggregateTransaction,
    MosaicId,
    NetworkType,
    TransactionType,
    TransferTransaction,
    UInt64, MultisigCosignatoryModification, PublicAccount, CosignatoryModificationAction
} from "nem2-sdk"
import {
    CosignAccount,
    mosaicsLoading,
    multisigAccountInfo,
    mosaics,
    MultisigAccount,
    Multisig2Account,
    CosignWallet
    // @ts-ignore
} from "@@/mock/conf/conf.spec"
import {AppWallet, MULTISIG_FORM_MODES} from "@/core/model"
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
                            state: Object.assign(appState.state, {mosaicsLoading}),
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
        }
    )


    it('Component MultisigTransactionForm is not null ', () => {
        expect(wrapper).not.toBeNull()
    })

    it('should create a multisig convert transaction  while all params is correct', async () => {
        wrapper.setData({
            formItems: {
                publicKeyList: [new MultisigCosignatoryModification(
                    CosignatoryModificationAction.Add,
                    PublicAccount.createFromPublicKey(Cosign2Account.publicKey, NetworkType.MIJIN_TEST),
                )],
                minApproval: 10,
                minRemoval: 10,
                feeSpeed: FEE_SPEEDS.NORMAL,
                multisigPublicKey: '',
            },
        })
        wrapper.setProps({mode: MULTISIG_FORM_MODES.CONVERSION})
        await flushPromises()
        wrapper.vm.submit()

        const convertMultisigTransaction = wrapper.vm.transactionList[0]
        expect(convertMultisigTransaction.type).toBe(TransactionType.AGGREGATE_BONDED)
        expect(convertMultisigTransaction.maxFee.compact()).toBe(3)
        expect(convertMultisigTransaction.deadline).toBeInstanceOf(Deadline)

        const innerTransaction = convertMultisigTransaction.innerTransactions[0]
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

    it('should create a multisig manage transaction while all params is correct', async () => {
        wrapper.setData({
            formItems: {
                publicKeyList: [new MultisigCosignatoryModification(
                    CosignatoryModificationAction.Add,
                    PublicAccount.createFromPublicKey(Cosign2Account.publicKey, NetworkType.MIJIN_TEST),
                )],
                minApproval: 10,
                minRemoval: 10,
                feeSpeed: FEE_SPEEDS.NORMAL,
                multisigPublicKey: MultisigAccount.publicKey,
            },
        })
        wrapper.setProps({mode: MULTISIG_FORM_MODES.MODIFICATION})
        await flushPromises()
        wrapper.vm.submit()

        const convertMultisigTransaction = wrapper.vm.transactionList[0]
        expect(convertMultisigTransaction.type).toBe(TransactionType.AGGREGATE_BONDED)
        expect(convertMultisigTransaction.maxFee.compact()).toBe(3)
        expect(convertMultisigTransaction.deadline).toBeInstanceOf(Deadline)

        const innerTransaction = convertMultisigTransaction.innerTransactions[0]
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

    it('should not create a multisig manage transaction while min approval < 0', async () => {
        wrapper.setData({
            formItems: {
                publicKeyList: [],
                minApproval: 1,
                minRemoval: 1,
                feeSpeed: FEE_SPEEDS.NORMAL,
                multisigPublicKey: '',
            },
        })
        wrapper.setProps({mode: MULTISIG_FORM_MODES.CONVERSION})
        await flushPromises()
        wrapper.vm.submit()

        const convertMultisigTransaction = wrapper.vm.transactionList[0]
        expect(convertMultisigTransaction).toBeUndefined()

    })

    it('should not create a multisig convert transaction while cosigner list is = 0 ', async () => {
        wrapper.setData({
            formItems: {
                publicKeyList: [],
                minApproval: 2,
                minRemoval: 2,
                feeSpeed: FEE_SPEEDS.NORMAL,
                multisigPublicKey: MultisigAccount.publicKey,
            },
        })
        wrapper.setProps({mode: MULTISIG_FORM_MODES.CONVERSION})
        await flushPromises()
        wrapper.vm.submit()

        const convertMultisigTransaction = wrapper.vm.transactionList[0]
        expect(convertMultisigTransaction).toBeUndefined()
    })

    it('should not create multisig convert transaction while min approval > 10', async () => {
        wrapper.setData({
            formItems: {
                publicKeyList: [],
                minApproval: 11,
                minRemoval: 10,
                feeSpeed: FEE_SPEEDS.NORMAL,
                multisigPublicKey: MultisigAccount.publicKey,
            },
        })
        wrapper.setProps({mode: MULTISIG_FORM_MODES.MODIFICATION})
        await flushPromises()
        wrapper.vm.submit()

        const convertMultisigTransaction = wrapper.vm.transactionList[0]
        expect(convertMultisigTransaction).toBeUndefined()
    })

    it('should not create multisig convert transaction while min removal > 10', async () => {
        wrapper.setData({
            formItems: {
                publicKeyList: [],
                minApproval: 10,
                minRemoval: 11,
                feeSpeed: FEE_SPEEDS.NORMAL,
                multisigPublicKey: MultisigAccount.publicKey,
            },
        })
        wrapper.setProps({mode: MULTISIG_FORM_MODES.MODIFICATION})
        await flushPromises()
        wrapper.vm.submit()

        const convertMultisigTransaction = wrapper.vm.transactionList[0]
        expect(convertMultisigTransaction).toBeUndefined()
    })

    it('should  add public key to the list while the public key is valid', async () => {
        wrapper.setData({
            publicKeyToAdd: Cosign2Account.publicKey
        })
        wrapper.setProps({mode: MULTISIG_FORM_MODES.MODIFICATION})
        wrapper.vm.addCosigner(CosignatoryModificationAction.Add)

        expect(wrapper.vm.formItems.publicKeyList.length).toBe(1)
    })

    it('should not add public key to the list while the public key is invalid', async () => {
        wrapper.setData({
            publicKeyToAdd: 'invalidPublicKey'
        })
        wrapper.setProps({mode: MULTISIG_FORM_MODES.MODIFICATION})
        wrapper.vm.addCosigner(CosignatoryModificationAction.Add)

        expect(wrapper.vm.formItems.publicKeyList.length).toBe(0)
    })

    it('should remove public key from the list while call removeCosigner function', async () => {
        wrapper.setData({
            formItems: {
                publicKeyList: [new MultisigCosignatoryModification(
                    CosignatoryModificationAction.Add,
                    PublicAccount.createFromPublicKey(Cosign2Account.publicKey, NetworkType.MIJIN_TEST),
                )]
            },
        })
        wrapper.vm.removeCosigner(0)
        expect(wrapper.vm.formItems.publicKeyList.length).toBe(0)
    })


})

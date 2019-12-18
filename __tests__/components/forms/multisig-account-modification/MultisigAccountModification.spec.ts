import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'view-design'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
// @ts-ignore
import MultisigAccountModification from '@/components/forms/multisig-account-modification/MultisigAccountModification.vue'
import {accountMutations, accountState} from '@/store/account'
import {appMutations, appState} from '@/store/app'
import {veeValidateConfig} from "@/core/validation"
import VueRx from "vue-rx"
import {FEE_SPEEDS, networkConfig} from "@/config"
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
import {of, throwError} from 'rxjs'
import {tap, mapTo, map, catchError} from 'rxjs/operators'

const {EMPTY_PUBLIC_KEY} = networkConfig

const mockGetAccountInfoCall = jest.fn()

const mockErroredGetAccountInfo = () => of('mock').pipe(
    tap((args) => mockGetAccountInfoCall(args)),
    map(() => {throw new Error('Couldn\'t get account info')}),
    catchError(error => throwError(error)),
)

const mockUnknownGetAccountInfo = (args) => of(args).pipe(
    tap((args) => mockGetAccountInfoCall(args)),
    mapTo({publicKey: EMPTY_PUBLIC_KEY}),
)

const publicAccount = PublicAccount.createFromPublicKey(
    '72B08ACF80558B285EADA206BB1226A44038C65AC4649108B2284591641657B5',
    NetworkType.TEST_NET,
)

const mockGetAccountInfo = (args) => of(args).pipe(
    tap((args) => mockGetAccountInfoCall(args)),
    mapTo({publicAccount}),
)

jest.mock('nem2-sdk/dist/src/infrastructure/AccountHttp', () => ({
    AccountHttp: jest.fn().mockImplementation((endpoint) => {
        if (endpoint === 'http://errored.endpoint:3000') {
            return {
                getAccountInfo: mockErroredGetAccountInfo,
            }
        }
        if (endpoint === 'http://unknown.address.endpoint:3000') {
            return {
                getAccountInfo: mockUnknownGetAccountInfo,
            }
        }
        return {
            getAccountInfo: mockGetAccountInfo,
        }
    })
}))


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
        mockGetAccountInfoCall.mockClear()

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
            propsData: {
                mode: MULTISIG_FORM_MODES.CONVERSION,
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

    it('addCosignerFromAddress should call addModification when successful', async (done) => {
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
        const addModificationMock = jest.fn()
        const mockCommit = jest.fn()
        const mockStore = {commit: mockCommit}

        wrapper.vm.$store = mockStore
        wrapper.vm.cosignerToAdd = publicAccount.address.plain(

        )
        wrapper.vm.addModification = addModificationMock

        try {
            wrapper.vm.addCosignerFromAddress(AddOrRemove.ADD)
            await flushPromises()
            setTimeout(() => {
                expect(mockGetAccountInfoCall).toHaveBeenCalledTimes(1)
                expect(mockCommit.mock.calls[0][0]).toBe('SET_LOADING_OVERLAY')
        expect(mockCommit.mock.calls[1][0]).toBe('SET_LOADING_OVERLAY')
        expect(mockCommit.mock.calls[1][1].show).toBeFalsy()
                expect(mockCommit.mock.calls[0][1].show).toBeTruthy()
                expect(addModificationMock).toHaveBeenCalledTimes(1)
                expect(addModificationMock.mock.calls[0][0]).toStrictEqual(publicAccount)
                expect(addModificationMock.mock.calls[0][1]).toBe(AddOrRemove.ADD)
                done()
            }, 10)
        } catch (error) {
            done()
        }
    })

    it('addCosignerFromAddress should call showErrorMessage when AccountHttp throws', async (done) => {
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
        const addModificationMock = jest.fn()
        const mockCommit = jest.fn()
        const mockStore = {commit: mockCommit}
        const mockErrorMessage = jest.fn()

        wrapper.vm.showErrorMessage = mockErrorMessage
        wrapper.vm.activeAccount.node = 'http://errored.endpoint:3000'
        wrapper.vm.$store = mockStore 
        wrapper.vm.cosignerToAdd = publicAccount.address.plain(

        )
        wrapper.vm.addModification = addModificationMock

        try {
            wrapper.vm.addCosignerFromAddress(AddOrRemove.ADD)
            await flushPromises()
            setTimeout(() => {
                expect(mockGetAccountInfoCall).toHaveBeenCalledTimes(1)
                expect(mockCommit.mock.calls[0][0]).toBe('SET_LOADING_OVERLAY')
                expect(mockCommit.mock.calls[0][1].show).toBeTruthy()
                expect(mockCommit.mock.calls[1][0]).toBe('SET_LOADING_OVERLAY')
                expect(mockCommit.mock.calls[1][1].show).toBeFalsy()
                expect(mockErrorMessage).toHaveBeenCalledTimes(1)
                done()
            }, 10)
        } catch (error) {
            done()
        }
    })

    it('addCosignerFromAddress should call showErrorMessage when AccountHttp throws', async (done) => {
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
        const addModificationMock = jest.fn()
        const mockCommit = jest.fn()
        const mockStore = {commit: mockCommit}
        const mockErrorMessage = jest.fn()

        wrapper.vm.showErrorMessage = mockErrorMessage
        wrapper.vm.activeAccount.node = 'http://unknown.address.endpoint:3000'
        wrapper.vm.$store = mockStore 
        wrapper.vm.cosignerToAdd = publicAccount.address.plain(

        )
        wrapper.vm.addModification = addModificationMock

        try {
            wrapper.vm.addCosignerFromAddress(AddOrRemove.ADD)
            await flushPromises()
            setTimeout(() => {
                expect(mockGetAccountInfoCall).toHaveBeenCalledTimes(1)
                expect(mockCommit.mock.calls[0][0]).toBe('SET_LOADING_OVERLAY')
                expect(mockCommit.mock.calls[0][1].show).toBeTruthy()
                expect(mockCommit.mock.calls[1][0]).toBe('SET_LOADING_OVERLAY')
                expect(mockCommit.mock.calls[1][1].show).toBeFalsy()
                expect(mockErrorMessage).toHaveBeenCalledTimes(1)
                done()
            }, 10)
        } catch (error) {
            done()
        }
    })
})
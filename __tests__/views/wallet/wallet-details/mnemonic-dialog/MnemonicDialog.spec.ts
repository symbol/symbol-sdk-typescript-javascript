import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'view-design'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
// @ts-ignore
import MnemonicDialog from '@/views/wallet/wallet-details/mnemonic-dialog/MnemonicDialog.vue'
import {accountState} from '@/store/account'
import {veeValidateConfig} from "@/core/validation"
import {Password} from "nem2-sdk"
import {MnemonicPassPhrase} from 'nem2-hd-wallets'
import {
    multisigAccountInfo,
    mosaics,
    networkCurrency,
    hdAccount,
    hdAccountData,
    // @ts-ignore
} from "@@/mock/conf/conf.spec"
import flushPromises from 'flush-promises'

jest.mock('@/common/img/monitor/failure.png', () => 'failureIcon');

// @ts-ignore
const localVue = createLocalVue()
const router = new VueRouter()
localVue.use(VueRouter)
localVue.use(iView)
localVue.use(Vuex)
localVue.use(VeeValidate, veeValidateConfig)
localVue.directive('focus', {
    inserted: function (el, binding) {
        el.focus()
    }
})

jest.mock('nem2-qr-library')
import {MnemonicQR} from 'nem2-qr-library'
// close warning
config.logModifiedComponents = false

describe('MnemonicDialog', () => {
    let store
    let wrapper
    beforeEach(() => {
        store = store = new Vuex.Store({
                modules: {
                    account: {
                        state: Object.assign(accountState.state, {
                            wallet: hdAccount.wallets[0],
                            mosaics,
                            networkCurrency,
                            multisigAccountInfo,
                            accountName: hdAccount.accountName,
                        }),
                    },
                }
            }
        )
        wrapper = shallowMount(MnemonicDialog, {
            sync: false,
            mocks: {
                $t: (msg) => msg,
            },
            computed: {
                cipher() {
                    return hdAccount.password
                },
            },
            localVue,
            store,
            router,
        })
    })

    it('Component MnemonicDialog is not null ', () => {
        expect(wrapper).not.toBeNull()
    })

    it('should not go to next step if the password is wrong', async (done) => {
        wrapper.setData({
            password: 'aWrongPassword'
        })
        wrapper.vm.submit()
        await flushPromises()
        expect(wrapper.vm.stepIndex).toBe(0)
        expect(wrapper.vm.mnemonic).toBe('')
        done()
    })

    it('should set data properly if password is right', async (done) => {
        wrapper.setData({
            password: 'password'
        })
        wrapper.vm.submit()
        await flushPromises()
        expect(wrapper.vm.stepIndex).toBe(1)
        expect(wrapper.vm.mnemonic).toBe(hdAccountData.mnemonic)
        done()
    })

    it('should decrement stepIndex and empty confirmedMnemonicList', async (done) => {
        wrapper.setData({
            password: 'password'
        })
        wrapper.vm.submit()
        await flushPromises()
        expect(wrapper.vm.stepIndex).toBe(1)
        expect(wrapper.vm.mnemonic).toBe(hdAccountData.mnemonic)
        done()
    })

    it('should call copyTxt with the mnemonic string', async (done) => {
        wrapper.setData({
            password: 'password',
        })
        const copyTxtMock = jest.fn()
        wrapper.vm.copyTxt = copyTxtMock
        wrapper.vm.submit()
        await flushPromises()
        await wrapper.vm.copyMnemonic()
        expect(copyTxtMock).toBeCalledWith(hdAccountData.mnemonic)
        done()
    })

    // it('should create a new MnemonicQR with the correct arguments', async (done) => {
    //     wrapper.setData({ password: 'password'})
    //     const MnemonicQRMock = MnemonicQR
    //     wrapper.vm.MnemonicQR = MnemonicQRMock
    //     wrapper.vm.submit()
    //     await flushPromises()
    //     wrapper.setData({ stepIndex: 5 })

    //     wrapper.vm.$nextTick(() => {
    //         expect(MnemonicQRMock).toHaveBeenCalledTimes(1)
    //         expect(MnemonicQRMock).toBeCalledWith(
    //             new MnemonicPassPhrase(hdAccountData.mnemonic),
    //             new Password(hdAccountData.password),
    //             hdAccount.wallets[0].networkType,
    //             accountState.state.generationHash,
    //         )
    //         done()
    //     })
    // })

    // it('QRCode should return error image if bad args are provided', async (done) => {
    //     //@ts-ignore
    //     const MnemonicQRMock = MnemonicQR.toBase64 = function() { throw new Error() }
    //     wrapper.setData({ password: 'password'})
    //     wrapper.vm.MnemonicQR = MnemonicQRMock
    //     wrapper.vm.submit()
    //     await flushPromises()
    //     wrapper.setData({ stepIndex: 5 })
    //     wrapper.vm.$nextTick(() => {
    //         expect(wrapper.vm.QRCode).toBe('failureIcon')
    //         done()
    //     })
    // })

    it('should emit closeMnemonicDialog when show is set to false', (done) => {
        wrapper.vm.show = false
        wrapper.vm.$nextTick(() => {
            expect(wrapper.emitted('closeMnemonicDialog')).toBeTruthy()
            done()
        })
    })

    it('cipher should return the correct value', () => {
        expect(wrapper.vm.cipher).toBe(hdAccount.password)
    })
})

import {AppWallet} from '@/core/model/AppWallet'
import {SimpleWallet} from 'nem2-sdk'
import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
// @ts-ignore
import DisabledForms from '@/components/disabled-forms/DisabledForms.vue'
import {Alert} from 'view-design'
import {accountMutations, accountState} from '@/store/account'
import {appMutations, appState} from '@/store/app'
import {veeValidateConfig} from "@/core/validation"
import VueRx from "vue-rx"
import moment from 'vue-moment'
import {
    mosaicsLoading,
    multisigAccountInfo,
    mosaics,
    hdAccount,
    CosignWallet,
    // @ts-ignore
} from "@@/mock/conf/conf.spec"
// @ts-ignore
const localVue = createLocalVue()
const router = new VueRouter()
localVue.use(VueRouter)
localVue.use(moment as any)
localVue.component('Alert', Alert)
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

describe('AppWallet', () => {
    let store
    let wrapper
    beforeEach(() => {
            store = store = new Vuex.Store({
                    modules: {
                        account: {
                            state: Object.assign(accountState.state, {
                                wallet: CosignWallet,
                                mosaics,
                                multisigAccountInfo,
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
            wrapper = shallowMount(DisabledForms, {
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

    it('AppWallet should instantiate properly hdWallet object from localStorage ', () => {
        const walletObject = hdAccount.wallets[0]
        const appWallet = new AppWallet(walletObject)
        expect(appWallet.simpleWallet).toBe(walletObject.simpleWallet)
        expect(appWallet.name).toBe(walletObject.name)
        expect(appWallet.address).toBe(walletObject.address)
        expect(appWallet.publicKey).toBe(walletObject.publicKey)
        expect(appWallet.networkType).toBe(walletObject.networkType)
        expect(appWallet.path).toBe(walletObject.path)
        expect(appWallet.sourceType).toBe(walletObject.sourceType)
        expect(appWallet.encryptedMnemonic).toBe(walletObject.encryptedMnemonic)
        expect(appWallet.balance).toBe(walletObject.balance)
    })

    it('createAndStoreRemoteAccount should throw if the password provided is not correct', () => {
        const appWallet = new AppWallet(hdAccount.wallets[0])
        expect(() => {
            appWallet.createAndStoreRemoteAccount('wrong password', '', store)
        }).toThrowError();
    })

    it('createAndStoreRemoteAccount should throw if the privateKey is invalid', () => {
        const invalidPrivateKey = '4546C6EC07DC5884AC2581063FBC3A7C970306EB3D234C65893CC7E3FE8A4062'
        const appWallet = new AppWallet(hdAccount.wallets[0])
        expect(() => {
            appWallet.createAndStoreRemoteAccount('wrong password', invalidPrivateKey, store)
        }).toThrowError();
    })

    it('createAndStoreRemoteAccount should create a RemoteAccount object when importing an account', () => {
        const privateKey = '4546C6EC07DC5884AC2581063FBC3A7C970306EB3D234C65893CC7E3FE8A4062'
        const address = 'SDO7L5Q4URACE732MCFC7XKKW3KKXCCLN73R2KJ5'
        const updateWalletMock = jest.fn()
        const appWallet = new AppWallet(hdAccount.wallets[0])
        appWallet.updateWallet = updateWalletMock

        const returnedPrivatekey = appWallet
            .createAndStoreRemoteAccount('password', privateKey, store)

        expect(appWallet.remoteAccount.publicKey.length).toBe(64)
        expect(appWallet.remoteAccount.simpleWallet).toBeInstanceOf(SimpleWallet)
        expect(appWallet.remoteAccount.simpleWallet.address.plain()).toBe(address)
        expect(updateWalletMock).toHaveBeenCalled()
        expect(returnedPrivatekey).toBe(returnedPrivatekey)
    })

    it('createAndStoreRemoteAccount should create a RemoteAccount object when creating an account', () => {
        const updateWalletMock = jest.fn()
        const appWallet = new AppWallet(hdAccount.wallets[0])
        appWallet.updateWallet = updateWalletMock

        const returnedPrivatekey = appWallet
            .createAndStoreRemoteAccount('password', false, store)

        expect(appWallet.remoteAccount.publicKey.length).toBe(64)
        expect(appWallet.remoteAccount.simpleWallet).toBeInstanceOf(SimpleWallet)
        expect(updateWalletMock).toHaveBeenCalled()
        expect(returnedPrivatekey.length).toBe(64)
    })

    it('createAndStoreRemoteAccount should throw if not matching an already linked remotePublicKey', () => {
        const privateKey = '4546C6EC07DC5884AC2581063FBC3A7C970306EB3D234C65893CC7E3FE8A4062'
        const publicKey = '7772FD51AB2B2182D37E5F05EDAAD5DD97DAC2870F9132350F7AF317460B9174'
        const updateWalletMock = jest.fn()
        const appWallet = new AppWallet(hdAccount.wallets[0])

        appWallet.linkedAccountKey = publicKey
        appWallet.updateWallet = updateWalletMock

        expect(() => {
            appWallet.createAndStoreRemoteAccount('wrong password', privateKey, store)
        }).toThrowError();
    })

    it('getRemoteAccountPrivateKey should return remote account private key', () => {
        const privateKey = '4546C6EC07DC5884AC2581063FBC3A7C970306EB3D234C65893CC7E3FE8A4062'
        const updateWalletMock = jest.fn()
        const appWallet = new AppWallet(hdAccount.wallets[0])
        appWallet.updateWallet = updateWalletMock

        appWallet.createAndStoreRemoteAccount('password', privateKey, store)
        const returnedPrivateKey = appWallet.getRemoteAccountPrivateKey('password')
        expect(returnedPrivateKey).toBe(privateKey)
    })

    it('getRemoteAccountPrivateKey should throw when provided a wrong password', () => {
        const privateKey = '4546C6EC07DC5884AC2581063FBC3A7C970306EB3D234C65893CC7E3FE8A4062'
        const updateWalletMock = jest.fn()
        const appWallet = new AppWallet(hdAccount.wallets[0])
        appWallet.updateWallet = updateWalletMock

        appWallet.createAndStoreRemoteAccount('password', privateKey, store)
        expect(() => {
            appWallet.getRemoteAccountPrivateKey('wrong password')
        }).toThrowError();
    })

    it('getRemoteAccountPrivateKey should throw when wallet has no remoteAccount', () => {
        const appWallet = new AppWallet(hdAccount.wallets[0])
        appWallet.remoteAccount = null
        expect(() => {
            appWallet.getRemoteAccountPrivateKey('password')
        }).toThrowError();
    })
})

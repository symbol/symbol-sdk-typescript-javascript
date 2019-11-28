import {localRead, localRemove, localSave} from "@/core/utils"
import {NetworkType, Password, SimpleWallet} from "nem2-sdk"
import {Store} from "vuex"
import {AppState} from "@/core/model/types"
import {AppWallet} from "@/core/model/AppWallet"
import CryptoJS from "crypto-js"
import {CreateWalletType} from "@/core/model/CreateWalletType"
import {CurrentAccount} from './CurrentAccount'

const defaultAlgo = CryptoJS.algo.AES
const cryptoJSLib: any = CryptoJS.lib
const PasswordBasedCipher: any = cryptoJSLib.PasswordBasedCipher


export class AppAccount {
    constructor(
        public accountName: string,
        public wallets: Array<any>,
        public password: string,
        public hint: string,
        public networkType: NetworkType,
        public seed?: string
    ) { }

    static create(
        clearPassword: string,
        accountName: string,
        wallets: Array<any>,
        hint: string,       
        networkType: NetworkType,
    )   {
        try {
            const password = AppAccounts().encryptString(clearPassword, clearPassword)
            return new AppAccount(
                accountName,
                wallets,
                password,
                hint,
                networkType,
            )
        } catch (error) {
            
        }
    }

    get currentAccount(): CurrentAccount {
        return  {
            name: this.accountName,
            password: this.password,
            networkType: this.networkType,
        }
    }

    delete(): void {
        const accountMap = localRead('accountMap') === ''
            ? {} : JSON.parse(localRead('accountMap'))
        delete accountMap[this.accountName]
        localSave('accountMap', JSON.stringify(accountMap))
    }
}


export const AppAccounts = () => ({
    accountName: '',

    getAccountFromLocalStorage(accountName) {
        const accountMapData = localRead('accountMap') || ''
        if (!accountMapData) {
            return ''
        }
        let accountMap = JSON.parse(localRead('accountMap'))
        return accountMap[accountName]
    },

    saveAccountInLocalStorage(appAccount: AppAccount): void {
        const accountMap = localRead('accountMap') ? JSON.parse(localRead('accountMap')) : {}
        accountMap[appAccount.accountName] = appAccount
        localSave('accountMap', JSON.stringify(accountMap))
    },

    deleteAccount(accountName: string) {
        const accountMap = localRead('accountMap') === ''
            ? {} : JSON.parse(localRead('accountMap'))
        delete accountMap[accountName]
        localSave('accountMap', JSON.stringify(accountMap))
    },

    /**
     * @description Save a new password in localStorage and store
     * @param {string} previousPassword
     * @param {string} newPassword
     * @param {string} mnemonic
     * @param {string} accountName
     * @param {string} store
     * @returns {string}
     */
    saveNewPassword(previousPassword: string, newPassword: string, mnemonic: string, accountName, store: Store<AppState>) {
        const newCipherPassword = this.encryptString(newPassword, newPassword)
        const newEncryptedMnemonic = this.encryptString(this.decryptString(mnemonic, previousPassword), newPassword)

        let accountMap = JSON.parse(localRead('accountMap'))
        accountMap[accountName].password = newCipherPassword
        accountMap[accountName].wallets = accountMap[accountName].wallets
            .filter(item => item.sourceType !== CreateWalletType.trezor)
            .map((item) => {
                if (item.encryptedMnemonic) {
                    item.encryptedMnemonic = newEncryptedMnemonic
                }
                const privateKey = new AppWallet({simpleWallet: item.simpleWallet}).getAccount(new Password(previousPassword)).privateKey
                item.simpleWallet = SimpleWallet.createFromPrivateKey(item.name, new Password(newPassword), privateKey, item.networkType)
                return item
            })

        const newWallet = accountMap[accountName].wallets.find(item => item.address == store.state.account.wallet.address)
        store.commit('SET_WALLET', newWallet)
        store.commit('SET_WALLET_LIST', accountMap[accountName].wallets)
        localSave('accountMap', JSON.stringify(accountMap))
    },


    /**
     * @description Encrypts a string
     * @param {string} toEncrypt
     * @param {string} password
     * @returns {string} encrypted string
     */
    encryptString(toEncrypt: string, password: string) {
        const encryptedWorkArray = CryptoJS.enc.Utf16.parse(toEncrypt)
        return PasswordBasedCipher.encrypt(defaultAlgo, encryptedWorkArray, password).toString()
    },

    /**
     * @description Decrypts a string
     * @param {string} toDecrypt
     * @param {string} password
     * @returns {string} decrypted string
     */
    decryptString(toDecrypt: string, password: string) {
        const decrypted = PasswordBasedCipher.decrypt(defaultAlgo, toDecrypt, password)
        return CryptoJS.enc.Utf16.stringify(decrypted)
    },

    /**
     * @description Returns a cipher from localStorage
     * @returns {StoredCipher}
     */
    getCipherPassword(accountName) {
        return JSON.parse(localRead('accountMap'))[accountName]['password']
    },

    /**
     * @description Removes a cipher from the localStorage
     */ deleteLock() {
        localRemove('lock')
    },

})

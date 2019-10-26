import CryptoJS, {WordArray} from 'crypto-js'
import {localSave, localRead, localRemove} from '@/core/utils'

const defaultAlgo = CryptoJS.algo.AES
const cryptoJSLib: any = CryptoJS.lib
const PasswordBasedCipher: any = cryptoJSLib.PasswordBasedCipher

const APP_LOCK_PHRASE: string = 'This Is The Awesome Wallet Lock Phrase!!!'
const APP_LOCK_PHRASE_WORD_ARRAY: WordArray = CryptoJS.enc.Utf16.parse(APP_LOCK_PHRASE)

export class StoredCipher {
    constructor(
        public readonly cipher: string,
        public hint: string) {
    }

    public create(): string {
        return JSON.stringify({
            cipher: this.cipher,
            hint: this.hint,
        })
    }
}

export class AppLock {
    /**
     * @description Encrypts the wallet lock phrase with a password
     * @param {string} password
     * @returns {string}
     */
    private createLock = (password: string): string => PasswordBasedCipher.encrypt(defaultAlgo, APP_LOCK_PHRASE_WORD_ARRAY, password).toString()

    public saveNewPassword = (newEncryptedMnemonic: string, newCipherPassword: string, accountName) => {
        let accountMap = JSON.parse(localRead('accountMap'))
        accountMap[accountName].password = newCipherPassword
        accountMap[accountName].encryptedMnemonic =
            accountMap[accountName].wallets.forEach((item) => {
                if (item.encryptedMnemonic) {
                    item.encryptedMnemonic = newEncryptedMnemonic
                }
                return item
            })
        localSave('accountMap', JSON.stringify(accountMap))
    }

    /**
     * @description Encrypts a string
     * @param {string} toEncrypt
     * @param {string} password
     * @returns {string} encrypted string
     */
    public static encryptString = (toEncrypt: string, password: string): string => {
        const encryptedWorkArray = CryptoJS.enc.Utf16.parse(toEncrypt)
        return PasswordBasedCipher.encrypt(defaultAlgo, encryptedWorkArray, password).toString()
    }

    /**
     * @description Decrypts a string
     * @param {string} toDecrypt
     * @param {string} password
     * @returns {string} decrypted string
     */
    public static decryptString = (toDecrypt: string, password: string): string => {
        const decrypted = PasswordBasedCipher.decrypt(defaultAlgo, toDecrypt, password)
        return CryptoJS.enc.Utf16.stringify(decrypted)
    }

    /**
     * @description Returns a cipher from localStorage
     * @returns {StoredCipher}
     */
    public getCipherPassword = (accountName): StoredCipher => {
        return JSON.parse(localRead('accountMap'))[accountName]['password']
    }

    /**
     * @description Removes a cipher from the localStorage
     */
    public deleteLock = (): void => {
        localRemove('lock')
    }

    /**
     * @description Verifies if a provided password matches the cipher
     * @param {string} password
     * @param {Cypher} Cypher
     * @returns {boolean}
     */
    public verifyLock = (password: string, cipher: string): boolean => {
        const decrypted = PasswordBasedCipher.decrypt(defaultAlgo, cipher, password)
        return CryptoJS.enc.Utf16.stringify(decrypted) === APP_LOCK_PHRASE
    }
}

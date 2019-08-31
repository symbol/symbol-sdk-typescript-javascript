import CryptoJS, {WordArray} from 'crypto-js'
import {localSave, localRead, localRemove} from '@/core/utils/utils.ts'

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
    private createLock = (password: string): string => PasswordBasedCipher
        .encrypt(defaultAlgo, APP_LOCK_PHRASE_WORD_ARRAY, password).toString()

    /**
     * @description Stores a new cipher in localStorage
     * @param {string} password
     */
    public storeLock = (password: string, hint: string): void => {
        const cipher = this.createLock(password)
        localSave('lock', new StoredCipher(cipher, hint).create())
    }

    /**
     * @description Returns a cipher from localStorage
     * @returns {StoredCipher}
     */
    public getLock = (): StoredCipher => {
        return JSON.parse(localRead('lock'))
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

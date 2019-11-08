import {AppWallet} from '@/core/model/AppWallet'
import {
  hdAccount,
  // @ts-ignore
} from "@@/mock/conf/conf.spec"

describe('AppWallet', () => {
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
})

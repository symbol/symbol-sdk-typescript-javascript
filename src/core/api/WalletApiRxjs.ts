import generator from 'generate-password';
import {WalletRepository} from "@/core/api/repository/WalletRepository";
import {Password, SimpleWallet, Account, PublicAccount, AccountHttp, NetworkType} from 'nem2-sdk'
import {from as observableFrom} from "rxjs";

export class WalletApiRxjs implements WalletRepository {

    loginWallet(name: string,
                privateKey: string,
                networkType: NetworkType,
                node?: string) {
        const password = new Password(generator.generate({length: 50, numbers: true, symbols: true,}));
        const account = Account.createFromPrivateKey(privateKey, networkType)
        const publicAccount = PublicAccount.createFromPublicKey(account.publicKey, networkType)
        let mosaics: any = []
        if (node) {
            const accountHttp = new AccountHttp(node)
            return observableFrom(accountHttp.getAccountInfo(account.address)).subscribe((accountInfo) => {
                    mosaics = accountInfo.mosaics
                    return {
                        wallet: SimpleWallet.createFromPrivateKey(name, password, privateKey, networkType),
                        password: password,
                        publicAccount: publicAccount,
                        account: account,
                        mosaics: mosaics
                    }
                }
            )
        }
        return {
            wallet: SimpleWallet.createFromPrivateKey(name, password, privateKey, networkType),
            password: password,
            publicAccount: publicAccount,
            account: account,
            mosaics: mosaics
        }
    }

    async createWallet(name: string,
                       networkType: NetworkType) {
        const privateKey = Account.generateNewAccount(networkType).privateKey;
        const password = new Password(generator.generate({length: 50, numbers: true, symbols: true,}));
        return {
            wallet: SimpleWallet.createFromPrivateKey(name, password, privateKey, networkType),
            privateKey: privateKey,
            password: password
        };
    }

    getWallet(name: string,
              privateKey: string,
              networkType: NetworkType) {
        const password = new Password(generator.generate({length: 50, numbers: true, symbols: true,}));
        return {
            wallet: SimpleWallet.createFromPrivateKey(name, password, privateKey, networkType),
            privateKey: privateKey,
            password: password
        }
    }

    async getKeys(password: Password,
                  wallet: SimpleWallet) {
        return {
            account: wallet.open(password)
        };
    }
}

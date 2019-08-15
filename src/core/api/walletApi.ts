import {Password, SimpleWallet, Account, PublicAccount, AccountHttp} from 'nem2-sdk'
import {sdkApi} from "@/core/api/apis";
import generator from 'generate-password';

export const walletApi: sdkApi.wallet = {

    loginWallet: async (params) => {
        const name = params.name;
        const privateKey = params.privateKey;
        const networkType = params.networkType;
        const password = new Password(generator.generate({length: 50, numbers: true, symbols: true,}));
        const wallet = await SimpleWallet.createFromPrivateKey(name, password, privateKey, networkType);
        const account = Account.createFromPrivateKey(privateKey, networkType)
        const publicAccount = PublicAccount.createFromPublicKey(account.publicKey, networkType)
        let mosaics: any = []
        if (params.node) {
            const accountHttp = new AccountHttp(params.node)
            const accountInfo = await accountHttp.getAccountInfo(account.address).toPromise()
            mosaics = accountInfo.mosaics
        }
        return {
            result: {
                wallet: wallet,
                password: password,
                publicAccount: publicAccount,
                account: account,
                mosaics: mosaics
            }
        };
    },

    createWallet: async (params) => {
        const name = params.name;
        const networkType = params.networkType;
        const privateKey = Account.generateNewAccount(networkType).privateKey;
        const password = new Password(generator.generate({length: 50, numbers: true, symbols: true,}));
        const wallet = await SimpleWallet.createFromPrivateKey(name, password, privateKey, networkType);
        return {
            result: {
                wallet: wallet,
                privateKey: privateKey,
                password: password
            }
        };
    },

    getWallet: async (params) => {
        const name = params.name;
        const privateKey = params.privateKey;
        const networkType = params.networkType;
        const password = new Password(generator.generate({length: 50, numbers: true, symbols: true,}));
        const wallet = await SimpleWallet.createFromPrivateKey(name, password, privateKey, networkType);
        return {
            result: {
                wallet: wallet,
                privateKey: privateKey,
                password: password
            }
        };
    },

    getKeys: async (params) => {
        const password = params.password;
        const wallet = params.wallet;
        const account = await wallet.open(password);
        return {
            result: {
                account: account
            }
        };
    },
}

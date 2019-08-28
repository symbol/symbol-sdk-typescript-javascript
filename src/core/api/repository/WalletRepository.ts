import {
    NetworkType, Password,
    SimpleWallet,
} from "nem2-sdk";


export interface WalletRepository {
    loginWallet(
        name: string,
        privateKey: string,
        networkType: NetworkType,
        node?: string
    ): Object;


    createWallet(
        name: string,
        networkType: NetworkType
    ): Object;


    getWallet(
        name: string,
        privateKey: string,
        networkType: NetworkType,
    ): Object;


    getKeys(
        password: Password,
        wallet: SimpleWallet
    ): Object;
}

import {Account} from 'nem2-sdk'
declare interface account {
    account: Account,
    wallet: any,
    mosaic:any[]
}

export default {
    state: {
        accountPrivateKey: '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E',
        accountPublicKey: 'AC1A6E1D8DE5B17D2C6B1293F1CAD3829EEACF38D09311BB3C8E5A880092DE26',
        accountAddress: 'SCA7ZS-2B7DEE-BGU3TH-SILYHC-RUR32Y-YE55ZB-LYA2',
        node: 'http://192.168.0.105:3000',
        currentXem: 'nem.xem',
        currentXEM1:'77a1969932d987d7',
        currentXEM2:'d525ad41d95fcf29',
        account:{},
        wallet:{},
        mosaic:[],
        generationHash:''
    },
    getters: {
        Address(state){
            return state.account.address;
        },
        PublicAccount(state){
            return state.account.publicAccount;
        },
        privateKey(state){
            return state.account.privateKey;
        },
        publicKey(state){
            return state.account.publicKey;
        }
    },
    mutations: {
        SET_ACCOUNT(state: account, account: Account): void {
            state.account = account
        },
        SET_WALLET(state: account, wallet: any): void {
            state.wallet = wallet
        },
        SET_MOSAICS(state: account, mosaic: any[]): void {
            state.mosaic = mosaic
        },
    },
}

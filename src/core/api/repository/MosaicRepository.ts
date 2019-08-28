import { Observable } from "rxjs";
import {
    AggregateTransaction,
    MosaicId,
    MosaicNonce,
    MosaicSupplyChangeTransaction,
    NetworkCurrencyMosaic,
    PublicAccount
} from "nem2-sdk";

export interface MosaicRepository {
    createMosaicNonce(nonce?: Uint8Array): MosaicNonce;

    getcurrentXEM(node?: string): NetworkCurrencyMosaic;

    createMosaicId(publicAccount: PublicAccount, mosaicNonce: any): MosaicId;


    createMosaic(
        mosaicNonce: any,
        mosaicId: any,
        supplyMutable: boolean,
        transferable: boolean,
        divisibility: number,
        duration: number | undefined,
        netWorkType: number,
        supply: number,
        publicAccount: PublicAccount,
        maxFee?: number
    ): AggregateTransaction;


    mosaicSupplyChange(
        mosaicId: any,
        delta: number,
        MosaicSupplyType: number,
        netWorkType: number,
        maxFee?: number
    ): MosaicSupplyChangeTransaction;


    getMosaics(node: string, mosaicIdList: MosaicId[]): Observable<any>;

    getMosaicsNames(node: string, mosaicIds: any[]): Observable<any>;

    getMosaicByNamespace(namespace: string): MosaicId;

}

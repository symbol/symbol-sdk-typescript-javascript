import {
    MosaicDefinitionTransaction,
    Deadline,
    MosaicNonce,
    MosaicId,
    NamespaceMosaicIdGenerator,
    AggregateTransaction,
    MosaicProperties,
    UInt64,
    MosaicSupplyChangeTransaction,
    MosaicHttp,
    Convert,
    NetworkCurrencyMosaic,
    MosaicSupplyType, PublicAccount
} from 'nem2-sdk'
import { MosaicRepository } from "@/core/api/repository/MosaicRepository.ts";
import { from as observableFrom } from "rxjs";

export class MosaicApiRxjs implements MosaicRepository {
    getMosaicByNamespace(namespace: string) {
        const uintArray = NamespaceMosaicIdGenerator.namespaceId(namespace)
        return new MosaicId(uintArray)
    }

    getcurrentXEM(params) {
        return NetworkCurrencyMosaic.createRelative(0)

    }

    createMosaicNonce(nonce?: Uint8Array) {
        nonce = nonce || convertNonce(Math.ceil(Math.random() * 1000))
        return (new MosaicNonce(nonce))

        function convertNonce(input: number) {
            const hex = input.toString(16)
            const hex2 = '0000000'.concat(hex).substr(-8)
            return Convert.hexToUint8(hex2).reverse()
        }
    }

    createMosaicId(publicAccount: PublicAccount, mosaicNonce: any) {
        return MosaicId.createFromNonce(mosaicNonce, publicAccount)
    }

    createMosaic(mosaicNonce: any,
        mosaicId: any,
        supplyMutable: boolean,
        transferable: boolean,
        divisibility: number,
        duration: number | undefined,
        netWorkType: number,
        supply: number,
        publicAccount: PublicAccount,
        maxFee?: number) {
        const mosaicDefinitionTx = MosaicDefinitionTransaction.create(
            Deadline.create(),
            mosaicNonce,
            mosaicId,
            MosaicProperties.create({
                supplyMutable: supplyMutable,
                transferable: transferable,
                divisibility: divisibility,
                duration: duration ? UInt64.fromUint(duration) : undefined
            }),
            netWorkType,
            maxFee ? UInt64.fromUint(maxFee) : undefined
        )
        const mosaicSupplyChangeTx = MosaicSupplyChangeTransaction.create(
            Deadline.create(),
            mosaicDefinitionTx.mosaicId,
            MosaicSupplyType.Increase,
            UInt64.fromUint(supply),
            netWorkType
        )
        return AggregateTransaction.createComplete(
            Deadline.create(),
            [
                mosaicDefinitionTx.toAggregate(publicAccount),
                mosaicSupplyChangeTx.toAggregate(publicAccount)
            ],
            netWorkType,
            [],
            UInt64.fromUint(maxFee)
        )
    }

    mosaicSupplyChange(mosaicId: any,
        delta: number,
        MosaicSupplyType: number,
        netWorkType: number,
        maxFee?: number) {
        return MosaicSupplyChangeTransaction.create(
            Deadline.create(),
            mosaicId,
            MosaicSupplyType,
            UInt64.fromUint(delta),
            netWorkType,
            maxFee ? UInt64.fromUint(maxFee) : undefined
        )
    }

    getMosaics(node: string, mosaicIdList: MosaicId[]) {
        return observableFrom(new MosaicHttp(node).getMosaics(mosaicIdList))
    }

    getMosaicsNames(node: string, mosaicIds: any[]) {
        return observableFrom(new MosaicHttp(node).getMosaicsNames(mosaicIds))
    }


}

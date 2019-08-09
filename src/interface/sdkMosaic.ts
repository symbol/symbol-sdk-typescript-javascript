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
    MosaicSupplyType
} from 'nem2-sdk'
import {SdkV0} from "./sdkDefine";

export const mosaicInterface: SdkV0.mosaic = {
    getMosaicByNamespace: async (params) => {
        const currentXem = params.namespace
        const uintArray = NamespaceMosaicIdGenerator.namespaceId(currentXem)
        const mosaicId = new MosaicId(uintArray)
        return {
            result: {
                mosaicId: mosaicId
            }
        }
    },
    getcurrentXEM: async (params) => {
        const node = params.node
        const currentXEM = NetworkCurrencyMosaic.createRelative(0)
        return {
            result: {
                currentXEM: currentXEM
            }
        }

        function convertNonce(input: number) {
            const hex = input.toString(16)
            const hex2 = '0000000'.concat(hex).substr(-8)
            return Convert.hexToUint8(hex2).reverse()
        }
    },
    createMosaicNonce: async (params) => {
        const nonce = params.nonce || convertNonce(Math.ceil(Math.random() * 1000))
        const mosaicNonce = new MosaicNonce(nonce)
        return {
            result: {
                mosaicNonce: mosaicNonce
            }
        }

        function convertNonce(input: number) {
            const hex = input.toString(16)
            const hex2 = '0000000'.concat(hex).substr(-8)
            return Convert.hexToUint8(hex2).reverse()
        }
    },

    createMosaicId: async (params) => {
        const publicAccount = params.publicAccount
        const mosaicNonce = params.mosaicNonce
        const mosaicId = MosaicId.createFromNonce(mosaicNonce, publicAccount)
        return {
            result: {
                mosaicId: mosaicId
            }
        }
    },

    createMosaic: async (params) => {
        const mosaicNonce = params.mosaicNonce;
        const mosaicId = params.mosaicId;
        const supplyMutable = params.supplyMutable;
        const transferable = params.transferable;
        const divisibility = params.divisibility;
        const duration = params.duration;
        const netWorkType = params.netWorkType;
        const maxFee = params.maxFee;
        const supply = params.supply
        const publicAccount = params.publicAccount
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
        const mosaicDefinitionTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [
                mosaicDefinitionTx.toAggregate(publicAccount),
                mosaicSupplyChangeTx.toAggregate(publicAccount)
            ],
            netWorkType,
            [],
            UInt64.fromUint(maxFee)
        )

        return {
            result: {
                mosaicDefinitionTransaction: mosaicDefinitionTransaction
            }
        };
    },

    mosaicSupplyChange: async (params) => {
        const mosaicId = params.mosaicId;
        const delta = params.delta;
        const netWorkType = params.netWorkType;
        const MosaicSupplyType = params.MosaicSupplyType;
        const maxFee = params.maxFee;
        const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
            Deadline.create(),
            mosaicId,
            MosaicSupplyType,
            UInt64.fromUint(delta),
            netWorkType,
            maxFee ? UInt64.fromUint(maxFee) : undefined
        )
        return {
            result: {
                mosaicSupplyChangeTransaction: mosaicSupplyChangeTransaction
            }
        };
    },

    getMosaics: async (params) => {
        const mosaicsInfos = new MosaicHttp(params.node).getMosaics(params.mosaicIdList)
        return {
            result: {
                mosaicsInfos: mosaicsInfos
            }
        };
    },

    getMosaicsNames: async (params) => {
        const mosaicsNamesInfos = await new MosaicHttp(params.node).getMosaicsNames(params.mosaicIds)
        return {
            result: {
                mosaicsNamesInfos: mosaicsNamesInfos
            }
        }
    },


}

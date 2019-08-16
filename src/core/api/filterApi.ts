
import {
    UInt64,
    Deadline,
    ModifyAccountPropertyAddressTransaction,
    ModifyAccountPropertyMosaicTransaction,
    ModifyAccountPropertyEntityTypeTransaction
} from 'nem2-sdk'
import {sdkApi} from "@/core/api/apis";

export const filterApi: sdkApi.filter = {
    creatrModifyAccountPropertyAddressTransaction: async (params) => {
        const {propertyType, modifications, networkType, fee} = params
        const modifyAccountPropertyAddressTransaction = ModifyAccountPropertyAddressTransaction.create(
            Deadline.create(),
            propertyType,
            modifications,
            networkType,
            UInt64.fromUint(fee)
        )
        return {
            result: {
                modifyAccountPropertyAddressTransaction: modifyAccountPropertyAddressTransaction
            }
        }
    },
    creatrModifyAccountPropertyMosaicTransaction: async (params) => {
        const {propertyType, modifications, networkType, fee} = params
        const modifyAccountPropertyMosaicTransaction = ModifyAccountPropertyMosaicTransaction.create(
            Deadline.create(),
            propertyType,
            modifications,
            networkType,
            UInt64.fromUint(fee)
        )
        return {
            result: {
                modifyAccountPropertyMosaicTransaction: modifyAccountPropertyMosaicTransaction
            }
        }
    },
    creatrModifyAccountPropertyEntityTypeTransaction: async (params) => {
        const {propertyType, modifications, networkType, fee} = params
        const modifyAccountPropertyEntityTypeTransaction = ModifyAccountPropertyEntityTypeTransaction.create(
            Deadline.create(),
            propertyType,
            modifications,
            networkType,
            UInt64.fromUint(fee)
        )
        return {
            result: {
                modifyAccountPropertyEntityTypeTransaction: modifyAccountPropertyEntityTypeTransaction
            }
        }
    },
}

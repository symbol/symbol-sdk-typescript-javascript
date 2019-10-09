import {
 UInt64,
 MosaicAmountView,
 MosaicDefinitionTransaction,
 MosaicInfo,
 Namespace,
} from 'nem2-sdk'
import {MosaicProperties, AppNamespace} from '@/core/model'
import {getRelativeMosaicAmount} from '@/core/utils'


export class AppMosaic {
 hex: string
 amount: any
 balance?: number
 expirationHeight: number | 'Forever'
 height: UInt64
 mosaicInfo: MosaicInfo
 name: string
 properties: MosaicProperties
 hide: boolean

 constructor(appMosaic?: {
     hex: string,
     balance?: number,
     name?: string,
     amount?: any,
     mosaicInfo?: MosaicInfo,
     properties?: MosaicProperties,
     hide?: boolean,
 }) {
     Object.assign(this, appMosaic)
     delete this.amount
     if (this.mosaicInfo) {
         const duration = this.mosaicInfo.duration.compact()
         this.expirationHeight = duration === 0
             ? 'Forever' : this.mosaicInfo.height.compact() + duration

         this.properties = new MosaicProperties(
             this.mosaicInfo.isSupplyMutable(),
             this.mosaicInfo.isTransferable(),
             this.mosaicInfo.divisibility,
             this.mosaicInfo.duration.compact(),
             this.mosaicInfo.isRestrictable(),
         )
     }
 }

 static fromGetCurrentNetworkMosaic( mosaicDefinitionTransaction: MosaicDefinitionTransaction,
                                     name: string): AppMosaic {
 const {mosaicId} = mosaicDefinitionTransaction
 return new AppMosaic({
         hex: mosaicId.toHex(),
         properties: new MosaicProperties(
            mosaicDefinitionTransaction.flags.supplyMutable,
            mosaicDefinitionTransaction.flags.transferable,
            mosaicDefinitionTransaction.divisibility,
            mosaicDefinitionTransaction.duration.compact(),
            mosaicDefinitionTransaction.flags.restrictable,
         ),
         name,
     })
 }
 
 static fromMosaicAmountView(mosaic: MosaicAmountView): AppMosaic {
     const mosaicHex = mosaic.mosaicInfo.id.toHex()
     return new AppMosaic({
         ...mosaic,
         hex: mosaicHex,
         balance: getRelativeMosaicAmount(
             mosaic.amount.compact(),
             mosaic.mosaicInfo.divisibility,
         ),
     })
 }

 static fromNamespace(namespace: Namespace | AppNamespace): AppMosaic {
     const id: any = namespace.alias.mosaicId
     
     return new AppMosaic({
         hex: id.toHex(),
         name: namespace.name,
     })
 }
}
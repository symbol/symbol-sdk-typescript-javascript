import {
 MosaicId, UInt64, MosaicAmountView, MosaicDefinitionTransaction,
 MosaicInfo, MosaicProperties, Namespace,
} from 'nem2-sdk'
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

         this.properties = MosaicProperties.create({
             supplyMutable: this.mosaicInfo.isSupplyMutable(),
             transferable: this.mosaicInfo.isTransferable(),
             divisibility: this.mosaicInfo.divisibility,
             duration: this.mosaicInfo.duration,
             restrictable: this.mosaicInfo.isRestrictable(),
         })
     }
 }

 static fromGetCurrentNetworkMosaic( mosaicDefinitionTransaction: MosaicDefinitionTransaction,
                                     name: string): AppMosaic {
     const {mosaicId, mosaicProperties} = mosaicDefinitionTransaction
     return new AppMosaic({
         hex: mosaicId.toHex(),
         properties: mosaicProperties,
         name,
     })
 }
 
 static fromMosaicAmountView(mosaic: MosaicAmountView): AppMosaic {
     const mosaicHex = mosaic.mosaicInfo.mosaicId.toHex()
     return new AppMosaic({
         ...mosaic,
         hex: mosaicHex,
         balance: getRelativeMosaicAmount(
             mosaic.amount.compact(),
             mosaic.mosaicInfo.divisibility,
         ),
     })
 }

 static fromNamespace(namespace: any): AppMosaic {
     const id: any = namespace.alias.mosaicId //@TODO change after SDK update
     return new AppMosaic({
         hex: new MosaicId(id).toHex(),
         name: namespace.label,
     })
 }
}
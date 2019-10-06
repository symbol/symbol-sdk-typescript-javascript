export class MosaicProperties {
 supplyMutable: boolean
 transferable: boolean
 divisibility: number
 duration: number
 restrictable: boolean

 constructor(    supplyMutable: boolean,
                 transferable: boolean,
                 divisibility: number,
                 duration: number,
                 restrictable: boolean
                 ) {
     this.supplyMutable = supplyMutable
     this.transferable = transferable
     this.divisibility = divisibility
     this.duration = duration
     this.restrictable = restrictable
 }
}
import {FormattedTransaction} from '@/core/model'
import {getRelativeMosaicAmount} from '@/core/utils'
import {Address, RegisterNamespaceTransaction} from 'nem2-sdk'
import {defaultNetworkConfig} from '@/config/index.ts';

export class FormattedRegisterNamespace extends FormattedTransaction {
  dialogDetailMap: any
  icon: any

  constructor( tx: RegisterNamespaceTransaction,
               address: Address,
               currentXem: string,
               xemDivisibility: number,
               store: any) {
      super(tx, address, currentXem, xemDivisibility, store)

        this.dialogDetailMap = {
          'transfer_type': this.txHeader.tag,
          'namespace_name': tx.namespaceName + ' (' + (tx.namespaceType ? 'sub' : 'root') + ')',
          'root_namespace': tx.parentId ? tx.parentId.id.toHex() : '-',
          'sender': tx.signer.publicKey,
          'duration': tx.duration ? tx.duration.compact() : 0,
          'rent': (tx.duration ? tx.duration.compact() : 0) / defaultNetworkConfig.gas2xemRate + defaultNetworkConfig.XEM,
          'fee': getRelativeMosaicAmount(tx.maxFee.compact(), xemDivisibility) + defaultNetworkConfig.XEM,
          'block': this.txHeader.block,
          'hash': this.txHeader.hash,
       }
   }
}

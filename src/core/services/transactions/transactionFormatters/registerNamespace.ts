import {FormattedTransaction, iconMap} from '@/core/services/transactions'
import {getRelativeMosaicAmount} from '@/core/utils/utils'
import {Address, RegisterNamespaceTransaction} from 'nem2-sdk'
import {nodeConfig} from '@/config/index.ts';

export class FormattedRegisterNamespace extends FormattedTransaction {
  dialogDetailMap: any
  icon: any

  constructor( tx: RegisterNamespaceTransaction,
               address: Address,
               currentXem: string,
               xemDivisibility: number) {
      super(tx, address, currentXem, xemDivisibility)
        this.icon = iconMap.dashboardNamespace

        this.dialogDetailMap = {
          'transfer_type': this.txHeader.tag,
          'namespace_name': tx.namespaceName + ' (' + (tx.namespaceType ? 'sub' : 'root') + ')',
          'root_namespace': tx.parentId ? tx.parentId.id.toHex() : '-',
          'sender': tx.signer.publicKey,
          'duration': tx.duration ? tx.duration.compact() : 0,
          'rent': (tx.duration ? tx.duration.compact() : 0) / nodeConfig.GasToXemMultiple + nodeConfig.XEM,
          'fee': getRelativeMosaicAmount(tx.maxFee.compact(), xemDivisibility) + nodeConfig.XEM,
          'block': this.txHeader.block,
          'hash': this.txHeader.hash,
       }
   }
}

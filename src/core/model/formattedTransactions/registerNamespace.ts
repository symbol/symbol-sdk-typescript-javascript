import {FormattedTransaction, AppState} from '@/core/model'
import {getRelativeMosaicAmount} from '@/core/utils'
import {RegisterNamespaceTransaction} from 'nem2-sdk'
import {defaultNetworkConfig} from '@/config/index.ts';
import {Store} from 'vuex';

export class FormattedRegisterNamespace extends FormattedTransaction {
  dialogDetailMap: any
  icon: any

  constructor(  tx: RegisterNamespaceTransaction,
                store: Store<AppState>) {
        super(tx, store)
        const {networkCurrency} = store.state.account

        this.dialogDetailMap = {
          'transfer_type': this.txHeader.tag,
          'namespace_name': tx.namespaceName + ' (' + (tx.namespaceType ? 'sub' : 'root') + ')',
          'root_namespace': tx.parentId ? tx.parentId.id.toHex() : '-',
          'sender': tx.signer.publicKey,
          'duration': tx.duration ? tx.duration.compact() : 0,
          'rent': (tx.duration ? tx.duration.compact() : 0) / defaultNetworkConfig.gas2xemRate + networkCurrency.ticker,
          'fee': getRelativeMosaicAmount(tx.maxFee.compact(), networkCurrency.divisibility) + networkCurrency.ticker,
          'block': this.txHeader.block,
          'hash': this.txHeader.hash,
       }
   }
}

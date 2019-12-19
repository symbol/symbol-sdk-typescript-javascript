import {Component, Prop, Vue} from 'vue-property-decorator'
import {StoreAccount} from "@/core/model"
import {mapState} from "vuex"
import {renderMosaicsAndReturnArray} from "@/core/utils"
import {getNamespaceNameFromNamespaceId, formatSenderOrRecipient} from '@/core/services'
import {TransferTransaction, Address, NamespaceId} from 'nem2-sdk'

@Component({
    computed: {...mapState({activeAccount: 'account'})},
})
export class TransactionInfoTemplateTs extends Vue {
    activeAccount: StoreAccount
    unusedAttributesList = [ 'from', 'cosignatories', 'hash', 'fee', 'max_fee', 'block', 'sender', 'transaction_type','message', 'self', 'aims', 'tag', 'mosaics', 'namespace', 'root_namespace' ]

    getNamespaceNameFromNamespaceId = getNamespaceNameFromNamespaceId
    formatSenderOrRecipient = formatSenderOrRecipient
    renderMosaicsAndReturnArray = renderMosaicsAndReturnArray
    TransferTransaction = TransferTransaction
    NamespaceId = NamespaceId

    @Prop()
    transactionDetails

    @Prop()
    cosignedBy: string[]

    getFrom(): string {
        const {activeMultisigAccount, wallet} = this.activeAccount

        return this.activeAccount.activeMultisigAccount
            ? Address.createFromPublicKey(activeMultisigAccount, wallet.networkType).pretty()
            : Address.createFromRawAddress(wallet.address).pretty()
    }
}

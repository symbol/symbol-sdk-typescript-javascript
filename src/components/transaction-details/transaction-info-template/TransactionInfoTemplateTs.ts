import {Component, Prop, Vue} from 'vue-property-decorator'
import {StoreAccount} from "@/core/model"
import {mapState} from "vuex"
import {Address} from "nem2-sdk"
import {renderMosaicsAndReturnArray} from "@/core/utils"

@Component({
    computed: {...mapState({activeAccount: 'account'})},
})
export default class extends Vue {
    activeAccount: StoreAccount
    unusedAttributesList = ['from', 'cosignatories', 'hash', 'fee', 'block', 'sender', 'transaction_type', 'self', 'aims', 'tag', 'mosaics']

    @Prop()
    transactionDetails

    get mosaics(): any {
        return this.activeAccount.mosaics
    }

    get address() {
        return this.activeAccount.wallet.address
    }


    decryptedAddress(encryptedAddress) {
        try {
            return Address.createFromEncoded(encryptedAddress).pretty()
        } catch (e) {
            return encryptedAddress
        }

    }

    renderMosaicsToTable(mosaics) {
        return renderMosaicsAndReturnArray(mosaics, this.$store)
    }
}

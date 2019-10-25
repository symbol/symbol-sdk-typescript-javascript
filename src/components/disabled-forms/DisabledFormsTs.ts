import {Component, Vue} from 'vue-property-decorator'
import {mapState} from "vuex"
import {AppInfo, StoreAccount} from "@/core/model"


@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    }
})
export class DisabledFormsTs extends Vue {
    activeAccount: StoreAccount
    app: AppInfo

    get noNetworkCurrencySet(): boolean {
        return this.activeAccount.networkCurrency.name === ''
    } 

    get isMultisig(): boolean {
        const {address} = this.activeAccount.wallet
        const {multisigAccountInfo} = this.activeAccount
        return multisigAccountInfo[address] && multisigAccountInfo[address].cosignatories.length > 0
    }

    get active(): boolean {
        if (this.noNetworkCurrencySet || this.isMultisig) return true
        return false
    }

    get alertMessage(): string {
        if (this.noNetworkCurrencySet) return 'no_network_currency_alert'
        if (this.isMultisig) return 'Multisig_accounts_can_not_send_a_transaction_by_themselves'
        return ''
    }
}

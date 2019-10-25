import {Component, Vue} from 'vue-property-decorator'
import {mapState} from "vuex"
import {AppInfo, StoreAccount} from "@/core/model"
import {Message} from '@/config'

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
        if (this.noNetworkCurrencySet) return Message.NO_NETWORK_CURRENCY
        if (this.isMultisig) return Message.MULTISIG_ACCOUNTS_NO_TX
        return ''
    }
}

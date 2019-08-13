import {Message} from "@/config/index"
import {Component, Vue} from 'vue-property-decorator'

@Component
export class WalletAliasTs extends Vue {
    isShowDialog = false
    isShowDeleteIcon = false
    formItem = {
        address: '',
        alias: '',
        fee: '',
        password: ''
    }
    aliasList = []
    aliasActionTypeList = [
        {
            label: 'no data',
            value: 'no data'
        }
    ]

    checkForm(): boolean {
        const {address, alias, fee, password} = this.formItem
        if (address.length < 40) {
            this.showErrorMessage(this.$t(Message.ADDRESS_FORMAT_ERROR))
            return false
        }
        if (alias || alias.trim()) {
            this.showErrorMessage(this.$t(Message.INPUT_EMPTY_ERROR) + '')
            return false
        }
        if (password || password.trim()) {
            this.showErrorMessage(this.$t(Message.INPUT_EMPTY_ERROR) + '')
            return false
        }
        if ((!Number(fee) && Number(fee) !== 0) || Number(fee) < 0) {
            this.showErrorMessage(this.$t(Message.FEE_LESS_THAN_0_ERROR))
            return false
        }
        return true
    }

    showErrorMessage(message) {
        this.$Notice.destroy()
        this.$Notice.error({
            title: message
        })
    }
}

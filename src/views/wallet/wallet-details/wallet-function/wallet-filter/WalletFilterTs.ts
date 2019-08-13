import {Message} from "@/config/index"
import {Component, Vue} from 'vue-property-decorator'

@Component
export class WalletFilterTs extends Vue {
    aliasList = []
    isShowDialog = false
    isShowDeleteIcon = false
    currentAlias: any = false
    currentTitle = 'add_address'
    filterTypeList = [true, false, false]
    titleList = ['add_address', 'add_mosaic', 'add_entity_type']
    formItem = {
        address: '',
        fee: 0,
        password: '',
        mosaic: '',
        entityType: -1
    }
    namespaceList = [
        {
            label: 'no data',
            value: 'no data'
        }
    ]

    showFilterTypeListIndex(index) {
        this.currentTitle = this.titleList[index]
        this.filterTypeList = [false, false, false]
        this.filterTypeList[index] = true
    }

    checkForm(): boolean {
        const {fee, password, address, mosaic, entityType} = this.formItem
        const {filterTypeList} = this
        if (password || password.trim()) {
            this.showErrorMessage(this.$t(Message.INPUT_EMPTY_ERROR) + '')
            return false
        }

        if ((!Number(fee) && Number(fee) !== 0) || Number(fee) < 0) {
            this.showErrorMessage(this.$t(Message.FEE_LESS_THAN_0_ERROR))
            return false
        }

        if (filterTypeList[0] && address.length < 40) {
            this.showErrorMessage(this.$t(Message.ADDRESS_FORMAT_ERROR))
            return false
        }


        if (filterTypeList[1] && mosaic) {
            this.showErrorMessage(this.$t(Message.INPUT_EMPTY_ERROR))
            return false
        }

        if (filterTypeList[2] && entityType) {
            this.showErrorMessage(this.$t(Message.INPUT_EMPTY_ERROR))
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

    confirmInput() {
        if (!this.checkForm()) return

    }

}

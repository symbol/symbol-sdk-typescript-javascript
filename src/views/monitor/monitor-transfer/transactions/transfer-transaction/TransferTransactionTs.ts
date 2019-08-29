import {Message} from "@/config/index.ts"
import {MosaicApiRxjs} from '@/core/api/MosaicApiRxjs.ts'
import {AccountApiRxjs} from '@/core/api/AccountApiRxjs.ts'
import {Account, Mosaic, MosaicId, UInt64} from 'nem2-sdk'
import {Component, Vue, Watch, Provide} from 'vue-property-decorator'
import {TransactionApiRxjs} from '@/core/api/TransactionApiRxjs.ts'
import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'
import {clone} from '@/core/utils/utils'
import ErrorTooltip from '@/views/other/forms/errorTooltip/ErrorTooltip.vue'
import {standardFields} from '@/core/validation'
import {mapState} from 'vuex';

@Component({
    components: {CheckPWDialog, ErrorTooltip},
    computed: {...mapState({activeAccount: 'account'})},
})
export default class TransferTransactionTs extends Vue {
    @Provide() validator: any = this.$validator
    activeAccount: any
    standardFields: object = standardFields
    errors: any
    submitDisabled: boolean = false
    mosaicList = []
    transactionList = []
    transactionDetail = {}
    showCheckPWDialog = false
    isCompleteForm = false

    formFields = {
        fee: 50000,
        remark: '',
        address: '',
        mosaic: '',
        amount: 0,
    }

    formModel = clone(this.formFields)

    get wallet() {
        return this.activeAccount.wallet
    }

    get accountPublicKey() {
        return this.activeAccount.wallet.publicKey
    }

    get accountAddress() {
        return this.activeAccount.wallet.address
    }

    get node() {
        return this.activeAccount.node
    }

    get currentXem() {
        return this.activeAccount.currentXem
    }

    get generationHash() {
        return this.activeAccount.generationHash
    }

    resetFields() {
        this.formModel = clone(this.formFields)
        this.$nextTick(() => this.$validator.reset())
    }

    submit() {
        this.$validator
            .validate()
            .then((valid) => {
                if (!valid) return
                this.showDialog()
            });
    }

    showDialog() {
        const {address, mosaic, amount, remark, fee} = this.formModel
        this.transactionDetail = {
            "transaction_type": 'ordinary_transfer',
            "transfer_target": address,
            "asset_type": mosaic,
            "quantity": amount,
            "fee": fee + 'gas',
            "remarks": remark
        }
        this.showCheckPWDialog = true
        this.generateTransaction()
    }

    generateTransaction() {
        const that = this
        let {node, generationHash} = this
        let {address, mosaic, amount, remark, fee} = this.formModel
        const {networkType} = this.wallet
        // const account = Account.createFromPrivateKey(key, networkType)
        const transaction = new TransactionApiRxjs().transferTransaction(
            networkType,
            fee,
            address,
            [new Mosaic(new MosaicId(mosaic), UInt64.fromUint(amount))],
            0,
            remark
        )
        this.transactionList = [transaction]
        // const signature = account.sign(transaction, generationHash)
        // new TransactionApiRxjs().announce(signature, node).subscribe(
        //     () => {
        //         that.$Notice.success({
        //             title: this.$t(Message.SUCCESS) + ''
        //         })
        //         that.resetFields()
        //     }, (error) => {
        //         console.log(error)
        //     }
        // )
    }

    async getMosaicList() {
        this.mosaicList = []
        const that = this
        let {accountAddress, node} = this
        const {currentXEM1, currentXEM2} = this.activeAccount
        new AccountApiRxjs().getAccountInfo(accountAddress, node).subscribe((accountInfo) => {
            // set mosaicList
            const mosaicList = accountInfo.mosaics.map((item: any) => {
                item._amount = item.amount.compact()
                item.value = item.id.toHex()
                if (item.value == currentXEM1 || item.value == currentXEM2) {
                    item.label = 'nem.xem' + ' (' + item._amount + ')'
                } else {
                    item.label = item.id.toHex() + ' (' + item._amount + ')'
                }
                return item
            })
            let isCrrentXEMExists = mosaicList.every((item) => {
                if (item.value == currentXEM1 || item.value == currentXEM2) {
                    return false
                }
                return true
            })
            if (isCrrentXEMExists) {
                mosaicList.unshift({
                    value: currentXEM1,
                    label: 'nem.xem'
                })
            }
            that.mosaicList = mosaicList
        }, () => {
            that.mosaicList = [{
                value: currentXEM1,
                label: 'nem.xem'
            }]
        })
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    checkEnd(isPasswordRight) {
        if (!isPasswordRight) {
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
        }
    }

    @Watch('accountAddress')
    onAcountAddressChange() {
        this.resetFields()
        this.getMosaicList()
    }

    @Watch('errors.items')
    onErrorsChanged() {
        this.submitDisabled = this.errors.items.length > 0
    }

    created() {
        this.getMosaicList()
    }

    mounted() {
        this.resetFields()
    }
}

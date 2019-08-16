import {Message} from "@/config"
import {mosaicApi} from '@/core/api/mosaicApi'
import {accountApi} from '@/core/api/accountApi'
import { Account, Mosaic, MosaicId, UInt64} from 'nem2-sdk'
import {Component, Vue, Watch} from 'vue-property-decorator'
import {transactionApi} from '@/core/api/transactionApi'
import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'


@Component({
    components: {
        CheckPWDialog
    }
})
export default class TransferTransactionTs extends Vue {
    node = ''
    currentXem = ''
    mosaicList = []
    generationHash = ''
    accountAddress = ''
    accountPublicKey = ''
    transactionDetail = {}
    isShowSubAlias = false
    showCheckPWDialog = false
    isCompleteForm = false
    formItem = {
        fee: 50000,
        remark: '',
        address: '',
        mosaic: '',
        amount: 0,
    }

    get getWallet() {
        return this.$store.state.account.wallet
    }

    initForm() {
        this.formItem = {
            fee: 50000,
            remark: '',
            address: 'SCSXIT-R36DCY-JRVSNE-NY5BUA-HXSL7I-E6ULEY-UYRC',
            mosaic: '',
            amount: 0,
        }
    }

    checkInfo() {
        if (!this.isCompleteForm) return
        if (!this.checkForm()) return
        this.showDialog()
    }

    showDialog() {
        const {address, mosaic, amount, remark, fee} = this.formItem
        this.transactionDetail = {
            "transaction_type": 'ordinary_transfer',
            "transfer_target": address,
            "asset_type": mosaic,
            "quantity": amount,
            "fee": fee + 'gas',
            "remarks": remark
        }
        this.showCheckPWDialog = true
    }

    sendTransaction(key) {
        const that = this
        let {node, generationHash} = this
        let {address, mosaic, amount, remark, fee} = this.formItem
        const account = Account.createFromPrivateKey(key, this.getWallet.networkType)

        transactionApi.transferTransaction({
            network: this.getWallet.networkType,
            MaxFee: fee,
            receive: address,
            MessageType: 0,
            mosaics: [new Mosaic(new MosaicId(mosaic), UInt64.fromUint(amount))],
            message: remark
        }).then((transactionResult) => {
            // sign tx
            const transaction = transactionResult.result.transferTransaction
            // const transaction = tx
            console.log(transaction)
            const signature = account.sign(transaction, generationHash)
            // send tx
            transactionApi.announce({signature, node}).then((announceResult) => {
                // get announce status
                announceResult.result.announceStatus.subscribe((announceInfo: any) => {
                    console.log(signature)
                    that.$Notice.success({
                        title: this.$t(Message.SUCCESS) + ''
                    })
                    that.initForm()
                })
            })

        })
    }

    checkForm() {
        const {address, mosaic, amount, remark, fee} = this.formItem
        if (address.length < 40) {
            this.showErrorMessage(this.$t(Message.ADDRESS_FORMAT_ERROR))
            return false
        }
        if (mosaic == '' || mosaic.trim() == '') {
            this.showErrorMessage(this.$t(Message.INPUT_EMPTY_ERROR))
            return false
        }
        if ((!Number(amount) && Number(amount) !== 0) || Number(amount) < 0) {
            this.showErrorMessage(this.$t(Message.AMOUNT_LESS_THAN_0_ERROR))
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

    async getMosaicList() {
        const that = this
        let {accountAddress, node} = this
        const {currentXEM1, currentXEM2} = this.$store.state.account
        await accountApi.getAccountInfo({
            node,
            address: accountAddress
        }).then(async accountInfoResult => {
            await accountInfoResult.result.accountInfo.subscribe((accountInfo) => {
                let mosaicList = []
                // set mosaicList
                mosaicList = accountInfo.mosaics.map((item) => {
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
                let mosaicList = []
                mosaicList.unshift({
                    value: currentXEM1,
                    label: 'nem.xem'
                })
                that.mosaicList = mosaicList
            })
        })
    }

    getNamespace(currentXem, mosaicIdList, currentXEM1, currentXEM2, mosaicList) {
        let currentXEMHex = ''
        const that = this
        mosaicApi.getMosaicByNamespace({
            namespace: currentXem
        }).then((result: any) => {
            let isCrrentXEMExists = true
            let spliceIndex = -1
            isCrrentXEMExists = mosaicIdList.every((item, index) => {
                if (item.value == currentXEM1 || item.value == currentXEM2) {
                    spliceIndex = index
                    return false
                }
                return true
            })
            that.mosaicList = mosaicList
            that.formItem.mosaic = currentXEMHex
        })
    }

    initData() {
        this.accountPublicKey = this.getWallet.publicKey
        this.accountAddress = this.getWallet.address
        this.node = this.$store.state.account.node
        this.currentXem = this.$store.state.account.currentXem
        this.generationHash = this.$store.state.account.generationHash
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    checkEnd(key) {
        if (key) {
            this.sendTransaction(key)
        } else {
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
        }
    }


    @Watch('getWallet')
    onGetWalletChange() {
        this.initData()
        this.getMosaicList()
    }

    @Watch('formItem', {immediate: true, deep: true})
    onFormItemChange() {
        const {address, mosaic, amount, fee} = this.formItem
        // isCompleteForm
        this.isCompleteForm = address !== '' && mosaic !== '' && parseInt(amount.toString()) >= 0 && fee  >= 0
    }

    created() {
        this.initForm()
        this.initData()
        this.getMosaicList()
    }

}

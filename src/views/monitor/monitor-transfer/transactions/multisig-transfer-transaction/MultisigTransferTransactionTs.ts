import {Message} from "@/config/index.ts"
import {AccountApiRxjs} from '@/core/api/AccountApiRxjs.ts'
import {MultisigApiRxjs} from '@/core/api/MultisigApiRxjs.ts'
import {Component, Vue, Watch} from 'vue-property-decorator'
import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'
import {
    Account,
    Mosaic,
    MosaicId,
    UInt64,
    TransferTransaction,
    PlainMessage,
    Address,
    Deadline,
    Listener,
} from 'nem2-sdk'
import {createBondedMultisigTransaction, createCompleteMultisigTransaction} from "@/core/utils/wallet.ts"

@Component({
    components: {
        CheckPWDialog,
    }
})
export class MultisigTransferTransactionTs extends Vue {
    node = ''
    currentXem = ''
    isShowPanel = true
    accountAddress = ''
    generationHash = ''
    transactionList = []
    accountPublicKey = ''
    transactionDetail = {}
    currentMinApproval = 0
    isShowSubAlias = false
    showCheckPWDialog = false
    otherDetails: any = {}
    isCompleteForm = false
    currentCosignatoryList = []
    mosaicList = [{
        label: 'no data',
        value: 'no data'
    }]
    multisigPublickeyList: any = [{
        label: 'no data',
        value: 'no data'
    }]
    formItem = {
        address: 'SCSXIT-R36DCY-JRVSNE-NY5BUA-HXSL7I-E6ULEY-UYRC',
        mosaic: '',
        amount: 0,
        remark: '',
        multisigPublickey: '',
        bondedFee: 10000000,
        lockFee: 10000000,
        aggregateFee: 10000000,
    }

    get getWallet() {
        return this.$store.state.account.wallet
    }

    initForm() {
        this.formItem = {
            address: '',
            mosaic: '',
            amount: 0,
            remark: '',
            multisigPublickey: '',
            bondedFee: 10000000,
            lockFee: 10000000,
            aggregateFee: 10000000,
        }
    }

    checkInfo() {
        if (!this.isCompleteForm) return
        if (!this.checkForm()) return
        this.showDialog()

    }

    showDialog() {
        const {address, mosaic, amount, remark, bondedFee, lockFee, aggregateFee, multisigPublickey} = this.formItem
        this.transactionDetail = {
            "transaction_type": 'Multisign_transfer',
            "Public_account": multisigPublickey,
            "transfer_target": address,
            "asset_type": mosaic,
            "quantity": amount,
            "fee": bondedFee + lockFee + aggregateFee + 'gas',
            "remarks": remark
        }
        this.otherDetails = {
            lockFee: lockFee
        }
        this.sendTransaction()
        this.showCheckPWDialog = true
    }

    sendTransaction() {
        if (this.currentMinApproval == 0) {
            return
        }
        const that = this
        const {networkType} = this.$store.state.account.wallet
        const {node} = this.$store.state.account
        let {address, bondedFee, lockFee, aggregateFee, mosaic, amount, remark, multisigPublickey} = this.formItem
        const listener = new Listener(node.replace('http', 'ws'), WebSocket)
        const transaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress(address),
            [new Mosaic(new MosaicId(mosaic), UInt64.fromUint(amount))],
            PlainMessage.create(remark),
            networkType,
            UInt64.fromUint(aggregateFee)
        )

        if (this.currentMinApproval > 1) {
            const aggregateTransaction = createBondedMultisigTransaction(
                [transaction],
                multisigPublickey,
                networkType,
                bondedFee
            )
            this.transactionList = [aggregateTransaction]
            return
        }
        const aggregateTransaction = createCompleteMultisigTransaction(
            [transaction],
            multisigPublickey,
            networkType,
            aggregateFee
        )
        this.transactionList = [aggregateTransaction]
    }

    getMultisigAccountList() {
        const that = this
        if (!this.getWallet) return
        const {address} = this.getWallet
        const {node} = this.$store.state.account

        new MultisigApiRxjs().getMultisigAccountInfo(address, node).subscribe((multisigInfo) => {
            if (multisigInfo.multisigAccounts.length == 0) {
                that.isShowPanel = false
                return
            }
            that.multisigPublickeyList = multisigInfo.multisigAccounts.map((item: any) => {
                item.value = item.publicKey
                item.label = item.publicKey
                return item
            })
        })
    }

    checkForm() {
        const {address, mosaic, amount, remark, bondedFee, lockFee, aggregateFee, multisigPublickey} = this.formItem

        // multisig check
        if (multisigPublickey.length !== 64) {
            this.showErrorMessage(this.$t(Message.ILLEGAL_PUBLICKEY_ERROR))
            return false
        }
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

        if ((!Number(aggregateFee) && Number(aggregateFee) !== 0) || Number(aggregateFee) < 0) {
            this.showErrorMessage(this.$t(Message.FEE_LESS_THAN_0_ERROR))
            return false
        }

        if ((!Number(bondedFee) && Number(bondedFee) !== 0) || Number(bondedFee) < 0) {
            this.showErrorMessage(this.$t(Message.FEE_LESS_THAN_0_ERROR))
            return false
        }
        if ((!Number(lockFee) && Number(lockFee) !== 0) || Number(lockFee) < 0) {
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

    async getMosaicList(accountAddress) {
        const that = this
        const {node, currentXem} = this
        const {currentXEM1, currentXEM2} = this.$store.state.account
        let mosaicIdList = []
        await new AccountApiRxjs().getAccountInfo(accountAddress, node).subscribe((accountInfo) => {
            let mosaicList = []
            // set mosaicList
            mosaicList = accountInfo.mosaics.map((item: any) => {
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
    }

    initData() {
        if (!this.getWallet) return
        this.accountPublicKey = this.getWallet.publicKey
        this.accountAddress = this.getWallet.address
        this.node = this.$store.state.account.node
        this.currentXem = this.$store.state.account.currentXem
        this.generationHash = this.$store.state.account.generationHash
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    checkEnd(isPasswordRight) {
        if (!isPasswordRight) {
            this.$Notice.destroy()
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
        }
    }


    @Watch('getWallet')
    onGetWalletChange() {
        this.initData()
    }

    @Watch('formItem.multisigPublickey')
    async onMultisigPublickeyChange() {
        const that = this
        const {multisigPublickey} = this.formItem
        const {node} = this.$store.state.account
        const {networkType} = this.$store.state.account.wallet
        let address = Address.createFromPublicKey(multisigPublickey, networkType)['address']
        await this.getMosaicList(address)
        new MultisigApiRxjs().getMultisigAccountInfo(address, node).subscribe((multisigInfo) => {
            that.currentMinApproval = multisigInfo.minApproval
            that.currentCosignatoryList = multisigInfo.cosignatories
        })
    }

    @Watch('formItem', {immediate: true, deep: true})
    onFormItemChange() {
        const {address, mosaic, amount, bondedFee, lockFee, aggregateFee, multisigPublickey} = this.formItem
        // isCompleteForm
        this.isCompleteForm = address !== '' && mosaic !== '' && parseInt(amount.toString()) >= 0 && multisigPublickey !== '' &&
            bondedFee > 0 && lockFee > 0 && aggregateFee > 0
    }

    created() {
        this.initData()
        this.getMultisigAccountList()
    }

}

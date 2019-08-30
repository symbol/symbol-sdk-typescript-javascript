import {Message} from "@/config/index.ts"
import {multisigAccountInfo} from "@/core/utils/wallet.ts"
import {MosaicApiRxjs} from '@/core/api/MosaicApiRxjs.ts'
import {formatSeconds, formatAddress} from '@/core/utils/utils.ts'
import {Component, Vue, Watch} from 'vue-property-decorator'
import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'
import {createBondedMultisigTransaction, createCompleteMultisigTransaction} from '@/core/utils/wallet.ts'
import {
    MosaicId,
    MosaicNonce,
    PublicAccount,
    Address,
    Listener,
    MosaicDefinitionTransaction,
    MosaicProperties,
    Deadline,
    UInt64,
    MosaicSupplyChangeTransaction,
    MosaicSupplyType
} from 'nem2-sdk'
import {MultisigApiRxjs} from "@/core/api/MultisigApiRxjs";

@Component({
    components: {
        CheckPWDialog
    }
})
export class MosaicTransactionTs extends Vue {
    node = ''
    duration = 0
    otherDetails: any = {}
    currentXem = ''
    accountAddress = ''
    generationHash = ''
    currentXEM2: string
    currentXEM1: string
    durationIntoDate: any = 0
    accountPublicKey = ''
    currentTab: number = 0
    currentMinApproval = -1
    mosaicMapInfo: any = {}
    transactionDetail = {}
    showCheckPWDialog = false
    isMultisigAccount = false
    transactionList = []
    showMosaicEditDialog = false
    showMosaicAliasDialog = false
    isCompleteForm = true

    multisigPublickeyList = [{
        value: 'no data',
        label: 'no data'
    }]
    typeList = [
        {
            name: 'ordinary_account',
            isSelected: true
        }, {
            name: 'multi_sign_account',
            isSelected: false
        }
    ]
    formItem: any = {
        supply: 500000000,
        divisibility: 6,
        transferable: true,
        supplyMutable: true,
        permanent: false,
        duration: 1000,
        innerFee: 50000,
        aggregateFee: 50000,
        lockFee: 50000,
        multisigPublickey: ''
    }

    get getWallet() {
        return this.$store.state.account.wallet
    }

    initForm() {
        this.formItem = {
            supply: 500000000,
            divisibility: 6,
            transferable: true,
            supplyMutable: true,
            permanent: false,
            duration: 1000,
            innerFee: 50000,
            aggregateFee: 50000,
            lockFee: 50000,
            multisigPublickey: ''
        }
    }

    formatAddress(address) {
        return formatAddress(address)
    }

    addSeverabilityAmount() {
        this.formItem.divisibility = Number(this.formItem.divisibility) + 1
    }

    cutSeverabilityAmount() {
        this.formItem.divisibility = this.formItem.divisibility >= 1 ? Number(this.formItem.divisibility - 1) : Number(this.formItem.divisibility)
    }

    addSupplyAmount() {
        this.formItem.supply = Number(this.formItem.supply + 1)
    }

    cutSupplyAmount() {
        this.formItem.supply = this.formItem.supply >= 2 ? Number(this.formItem.supply - 1) : Number(this.formItem.supply)
    }

    switchType(index) {
        this.initForm()
        let list = this.typeList
        list = list.map((item) => {
            item.isSelected = false
            return item
        })
        list[index].isSelected = true
        this.typeList = list
    }

    showCheckDialog() {
        const {supply, divisibility, transferable, supplyMutable, duration, lockFee, innerFee} = this.formItem
        const address = this.getWallet.address
        this.transactionDetail = {
            "address": address,
            "supply": supply,
            "severability": divisibility,
            "duration": duration,
            "fee": innerFee,
            'transmittable': transferable,
            'variable_upply': supplyMutable
        }
        this.otherDetails = {
            lockFee: lockFee
        }
        if (this.isMultisigAccount) {
            this.createByMultisig()
            this.showCheckPWDialog = true
            return
        }
        this.createBySelf()
        this.showCheckPWDialog = true
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    showAliasDialog() {
        document.body.click()
        setTimeout(() => {
            this.showMosaicAliasDialog = true
        })
    }

    closeMosaicAliasDialog() {
        this.showMosaicAliasDialog = false
    }

    showEditDialog() {
        this.showMosaicEditDialog = true
    }

    closeMosaicEditDialog() {
        this.showMosaicEditDialog = false
    }

    checkEnd(isPasswordRight) {
        if (!isPasswordRight) {
            this.$Notice.destroy()
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
        }
    }

    createBySelf() {
        let {accountPublicKey} = this
        const {networkType} = this.getWallet
        const {supply, divisibility, transferable, supplyMutable, duration, innerFee} = this.formItem
        const that = this
        const nonce = MosaicNonce.createRandom()
        const publicAccount = PublicAccount.createFromPublicKey(this.$store.state.account.wallet.publicKey, networkType)
        const mosaicId = MosaicId.createFromNonce(nonce, PublicAccount.createFromPublicKey(accountPublicKey, this.getWallet.networkType))
        this.transactionList = [
            new MosaicApiRxjs().createMosaic(
                nonce,
                mosaicId,
                supplyMutable,
                transferable,
                Number(divisibility),
                this.formItem.permanent ? undefined : Number(duration),
                networkType,
                supply,
                publicAccount,
                Number(innerFee))
        ]
        that.initForm()
    }


    createByMultisig() {
        const {networkType} = this.$store.state.account.wallet
        const {generationHash, node} = this.$store.state.account
        const mosaicHex = this.$store.state.account.currentXEM1
        const listener = new Listener(node.replace('http', 'ws'), WebSocket)
        const {supply, divisibility, transferable, supplyMutable, duration, innerFee, aggregateFee, lockFee, multisigPublickey} = this.formItem
        const that = this
        const nonce = MosaicNonce.createRandom()
        const mosaicId = MosaicId.createFromNonce(nonce, PublicAccount.createFromPublicKey(multisigPublickey, this.getWallet.networkType))
        const mosaicDefinitionTx = MosaicDefinitionTransaction.create(
            Deadline.create(),
            nonce,
            mosaicId,
            MosaicProperties.create({
                supplyMutable: supplyMutable,
                transferable: transferable,
                divisibility: divisibility,
                duration: duration ? UInt64.fromUint(duration) : undefined
            }),
            networkType,
            innerFee ? UInt64.fromUint(innerFee) : undefined
        )

        const mosaicSupplyChangeTx = MosaicSupplyChangeTransaction.create(
            Deadline.create(),
            mosaicDefinitionTx.mosaicId,
            MosaicSupplyType.Increase,
            UInt64.fromUint(supply),
            networkType
        )

        if (that.currentMinApproval > 1) {
            const aggregateTransaction = createBondedMultisigTransaction(
                [mosaicDefinitionTx, mosaicSupplyChangeTx],
                multisigPublickey,
                networkType,
                aggregateFee
            )
            this.transactionList = [aggregateTransaction]
            return
        }
        const aggregateTransaction = createCompleteMultisigTransaction(
            [mosaicDefinitionTx, mosaicSupplyChangeTx],
            multisigPublickey,
            networkType,
            aggregateFee,
        )
        this.transactionList = [aggregateTransaction]
    }

    checkForm() {
        const {supply, divisibility, duration, innerFee, aggregateFee, lockFee, multisigPublickey} = this.formItem
        // multisigApi check
        if (this.isMultisigAccount) {
            if (!multisigPublickey) {
                this.$Notice.error({
                    title: this.$t(Message.INPUT_EMPTY_ERROR) + ''
                })
                return false
            }

            if (!Number(aggregateFee) || aggregateFee < 0) {
                this.$Notice.error({
                    title: this.$t(Message.FEE_LESS_THAN_0_ERROR) + ''
                })
                return false
            }

            if (!Number(lockFee) || lockFee < 0) {
                this.$Notice.error({
                    title: this.$t(Message.FEE_LESS_THAN_0_ERROR) + ''
                })
                return false
            }
        }
        // common check
        if (!Number(supply) || supply < 0) {
            this.$Notice.error({
                title: this.$t(Message.SUPPLY_LESS_THAN_0_ERROR) + ''
            })
            return false
        }
        if (!Number(divisibility) || divisibility < 0) {
            this.$Notice.error({
                title: this.$t(Message.DIVISIBILITY_LESS_THAN_0_ERROR) + ''
            })
            return false
        }
        if (!Number(duration) || duration <= 0) {
            this.$Notice.error({
                title: this.$t(Message.DURATION_LESS_THAN_0_ERROR) + ''
            })
            return false
        }
        if (!Number(innerFee) || innerFee < 0) {
            this.$Notice.error({
                title: this.$t(Message.FEE_LESS_THAN_0_ERROR) + ''
            })
            return false
        }
        return true
    }


    createMosaic(isMultisigAccount) {
        if (!this.isCompleteForm) return
        this.isMultisigAccount = isMultisigAccount
        if (!this.checkForm()) return
        this.showCheckDialog()
    }


    getMultisigAccountList() {
        const that = this
        if (!this.$store.state.account.wallet) return
        const {address} = this.$store.state.account.wallet
        const {node} = this.$store.state.account
        new MultisigApiRxjs().getMultisigAccountInfo(address, node).subscribe((multisigInfo) => {
            that.multisigPublickeyList = multisigInfo.multisigAccounts.map((item: any) => {
                item.value = item.publicKey
                item.label = item.publicKey
                return item
            })
        })
    }

    @Watch('formItem.multisigPublickey')
    async onMultisigPublickeyChange() {
        const that = this
        const {multisigPublickey} = this.formItem
        if (multisigPublickey.length !== 64) {
            return
        }
        if (multisigPublickey.length !== 64) {
            return
        }
        const {node} = this.$store.state.account
        const {networkType} = this.$store.state.account.wallet
        let address = Address.createFromPublicKey(multisigPublickey, networkType)['address']
        const multisigInfo = multisigAccountInfo(address, node)
        that.currentMinApproval = multisigInfo['minApproval']

    }

    // @Watch('formItem', {immediate: true, deep: true})
    // onFormItemChange() {
    //     const {supply, divisibility, duration, innerFee, aggregateFee, lockFee, multisigPublickey} = this.formItem
    //     // isCompleteForm
    //     if (this.typeList[0].isSelected) {
    //         this.isCompleteForm = supply !== '' && divisibility !== '' && duration !== '' && innerFee !== ''
    //         return
    //     }
    //     this.isCompleteForm = supply !== '' && divisibility !== '' && duration !== '' && innerFee !== '' && aggregateFee !== '' && lockFee !== '' && multisigPublickey && multisigPublickey.length === 64
    // }

    initData() {
        if (!this.getWallet) return
        this.accountPublicKey = this.getWallet.publicKey
        this.accountAddress = this.getWallet.address
        this.node = this.$store.state.account.node
        this.generationHash = this.$store.state.account.generationHash
        this.currentXEM2 = this.$store.state.account.currentXEM2
        this.currentXEM1 = this.$store.state.account.currentXEM1
        this.currentXem = this.$store.state.account.currentXem
        this.durationChange()
    }

    durationChange() {
        const duration = Number(this.formItem.duration)
        if (Number.isNaN(duration)) {
            this.formItem.duration = 0
            this.durationIntoDate = 0
            return
        }
        if (duration * 12 >= 60 * 60 * 24 * 3650) {
            this.$Notice.error({
                title: this.$t(Message.DURATION_MORE_THAN_10_YEARS_ERROR) + ''
            })
            this.formItem.duration = 0
        }
        this.durationIntoDate = formatSeconds(duration * 12)
    }

    created() {
        this.initData()
        this.getMultisigAccountList()
    }
}

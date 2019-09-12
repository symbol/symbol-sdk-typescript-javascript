import {Message, mosaicTransactionTypeList, formData} from "@/config/index.ts"
import {multisigAccountInfo} from "@/core/utils/wallet.ts"
import {MosaicApiRxjs} from '@/core/api/MosaicApiRxjs.ts'
import {formatSeconds, formatAddress} from '@/core/utils/utils.ts'
import {Component, Vue, Watch} from 'vue-property-decorator'
import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'
import {createBondedMultisigTransaction, createCompleteMultisigTransaction} from '@/core/utils/wallet.ts'
import {MultisigApiRxjs} from "@/core/api/MultisigApiRxjs"
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
import {mapState} from "vuex"
import {getAbsoluteMosaicAmount} from "@/core/utils/utils"

@Component({
    components: {
        CheckPWDialog
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
        })
    }
})
export class MosaicTransactionTs extends Vue {
    activeAccount: any
    duration = 0
    otherDetails: any = {}
    durationIntoDate: any = 0
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
    multisigPublickeyList = []
    typeList = mosaicTransactionTypeList
    formItem: any = formData.mosaicTransactionForm

    get wallet() {
        return this.activeAccount.wallet
    }

    get networkType() {
        return this.activeAccount.wallet.networkType
    }

    get accountPublicKey() {
        return this.activeAccount.wallet.publicKey
    }

    get generationHash() {
        return this.activeAccount.generationHash
    }

    get currentXEM1() {
        return this.activeAccount.currentXEM1
    }

    get currentXEM2() {
        return this.activeAccount.currentXEM2
    }

    get currentXem() {
        return this.activeAccount.currentXem
    }

    get address() {
        return this.activeAccount.wallet.address
    }

    get xemDivisibility() {
        return this.activeAccount.xemDivisibility
    }

    get node() {
        return this.activeAccount.node
    }

    initForm() {
        this.formItem = {
            supply: 500000000,
            divisibility: 0,
            transferable: true,
            supplyMutable: true,
            permanent: false,
            restrictable: false,
            duration: 1000,
            innerFee: 0.5,
            aggregateFee: 0.5,
            lockFee: 10,
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
        const {supply, divisibility, transferable, permanent, supplyMutable, restrictable, duration, lockFee, innerFee} = this.formItem
        const {address} = this.wallet
        this.transactionDetail = {
            "address": address,
            "supply": supply,
            "severability": divisibility,
            "duration": duration,
            "fee": innerFee,
            'transmittable': transferable,
            'variable_upply': supplyMutable,
            "duration_permanent": permanent,
            "restrictable": restrictable
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
        let {accountPublicKey, networkType, xemDivisibility} = this
        let {supply, divisibility, transferable, supplyMutable, duration, innerFee, restrictable} = this.formItem
        const that = this
        const nonce = MosaicNonce.createRandom()
        const publicAccount = PublicAccount.createFromPublicKey(accountPublicKey, networkType)
        const mosaicId = MosaicId.createFromNonce(nonce, PublicAccount.createFromPublicKey(accountPublicKey, this.wallet.networkType))
        innerFee = getAbsoluteMosaicAmount(innerFee, xemDivisibility)
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
                restrictable,
                Number(innerFee))
        ]
        that.initForm()
    }


    createByMultisig() {
        const {node, networkType, xemDivisibility} = this
        let {supply, divisibility, transferable, supplyMutable, duration, innerFee, aggregateFee, multisigPublickey} = this.formItem
        innerFee = getAbsoluteMosaicAmount(innerFee, xemDivisibility)
        aggregateFee = getAbsoluteMosaicAmount(aggregateFee, xemDivisibility)
        const that = this
        const nonce = MosaicNonce.createRandom()
        const mosaicId = MosaicId.createFromNonce(nonce, PublicAccount.createFromPublicKey(multisigPublickey, this.wallet.networkType))
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
        if ((!Number(divisibility) && Number(divisibility) !== 0) || divisibility < 0) {
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
        if (!this.wallet) return
        const {address, node} = this
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
        const {node, networkType} = this
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

    mounted() {
        this.initData()
        // @TODO multisig account list at higher level
        this.getMultisigAccountList()
    }
}

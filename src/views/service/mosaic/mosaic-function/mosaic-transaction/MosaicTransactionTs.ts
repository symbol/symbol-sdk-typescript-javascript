import {Message} from "@/config"
import {multisigAccountInfo} from "@/core/utils/wallet"
import {mosaicApi} from '@/core/api/mosaicApi'
import {multisigApi} from '@/core/api/multisigApi'
import {formatSeconds, formatAddress} from '@/core/utils/utils'
import {Component, Vue, Watch} from 'vue-property-decorator'
import {transactionApi} from '@/core/api/transactionApi'
import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'
import {createBondedMultisigTransaction, createCompleteMultisigTransaction} from '@/core/utils/wallet'
import {
    MosaicId,
    MosaicNonce,
    PublicAccount,
    NetworkType,
    Account,
    Address,
    Listener,
    MosaicDefinitionTransaction,
    MosaicProperties,
    Deadline,
    UInt64,
    MosaicSupplyChangeTransaction,
    MosaicSupplyType
} from 'nem2-sdk'

@Component({
    components: {
        CheckPWDialog
    }
})
export class MosaicTransactionTs extends Vue {

    node = ''
    duration = 0
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
    showMosaicEditDialog = false
    showMosaicAliasDialog = false
    isCompleteForm = false

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

    createTransaction() {
        this.showCheckPWDialog = true
    }

    showCheckDialog() {
        const {supply, divisibility, transferable, supplyMutable, duration, innerFee} = this.formItem
        const address = this.getWallet.address
        // TODO mosaic transaction detail
        this.transactionDetail = {
            "address": address,
            "supply": supply,
            "severability": divisibility,
            "duration": duration,
            "fee": innerFee,
            'transmittable': transferable,
            'variable_upply': supplyMutable
        }
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
        document.body.click()
        setTimeout(() => {
            this.showMosaicEditDialog = true
        }, 0)
    }

    closeMosaicEditDialog() {
        this.showMosaicEditDialog = false
    }

    checkEnd(key) {
        if (!key) {
            this.$Notice.destroy()
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
            return
        }
        if (this.isMultisigAccount) {
            this.createByMultisig(key)
        } else {
            this.createBySelf(key)
        }
    }

    createBySelf(key) {
        let {accountPublicKey, node, generationHash} = this
        const {supply, divisibility, transferable, supplyMutable, duration, innerFee} = this.formItem
        const account = Account.createFromPrivateKey(key, this.getWallet.networkType)
        const that = this
        const nonce = MosaicNonce.createRandom()
        const mosaicId = MosaicId.createFromNonce(nonce, PublicAccount.createFromPublicKey(accountPublicKey, this.getWallet.networkType))
        mosaicApi.createMosaic({
            mosaicNonce: nonce,
            supply: supply,
            mosaicId: mosaicId,
            supplyMutable: supplyMutable,
            transferable: transferable,
            divisibility: Number(divisibility),
            duration: this.formItem.permanent ? undefined : Number(duration),
            netWorkType: this.getWallet.networkType,
            maxFee: Number(innerFee),
            publicAccount: account.publicAccount
        }).then((result: any) => {
            const mosaicDefinitionTransaction = result.result.mosaicDefinitionTransaction
            const signature = account.sign(mosaicDefinitionTransaction, generationHash)
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
        }).catch((e) => {
            console.log(e)
        })
    }


    createByMultisig(key) {
        const {networkType} = this.$store.state.account.wallet
        const {generationHash, node} = this.$store.state.account
        const listener = new Listener(node.replace('http', 'ws'), WebSocket)
        const {supply, divisibility, transferable, supplyMutable, duration, innerFee, aggregateFee, lockFee, multisigPublickey} = this.formItem
        const account = Account.createFromPrivateKey(key, this.getWallet.networkType)
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
            createBondedMultisigTransaction(
                [mosaicDefinitionTx, mosaicSupplyChangeTx],
                multisigPublickey,
                networkType,
                account,
                aggregateFee
            ).then((aggregateTransaction) => {
                transactionApi.announceBondedWithLock({
                    aggregateTransaction,
                    account,
                    listener,
                    node,
                    generationHash,
                    networkType,
                    fee: lockFee
                })
            })
            return
        }
        createCompleteMultisigTransaction(
            [mosaicDefinitionTx, mosaicSupplyChangeTx],
            multisigPublickey,
            networkType,
            aggregateFee,
        ).then((aggregateTransaction) => {
            transactionApi._announce({
                transaction: aggregateTransaction,
                account,
                node,
                generationHash
            })
        })
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
        const {address} = this.$store.state.account.wallet
        const {node} = this.$store.state.account
        const multisigInfo = multisigAccountInfo(address, node)
        const multisigPublickeyList = multisigInfo['multisigAccounts'] ? multisigInfo['multisigAccounts'].map((item) => {
            item.value = item.publicKey
            item.label = item.publicKey
            return item
        }) : [{label: 'no data', value: 'no data'}]
        that.multisigPublickeyList = multisigPublickeyList
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

    @Watch('formItem', {immediate: true, deep: true})
    onFormItemChange() {
        const {supply, divisibility, duration, innerFee, aggregateFee, lockFee, multisigPublickey} = this.formItem
        // isCompleteForm
        if (this.typeList[0].isSelected) {
            this.isCompleteForm = supply !== '' && divisibility !== '' && duration !== '' && innerFee !== ''
            return
        }
        this.isCompleteForm = supply !== '' && divisibility !== '' && duration !== '' && innerFee !== '' && aggregateFee !== '' && lockFee !== '' && multisigPublickey && multisigPublickey.length === 64
    }

    initData() {
        this.accountPublicKey = this.getWallet.publicKey
        this.accountAddress = this.getWallet.address
        this.node = this.$store.state.account.node
        this.generationHash = this.$store.state.account.generationHash
        this.$store.state.app.isInLoginPage = false
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

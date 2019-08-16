import {Message} from "@/config"
import {walletApi} from "@/core/api/walletApi"
import {mosaicApi} from "@/core/api/mosaicApi"
import {transactionApi} from "@/core/api/transactionApi"
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {Account, Crypto} from 'nem2-sdk'
import {decryptKey} from "@/core/utils/wallet";

@Component
export class MosaicEditDialogTs extends Vue {
    show = false
    isCompleteForm = false
    changedSupply = 0
    totalSupply = 9000000000
    mosaic = {
        id: '',
        aliasName: '',
        delta: 0,
        supplyType: 1,
        changeDelta: 0,
        duration: '',
        fee: 50000,
        password: ''
    }

    @Prop()
    showMosaicEditDialog: boolean

    @Prop()
    itemMosaic: any

    get selectedMosaic() {
        return this.itemMosaic
    }

    get supply() {
        return this.mosaic['supply']
    }

    get getWallet() {
        return this.$store.state.account.wallet
    }

    get generationHash() {
        return this.$store.state.account.generationHash
    }

    get node() {
        return this.$store.state.account.node
    }

    mosaicEditDialogCancel() {
        this.initForm()
        this.$emit('closeMosaicEditDialog')
    }

    changeSupply() {
        this.mosaic.changeDelta = Math.abs(this.mosaic.changeDelta)
        let supply = 0
        if (this.mosaic.supplyType === 1) {
            supply = Number(this.mosaic.changeDelta) + Number(this.supply)
            if (supply > this.totalSupply * Math.pow(10, this.mosaic['_divisibility'])) {
                supply = this.totalSupply * Math.pow(10, this.mosaic['_divisibility'])
                this.mosaic.changeDelta = supply - this.supply
            }
        } else {
            supply = this.supply - this.mosaic.changeDelta
            if (supply <= 0) {
                supply = 0
                this.mosaic.changeDelta = this.supply
            }
        }

        this.changedSupply = supply
    }

    checkInfo() {
        const {mosaic} = this

        if (mosaic.fee === 0) {
            this.$Notice.error({
                title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
            })
            return false
        }
        if (mosaic.changeDelta === 0) {
            this.$Notice.error({
                title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
            })
            return false
        }
        if (mosaic.password === '') {
            this.$Notice.error({
                title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
            })
            return false
        }
        return true
    }

    checkMosaicForm() {
        if (!this.isCompleteForm) return
        if (!this.checkInfo()) return
        this.decryptKey()
    }

    decryptKey() {
        this.checkPrivateKey(decryptKey( this.getWallet, this.mosaic.password))
    }

    checkPrivateKey(DeTxt) {
        const that = this
        walletApi.getWallet({
            name: this.getWallet.name,
            networkType: this.getWallet.networkType,
            privateKey: DeTxt.length === 64 ? DeTxt : ''
        }).then(async (Wallet: any) => {
            this.updateMosaic(DeTxt)
        }).catch(() => {
            that.$Notice.error({
                title: this.$t('password_error') + ''
            })
        })
    }

    updateMosaic(key) {
        const that = this
        mosaicApi.mosaicSupplyChange({
            mosaicId: this.mosaic['mosaicId'],
            delta: this.mosaic.changeDelta,
            netWorkType: this.getWallet.networkType,
            MosaicSupplyType: this.mosaic.supplyType,
            maxFee: this.mosaic.fee,
        }).then((changed) => {
            const transaction = changed.result.mosaicSupplyChangeTransaction
            const account = Account.createFromPrivateKey(key, this.getWallet.networkType)
            const signature = account.sign(transaction, this.generationHash)

            transactionApi.announce({signature, node: that.node}).then((announceResult) => {
                // get announce status
                announceResult.result.announceStatus.subscribe((announceInfo: any) => {
                    console.log(signature)
                    that.updatedMosaic()
                })
            })
        })
    }

    updatedMosaic() {
        this.show = false
        this.mosaicEditDialogCancel()
        this.$Notice.success({
            title: this['$t']('mosaic_operation') + '',
            desc: this['$t']('update_completed') + ''
        });
    }

    initForm() {
        this.mosaic = {
            id: '',
            aliasName: '',
            delta: 0,
            supplyType: 1,
            changeDelta: 0,
            duration: '',
            fee: 50000,
            password: ''
        }
    }

    @Watch('showMosaicEditDialog')
    onShowMosaicEditDialogChange() {
        this.show = this.showMosaicEditDialog
        Object.assign(this.mosaic, this.selectedMosaic)
    }

    @Watch('selectedMosaic')
    onSelectMosaicChange() {
        Object.assign(this.mosaic, this.selectedMosaic)
    }

    @Watch('mosaic', {immediate: true, deep: true})
    onFormItemChange() {
        const {delta, fee, password} = this.mosaic
        // isCompleteForm
        console.log(delta, fee, password)
        this.isCompleteForm = parseInt(delta.toString()) >= 0 && fee > 0 && password !== ''
    }
}

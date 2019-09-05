import {Password} from 'nem2-sdk'
import {Message, formData, xemTotalSupply} from "@/config/index.ts"
import {MosaicApiRxjs} from "@/core/api/MosaicApiRxjs.ts"
import {AppWallet} from "@/core/utils/wallet.ts"
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {mapState} from "vuex"
import {getAbsoluteMosaicAmount} from "@/core/utils/utils"

@Component({
    computed: {
        ...mapState({activeAccount: 'account'})
    }

})
export class MosaicEditDialogTs extends Vue {
    show = false
    activeAccount: any
    isCompleteForm = false
    changedSupply = 0
    totalSupply = xemTotalSupply
    mosaic: any = formData.mosaicEditForm

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

    get wallet() {
        return this.activeAccount.wallet
    }

    get generationHash() {
        return this.activeAccount.generationHash
    }

    get node() {
        return this.activeAccount.node
    }

    get xemDivisibility() {
        return this.activeAccount.xemDivisibility
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

        if (mosaic.password.length < 8) {
            this.$Notice.error({
                title: '' + Message.WRONG_PASSWORD_ERROR
            })
            return false
        }

        const validPassword = new AppWallet(this.wallet).checkPassword(new Password(mosaic.password))

        if (!validPassword) {
            this.$Notice.error({
                title: '' + Message.WRONG_PASSWORD_ERROR
            })
            return false
        }
        return true
    }

    submit() {
        if (!this.isCompleteForm) return
        if (!this.checkInfo()) return
        this.updateMosaic()
    }

    updateMosaic() {
        const {node, generationHash, xemDivisibility} = this
        const password = new Password(this.mosaic.password)
        let {mosaicId, changeDelta, supplyType, networkType, fee} = this.mosaic
        fee = getAbsoluteMosaicAmount(fee, xemDivisibility)
        const transaction = new MosaicApiRxjs().mosaicSupplyChange(
            mosaicId,
            changeDelta,
            supplyType,
            networkType,
            fee
        )
        new AppWallet(this.wallet)
            .signAndAnnounceNormal(password, node, generationHash, [transaction], this)
    }

    updatedMosaic() {
        this.show = false
        this.mosaicEditDialogCancel()
        this.$Notice.success({
            title: this.$t('mosaic_operation') + '',
            desc: this.$t('update_completed') + ''
        })
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
        this.isCompleteForm = parseInt(delta.toString()) >= 0 && fee > 0 && password !== ''
    }
}

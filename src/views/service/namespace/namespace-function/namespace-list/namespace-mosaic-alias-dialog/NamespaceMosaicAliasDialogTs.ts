import {mapState} from "vuex"
import {AliasActionType, NamespaceId, MosaicId, Password} from "nem2-sdk"
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {Message} from "@/config/index.ts"
import {NamespaceApiRxjs} from "@/core/api/NamespaceApiRxjs.ts"
import {getAbsoluteMosaicAmount} from '@/core/utils'
import {AppMosaics} from '@/core/services/mosaics'
import {MosaicNamespaceStatusType} from "@/core/model/MosaicNamespaceStatusType";
import {formDataConfig} from "@/config/view/form";
import {AppWallet} from "@/core/model"

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app',
        })
    }
})
export class NamespaceMosaicAliasDialogTs extends Vue {
    activeAccount: any
    app: any
    show = false
    isCompleteForm = false
    formItem: any = formDataConfig.mosaicAliasForm

    @Prop()
    showMosaicAliasDialog: boolean
    @Prop()
    itemMosaic: any

    get wallet() {
        return this.activeAccount.wallet
    }

    get generationHash() {
        return this.activeAccount.generationHash
    }

    get node() {
        return this.activeAccount.node
    }

    get namespaceList() {
        return this.activeAccount.namespaces
    }

    get xemDivisibility() {
        return this.activeAccount.xemDivisibility
    }

    get mosaics() {
        return this.activeAccount.mosaics
    }

    get currentHeight() {
        return this.app.chainStatus.currentHeight
    }

    get accountName(){
        return this.activeAccount.accountName
    }
    get unlinkMosaicList() {
        const {currentHeight} = this
        const {address} = this.wallet
        const availableToBeLinked = AppMosaics()
            .getAvailableToBeLinked(currentHeight, address, this.$store)
        if (!availableToBeLinked.length) return []
        return availableToBeLinked
            .filter((item) => currentHeight < item.expirationHeight || item.expirationHeight == MosaicNamespaceStatusType.FOREVER)
            .map((item:any) => {
                item.value = item.hex
                item.label = item.hex
                return item
            })
    }

    mosaicAliasDialogCancel() {
        this.initForm()
        this.$emit('closeMosaicAliasDialog')
    }

    submit() {
        if (!this.isCompleteForm) return
        if (!this.checkInfo()) return
        this.updateMosaic()
    }

    checkInfo() {
        const {formItem} = this

        if (formItem.fee === 0) {
            this.$Notice.error({
                title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
            })
            return false
        }
        if (formItem.mosaicHex === '') {
            this.$Notice.error({
                title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
            })
            return false
        }
        if (formItem.password === '') {
            this.$Notice.error({
                title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
            })
            return false
        }

        if (formItem.password.length < 8) {
            this.$Notice.error({
                title: '' + this.$t('password_error')
            })
            return false
        }

        const validPassword = new AppWallet(this.wallet).checkPassword(new Password(formItem.password))

        if (!validPassword) {
            this.$Notice.error({
                title: '' + this.$t('password_error')
            })
            return false
        }
        return true
    }

    async updateMosaic() {
        const {node, generationHash, xemDivisibility} = this
        const {networkType} = this.wallet
        let {fee, name, mosaicHex} = this.formItem
        fee = getAbsoluteMosaicAmount(fee, xemDivisibility)
        const password = new Password(this.formItem.password)
        let transaction = new NamespaceApiRxjs().mosaicAliasTransaction(
            AliasActionType.Link,
            new NamespaceId(name),
            new MosaicId(mosaicHex),
            networkType,
            fee
        )
        this.initForm()
        new AppWallet(this.wallet)
            .signAndAnnounceNormal(password, node, generationHash, [transaction], this)
        this.updatedMosaicAlias()
    }

    updatedMosaicAlias() {
        this.show = false
        this.mosaicAliasDialogCancel()
    }

    initForm() {
        this.formItem = {
            mosaicHex: '',
            fee: .5,
            password: ''
        }
    }

    @Watch('showMosaicAliasDialog')
    onShowMosaicAliasDialogChange() {
        this.show = this.showMosaicAliasDialog
        Object.assign(this.formItem, this.itemMosaic)
    }

    @Watch('formItem', {immediate: true, deep: true})
    onFormItemChange() {
        const {mosaicHex, fee, password} = this.formItem
        // isCompleteForm
        this.isCompleteForm = mosaicHex !== '' && fee > 0 && password !== ''
    }
}

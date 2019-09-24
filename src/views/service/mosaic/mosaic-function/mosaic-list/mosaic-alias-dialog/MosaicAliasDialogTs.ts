import {AliasActionType, NamespaceId, MosaicId, Password} from "nem2-sdk"
import {mapState} from "vuex"
import {Message,networkConfig} from "@/config/index.ts"
import {NamespaceApiRxjs} from "@/core/api/NamespaceApiRxjs.ts"
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {EmptyAlias} from "nem2-sdk/dist/src/model/namespace/EmptyAlias"
import {getAbsoluteMosaicAmount} from '@/core/utils'
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
export class MosaicAliasDialogTs extends Vue {
    activeAccount: any
    app: any
    show = false
    isCompleteForm = false
    mosaic: any = formDataConfig.mosaicAliasForm
    namespaceGracePeriodDuration = networkConfig.namespaceGracePeriodDuration

    @Prop()
    showMosaicAliasDialog: boolean
    @Prop()
    itemMosaic: any

    get getWallet() {
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

    get currentHeight() {
        return this.app.chainStatus.currentHeight
    }

    get aliasNameList() {
        const {currentHeight, namespaceGracePeriodDuration} = this
        // @TODO handle namespace list loading state
        return this.namespaceList
            .filter(({alias,endHeight}) => alias instanceof EmptyAlias && endHeight - currentHeight > namespaceGracePeriodDuration)
            .map(alias => ({label: alias.label, value: alias.label}))
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
        const {mosaic} = this

        if (mosaic.fee === 0) {
            this.$Notice.error({
                title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
            })
            return false
        }
        if (mosaic.aliasName === '') {
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
                title: '' + this.$t('password_error')
            })
            return false
        }

        const validPassword = new AppWallet(this.getWallet).checkPassword(new Password(mosaic.password))

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
        const {networkType} = this.getWallet
        let {fee, hex, aliasName} = this.mosaic
        fee = getAbsoluteMosaicAmount(fee, xemDivisibility)
        const password = new Password(this.mosaic.password)
        let transaction = new NamespaceApiRxjs().mosaicAliasTransaction(
            AliasActionType.Link,
            new NamespaceId(aliasName),
            new MosaicId(hex),
            networkType,
            fee
        )
        new AppWallet(this.getWallet)
            .signAndAnnounceNormal(password, node, generationHash, [transaction], this)
        this.initForm()
        this.updatedMosaicAlias()
    }

    updatedMosaicAlias() {
        this.show = false
        this.mosaicAliasDialogCancel()
    }

    initForm() {
        this.mosaic = {
            aliasName: '',
            fee: .5,
            password: ''
        }
    }

    // @TODO: use v-model
    @Watch('showMosaicAliasDialog')
    onShowMosaicAliasDialogChange() {
        this.show = this.showMosaicAliasDialog
        Object.assign(this.mosaic, this.itemMosaic)
    }

    // @TODO: use v-model
    @Watch('mosaic', {immediate: true, deep: true})
    onFormItemChange() {
        const {aliasName, fee, password} = this.mosaic
        // isCompleteForm
        this.isCompleteForm = aliasName !== '' && fee > 0 && password !== ''
    }
}


import {Message} from "@/config"
import {copyTxt} from '@/core/utils/utils'
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'

@Component
export class KeystoreDialogTs extends Vue {
    stepIndex = 0
    show = false
    QRCode = ''
    wallet = {
        password: '',
        keystore: ''
    }

    @Prop()
    showKeystoreDialog: boolean

    keystoreDialogCancel() {
        this.$emit('closeKeystoreDialog')
        setTimeout(() => {
            this.stepIndex = 0
        }, 300)
    }

    exportKeystore() {
        // TODO
        return
        switch (this.stepIndex) {
            case 0 :
                this.stepIndex = 1
                break;
            case 1 :
                this.stepIndex = 2
                break;
            case 2 :
                this.stepIndex = 3
                break;
        }
    }

    toPrevPage() {
        this.stepIndex = 2
    }

    copyKeystore() {
        copyTxt(this.wallet.keystore).then((data) => {
            this.$Notice.success({
                title: this.$t(Message.COPY_SUCCESS) + ''
            });
        })
    }

    saveQRCode() {

    }

    @Watch('showKeystoreDialog')
    onShowKeystoreDialogChange() {
        this.show = this.showKeystoreDialog
    }

    created() {
    }
}

import {Component, Vue} from 'vue-property-decorator'
import {Message} from "@/config"
import {UInt64} from 'nem2-sdk'
import {localRead} from '@/core/utils/utils'
import {decryptKey} from "@/core/utils/wallet";

@Component
export class InputLockTs extends Vue {
    lockPromptText: string = ''
    isShowPrompt: boolean = false
    currentText: string = ''
    isShowClearCache: boolean = false
    form: { password: '' } = {password: ''}


    showPrompt() {
        this.isShowPrompt = true
    }

    showIndexView() {
        this.$emit('showIndexView', 1)
    }

    checkInput() {
        const {form} = this
        if (form.password == '') {
            this.$Notice.error({title: this.$t(Message.INPUT_EMPTY_ERROR) + ''});
            return false
        }
        return true
    }

    checkLock() {
        if (!this.checkInput()) {
            return
        }

        let lock: any = localRead('lock')
        try {
            const u = [50, 50]
            lock = JSON.parse(lock)
            const enTxt = decryptKey(lock, this.form.password)
            if (enTxt !== new UInt64(u).toHex()) {
                this.$Notice.error({title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''});
                return false
            }
            return true
        } catch (e) {
            this.$Notice.error({title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''});
            return false
        }
    }


    jumpToDashBoard() {
        if (!this.checkLock()) return
        if (this.$store.state.app.walletList.length == 0) {
            this.$router.push({
                name: 'walletCreate',
                params: {
                    name: 'walletCreate'
                }
            })
            return
        }
        this.$store.state.app.isInLoginPage = false
        this.$router.push({
            name: 'monitorPanel'
        })

    }

    clearCache() {
        // localRead remove
        // localRemove('lock')
        // localRemove('wallets')
        // localRemove('loglevel:webpack-dev-server')
    }

    created() {
        this.$store.state.app.isInLoginPage = true
        this.lockPromptText = JSON.parse(localRead('lock')).remindTxt

    }
}

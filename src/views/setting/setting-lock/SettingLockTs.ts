import {UInt64} from 'nem2-sdk'
import {Message} from "@/config"
import {localRead, localSave} from '@/core/utils/utils'
import {Component, Vue} from 'vue-property-decorator'
import {decryptKey, encryptKey} from "@/core/utils/wallet"

@Component
export class SettingLockTs extends Vue {
    prePassword = ''
    newPassword = ''
    repeatPassword = ''
    lockKey = [50, 50]
    btnState = false

    get getWallet() {
        return this.$store.state.account.wallet
    }

    changeBtnState() {
        if (this.prePassword == '') {
            this.btnState = false
        } else {
            this.btnState = true
        }
    }

    checkInfo() {
        const {prePassword, newPassword, repeatPassword} = this

        if (prePassword == '') {
            this.$Notice.error({
                title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
            })
            return false
        }
        if (newPassword == '') {
            this.$Notice.error({
                title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
            })
            return false
        }
        if (repeatPassword == '') {
            this.$Notice.error({
                title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
            })
            return false
        }
        if (newPassword !== repeatPassword) {
            this.$Notice.error({
                title: '' + this.$t(Message.INCONSISTENT_PASSWORD_ERROR)
            })
            return false
        }
        return true
    }

    confirmUpdate() {
        if (!this.btnState || !this.checkInfo()) {
            return
        }
        this.decryptKey()
    }

    updatePW() {
        let encryptObj = encryptKey(new UInt64(this.lockKey).toHex(), this.newPassword)
        let saveData = {
            ciphertext: encryptObj.ciphertext,
            iv: encryptObj.iv,
        }
        localSave('lock', JSON.stringify(saveData))
        this.init()
        this.$Notice.success({
            title: this.$t(Message.SUCCESS) + ''
        })
    }

    decryptKey() {
        let lock: any = localRead('lock')
        try {
            const u = [50, 50]
            lock = JSON.parse(lock)
            const enTxt = decryptKey(lock, this.prePassword)
            if (enTxt !== new UInt64(u).toHex()) {
                this.$Notice.error({title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''});
            } else {
                this.updatePW()
            }
        } catch (e) {
            this.$Notice.error({title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''});
        }
    }

    init() {
        this.prePassword = ''
        this.newPassword = ''
        this.repeatPassword = ''
    }

    created() {
        this.init()
    }
}

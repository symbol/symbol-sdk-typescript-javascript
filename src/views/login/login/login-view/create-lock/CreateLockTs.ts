import {Message} from "@/config"
import {UInt64} from 'nem2-sdk'
import {
    passwordValidator,
    MIN_PASSWORD_LENGTH,
    MAX_PASSWORD_LENGTH,
    ALLOWED_SPECIAL_CHAR,
} from '@/core/utils/validation'
import {localSave} from '@/core/utils/utils'
import {Component, Vue} from 'vue-property-decorator'
import {encryptKey} from "@/core/utils/wallet";

@Component
export class CreateLockTs extends Vue {
    lockPW = {
        password: '',
        checkPW: '',
        remindTxt: ''
    }

    passwordValidator = passwordValidator
    MIN_PASSWORD_LENGTH = MIN_PASSWORD_LENGTH
    MAX_PASSWORD_LENGTH = MAX_PASSWORD_LENGTH
    ALLOWED_SPECIAL_CHAR = ALLOWED_SPECIAL_CHAR

    checkInput() {
        if (!passwordValidator(this.lockPW.password)) {
            this.$Notice.error({
                title: this.$t(Message.PASSWORD_CREATE_ERROR) + ''
            });
            return false
        }
        if (this.lockPW.password !== this.lockPW.checkPW) {
            this.$Notice.error({
                title: this.$t(Message.INCONSISTENT_PASSWORD_ERROR) + '',
            });
            return false
        }
        if (!this.lockPW.remindTxt || this.lockPW.remindTxt === '') {
            this.$Notice.error({
                title: this.$t(Message.PASSWORD_HIT_SETTING_ERROR) + '',
            });
            return false
        }
        return true
    }

    showIndexView() {
        const u = [50, 50]
        if (!this.checkInput()) return
        const encryptObj = encryptKey(new UInt64(u).toHex(), this.lockPW.password)
        let saveData = {
            ciphertext: encryptObj.ciphertext,
            iv: encryptObj.iv,
            remindTxt: this.lockPW.remindTxt
        }
        localSave('lock', JSON.stringify(saveData))
        this.$emit('showIndexView', 2)
    }

    hideIndexView() {
        this.$emit('showIndexView', 0)
    }
}

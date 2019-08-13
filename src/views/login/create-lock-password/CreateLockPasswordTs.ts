import {Message} from "@/config/index"
import {Crypto, UInt64} from 'nem2-sdk'
import {localSave} from '@/help/help.ts'
import {Component, Vue} from 'vue-property-decorator'

@Component
export class CreateLockPasswordTs extends Vue {
    lockPW = {
        password: '',
        checkPW: '',
        remindTxt: ''
    }

    checkInput () {
        if(!this.lockPW.password || this.lockPW.password === ''){
            this.$Message.error(Message.PASSWORD_CREATE_ERROR);
            return false
        }
        if(this.lockPW.password !== this.lockPW.checkPW){
            this.$Message.error(Message.INCONSISTENT_PASSWORD_ERROR);
            return false
        }
        if(!this.lockPW.remindTxt || this.lockPW.remindTxt === ''){
            this.$Message.error(Message.PASSWORD_HIT_SETTING_ERROR);
            return false
        }
        return true
    }

    jumpToOtherPage(path) {
        if(path === '/walletPanel'){
            const u = [50,50]
            if(!this.checkInput()) return
            const encryptObj = Crypto.encrypt(new UInt64(u).toHex(), this.lockPW.password)
            let saveData = {
                ciphertext: encryptObj.ciphertext,
                iv: encryptObj.iv,
            }
            localSave('lock', JSON.stringify(saveData))
        }
        this.$router.push({
            path: path
        })
    }
}

import {Message} from "@/config/index.ts"
import {Component, Vue} from 'vue-property-decorator'
import {createMnemonic} from "@/core/utils"
import CheckPasswordDialog from '@/components/check-password-dialog/CheckPasswordDialog.vue'
import {networkTypeConfig} from '@/config/view/setting'

@Component({
    components: {
        CheckPasswordDialog
    }
})
export class AccountCreateMnemonicTs extends Vue {
    formItem = {
        currentNetType: '',
        password: '',
        seed: ''
    }
    showCheckPWDialog = false
    networkTypeList = networkTypeConfig

    checkInput() {
        if (!this.formItem.currentNetType || this.formItem.currentNetType == '') {
            this.$Notice.error({title: this.$t(Message.PLEASE_SWITCH_NETWORK) + ''})
            return false
        }
        return true
    }

    checkEnd(password) {
        if (!password) return
        const seed = createMnemonic()
        this.$store.commit('SET_MNEMONIC', seed)
        this.formItem.password = password
        this.formItem.seed = seed
        this.$emit('isCreated', this.formItem)
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    createWallet() {
        if (!this.checkInput()) return
        this.showCheckPWDialog = true
    }

    toBack() {
        this.$router.push('initAccount')
    }
}

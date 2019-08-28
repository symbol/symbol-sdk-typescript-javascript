import {Component, Vue } from 'vue-property-decorator'
import { AppLock, StoredCipher } from '@/core/utils/AppLock'
import { standardFields } from '@/core/validation'

@Component
export class InputLockTs extends Vue {
  passwordFieldValidation = standardFields.previousPassword.validation
  storedCipher: StoredCipher = new AppLock().getLock()
  cipher: string = this.storedCipher.cipher
  cipherHint: string = this.storedCipher.hint
  password: string = ''
  errors: any
  activeError: string = ''
  isShowPrompt: boolean = false
  currentText: string = ''
  isShowClearCache: boolean = false

  showPrompt() { this.isShowPrompt = true }
  showIndexView() { this.$emit('showIndexView', 1) }

  jumpToDashBoard() {
    if (this.$store.state.app.walletList.length == 0) {
      this.$router.push({
        name: 'walletCreate',
        params: { name: 'walletCreate' }
      })
      return
    }
    this.$router.push({ name: 'monitorPanel' })
  }

  submit() {
    if(this.errors.items.length > 0) {
      this.$Notice.error({ title: this.errors.items[0].msg })
      return
    }

    this.$validator
      .validate()
      .then((valid) => {
        if(!valid) return
        this.jumpToDashBoard()
      });
  }

    clearCache() {
        // localRead remove
        // localRemove('lock')
        // localRemove('wallets')
        // localRemove('loglevel:webpack-dev-server')
    }
}

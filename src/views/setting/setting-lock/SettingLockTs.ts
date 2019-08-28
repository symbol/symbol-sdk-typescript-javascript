import { Component, Vue, Provide, Watch } from 'vue-property-decorator'
import { Message } from "@/config"
import { clone } from '@/core/utils/utils'
import { standardFields } from '@/core/validation'
import { AppLock } from '@/core/utils/AppLock'
import FormInput from '../../other/forms/input/FormInput.vue'

@Component({ components: { FormInput } })
export class SettingLockTs extends Vue {
  @Provide() validator: any = this.$validator

  errors: any
  cypher: string
  submitDisabled: boolean = false

  formFields = {
      previousPassword: standardFields.previousPassword.default,
      newPassword: standardFields.previousPassword.default,
      confirmPassword: standardFields.previousPassword.default,
      cipher: new AppLock().getLock().cipher,
      hint: standardFields.hint.default,
  }

  formModel = clone(this.formFields)

  @Watch('errors')
  onErrorsChanged() { this.submitDisabled = this.errors.items.length > 0 }
  
  resetFields() { this.formModel = clone(this.formFields) }

  submit() {
    this.$validator
      .validate()
      .then((valid) => {
        if(!valid) return
        const { newPassword, hint } = this.formModel
        new AppLock().storeLock(newPassword, hint)
        this.resetFields()
        this.formModel.cipher = new AppLock().getLock().cipher
        this.$Notice.success({
            title: this.$t(Message.SUCCESS) + ''
        })
      });
  }
}

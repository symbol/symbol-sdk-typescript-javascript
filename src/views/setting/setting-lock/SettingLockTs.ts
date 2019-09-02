import {Component, Vue, Provide, Watch} from 'vue-property-decorator'
import {Message} from "@/config"
import {cloneData} from '@/core/utils/utils'
import {standardFields} from '@/core/validation'
import {AppLock} from '@/core/utils/appLock'
import FormInput from '@/views/other/forms/input/FormInput.vue'

@Component({components: {FormInput}})
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

    formModel = cloneData(this.formFields)

    @Watch('errors')
    onErrorsChanged() {
        this.submitDisabled = this.errors.items.length > 0
    }

    resetFields() {
        this.formModel = cloneData(this.formFields)
    }

    submit() {
        console.log(this.formModel)
        this.$validator
            .validate()
            .then((valid) => {
                if (!valid) return
                const {newPassword, hint} = this.formModel
                new AppLock().storeLock(newPassword, hint)
                this.resetFields()
                this.formModel.cipher = new AppLock().getLock().cipher
                this.$Notice.success({
                    title: this.$t(Message.SUCCESS) + ''
                })
            })
    }
}

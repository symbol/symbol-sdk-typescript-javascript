import {Message} from "@/config/index.ts"
import {Component, Vue} from 'vue-property-decorator'
import {AppLock} from "@/core/utils/AppLock"
import { formFields } from '@/core/validation'

@Component
export class CreateLockTs extends Vue {
    formFields: object = formFields
    errors: any

    lockPW = {
        password: '',
        checkPW: '',
        hint: ''
    }

    submit() {
      console.log('SUBMIT CALLED')
      if(this.errors.items.length > 0) {
        this.$Notice.error({ title: this.errors.items[0].msg })
        return
      }

      this.$validator
        .validate()
        .then((valid) => {
          if(!valid) return
          new AppLock().storeLock(this.lockPW.password, this.lockPW.hint)
          this.showIndexView()
          this.$Notice.success({
             title: this.$t(Message.SUCCESS) + ''
          })
        });
    }

    showIndexView() { this.$emit('showIndexView', 2) }
    hideIndexView() { this.$emit('showIndexView', 0) }
}

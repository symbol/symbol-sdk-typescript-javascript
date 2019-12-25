import {mapState} from "vuex"
import {Component, Vue, Prop, Provide} from 'vue-property-decorator'
import {validation} from '@/core/validation'
import {StoreAccount} from "@/core/model"
import CheckPassword from '@/components/forms/check-password/CheckPassword.vue'

@Component({
    computed: {...mapState({activeAccount: 'account'})},
    components: {CheckPassword},
})
export class CheckPasswordDialogTs extends Vue {
    @Provide() validator: any = this.$validator
    activeAccount: StoreAccount
    validation = validation
    password = ''

    @Prop({default: false})
    visible: boolean

    @Prop({default: false})
    returnPassword: boolean

    get show(): boolean {
        return this.visible
    }

    set show(val) {
      if (!val) {
        this.$emit('close')
      }
    }

  passwordValidated(value){
      this.$emit('passwordValidated',value)
      this.show = false
  }
}

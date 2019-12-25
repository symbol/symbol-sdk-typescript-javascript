import {Component, Prop, Provide, Vue} from 'vue-property-decorator'
import {StoreAccount} from "@/core/model"
import {validation} from "@/core/validation"
import {mapState} from "vuex"
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'

@Component({
  computed: {
    ...mapState({activeAccount: 'account'}),
  },
  components:{
    ErrorTooltip
  }
})
export default class extends Vue {
  @Provide() validator: any = this.$validator
  activeAccount: StoreAccount
  validation = validation
  password:string = ''

  @Prop({default: false})
  returnPassword: boolean

  get accountPassword() {
    return this.activeAccount.currentAccount.password
  }

  submit() {
    this.$validator
      .validate()
      .then((valid) => {
        const response = valid && this.returnPassword ? this.password : valid
        this.$emit('passwordValidated', response)
      })
  }
}

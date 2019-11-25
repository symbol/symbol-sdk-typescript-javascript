import {Component, Vue, Provide, Watch} from 'vue-property-decorator'
import {Message, formDataConfig} from "@/config"
import {cloneData} from '@/core/utils'
import FormInput from '@/components/other/forms/input/FormInput.vue'
import {mapState} from "vuex"
import {AppAccounts, StoreAccount} from "@/core/model"
import {validation} from '@/core/validation'

const formItems = formDataConfig.settingPassword

@Component(
    {
        components: {FormInput},
        computed: {
            ...mapState({
                activeAccount: 'account',
            })
        }
    }
)
export class SettingPasswordTs extends Vue {
    @Provide() validator: any = this.$validator
    AppAccounts = AppAccounts
    activeAccount: StoreAccount
    validation = validation
    errors: any
    cypher: string
    submitDisabled: boolean = false
    formItems = cloneData(formItems)

    @Watch('errors')
    onErrorsChanged() {
        this.submitDisabled = this.errors.items.length > 0
    }

    get accountName() {
        return this.activeAccount.currentAccount.name
    }

    get mnemonic() {
        return this.activeAccount.currentAccount.password
    }

    resetFields() {
        this.formItems = {
            ...cloneData(formItems),
            cipher: this.activeAccount.currentAccount.password,
        }
    }

    submit() {
        const {previousPassword, newPassword} = this.formItems
        const {accountName, mnemonic} = this
        this.$validator
            .validate()
            .then((valid) => {
                if (!valid) return
                this.AppAccounts().saveNewPassword(previousPassword, newPassword, mnemonic, accountName, this.$store)
                this.resetFields()
                this.$Notice.success({
                    title: this.$t(Message.SUCCESS) + ''
                })
            })
    }

    mounted() {
        this.resetFields()
    }
}

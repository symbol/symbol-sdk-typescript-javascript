import {Component, Vue, Provide, Watch} from 'vue-property-decorator'
import {Message} from "@/config"
import {localRead} from '@/core/utils'
import {standardFields} from '@/core/validation'
import FormInput from '@/components/other/forms/input/FormInput.vue'
import {mapState} from "vuex"
import {AppAccounts, StoreAccount} from "@/core/model"

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
    activeAccount: StoreAccount
    errors: any
    cypher: string
    submitDisabled: boolean = false
    formItems = {
        previousPassword: standardFields.previousPassword.default,
        newPassword: standardFields.previousPassword.default,
        confirmPassword: standardFields.previousPassword.default,
        cipher: '',
        hint: standardFields.hint.default,
    }

    @Watch('errors')
    onErrorsChanged() {
        this.submitDisabled = this.errors.items.length > 0
    }

    get accountName() {
        return this.activeAccount.accountName
    }

    get mnemonic() {
        const {accountName} = this
        return JSON.parse(localRead('accountMap'))[accountName].seed
    }


    resetFields() {
        const {accountName} = this
        this.formItems = {
            previousPassword: standardFields.previousPassword.default,
            newPassword: standardFields.previousPassword.default,
            confirmPassword: standardFields.previousPassword.default,
            cipher: AppAccounts().getCipherPassword(accountName) + '',
            hint: standardFields.hint.default,
        }
    }

    submit() {
        const {previousPassword, newPassword} = this.formItems
        const {accountName, mnemonic} = this
        this.$validator
            .validate()
            .then((valid) => {
                if (!valid) return
                // refresh password localstorage and store info
                AppAccounts().saveNewPassword(previousPassword, newPassword, mnemonic, accountName, this.$store)
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

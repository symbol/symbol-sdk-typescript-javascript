import { Vue, Component, Provide } from 'vue-property-decorator'
import { NodeHttp } from 'nem2-sdk'
import { mapState } from "vuex"
import DisabledForms from '@/components/disabled-forms/DisabledForms.vue'
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
        })
    },
    components: { DisabledForms, ErrorTooltip }
})
export class GetNodePublicKeyTs extends Vue {
    @Provide() validator: any = this.$validator
    nodeUrl: string = ""
    nodePublicKey: string = 'N/A'

    async getNodePublicKey() {
        try {
            const nodeUrl = this.nodeUrl.trim()
            const urlWithoutTrailingSlash = nodeUrl[nodeUrl.length - 1] === '/'
                ? nodeUrl.substring(0, nodeUrl.length - 1)
                : nodeUrl
            const nodeInfo = await new NodeHttp(urlWithoutTrailingSlash).getNodeInfo().toPromise()
            this.nodePublicKey = nodeInfo.publicKey
        } catch (error) {
            console.log("TCL: GetNodePublicKeyTs -> getNodePublicKey -> error", error)
            this.nodePublicKey = "Nothing_was_found_at_this_address"
        }
    }

    submit() {
        this.$validator
            .validate()
            .then((valid) => {
                if (!valid) return
                this.getNodePublicKey()
            })
    }
}

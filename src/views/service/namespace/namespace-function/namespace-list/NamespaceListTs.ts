import {formatSeconds} from '@/core/utils/utils.ts'
import {Component, Vue} from 'vue-property-decorator'
import NamespaceEditDialog from './namespace-edit-dialog/NamespaceEditDialog.vue'
import {mapState} from "vuex"

@Component({
    components: {
        NamespaceEditDialog
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
            app:'app'
        })
    }
})
export class NamespaceListTs extends Vue {
    activeAccount:any
    app:any
    showNamespaceEditDialog = false
    currentNamespace = ''

    get namespaceList() {
        return this.activeAccount.namespace
    }

    get nowBlockHeihgt() {
        return this.app.chainStatus.currentHeight
    }

    showEditDialog(namespaceName) {
        this.currentNamespace = namespaceName
        this.showNamespaceEditDialog = true
    }

    closeNamespaceEditDialog() {
        this.showNamespaceEditDialog = false
    }

    computeDuration(namespaceInfo) {
        const {duration, isActive} = namespaceInfo
        if (!isActive) {
            return 'Expired'
        }
        const expireTime = duration - this.nowBlockHeihgt > 0 ? duration - this.nowBlockHeihgt : 'not active'
        return expireTime
    }

    durationToTime(duration) {
        const durationNum = Number(duration - this.nowBlockHeihgt)
        return formatSeconds(durationNum * 12)

    }
}

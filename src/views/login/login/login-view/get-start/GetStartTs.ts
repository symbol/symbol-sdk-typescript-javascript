import {Component, Vue} from 'vue-property-decorator'
import {getObjectLength, localRead} from "@/core/utils"

@Component
export class GetStartTs extends Vue {
    showStartContent = false
    showCreateLockContent = true
    showInputLockContent = false

    showIndexView() {
        const accountMapData = localRead('accountMap')
        const accountMap = accountMapData ? JSON.parse(accountMapData) : {}
        if (!getObjectLength(accountMap)) {
            this.$router.push('createAccount')
            return
        }
        this.$emit('showIndexView', 1)
    }

}

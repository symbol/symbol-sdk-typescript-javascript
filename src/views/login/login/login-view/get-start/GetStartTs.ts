import {Component, Vue} from 'vue-property-decorator'

@Component
export class GetStartTs extends Vue {
    showStartContent = false
    showCreateLockContent = true
    showInputLockContent = false

    showIndexView() {
        this.$emit('showIndexView', 1)
    }

    created() {
        this.$store.state.app.isInLoginPage = true
    }
}

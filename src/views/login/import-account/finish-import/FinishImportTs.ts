import {Vue, Component} from 'vue-property-decorator'

@Component
export default class FinishImportTs extends Vue {

    jumpToDashboard() {
        this.$router.push({
            path: "/dashboard"
        })
    }

}

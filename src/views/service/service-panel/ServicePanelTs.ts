
import {Component, Vue} from 'vue-property-decorator'
import ServiceSwitch from '@/views/service/service-switch/ServiceSwitch.vue'

@Component({
    components: {
        ServiceSwitch
    },
})
export class ServicePanelTs extends Vue{
    created(){
        this.$store.state.app.isInLoginPage = false
    }
}

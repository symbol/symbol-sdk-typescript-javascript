import {Component, Vue} from 'vue-property-decorator'
import { serviceSwitchFnConfig } from '@/config/view/wallet'


@Component
export class ServiceSwitchTs extends Vue {
    serviceFnList =serviceSwitchFnConfig

    nowIcon(item) {
        return item.active ? item.iconActive : item.iconDefault
    }

    toPage(item) {
        for (let i in this.serviceFnList) {
            if (this.serviceFnList[i].name == item.name) {
                this.serviceFnList[i].active = true
            } else {
                this.serviceFnList[i].active = false
            }
        }
        this.$router.push({path: item.to})
    }

    mounted() {
        this.toPage(this.serviceFnList[0])
    }
}

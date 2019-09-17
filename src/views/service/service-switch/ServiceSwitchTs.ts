import {Component, Vue} from 'vue-property-decorator'
import {serviceSwitchFnList} from '@/config/view'

@Component
export class ServiceSwitchTs extends Vue {
    serviceFnList =serviceSwitchFnList

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

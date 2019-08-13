import {Component, Vue} from 'vue-property-decorator'
import ApostilleAudit from './apostille-function/apostille-audit/ApostilleAudit.vue'
import ApostilleCreate from './apostille-function/apostille-create/ApostilleCreate.vue'
import ApostilleHistory from './apostille-function/apostille-history/ApostilleHistory.vue'

@Component({
    components:{
        ApostilleCreate,
        ApostilleAudit,
        ApostilleHistory
    }
})
export class ApostilleTs extends Vue {
    buttonList = [
        {
            name: 'create_apostille',
            isSelected: true
        }, {
            name: 'audit_apostille',
            isSelected: false
        }, {
            name: 'apostille_history',
            isSelected: false
        }
    ]

    switchButton(index) {
        let list = this.buttonList
        list = list.map((item) => {
            item.isSelected = false
            return item
        })
        list[index].isSelected = true
        this.buttonList = list
    }

}

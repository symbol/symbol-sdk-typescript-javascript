import {Component, Vue} from 'vue-property-decorator'
import MultisigMap from './multisig-functions/multisig-map/MultisigMap.vue'
import MultisigCosign from './multisig-functions/multisig-cosign/MultisigCosign.vue'
import MultisigConversion from './multisig-functions/multisig-conversion/MultisigConversion.vue'
import MultisigManagement from './multisig-functions/multisig-management/MultisigManagement.vue'

@Component({
    components: {
        MultisigMap,
        MultisigConversion,
        MultisigManagement,
        MultisigCosign
    }
})
export class MultisigTs extends Vue {

    buttonList = [
        {
            name: 'convert',
            isSelected: false
        }, {
            name: 'manage',
            isSelected: false
        }, {
            name: 'map',
            isSelected: true
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

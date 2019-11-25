import {Component, Prop, Vue} from 'vue-property-decorator'
import {MultisigCosignatoryModification, CosignatoryModificationAction} from 'nem2-sdk'

@Component
export default class CosignatoriesTableTs extends Vue {
    CosignatoryModificationAction = CosignatoryModificationAction

    @Prop({default: []}) cosignatories: MultisigCosignatoryModification[]
}

// external dependencies
import { Component, Vue } from 'vue-property-decorator'
// child components
// @ts-ignore
import AssetFormPageWrap from '@/views/pages/assets/AssetFormPageWrap/AssetFormPageWrap.vue'
// @ts-ignore
import FormNamespaceRegistrationTransaction from '@/views/forms/FormNamespaceRegistrationTransaction/FormNamespaceRegistrationTransaction.vue'
import { mapGetters } from 'vuex'
@Component({
  components:{AssetFormPageWrap,FormNamespaceRegistrationTransaction},
  computed: {...mapGetters({
    ownedNamespaces: 'namespace/ownedNamespaces',
  })},
})
export class CreateSubNamespaceTs extends Vue{
    
}

// external dependencies
import { Component, Vue } from 'vue-property-decorator'

// child components
// @ts-ignore
import NavigationTabs from '@/components/NavigationTabs/NavigationTabs.vue'

@Component({ components: { NavigationTabs } })
export class AssetFormPageWrapTs extends Vue {
  public isViewingHelpModal: boolean=false

  public get hasHelpModal(): boolean {
    return this.isViewingHelpModal
  }

  public set hasHelpModal(f: boolean) {
    this.isViewingHelpModal = f
  }
}

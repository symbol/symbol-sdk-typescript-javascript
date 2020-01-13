import {mapState} from 'vuex'
import {Component, Vue} from 'vue-property-decorator'

@Component({
  computed: {...mapState({app: 'app'})},
})

export class DisabledUiOverlayTs extends Vue {
  app: any

  get show() {
    return this.app.isUiDisabled
  }

  set show(val) {
    if (!val) {
      this.$emit('close')
    }
  }

  get message() {
    return this.app.uiDisabledMessage
  }
}

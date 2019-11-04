import {Component, Vue, Prop} from 'vue-property-decorator'

@Component
export class DebugConsoleTs extends Vue {
   @Prop({default: false}) 
   visible: true

   get show() {
       return this.visible
   }

   set show(val) {
       if (!val) {
           this.$emit('close')
       }
   }
}

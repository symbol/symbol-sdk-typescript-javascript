<template>
  <div class="namespace_list_container">
    <div class="top_text">
      <div class="head_title">{{$t('Update_namespace_prompts')}}</div>
      <div class="tips">{{$t('namespace_list_tips_1')}}</div>
      <div class="tips">{{$t('namespace_list_tips_2')}}</div>
    </div>

    <div class="namespace_list_table">
      <div class="table_head">
        <span class="namesapce_name">{{$t('space_name')}}</span>
        <span class="duration">{{$t('duration')}}</span>
        <!--        // TODO-->
        <img src="../../../../../assets/images/service/moreFn.png">
      </div>

      <div class="table_body">
        <div class="table_body_item radius" v-for="n in namespaceList">
          <span class="namesapce_name">{{n.name}}</span>
          <span class="duration">{{n.duration}}</span>
          <!--        // TODO-->
          <span class="more">
            <Poptip class="poptip_container" placement="top-start">
              <i class="moreFn"></i>
              <div slot="content" max-width="50" class="refresh_sub_container">
                <span class="fnItem pointer" @click="showEditDialog(n.name)">
                  <img src="../../../../../assets/images/service/namespace/namespaceRefresh.png">
                  <span>{{$t('update')}}</span>
                </span>
              </div>
            </Poptip>
          </span>
        </div>
      </div>
    </div>
    <NamespaceEditDialog :currentNamespaceName="currentNamespaceName"  :showNamespaceEditDialog="showNamespaceEditDialog" @closeNamespaceEditDialog   = 'closeNamespaceEditDialog'></NamespaceEditDialog>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import NamespaceEditDialog from './namespace-edit-dialog/NamespaceEditDialog.vue'

    @Component({
        components:{
            NamespaceEditDialog
        }
    })
    export default class NamespaceList extends Vue {
        showNamespaceEditDialog = false
        currentNamespaceName = ''
        namespaceList = [
            {
                name: 'nem.xem123',
                duration: '123321',
            },
            {
                name: 'nem.xem321',
                duration: '123321',
            },
            {
                name: 'nem.xem123',
                duration: '123321',
            }
        ]

        showEditDialog(namespaceName) {
            this.currentNamespaceName = namespaceName
            this.showNamespaceEditDialog = true
        }
        closeNamespaceEditDialog(){
            this.showNamespaceEditDialog = false
        }

    }
</script>
<style scoped lang="less">
  @import "NamespaceList.less";
</style>

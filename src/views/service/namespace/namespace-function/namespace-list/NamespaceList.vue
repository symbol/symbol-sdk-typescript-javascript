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
      </div>

      <div class="table_body">
        <div class="table_body_item radius" v-for="n in namespaceList">
          <span class="namesapce_name">{{n.name}}</span>
          <span class="duration">{{computeDuration(n.duration)}} ({{durationToTime(n.duration)}})</span>
          <span class="more" v-if="n.levels === 1">
            <Poptip class="poptip_container" placement="top-start">
              <i class="moreFn"></i>
              <div slot="content" max-width="50" class="refresh_sub_container">
                <span class="fnItem pointer" @click="showEditDialog(n)">
                  <img src="@/common/img/service/namespace/namespaceRefresh.png">
                  <span>{{$t('update')}}</span>
                </span>
              </div>
            </Poptip>
          </span>
        </div>

        <div v-if="namespaceList.length == 0" class="noData" >
          <i><img src="@/common/img/wallet/no_data.png"></i>
          <p>{{$t('not_yet_open')}}</p>
        </div>

      </div>
    </div>
    <NamespaceEditDialog :currentNamespace="currentNamespace" :showNamespaceEditDialog="showNamespaceEditDialog"
                         @closeNamespaceEditDialog='closeNamespaceEditDialog'></NamespaceEditDialog>
  </div>
</template>

<script lang="ts">
    import {formatSeconds} from '@/help/help.ts'
    import {Component, Vue} from 'vue-property-decorator'
    import NamespaceEditDialog from './namespace-edit-dialog/NamespaceEditDialog.vue'

    @Component({
        components: {
            NamespaceEditDialog
        }
    })
    export default class NamespaceList extends Vue {
        showNamespaceEditDialog = false
        currentNamespace = ''

        get namespaceList () {
            return this.$store.state.account.namespace
        }

        get nowBlockHeihgt () {
            return this.$store.state.app.chainStatus.currentHeight
        }

        showEditDialog(namespaceName) {
            this.currentNamespace = namespaceName
            this.showNamespaceEditDialog = true
        }

        closeNamespaceEditDialog() {
            this.showNamespaceEditDialog = false
        }

        computeDuration (duration) {
            let expireTime = duration - this.nowBlockHeihgt > 0 ? duration - this.nowBlockHeihgt : 'Expired'
            return expireTime
        }

        durationToTime(duration) {
            const durationNum = Number(duration)
            return formatSeconds(durationNum * 12)

        }
    }
</script>
<style scoped lang="less">
  @import "NamespaceList.less";
</style>

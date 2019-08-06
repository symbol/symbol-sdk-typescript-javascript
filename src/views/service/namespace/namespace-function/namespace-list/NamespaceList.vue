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
          <span class="duration">{{computeDuration(n.duration)}} ({{durationToTime(n.duration)}})</span>
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

        <div v-if="namespaceList.length == 0" class="noData" >
          <i><img src="@/assets/images/wallet-management/no_data.png"></i>
          <p>{{$t('not_yet_open')}}</p>
        </div>

      </div>
    </div>
    <NamespaceEditDialog :currentNamespaceName="currentNamespaceName" :showNamespaceEditDialog="showNamespaceEditDialog"
                         @closeNamespaceEditDialog='closeNamespaceEditDialog'></NamespaceEditDialog>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {formatSeconds} from '@/utils/util.js'
    import NamespaceEditDialog from './namespace-edit-dialog/NamespaceEditDialog.vue'
    import Message from "@/message/Message";

    @Component({
        components: {
            NamespaceEditDialog
        }
    })
    export default class NamespaceList extends Vue {
        showNamespaceEditDialog = false
        currentNamespaceName = ''

        get namespaceList () {
            return this.$store.state.account.namespace
        }

        get nowBlockHeihgt () {
            return this.$store.state.app.chainStatus.currentHeight
        }

        showEditDialog(namespaceName) {
            this.currentNamespaceName = namespaceName
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
            if (Number.isNaN(durationNum)) {
                return duration
            }
            if (durationNum * 12 >= 60 * 60 * 24 * 3650) {
                this.$Notice.error({
                    title: this.$t(Message.DURATION_MORE_THAN_10_YEARS_ERROR) + ''
                })
            }
            return formatSeconds(durationNum * 12)

        }
    }
</script>
<style scoped lang="less">
  @import "NamespaceList.less";
</style>

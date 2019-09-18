<template>
  <div class="namespace_list_container secondary_page_animate">
    <Spin v-if="namespaceLoading" size="large" fix class="absolute"></Spin>
    <div class="top_text">
      <div class="head_title">{{$t('Update_namespace_prompts')}}</div>
      <div class="tips">{{$t('namespace_list_tips_1')}}</div>
      <div class="tips">{{$t('namespace_list_tips_2')}}</div>
    </div>

    <div class="namespace_list_table">
      <div class="table_head">
        <span class="namesapce_name">{{$t('namespace_name')}}</span>
        <span class="duration">{{$t('duration')}}</span>
        <span class="is_active">{{$t('Control')}}</span>
        <span class="link">{{$t('link')}}</span>
        <span class="type">{{$t('type')}}</span>
        <span class="more"></span>
      </div>
      <Spin v-if="namespaceLoading" size="large" fix class="absolute"></Spin>
      <div class="table_body">
        <div class="table_body_item radius" v-if="n" v-for="n in namespaceList">
          <span class="namesapce_name overflow_ellipsis">{{n.label}}</span>
          <span class="duration overflow_ellipsis">
            {{computeDuration(n) === StatusString.EXPIRED ? $t('overdue') : durationToTime(n.endHeight)}}
          </span>
          <span class="is_active overflow_ellipsis">
            <Icon v-if="n.isActive" type="md-checkmark"/>
            <Icon v-else type="md-close"/>
          </span>
          <span class="link overflow_ellipsis">{{n.aliasType}}</span>
          <span class="type overflow_ellipsis">{{n.aliasTarget}}</span>
          <span class="more overflow_ellipsis">
            <Poptip class="poptip_container" placement="top-end">
              <i class="moreFn"></i>
              <div slot="content" max-width="150" class="refresh_sub_container">
                <span class="fnItem pointer" v-if="n.levels === 1" @click="showEditDialog(n)">
                  <img src="@/common/img/service/namespace/namespaceRefresh.png">
                  <span>{{$t('update')}}</span>
                </span>
               <span v-if="n.isLinked && computeDuration(n) !== StatusString.EXPIRED&&unlinkMosaicList.length"
                     class="fnItem pointer" @click="showUnlinkDialog(n)">
                <img src="@/common/img/service/namespace/namespaceRefresh.png">
                <span>{{$t('unbind')}}</span>
              </span>

              <span v-if="!n.isLinked && computeDuration(n) !== StatusString.EXPIRED  && availableMosaics.length"
                    class="fnItem pointer"
                    @click="showMosaicLinkDialog(n)">
                <img src="@/common/img/service/namespace/namespaceRefresh.png">
                <span>{{$t('bind_mosaic')}}</span>
              </span>
                  <span v-if="!n.isLinked&& computeDuration(n) !== StatusString.EXPIRED " class="fnItem pointer"
                        @click="showAddressLinkDialog(n)">
                <img src="@/common/img/service/namespace/namespaceRefresh.png">
                <span>{{$t('bind_address')}}</span>
              </span>
              </div>
            </Poptip>
          </span>
        </div>

        <div v-if="namespaceList.length == 0" class="noData">
          <p>{{$t('no_data')}}</p>
        </div>

      </div>
    </div>
    <NamespaceEditDialog
            :currentNamespace="currentNamespace"
            :showNamespaceEditDialog="showNamespaceEditDialog"
            @closeNamespaceEditDialog='closeNamespaceEditDialog'
    ></NamespaceEditDialog>

    <NamespaceUnAliasDialog
            :showUnAliasDialog="showUnAliasDialog"
            :unAliasItem="aliasDialogItem"
            @closeUnAliasDialog="closeUnAliasDialog"
    ></NamespaceUnAliasDialog>

    <NamespaceMosaicAliasDialog
            :showMosaicAliasDialog="showMosaicAliasDialog"
            :itemMosaic="aliasDialogItem"
            @closeMosaicAliasDialog="closeMosaicAliasDialog"
    ></NamespaceMosaicAliasDialog>

    <NamespaceAddressAliasDialog
            :isShowAddressAliasDialog="isShowAddressAliasDialog"
            :addressAliasItem="aliasDialogItem"
            @closeAddressAliasDialog="closeAddressAliasDialog"
    ></NamespaceAddressAliasDialog>

  </div>
</template>

<script lang="ts">
    // @ts-ignore
    import {NamespaceListTs} from '@/views/service/namespace/namespace-function/namespace-list/NamespaceListTs.ts'

    export default class NamespaceList extends NamespaceListTs {

    }
</script>
<style scoped lang="less">
  @import "NamespaceList.less";
</style>

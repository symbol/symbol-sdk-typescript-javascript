<template>
  <div class="namespace_list_container secondary_page_animate">
    <div class="left_container radius">
      <Spin v-if="namespaceLoading" size="large" fix class="absolute"></Spin>
      <div class="top_text">
        <p class="head_title">{{$t('Namespace_and_Sub_Namespace')}}</p>
        <p class="tips">{{$t('Under_the_current_wallet')}}</p>
      </div>

      <div class="tips_icon">
        <Poptip width="290" placement="bottom">
          <img src="@/common/img/service/namespace/namespaceTipIcon.png" alt="">
          <div class="tip_text" slot="content">
            <p>{{$t('namespace_list_tips_1')}}</p>
            <p>{{$t('namespace_list_tips_2')}}</p>
          </div>
        </Poptip>

      </div>
      <div class="namespace_list_table">
        <div class="table_head">
        <span @click="getSortType(namespaceSortType.byName)" class="namespace_name">
          {{$t('namespace_name')}}
          <Icon v-if="namespaceSortType.byName == currentSortType" class="active_sort_type" type="md-arrow-dropdown"/>
        </span>
          <span @click="getSortType(namespaceSortType.byDuration)" class="duration">
          {{$t('duration')}}
             <Icon v-if="namespaceSortType.byDuration == currentSortType" class="active_sort_type"
                   type="md-arrow-dropdown"/>
        </span>
          <span @click="getSortType(namespaceSortType.byOwnerShip)" class="is_active">
          {{$t('Control')}}
             <Icon v-if="namespaceSortType.byOwnerShip == currentSortType" class="active_sort_type"
                   type="md-arrow-dropdown"/>
        </span>
          <span @click="getSortType(namespaceSortType.byBindType)" class="link">
          {{$t('link')}}
             <Icon v-if="namespaceSortType.byBindType == currentSortType" class="active_sort_type"
                   type="md-arrow-dropdown"/>
        </span>
          <span @click="getSortType(namespaceSortType.byBindInfo)" class="type">
          {{$t('type')}}
             <Icon v-if="namespaceSortType.byBindInfo == currentSortType" class="active_sort_type"
                   type="md-arrow-dropdown"/>
        </span>
          <span class="more"></span>
          <!--       this is   a  filter-->
          <!--          <div class="namespace_filter" @click="toggleIsShowExpirednamespace()">-->
          <!--            <img v-if="!isShowExpirednamespace" src="@/common/img/window/windowSelected.png">-->
          <!--            <img v-else src="@/common/img/window/windowUnselected.png">-->
          <!--            <span>{{$t('Hide_expired_namespaces')}}</span>-->
          <!--          </div>-->
        </div>
        <Spin v-if="namespaceLoading" size="large" fix class="absolute"></Spin>
        <div class="table_body ">
          <div class=" radius"
               v-for=" n in currentNamespaceListByPage">
            <div v-if="n" class="table_body_item">
              <span class="namespace_name overflow_ellipsis">{{n.label}}</span>
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
          </div>
          <div v-if="currentNamespaceListByPage.length == 0" class="noData">
            <p>{{$t('no_data')}}</p>
          </div>
        </div>
      </div>

      <div class="page_list_container">
        <Page class="page_list" :total="currentNamespacelist.length" :page-size="pageSize" @on-change="handleChange"></Page>
      </div>
    </div>

    <div class="right_container radius">
      <p class="right_container_head">{{$t('namespace')}}</p>
      <p class="second_head">{{$t('define')}}</p>
      <p class="green">{{$t('A_namespace_starts_with_a_name_that_you_choose_similar_to_an_internet_domain_name')}}</p>
      <p class="second_head">{{$t('Namespace_description')}}</p>
      <p class="green">
        {{$t('The_name_must_appear_as_unique_in_the_network_and_may_have_a_maximum_length_of_64_characters')}}</p>
      <p>{{$t('Namespaces_can_have_up_to_3_levels')}}</p>
      <p class="second_head">{{$t('scenes_to_be_used')}}</p>
      <p>{{$t('Used_to_bind_a_wallet_address')}}</p>
    </div>

    <NamespaceEditDialog
            :currentNamespace="currentNamespace"
            :showNamespaceEditDialog="showNamespaceEditDialog"
            @closeNamespaceEditDialog='closeNamespaceEditDialog'/>

    <NamespaceUnAliasDialog
            :showUnAliasDialog="showUnAliasDialog"
            :unAliasItem="aliasDialogItem"
            @closeUnAliasDialog="closeUnAliasDialog"/>

    <NamespaceMosaicAliasDialog
            :showMosaicAliasDialog="showMosaicAliasDialog"
            :itemMosaic="aliasDialogItem"
            @closeMosaicAliasDialog="closeMosaicAliasDialog"/>

    <NamespaceAddressAliasDialog
            :isShowAddressAliasDialog="isShowAddressAliasDialog"
            :addressAliasItem="aliasDialogItem"
            @closeAddressAliasDialog="closeAddressAliasDialog"/>

  </div>
</template>

<script lang="ts">
    // @ts-ignore
    import "./NamespaceList.less"
    import {NamespaceListTs} from '@/views/service/namespace/namespace-function/namespace-list/NamespaceListTs.ts'

    export default class NamespaceList extends NamespaceListTs {

    }
</script>
<style scoped lang="less">

</style>

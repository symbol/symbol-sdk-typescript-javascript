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
          <span
                  class="Namespace_name"
                  @click="namespaceSortType = namespaceSortTypes.byName;
                sortDirection = !sortDirection"
          >{{$t('namespace_name')}}
            <Icon
                    v-if="namespaceSortType === namespaceSortTypes.byName"
                    class="active_sort_type"
                    :type="sortDirection?'md-arrow-dropdown':'md-arrow-dropup'"
            />
          </span>
          <span
                  class="duration"
                  @click="namespaceSortType = namespaceSortTypes.byDuration;
                sortDirection = !sortDirection"
          >{{$t('duration')}}
            <Icon
                    v-if="namespaceSortType === namespaceSortTypes.byDuration"
                    class="active_sort_type"
                    :type="sortDirection?'md-arrow-dropdown':'md-arrow-dropup'"
            />
          </span>
          <span
                  class="is_expired"
                  @click="namespaceSortType = namespaceSortTypes.byDuration;
                sortDirection = !sortDirection"
          >{{$t('Expired')}}
            <Icon
                    v-if="namespaceSortType === namespaceSortTypes.byDuration"
                    class="active_sort_type"
                    :type="sortDirection?'md-arrow-dropdown':'md-arrow-dropup'"
            />
          </span>
          <span
                  class="link overflow_ellipsis"
                  @click="namespaceSortType = namespaceSortTypes.byBindType;
                sortDirection = !sortDirection"
          >{{$t('link')}}
            <Icon
                    v-if="namespaceSortType === namespaceSortTypes.byBindType"
                    class="active_sort_type"
                    :type="sortDirection?'md-arrow-dropdown':'md-arrow-dropup'"
            />
          </span>
          <span
                  @click="namespaceSortType = namespaceSortTypes.byBindType;
                sortDirection = !sortDirection"
                  class="type"
          >{{$t('type')}}
             <Icon
                     v-if="namespaceSortType === namespaceSortTypes.byBindInfo"
                     class="active_sort_type"
                     :type="sortDirection?'md-arrow-dropdown':'md-arrow-dropup'"
             />
          </span>
          <span class="more"></span>
          <span @click="refreshNamespaceList()"
                class="pointer refresh_btn">{{$t('refresh')}}</span>
          <div
                  class="namespace_filter pointer"
                  @click="isShowExpiredNamespace = !isShowExpiredNamespace"
          >
            <Icon v-if="isShowExpiredNamespace" type="md-square"/>
            <Icon v-else type="md-square-outline"/>
            <span>{{$t('Hide_expired_namespaces')}}</span>
          </div>
        </div>
        <Spin v-if="namespaceLoading" size="large" fix class="absolute"></Spin>
        <div class="table_body ">
          <div class=" radius" :key="`ns${index}`"
               v-for="(n, index) in paginatedNamespaceList">
            <div v-if="n" class="table_body_item">
              <span class="Namespace_name text_select overflow_ellipsis">{{n.name}}</span>
              <span :class="[
                  'duration',
                  'overflow_ellipsis',
                  displayDuration(n).expired ? 'red' : '',
              ]">
                  {{ displayDuration(n).time }}
            </span>
              <span class="is_expired overflow_ellipsis">
                <Icon v-if="displayDuration(n).expired" type="md-checkmark"/>
                <Icon v-else type="md-close"/>
              </span>
              <span class="link overflow_ellipsis">
                <span v-if="getAliasType(n)">
                    {{$t(getAliasType(n))}}
                </span>
                <Icon v-else type="md-close"/>
              </span>
              <span class="type text_select overflow_ellipsis">
                <span v-if="getAliasTarget(n)">
                  {{getAliasTarget(n)}}
                </span>
                <Icon v-else type="md-close"/>
              </span>
              <span class="more overflow_ellipsis">
            <Poptip class="poptip_container" v-if="!displayDuration(n).expired || n.levels === 1" placement="top-end">
              <i class="moreFn"></i>
              <div slot="content" max-width="150" class="refresh_sub_container">
                <span class="fnItem pointer" v-if="n.levels === 1" @click.stop="showEditDialog(n)">
                  <img src="@/common/img/service/namespace/namespaceRefresh.png">
                  <span>{{$t('update')}}</span>
                </span>
               <span
                       v-if="n.isLinked() && !displayDuration(n).expired"
                       class="fnItem pointer"
                       @click.stop="unbindItem(n)"
               >
                <img src="@/common/img/service/namespace/namespaceRefresh.png">
                <span>{{$t('unbind')}}</span>
              </span>

              <span
                      v-if="!n.isLinked() && !displayDuration(n).expired"
                      class="fnItem pointer"
                      @click.stop="bindItem(n)"
              >
                <img src="@/common/img/service/namespace/namespaceRefresh.png">
                <span>{{$t('bind')}}</span>
              </span>
          </div>
          </Poptip>
          </span>
            </div>
          </div>
          <div v-if="namespaceList.length == 0" class="noData">
            <p>{{$t('no_data')}}</p>
          </div>
        </div>
      </div>

      <div class="page_list_container">
        <Page class="page_list" :total="namespaceList.length" :page-size="pageSize" @on-change="handleChange"></Page>
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
            v-if="showNamespaceEditDialog"
            :currentNamespace="namespace"
            :showNamespaceEditDialog="showNamespaceEditDialog"
            @close='showNamespaceEditDialog = false'
    />
    <Alias
            v-if="showAliasDialog"
            :visible="showAliasDialog"
            :bind="bind"
            :fromNamespace="true"
            :namespace="namespace"
            :mosaic="mosaic"
            :address="address"
            @close="showAliasDialog = false"
    />
  </div>
</template>

<script lang="ts">
    // @ts-ignore
    import "./NamespaceList.less"
    import {NamespaceListTs} from '@/views/namespace/namespace-function/namespace-list/NamespaceListTs.ts'

    export default class NamespaceList extends NamespaceListTs {

    }
</script>
<style scoped lang="less">

</style>

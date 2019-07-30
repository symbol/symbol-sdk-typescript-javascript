<template>
  <div class="serviceSwitchWrap radius">
    <div class="serviceSwitchHead">
      <p class="tit">{{$t('service')}}</p>
    </div>
    <div class="serviceList">
      <div :class="['serviceItem', item.active?'active':'']" v-for="(item,index) in serviceFnList" @click="toPage(item)"
           :key="index">
        <div class="serviceName"><i><img :src="nowIcon(item)"></i> <span>{{$t(item.name)}}</span></div>
        <p class="serviceTxt" v-if="item.active">{{$t(item.introduce)}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import {Component, Vue} from 'vue-property-decorator';
  import './ServiceSwitch.less'
  import multisign1Icon from '../../../assets/images/service/multisign1.png'
  import multisign2Icon from '../../../assets/images/service/multisign2.png'
  import namespace1Icon from '../../../assets/images/service/namespace1.png'
  import namespace2Icon from '../../../assets/images/service/namespace2.png'
  import mosaic1Icon from '../../../assets/images/service/mosaic1.png'
  import mosaic2Icon from '../../../assets/images/service/mosaic2.png'
  import harvest1Icon from '../../../assets/images/service/harvest1.png'
  import harvest2Icon from '../../../assets/images/service/harvest2.png'
  import apostille1Icon from '../../../assets/images/service/apostille1.png'
  import apostille2Icon from '../../../assets/images/service/apostille2.png'
  import address1Icon from '../../../assets/images/service/address1.png'
  import address2Icon from '../../../assets/images/service/address2.png'
  import exchange1Icon from '../../../assets/images/service/exchange1.png'
  import exchange2Icon from '../../../assets/images/service/exchange2.png'

  @Component
  export default class serviceSwitch extends Vue {
    serviceFnList = [
      {
        name: 'mosaic',
        to: '/mosaic',
        iconDefault: mosaic1Icon,
        iconActive: mosaic2Icon,
        introduce: 'NEM_Mosaic_is_a_smart_asset_with_rich_attributes_and_features_To_create_a_mosaic_you_must_provision_the_root_namespace_for_your_account',
        active: false
      },
      {
        name: 'multi_signature',
        to: '/multisig',
        iconDefault: multisign1Icon,
        iconActive: multisign2Icon,
        introduce: 'provides_an_editable_chain_on_protocol_in_a_multi_signature_account_which_is_the_best_way_to_store_funds_and_achieve_a_common_account',
        active: true
      }, {
        name: 'namespace',
        to: '/namespace',
        iconDefault: namespace1Icon,
        iconActive: namespace2Icon,
        introduce: 'a_namespace_is_a_domain_name_that_stores_mosaics_Each_namespace_is_unique_within_a_blockchain_and_mosaics_can_be_defined_and_authenticated_on_a_multi_level_sub_namespace',
        active: false
      },
      // {
      //     name:'委托收获',
      //     to:'/onDev',
      //     iconDefault:harvest1Icon,
      //     iconActive:harvest2Icon,
      //     introduce:'多重签名账户中提供可编辑的链上协议，是存储资金，实现共有账户的最佳实现方式',
      //     active:false
      // },
      {
        name: 'apostille',
        to: '/apostille',
        iconDefault: apostille1Icon,
        iconActive: apostille2Icon,
        introduce: 'provides_an_editable_chain_on_protocol_in_a_multi_signature_account_which_is_the_best_way_to_store_funds_and_achieve_a_common_account',
        active: false
      },
      // {
      //   name: 'address_book',
      //   to: '/onDev',
      //   iconDefault: address1Icon,
      //   iconActive: address2Icon,
      //   introduce: 'assign_tags_to_addresses_to_easily_track_contacts',
      //   active: false
      // }, {
      //   name: 'instant_xchanges',
      //   to: '/onDev',
      //   iconDefault: exchange1Icon,
      //   iconActive: exchange2Icon,
      //   introduce: 'use_Changelly_and_ShapeShift_widgets_to_buy_XEM_at_the_best_rates',
      //   active: false
      // },
    ]

    nowIcon(item) {
      return item.active ? item.iconActive : item.iconDefault
    }

    toPage(item) {
      for (let i in this.serviceFnList) {
        if (this.serviceFnList[i].name == item.name) {
          this.serviceFnList[i].active = true
        } else {
          this.serviceFnList[i].active = false
        }
      }
      this.$router.push({path: item.to})
    }

    mounted() {
      this.toPage(this.serviceFnList[0])
    }
  }
</script>

<style scoped>

</style>

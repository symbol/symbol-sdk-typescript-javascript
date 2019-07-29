<template>
  <div class="guideIntoWrap scroll">
    <h1 class="pageTit">{{$t('start_the_NEM_tour')}}</h1>
    <div class="methodDiv">

      <div class=" createDiv
        ">
        <div class="createIcon">
          <img src="../../../assets/images/login/guide-into/guideIntoCreate.png">
        </div>
        <p class="createTit">{{$t('create_now')}}</p>
        <p class="createTxt">{{$t('this_will_create_a_new_wallet_and_a_new_torrent_file')}}</p>
        <div class="button pointer" @click="jumpToOtherPage('walletCreate')">
          {{$t('create_wallet')}}
          <div/>
        </div>
      </div>

      <div class="importDiv">
        <div class="importIcon">
          <img src="../../../assets/images/login/guide-into/guideIntoImport.png">
        </div>
        <p class="importTit">{{$t('existing_wallet')}}</p>
        <p class="importTxt">{{$t('import_text')}}</p>
        <div class="button pointer" @click="jumpToOtherPage('walletImportKeystore')">{{$t('import_wallet')}}</div>
      </div>



    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component({})
    export default class guideIntoWrap extends Vue {
        jumpToOtherPage(name) {
            this.$store.state.app.isInLoginPage = false
            if(name === 'walletImportKeystore'){
                this.$emit('toImport')
            }else if(name === 'walletCreate'){
                this.$emit('toCreate')
            }
        }
    }
</script>

<style scoped lang="less">
  @import "guideInto.less";
</style>

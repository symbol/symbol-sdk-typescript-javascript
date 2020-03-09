<template>
  <div class="about-container">
    <div class="form-container">
      <div class="form-row about-list">
        <div class="label">{{ $t('about_app_release') }}</div>
        <div class="value">
          {{ configs.package.description }} v{{ configs.package.version }}
        </div>
      </div>
      <div class="form-row about-list">
        <div class="label">{{ $t('about_app_url') }}</div>
        <div class="value">
          <a :href="configs.package.homepage" target="_blank">{{ configs.package.homepage }}</a>
        </div>
      </div>
      <!-- <div class="form-row"></div> -->

      <div class="subtitle">{{ $t('about_network') }}</div>

      <div class="form-row about-list">
        <div class="label">{{ $t('about_default_node') }}</div>
        <div class="value">
          <a :href="getNodeLink()" target="_blank">{{ configs.network.defaultNode.url }}</a>
        </div>
      </div>

      <div class="form-row about-list">
        <div class="label">{{ $t('about_network_type') }}</div>
        <div class="value">
          <span v-if="isNetworkType(types.MAIN_NET)">MAINNET</span>
          <span v-else-if="isNetworkType(types.TEST_NET)">TESTNET</span>
          <span v-else-if="isNetworkType(types.MIJIN)">MIJIN</span>
          <span v-else-if="isNetworkType(types.MIJIN_TEST)">MIJIN_TEST</span>
        </div>
      </div>

      <div class="form-row about-list">
        <div class="label">{{ $t('about_generation_hash') }}</div>
        <div class="value">{{ configs.network.networks['testnet-publicTest'].generationHash }}</div>
      </div>
      <!-- <div class="form-row about-list"></div> -->

      <div class="subtitle">{{ $t('about_dependencies') }}</div>

      <div class="form-row about-list">
        <div class="label">{{ $t('about_sdk_version') }}</div>
        <div class="value">{{ configs.package.dependencies['symbol-sdk'] }}</div>
      </div>

      <div class="form-row about-list">
        <div class="label">{{ $t('about_typescript_version') }}</div>
        <div class="value">{{ configs.package.dependencies['typescript'] }}</div>
      </div>

      <div class="form-row about-list">
        <div class="label">{{ $t('about_rxjs_version') }}</div>
        <div class="value">{{ configs.package.dependencies['rxjs'] }}</div>
      </div>

      <div class="form-row about-list">
        <div class="label">{{ $t('about_vue_version') }}</div>
        <div class="value">{{ configs.package.dependencies['vue'] }}</div>
      </div>
      <!-- <div class="form-row"></div> -->
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import {NetworkType} from 'symbol-sdk'

// child components
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue'
import FormLabel from '@/components/FormLabel/FormLabel.vue'

// configuration
import appConfig from '@/../config/app.conf.json'
import feesConfig from '@/../config/fees.conf.json'
import networkConfig from '@/../config/network.conf.json'
import packageConfig from '@/../package.json'

@Component({
  components: {
    FormWrapper,
    FormLabel,
  },
})
export default class AboutPage extends Vue {
  public configs = {
    package: packageConfig,
    app: appConfig,
    fees: feesConfig,
    network: networkConfig,
  }
  public types = NetworkType

  public isNetworkType(type): boolean {
    return networkConfig.defaultNetworkType === type
  }

  public getNodeLink(): string {
    return networkConfig.defaultNode.url + '/node/info'
  }
}
</script>

<style lang="less" scoped>
.about-container {
  display: block;
  width: 100%;
  clear: both;
  min-height: 1rem;

  .form-row {
    width: 100%;
    margin-top: 20px;
    margin-bottom: 20px;

    .label {
      float: left;
      font-size: 20px;
      width: 250px;
    }

    .value {
      float: left;
      margin-left: 50px;
      font-size: 20px;
      font-weight: bolder;
    }
  }

  .subtitle {
    font-size: 25px;
    margin-top: 50px;
  }
}
</style>


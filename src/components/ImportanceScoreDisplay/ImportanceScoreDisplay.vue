<template>
  <div>
    <span class="tit">{{ $t('importance') }}</span>
    <span>
      <span>
        {{ score() }}
      </span>
    </span>
  </div>
</template>

<script>
import {Component, Vue, Prop} from 'vue-property-decorator'
import {WalletsModel} from '@/core/database/entities/WalletsModel'

@Component
export default class ImportanceScoreDisplay extends Vue {
  @Prop({
    default: null
  }) wallet: WalletsModel
}
</script>

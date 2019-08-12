<template>
  <div class="communityPanelWrap clear">
    <div class="communityPanel">
      <div class="communityPanelNav left">
        <ul class="navList clear">
          <li :class="[item.active?'active':'','left',item.disabled?'disabled':'']"
              v-for="(item,index) in navList"
              :key="index"
              @click="goToPage(item)">
            {{$t(item.name)}}
          </li>
        </ul>
      </div>
      <div class="contentPanel radius">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import './CommunityPanel.less'
    import {Component, Vue} from 'vue-property-decorator'


    @Component
    export default class communityPanel extends Vue {
        walletList = []
        navList = [
            {name: 'news', to: '/information', active: true},
            {name: 'vote', to: '/vote', active: false,},
        ]

        get nowWalletList() {
            return this.$store.state.app.walletList
        }

        goToPage(item) {
            if (item.disabled) {
                return
            }
            for (let i in this.navList) {
                if (this.navList[i].to == item.to) {
                    this.navList[i].active = true
                    continue
                }
                this.navList[i].active = false
            }
            this.$router.push({path: item.to})
        }

        created() {
            this.$router.push({
                name: 'information'
            })
        }
    }
</script>

<style scoped>

</style>

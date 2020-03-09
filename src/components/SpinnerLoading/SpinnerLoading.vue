<template>
  <div />
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'

@Component({
  computed: {
    ...mapGetters({
      message: 'app/loadingOverlayMessage',
      disableCloseButton: 'app/loadingDisableCloseButton',
    }),
  },
})
export default class SpinnerLoading extends Vue {
  /**
   * Message displayed when UI is disabled
   * @var {string}
   */
  public message: string

  /**
   * Whether should show the close button
   * @var {boolean}
   */
  public disableCloseButton: boolean

  open() {
    // @ts-ignore
    this.$Spin.show({
      render: h => {
        return h('div', [
          h(
            'div',
            {
              class: 'loading-overlay-message',
            },
            this.message,
          ),
          !this.disableCloseButton
            ? h('i', {
              class: 'ivu-icon ivu-icon-ios-close-circle icon close-icon',
              size: '45px',
            })
            : '',
          !this.disableCloseButton
            ? h(
              'a',
              {
                on: { click: this.closeScreen },
                class: 'close-text',
              },
              'close',
            )
            : '',
        ])
      },
    })

    this
  }

  mounted() {
    this.open()
  }

  closeScreen() {
    this.$store.dispatch('app/SET_LOADING_OVERLAY', {
      show: false,
      message: '',
    })
  }
}
</script> 

<style lang="less">
@import "../../views/resources/css/variables.less";

.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}

.ivu-spin-dot {
  display: block !important;
  position: relative;
  margin: 0 auto 30px;
  display: block;
  border-radius: 50%;
  background-color: @purpleDark;
  width: 50px;
  height: 50px;
  animation: ani-spin-bounce 1s 0s ease-in-out infinite;
  border-radius: 50%;
}

.close-icon {
  margin-right: 4px;
  font-size: @biggerFont;
  color: @black;
}

.loading-overlay-message {
  font-size: @biggerFont;
  margin-bottom: 20px;
  color: @purpleDark;
}

.close-text {
  font-size: @biggerFont;
  color: @black;
  text-decoration: none;
}
</style>

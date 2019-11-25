<template>
  <div></div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { AppInfo, StoreAccount, AppState } from "@/core/model";
import { mapState } from "vuex";

@Component({ computed: { ...mapState({ app: "app" }) } })
export default class LoadingOverlay extends Vue {
  app: AppInfo;

  open() {
    // @ts-ignore
    this.$Spin.show({
      render: h => {
        return h("div", [
          h("div", this.app.loadingOverlay.message),
          h("i", {
            class: "ivu-icon ivu-icon-ios-close-circle icon"
          }),
          h(
            "a",
            {
              on: {
                click: this.closeScreen
              }
            },
            "close"
          )
        ]);
      }
    });

    this;
  }

  mounted() {
    this.open();
  }

  closeScreen() {
    // @ts-ignore
    this.$Spin.hide();
    this.$store.commit("SET_LOADING_OVERLAY", {
      show: false,
      message: ""
    });
  }
}
</script>

<style>
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}

.ivu-spin-dot {
  display: block !important;
  position: relative;
  margin: 0 auto 30px;
  display: block;
  border-radius: 50%;
  background-color: #2d8cf0;
  width: 50px;
  height: 50px;
  animation: ani-spin-bounce 1s 0s ease-in-out infinite;
  border-radius: 50%;
}

.icon {
  margin-right: 4px;
}
</style>
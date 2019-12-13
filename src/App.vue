<template>
  <div id="app" :class="[isWindows?'windows':'mac']">
    <router-view/>
    <DisabledUiOverlay/>
    <TransactionConfirmation/>
    <LoadingOverlay v-if="showLoadingOverlay"/>
  </div>
</template>

<script lang="ts">
    import "animate.css";
    import {AccountHttp, Address, QueryParams, Transaction} from "nem2-sdk";
    import {mapState} from "vuex";
    import {asyncScheduler} from "rxjs";
    import {throttleTime} from "rxjs/operators";
    import {isWindows} from "@/config";
    import {
        checkInstall,
        getObjectLength,
        getTopValueInObject,
        localRead
    } from "@/core/utils";
    import {Component, Vue} from "vue-property-decorator";
    import {
        setMosaics,
        mosaicsAmountViewFromAddress,
        AppMosaics,
        setMarketOpeningPrice,
        setTransactionList,
        setNamespaces,
        getNamespacesFromAddress,
        setWalletsBalances,
        getMultisigAccountMultisigAccountInfo
    } from "@/core/services";
    import {
        AppMosaic,
        AppWallet,
        AppInfo,
        StoreAccount,
        AppAccount,
        Notice,
        Network,
        Listeners
    } from "@/core/model";
    import DisabledUiOverlay from "@/components/disabled-ui-overlay/DisabledUiOverlay.vue";
    import TransactionConfirmation from "@/components/transaction-confirmation/TransactionConfirmation.vue";
    import LoadingOverlay from "@/components/loading-overlay/LoadingOverlay.vue";

    @Component({
        computed: {
            ...mapState({activeAccount: "account", app: "app"})
        },
        components: {
            DisabledUiOverlay,
            TransactionConfirmation,
            LoadingOverlay
        }
    })
    export default class App extends Vue {
        isWindows = isWindows;
        activeAccount: StoreAccount;
        app: AppInfo;
        Listeners: Listeners;
        Network: Network;

        get showLoadingOverlay() {
            return (this.app.loadingOverlay && this.app.loadingOverlay.show) || false;
        }

        get node() {
            return this.activeAccount.node;
        }

        get wallet() {
            return this.activeAccount.wallet;
        }

        get address() {
            if (!this.wallet) return null;
            return this.wallet.address;
        }

        get accountName(): string {
            return;
        }

        async onWalletChange(newWallet) {
            try {
                this.$store.commit("SET_TRANSACTIONS_LOADING", true);
                this.$store.commit("SET_MOSAICS_LOADING", true);
                this.$store.commit("SET_NAMESPACE_LOADING", true);
                this.$store.commit("SET_MULTISIG_LOADING", true);
                this.$store.commit("RESET_TRANSACTION_LIST");
                this.$store.commit("RESET_MOSAICS");
                this.$store.commit("RESET_NAMESPACES");

                //@TODO: move from there
                const mosaicListFromStorage = localRead(newWallet.address);
                const appWallet = new AppWallet(newWallet);
                const parsedMosaicListFromStorage =
                    mosaicListFromStorage === ""
                        ? false
                        : JSON.parse(mosaicListFromStorage);

                if (mosaicListFromStorage) {
                    await this.$store.commit("SET_MOSAICS", parsedMosaicListFromStorage);
                }

                appWallet.setAccountInfo(this.$store);
                await setMosaics(appWallet, this.$store);
                await setNamespaces(newWallet.address, this.$store);

                /* Delay network calls to avoid ban */
                setTimeout(() => {
                    try {
                        setTransactionList(newWallet.address, this.$store);
                        appWallet.setMultisigStatus(this.node, this.$store);
                    } catch (error) {
                        console.error("App -> onWalletChange -> setTimeout -> error", error);
                    }
                }, 1000);

                this.Listeners.switchAddress(
                    Address.createFromRawAddress(newWallet.address)
                );
            } catch (error) {
                console.error("App -> onWalletChange -> error", error);
                this.$store.commit("SET_TRANSACTIONS_LOADING", false);
                this.$store.commit("SET_MOSAICS_LOADING", false);
                this.$store.commit("SET_NAMESPACE_LOADING", false);
                this.$store.commit("SET_MULTISIG_LOADING", false);
            }
        }

        //@TODO: move out from App.vue
        async onActiveMultisigAccountChange(publicKey: string): Promise<void> {
            try {
                const {node} = this;
                const {networkType} = this.wallet;

                // @TODO: Fix one single address type to be used as param
                const accountAddress = Address.createFromPublicKey(
                    publicKey,
                    networkType
                );
                const address = accountAddress.plain();

                const promises = await Promise.all([
                    getNamespacesFromAddress(address, node),
                    mosaicsAmountViewFromAddress(node, accountAddress)
                ]);

                const appNamespaces = promises[0];
                // @TODO: refactor
                const mosaicAmountViews = promises[1];
                const appMosaics = mosaicAmountViews.map(x =>
                    AppMosaic.fromMosaicAmountView(x)
                );

                this.$store.commit("UPDATE_MULTISIG_ACCOUNT_MOSAICS", {
                    address,
                    mosaics: appMosaics
                });
                this.$store.commit("SET_MULTISIG_ACCOUNT_NAMESPACES", {
                    address,
                    namespaces: appNamespaces
                });

                const appMosaicsFromNamespaces = await AppMosaics().fromAppNamespaces(
                    appNamespaces
                );
                this.$store.commit("UPDATE_MULTISIG_ACCOUNT_MOSAICS", {
                    address,
                    mosaics: appMosaicsFromNamespaces
                });
            } catch (error) {
                throw new Error(error);
            }
        }

        created() {
            this.initializeNotice();
            this.initializeNetwork();

            if (isWindows) {
                checkInstall();
            }
        }

        async mounted() {
            this.$store.commit("SET_TRANSACTIONS_LOADING", true);
            this.$store.commit("SET_MOSAICS_LOADING", true);
            this.$store.commit("SET_NAMESPACE_LOADING", true);
            this.initializeEventsHandlers();

            setMarketOpeningPrice(this);
            if (!this.activeAccount.wallet) this.$router.push("/login");
        }

        initializeNotice() {
            this.$Notice.config({duration: 4});
            const messageTranslator = message => `${this.$t(message)}`

            this.$store.subscribe(async (mutation, state) => {
                if (mutation.type === "TRIGGER_NOTICE") {
                    const notice: Notice = mutation.payload;
                    this.$Notice.destroy();
                    this.$Notice[notice.type]({title: messageTranslator(notice.message)});
                }
            });
        }

        initializeNetwork() {
            this.Network = Network.create(this.$store);
            this.Listeners = Listeners.create(this.$store);
        }

        initializeEventsHandlers() {
            /**
             * ON ADDRESS CHANGE
             */
            this.$watchAsObservable("address", {immediate: true})
                .pipe(
                    throttleTime(6000, asyncScheduler, {leading: true, trailing: true})
                )
                .subscribe(({newValue, oldValue}) => {
                    if (!newValue) return;

                    if ((!oldValue && newValue) || (oldValue && newValue !== oldValue)) {
                        this.onWalletChange(this.wallet);
                    }
                });

            /**
             * ON ACTIVE MULTISIG ACCOUNT CHANGE
             */
            this.$watchAsObservable("activeAccount.activeMultisigAccount")
                .pipe(
                    throttleTime(6000, asyncScheduler, {leading: true, trailing: true})
                )
                .subscribe(({newValue, oldValue}) => {
                    if (!newValue) return;

                    if (oldValue !== newValue) {
                        this.onActiveMultisigAccountChange(newValue);
                        setTimeout(() => {
                            getMultisigAccountMultisigAccountInfo(newValue, this.$store);
                        }, 500);
                    }
                });

            /**
             * ON ACCOUNT CHANGE
             */
            this.$watchAsObservable("accountName", {immediate: true})
                .pipe(
                    throttleTime(6000, asyncScheduler, {leading: true, trailing: true})
                )
                .subscribe(({newValue, oldValue}) => {
                    if (!newValue) return;
                    // @TODO: setWalletsBalance name is not appropriate
                    if (oldValue !== newValue) setWalletsBalances(this.$store);
                });

            /**
             * ON ENDPOINT CHANGE
             */
            this.$watchAsObservable("node")
                .pipe(
                    throttleTime(6000, asyncScheduler, {leading: true, trailing: true})
                )
                .subscribe(({newValue, oldValue}) => {
                    if (newValue && oldValue !== newValue) {
                        this.Network.switchNode(newValue);
                        this.Listeners.switchEndpoint(newValue);
                        // need update wallet info after node change
                        this.onWalletChange(this.wallet)
                    }
                });
        }
    }
</script>

<style lang="less">
  @import "./common/css/common.less";
  @import "./common/css/ivewWindows.less";
  @import "./common/css/iviewMac.less";
</style>

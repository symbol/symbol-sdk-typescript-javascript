const routers = [
    {
        path: '/',
        name: 'home',
        // @ts-ignore
        component: () => import('@/common/vue/menu-bar/MenuBar.vue'),
        children: [
            {
                path: '/monitorPanel',
                name: 'monitorPanel',
                redirect: '/dashBoard',
                meta: {},
                // @ts-ignore
                component: () => import('@/views/monitor/monitor-panel/MonitorPanel.vue'),
                children: [
                    {
                        path: '/dashBoard',
                        name: 'dashBoard',
                        // @ts-ignore
                        component: () => import('@/views/monitor/monitor-dashboard/MonitorDashBoard.vue')
                    }, {
                        path: '/market',
                        name: 'market',
                        // @ts-ignore
                        component: () => import('@/views/monitor/monitor-market/MonitorMarket.vue')
                    }, {
                        path: '/transfer',
                        name: 'transfer',
                        // @ts-ignore
                        component: () => import('@/views/monitor/monitor-transfer/MonitorTransfer.vue')
                    }, {
                        path: '/receipt',
                        name: 'receipt',
                        // @ts-ignore
                        component: () => import('@/views/monitor/monitor-receipt/MonitorReceipt.vue')
                    }, {
                        path: '/remote',
                        name: 'remote',
                        // @ts-ignore
                        component: () => import('@/views/monitor/monitor-remote/MonitorRemote.vue')
                    },

                ]
            },
            {
                path: '/walletPanel',
                name: 'walletPanel',
                redirect: '/walletCreate',
                meta: {},
                // @ts-ignore
                component: () => import('@/views/wallet/wallet-panel/WalletPanel.vue'),
                children: [
                    {
                        path: '/walletCreate',
                        name: 'walletCreate',
                        // @ts-ignore
                        component: () => import('@/views/wallet/wallet-create/WalletCreate.vue')
                    }, {
                        path: '/walletCreated',
                        name: 'walletCreated',
                        // @ts-ignore
                        component: () => import('@/views/wallet/wallet-created/WalletCreated.vue')
                    }, {
                        path: 'walletImport',
                        name: 'walletImport',
                        // @ts-ignore
                        component: () => import('@/views/wallet/wallet-import/WalletImport.vue'),
                        children: [
                            {
                                path: '/walletImportKeystore',
                                name: 'walletImportKeystore',
                                // @ts-ignore
                                component: () => import('@/views/wallet/wallet-import-keystore/WalletImportKeystore.vue'),
                            }, {
                                path: '/walletImportMnemonic',
                                name: 'walletImportMnemonic',
                                // @ts-ignore
                                component: () => import('@/views/wallet/wallet-import-mnemonic/WalletImportMnemonic.vue'),
                            }, {
                                path: '/walletImportPrivatekey',
                                name: 'walletImportPrivatekey',
                                // @ts-ignore
                                component: () => import('@/views/wallet/wallet-import-privatekey/WalletImportPrivatekey.vue'),
                            }
                        ]
                    },
                ]
            },
            {
                path: '/servicePanel',
                name: 'servicePanel',
                redirect: '/namespace',
                meta: {
                    //     disabled: true,
                },
                // @ts-ignore
                component: () => import('@/views/service/service-panel/ServicePanel.vue'),
                children: [
                    {
                        path: '/onDev',
                        name: 'onDev',
                        // @ts-ignore
                        component: () => import('@/views/other/on-development/OnDevelopment.vue')
                    }, {
                        path: '/namespace',
                        name: 'namespace',
                        // @ts-ignore
                        component: () => import('@/views/service/namespace/Namespace.vue')
                    }, {
                        path: '/mosaic',
                        name: 'mosaic',
                        // @ts-ignore
                        component: () => import('@/views/service/mosaic/Mosaic.vue')
                    }, {
                        path: '/multisigApi',
                        name: 'multisigApi',
                        // @ts-ignore
                        component: () => import('@/views/service/multisig/Multisig.vue')
                    },
                    {
                        path: '/apostille',
                        name: 'apostille',
                        // @ts-ignore
                        component: () => import('@/views/service/apostille/Apostille.vue')
                    },
                ]
            },

            {
                path: '/communityPanel',
                name: 'communityPanel',
                redirect: '/information',
                meta: {},
                // @ts-ignore
                component: () => import('@/views/community/community-panel/CommunityPanel.vue'),
                children: [
                    {
                        path: '/information',
                        name: 'information',
                        // @ts-ignore
                        component: () => import('@/views/community/information/Information.vue')
                    }, {
                        path: '/vote',
                        name: 'vote',
                        // @ts-ignore
                        component: () => import('@/views/community/vote/Vote.vue')
                    },
                ]
            },
            {
                path: '/settingPanel',
                name: 'settingPanel',
                redirect: '/settingNormal',
                meta: {
                    //     disabled: true,
                },
                // @ts-ignore
                component: () => import('@/views/setting/setting-panel/SettingPanel.vue'),
                children: [
                    {
                        path: '/settingAbout',
                        name: 'settingAbout',
                        // @ts-ignore
                        component: () => import('@/views/setting/setting-about/SettingAbout.vue')
                    },
                    {
                        path: '/settingLock',
                        name: 'settingLock',
                        // @ts-ignore
                        component: () => import('@/views/setting/setting-lock/SettingLock.vue')
                    }, {
                        path: '/settingNetwork',
                        name: 'settingNetwork',
                        // @ts-ignore
                        component: () => import('@/views/setting/setting-network/SettingNetwork.vue')
                    }, {
                        path: '/settingNormal',
                        name: 'settingNormal',
                        // @ts-ignore
                        component: () => import('@/views/setting/setting-normal/SettingNormal.vue')
                    },
                ]
            },
            {
                path: '/login',
                name: 'login',
                component: () => import('@/views/login/login/Login.vue'),
            }
        ]
    },
]

export default routers

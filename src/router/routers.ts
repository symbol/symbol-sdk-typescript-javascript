const routers = [
    {
        path: '/',
        name: 'home',
        // @ts-ignore
        component: () => import('@/components/menu-bar/MenuBar.vue'),
        children: [
            {
                path: '/monitorPanel',
                name: 'monitorPanel',
                meta: {},
                // @ts-ignore
                component: () => import('@/views/monitor/monitor-panel/MonitorPanel.vue'),
                children: [
                    {
                        path: '/monitorPanel',
                        name: 'monitorPanel',
                        // @ts-ignore
                        component: () => import('@/views/monitor/monitor-dashboard/MonitorDashBoard.vue')
                    },
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
                        component: () => import('@/views/monitor/monitor-dashboard/MonitorDashBoard.vue')
                    },

                ]
            },
            {
                path: '/walletPanel',
                name: 'walletPanel',
                meta: {},
                // @ts-ignore
                component: () => import('@/views/wallet-management/wallet-panel/WalletPanel.vue'),
                children: [
                    {
                        path: '/walletDetails',
                        name: 'walletDetails',
                        // @ts-ignore
                        component: () => import('@/views/wallet-management/wallet-details/WalletDetails.vue')
                    }, {
                        path: '/walletCreate',
                        name: 'walletCreate',
                        // @ts-ignore
                        component: () => import('@/views/wallet-management/wallet-create/WalletCreate.vue')
                    }, {
                        path: '/walletCreated',
                        name: 'walletCreated',
                        // @ts-ignore
                        component: () => import('@/views/wallet-management/wallet-created/WalletCreated.vue')
                    }, {
                        path: 'walletImport',
                        name: 'walletImport',
                        // @ts-ignore
                        component: () => import('@/views/wallet-management/wallet-import/WalletImport.vue'),
                        children: [
                            {
                                path: '/walletImportKeystore',
                                name: 'walletImportKeystore',
                                // @ts-ignore
                                component: () => import('@/views/wallet-management/wallet-import-keystore/WalletImportKeystore.vue'),
                            }, {
                                path: '/walletImportMnemonic',
                                name: 'walletImportMnemonic',
                                // @ts-ignore
                                component: () => import('@/views/wallet-management/wallet-import-mnemonic/WalletImportMnemonic.vue'),
                            }, {
                                path: '/walletImportPrivatekey',
                                name: 'walletImportPrivatekey',
                                // @ts-ignore
                                component: () => import('@/views/wallet-management/wallet-import-privatekey/WalletImportPrivatekey.vue'),
                            }
                        ]
                    },
                ]
            },
            {
                path: '/servicePanel',
                name: 'servicePanel',
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
                        component: () => import('@/views/other/onDev/onDev.vue')
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
                        path: '/multisig',
                        name: 'multisig',
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
                meta: {},
                // @ts-ignore
                component: () => import('@/views/community/community-panel/CommunityPanel.vue'),
                children: [
                    {
                        path: '/communityPanel',
                        name: 'communityPanel',
                        // @ts-ignore
                        component: () => import('@/views/community/information/Information.vue')
                    }, {
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
                    }, {
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
                    }, {
                        path: '/settingPanel',
                        name: 'settingPanel',
                        // @ts-ignore
                        component: () => import('@/views/setting/setting-normal/SettingNormal.vue')
                    },
                ]
            },
            {
                path: '/login',
                name: 'login',
                // @ts-ignore
                // component: () => import('@/views/login/welcome-page/welcomePage.vue'),
                component: () => import('@/views/login/new-login/NewLogin.vue'),
            },
            {
                path: '/reLogin',
                name: 'reLogin',
                // @ts-ignore
                // component: () => import('@/views/login/relogin/Relogin.vue'),
                component: () => import('@/views/login/new-relogin/NewRelogin.vue'),
            },
            {
                path: '/welcomePage',
                name: 'welcomePage',
                component: function () {
                    // component: () => import('@/views/login/welcome-page/welcomePage.vue'),
                    component: () => import('@/views/login/new-login/NewLogin.vue')
                },
            },
            {
                path: '/createLockPW',
                name: 'createLockPW',
                // @ts-ignore
                component: () => import('@/views/login/create-lockPW/createLockPW.vue'),
            },
            {
                path: '/guideInto',
                name: 'guideInto',
                // @ts-ignore
                component: () => import('@/views/login/guide-into/guideInto.vue'),
            }
        ]
    },
]

export default routers

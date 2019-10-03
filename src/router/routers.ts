const routers = [
    {
        path: '/',
        name: 'home',
        redirect: '/login',
        component: () => import('@/common/vue/menu-bar/MenuBar.vue'),
        children: [
            {
                path: '/monitorPanel',
                name: 'monitorPanel',
                redirect: '/dashBoard',
                meta: {},
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
                        path: '/invoice',
                        name: 'invoice',
                        // @ts-ignore
                        component: () => import('@/views/monitor/monitor-invoice/MonitorInvoice.vue')
                    },
                    // {
                    //     path: '/remote',
                    //     name: 'remote',
                    //     // @ts-ignore
                    //     component: () => import('@/views/monitor/monitor-remote/MonitorRemote.vue')
                    // },

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
                            },{
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
                path: '/mosaic',
                name: 'mosaic',
                component: () => import('@/views/service/mosaic/Mosaic.vue')
            },{
                path: '/namespace',
                name: 'namespace',
                redirect: '/namespaceList',
                component: () => import('@/views/service/namespace/Namespace.vue'),
                children: [
                    {
                        path: '/namespaceList',
                        name: 'Namespace_list',
                        component: () => import('@/views/service/namespace/namespace-function/namespace-list/NamespaceList.vue')
                    }, {
                        path: '/createNamespace',
                        name: 'Create_namespace',
                        component: () => import('@/views/service/namespace/namespace-function/root-namespace/RootNamespace.vue')
                    }, {
                        path: '/createSubNamespace',
                        name: 'Create_subNamespace',
                        component: () => import('@/views/service/namespace/namespace-function/sub-namespace/SubNamespace.vue')
                    },
                ]
            },{
                path: '/multisigApi',
                name: 'multisigApi',
                // @ts-ignore
                component: () => import('@/views/service/multisig/Multisig.vue')
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
            }, {
                path: '/createAccount',
                name: 'createAccount',
                component: () => import('@/views/login/create-account/CreateAccount.vue'),
            }, {
                path: '/initAccount',
                name: 'initAccount',
                component: () => import('@/views/login/init-account/InitAccount.vue'),
            }, {
                path: '/initSeed',
                name: 'initSeed',
                component: () => import('@/views/login/init-seed/InitSeed.vue'),
            },
        ]
    },
]


export default routers

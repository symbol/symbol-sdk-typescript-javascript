import {leftBarIcons} from '@/common/img/window'

const routers = [
    {
        path: '/',
        name: 'home',
        redirect: '/login',
        component: () => import('@/components/menu-bar/MenuBar.vue'),
        children: [
            {
                path: '/monitorPanel',
                name: 'monitorPanel',
                redirect: '/dashBoard',
                meta: {
                    clickable: true,
                    icon: leftBarIcons.windowDashboard,
                    activeIcon: leftBarIcons.windowDashboardActive,
                },
                component: () => import('@/views/monitor/Monitor.vue'),
                children: [
                    {
                        path: '/dashBoard',
                        name: 'dash_board',
                        // @ts-ignore
                        component: () => import('@/views/monitor/monitor-dashboard/MonitorDashBoard.vue')
                    }, {
                        path: '/transfer',
                        name: 'transfer',
                        // @ts-ignore
                        component: () => import('@/views/monitor/monitor-transfer/MonitorTransfer.vue')
                    }, {
                        path: '/invoice',
                        name: 'Invoice',
                        // @ts-ignore
                        component: () => import('@/views/monitor/monitor-invoice/MonitorInvoice.vue')
                    }, {
                        path: '/market',
                        name: 'market',
                        // @ts-ignore
                        component: () => import('@/views/monitor/monitor-market/MonitorMarket.vue')
                    },
                ]
            },
            {
                path: '/walletPanel',
                name: 'walletPanel',
                redirect: '/walletCreate',
                meta: {
                    clickable: true,
                    icon: leftBarIcons.windowWallet,
                    activeIcon: leftBarIcons.windowWalletActive,
                },
                // @ts-ignore
                component: () => import('@/views/wallet/Wallet.vue'),
                children: [
                    {
                        path: '/walletCreate',
                        name: 'walletCreate',
                        // @ts-ignore
                        component: () => import('@/views/wallet/wallet-functions/wallet-create/WalletCreate.vue')
                    }, {
                        path: '/walletCreated',
                        name: 'walletCreated',
                        // @ts-ignore
                        component: () => import('@/views/wallet/wallet-functions/wallet-created/WalletCreated.vue')
                    }, {
                        path: 'walletImport',
                        name: 'walletImport',
                        // @ts-ignore
                        component: () => import('@/views/wallet/wallet-functions/wallet-import/WalletImport.vue'),
                        children: [
                            {
                                path: '/walletImportKeystore',
                                name: 'walletImportKeystore',
                                // @ts-ignore
                                component: () => import('@/views/wallet/wallet-functions/wallet-import/wallet-import-keystore/WalletImportKeystore.vue'),
                            }, {
                                path: '/walletImportPrivatekey',
                                name: 'walletImportPrivatekey',
                                // @ts-ignore
                                component: () => import('@/views/wallet/wallet-functions/wallet-import/wallet-import-privatekey/WalletImportPrivatekey.vue'),
                            }
                        ]
                    },
                ]
            },
            {
                path: '/mosaic',
                name: 'mosaic',
                meta: {
                    clickable: true,
                    icon: leftBarIcons.windowMosaic,
                    activeIcon: leftBarIcons.windowMosaicActive,
                },
                component: () => import('@/views/mosaic/Mosaic.vue')
            },
            {
                path: '/namespace',
                name: 'namespace',
                meta: {
                    clickable: true,
                    icon: leftBarIcons.windowNamespace,
                    activeIcon: leftBarIcons.windowNamespaceActive,
                },
                redirect: '/namespaceList',
                component: () => import('@/views/namespace/Namespace.vue'),
                children: [
                    {
                        path: '/namespaceList',
                        name: 'Namespace_list',
                        component: () => import('@/views/namespace/namespace-function/namespace-list/NamespaceList.vue')
                    }, {
                        path: '/createNamespace',
                        name: 'Create_namespace',
                        component: () => import('@/views/namespace/namespace-function/root-namespace/RootNamespace.vue')
                    }, {
                        path: '/createSubNamespace',
                        name: 'Create_subNamespace',
                        component: () => import('@/views/namespace/namespace-function/sub-namespace/SubNamespace.vue')
                    },
                ]
            },
            {
                path: '/multisigApi',
                name: 'multisigApi',
                meta: {
                    clickable: true,
                    icon: leftBarIcons.windowMultisig,
                    activeIcon: leftBarIcons.windowMultisigActive,
                },
                redirect: '/multisigConversion',
                component: () => import('@/views/multisig/Multisig.vue'),
                children: [
                    {
                        path: '/multisigConversion',
                        name: 'multisigConversion',
                        component: () => import('@/views/multisig/MultisigConversion.vue')
                    }, {
                        path: '/multisigManagement',
                        name: 'multisigManagement',
                        component: () => import('@/views/multisig/MultisigModification.vue')
                    }, {
                        path: '/multisigMap',
                        name: 'multisigMap',
                        component: () => import('@/views/multisig/multisig-map/TopographicMap.vue')
                    }, {
                        path: '/multisigCosign',
                        name: 'multisigCosign',
                        component: () => import('@/views/multisig/multisig-cosign/MultisigCosign.vue')
                    },
                ]
            },
            {
                path: '/communityPanel',
                name: 'communityPanel',
                redirect: '/information',
                meta: {
                    clickable: true,
                    icon: leftBarIcons.windowCommunity,
                    activeIcon: leftBarIcons.windowCommunityActive,
                },
                // @ts-ignore
                component: () => import('@/views/community/Community.vue'),
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
                    clickable: true,
                    icon: leftBarIcons.windowSetting,
                    activeIcon: leftBarIcons.windowSettingActive,
                },
                component: () => import('@/views/setting/Setting.vue'),
                children: [
                    {
                        path: '/settingNormal',
                        name: 'settingNormal',
                        meta: {
                            title: 'general_settings',
                        },
                        component: () => import('@/views/setting/setting-normal/SettingNormal.vue')
                    }, {
                        path: '/settingPassword',
                        name: 'settingPassword',
                        meta: {
                            title: 'account_password',
                        },
                        component: () => import('@/views/setting/setting-password/SettingPassword.vue')
                    }, {
                        path: '/settingNetwork',
                        name: 'settingNetwork',
                        meta: {
                            disabled: true,
                            title: 'network_settings',
                        },
                        component: () => import('@/views/setting/setting-network/SettingNetwork.vue')
                    }, {
                        path: '/settingAbout',
                        name: 'settingAbout',
                        meta: {
                            title: 'about',
                        },
                        component: () => import('@/views/setting/setting-about/SettingAbout.vue')
                    },
                ]
            },
            {
                path: '/login',
                name: 'login',
                redirect: '/inputLock',
                meta: {clickable: false},
                component: () => import('@/views/login/login/Login.vue'),
                children: [
                    {
                        path: '/getStarted',
                        name: 'Get_started',
                        component: () => import('@/views/login/login/login-view/get-start/GetStart.vue')
                    }, {
                        path: '/inputLock',
                        name: 'Input_lock',
                        component: () => import('@/views/login/login/login-view/input-lock/InputLock.vue')
                    },
                ]
            },
            {
                path: '/createAccount',
                name: 'createAccount',
                meta: {clickable: false},
                component: () => import('@/views/login/create-account/CreateAccount.vue'),
            },
            {
                path: '/initAccount',
                name: 'initAccount',
                meta: {clickable: false},
                component: () => import('@/views/login/init-account/InitAccount.vue'),
            },
            {
                path: '/initSeed',
                name: 'initSeed',
                meta: {clickable: false},
                component: () => import('@/views/login/init-seed/InitSeed.vue'),
            },
        ]
    },
]


export default routers

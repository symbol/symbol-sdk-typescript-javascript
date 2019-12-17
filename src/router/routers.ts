import {leftBarIcons} from '@/common/img/window'
import {createStepImage,importStepImage} from '@/config/view/login'

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
                        name: 'dashBoard',
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
                redirect: '/mosaicList',
                meta: {
                    clickable: true,
                    icon: leftBarIcons.windowMosaic,
                    activeIcon: leftBarIcons.windowMosaicActive,
                },
                component: () => import('@/views/mosaic/Mosaic.vue'),
                children: [
                    {
                        path: '/mosaicList',
                        name: 'mosaicList',
                        component: () => import('@/views/mosaic/mosaic-list/MosaicList.vue')
                    }, {
                        path: '/createMosaic',
                        name: 'createMosaic',
                        component: () => import('@/components/forms/mosaic-creation/MosaicCreation.vue')
                    },
                ]
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
                        component: () => import('@/components/forms/create-root-namespace/CreateRootNamespace.vue')
                    }, {
                        path: '/createSubNamespace',
                        name: 'Create_subNamespace',
                        component: () => import('@/components/forms/create-sub-namespace/CreateSubNamespace.vue')
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
                    }
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
                        path: '/offlineSetting',
                        name: 'offlineSetting',
                        meta: {
                            title: 'offline_setting',
                        },
                        component: () => import('@/views/setting/offline-setting/OfflineSetting.vue')
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
                path: "/login",
                name: 'login',
                redirect: '/loginAccount',
                component: () => import('@/views/login/Login.vue'),
                meta: {},
                children: [
                    {
                        path: '/loginAccount',
                        name: 'loginAccount',
                        component: () => import('@/views/login/login-account/LoginAccount.vue'),
                    },
                    {
                        path: '/chooseImportWay',
                        name: 'chooseImportWay',
                        component: () => import('@/views/login/choose-import-way/ChooseImportWay.vue'),
                    },
                    {
                        path: '/createAccount',
                        name: 'createAccount',
                        redirect: '/CreateAccountInfo',
                        component: () => import('@/views/login/create-account/CreateAccount.vue'),
                        children: [
                            {
                                path: '/createAccountInfo',
                                name: 'createAccountInfo',
                                meta: {icon: createStepImage.createStepImage1},
                                component: () => import('@/views/login/create-account/create-account-info/CreateAccountInfo.vue'),
                            }, {
                                path: '/generateMnemonic',
                                name: 'generateMnemonic',
                                meta: {icon: createStepImage.createStepImage2},
                                component: () => import('@/views/login/create-account/generate-mnemonic/GenerateMnemonic.vue'),
                            }, {
                                path: '/showMnemonic',
                                name: 'showMnemonic',
                                meta: {icon: createStepImage.createStepImage3},
                                component: () => import('@/views/login/create-account/show-mnemonic/ShowMnemonic.vue'),
                            }, {
                                path: '/verifyMnemonic',
                                name: 'verifyMnemonic',
                                meta: {icon: createStepImage.createStepImage4},
                                component: () => import('@/views/login/create-account/verify-mnemonic/VerifyMnemonic.vue'),
                            }, {
                                path: '/finishCreate',
                                name: 'finishCreate',
                                meta: {icon: createStepImage.createStepImage5},
                                component: () => import('@/views/login/create-account/finish-create/FinishCreate.vue'),
                            }],
                    },
                    {
                        path: '/importAccount',
                        name: 'importAccount',
                        redirect: '/inputAccountInfo',
                        component: () => import('@/views/login/import-account/ImportAccount.vue'),
                        children: [{
                            path: '/inputAccountInfo',
                            name: 'inputAccountInfo',
                            meta: {icon: importStepImage.importStepImage1},
                            component: () => import('@/views/login/import-account/create-account-info/CreateAccountInfo.vue'),
                        }, {
                            path: '/importMnemonic',
                            name: 'importMnemonic',
                            meta: {icon: importStepImage.importStepImage2},
                            component: () => import('@/views/login/import-account/import-mnemonic/ImportMnemonic.vue'),
                        }, {
                            path: '/walletChoose',
                            name: 'walletChoose',
                            meta: {icon: importStepImage.importStepImage3},
                            component: () => import('@/views/login/import-account/wallet-choose/WalletChoose.vue'),
                        }, {
                            path: '/finishImport',
                            name: 'finishImport',
                            meta: {icon: importStepImage.importStepImage4},
                            component: () => import('@/views/login/import-account/finish-import/FinishImport.vue'),
                        }],
                    },
                ]
            }
        ]
    },
]


export default routers

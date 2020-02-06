/**
 * Copyright 2020 NEM Foundation (https://nem.io)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {createStepImage, importStepImage, leftBarIcons} from '@/views/resources/Images'
import {AppRoute} from './AppRoute'

export const routes: AppRoute[] = [
  {
    path: '/',
    name: 'home',
    meta: { protected: false },
    redirect: {name: 'accounts.login'},
    // @ts-ignore
    component: () => import('@/views/layout/PageLayout/PageLayout.vue'),
    /// region PageLayout children
    children: [
      {
        path: 'accounts',
        name: 'accounts',
        // @ts-ignore
        component: () => import('@/views/layout/RouterPage.vue'),
        meta: { protected: false },
        children: [
          {
            path: 'login',
            name: 'accounts.login',
            meta: { protected: false },
            // @ts-ignore
            component: () => import('@/views/accounts/LoginPage.vue'),
          },
          {
            path: 'create',
            name: 'accounts.importAccount.importStrategy',
            meta: { protected: false },
            // @ts-ignore
            component: () => import('@/views/accounts/import-account/import-strategy/ImportStrategy.vue'),
          },
          {
            path: 'create/new',
            name: 'accounts.createAccount',
            meta: { protected: false },
            // @ts-ignore
            component: () => import('@/views/accounts/create-account/CreateAccount.vue'),
            children: [
              {
                path: 'create/info',
                name: 'accounts.createAccount.info',
                meta: {
                  protected: false,
                  icon: createStepImage.createStepImage1,
                  nextPage:'accounts.createAccount.generateMnemonic',
                },
                // @ts-ignore
                component: () => import('@/views/forms/FormAccountCreation/FormAccountCreation.vue'),
              }, {
                path: 'create/generateMnemonic',
                name: 'accounts.createAccount.generateMnemonic',
                meta: {
                  protected: false,
                  icon: createStepImage.createStepImage2
                },
                // @ts-ignore
                component: () => import('@/views/accounts/create-account/generate-mnemonic/GenerateMnemonic.vue'),
              }, {
                path: 'create/showMnemonic',
                name: 'accounts.createAccount.showMnemonic',
                meta: {
                  protected: false,
                  icon: createStepImage.createStepImage3
                },
                // @ts-ignore
                component: () => import('@/views/accounts/create-account/show-mnemonic/ShowMnemonic.vue'),
              }, {
                path: 'create/verifyMnemonic',
                name: 'accounts.createAccount.verifyMnemonic',
                meta: {
                  protected: false,
                  icon: createStepImage.createStepImage4
                },
                // @ts-ignore
                component: () => import('@/views/accounts/create-account/verify-mnemonic/VerifyMnemonic.vue'),
              }, {
                path: 'create/finishCreate',
                name: 'accounts.createAccount.finalize',
                meta: {
                  protected: false,
                  icon: createStepImage.createStepImage5
                },
                // @ts-ignore
                component: () => import('@/views/accounts/create-account/finalize/Finalize.vue'),
              }],
          },
          {
            path: 'import',
            name: 'accounts.importAccount',
            meta: { protected: false },
            // @ts-ignore
            component: () => import('@/views/accounts/import-account/ImportAccount.vue'),
            children: [{
              path: 'import/inputAccountInfo',
              name: 'accounts.importAccount.info',
              meta: {
                protected: false,
                icon: importStepImage.importStepImage1,
                nextPage:'accounts.importAccount.importMnemonic',
              },
              // @ts-ignore
              component: () => import('@/views/forms/FormAccountCreation/FormAccountCreation.vue'),
            },{
              path: 'import/importMnemonic',
              name: 'accounts.importAccount.importMnemonic',
              meta: {
                protected: false,
                icon: importStepImage.importStepImage2
              },
              // @ts-ignore
              component: () => import('@/views/accounts/import-account/import-mnemonic/ImportMnemonic.vue'),
            }, {
              path: 'import/walletChoose',
              name: 'accounts.importAccount.walletSelection',
              meta: {
                protected: false,
                icon: importStepImage.importStepImage3
              },
              // @ts-ignore
              component: () => import('@/views/accounts/import-account/wallet-selection/WalletSelection.vue'),
            }, {
              path: 'import/finishImport',
              name: 'accounts.importAccount.finalize',
              meta: {
                protected: false,
                icon: importStepImage.importStepImage4
              },
              // @ts-ignore
              component: () => import('@/views/accounts/import-account/finalize/Finalize.vue'),
            }],
          },
        ],
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: {
          protected: true,
          clickable: true,
          icon: leftBarIcons.windowDashboard,
          activeIcon: leftBarIcons.windowDashboardActive,
        },
        redirect: '/home',
        // @ts-ignore
        component: () => import('@/views/dashboard/Dashboard.vue'),
        children: [
          {
            path: '/home',
            name: 'dashboard.index',
            meta: {
              protected: true,
              title: 'dashboard',
            },
            // @ts-ignore
            component: () => import('@/views/dashboard/home/DashboardHomePage.vue'),
          }, {
            path: '/transfer',
            name: 'dashboard.transfer',
            meta: {
              protected: true,
              title: 'transfer',
            },
            // @ts-ignore
            component: () => import('@/views/dashboard/transfer/DashboardTransferPage.vue'),
          }, {
            path: '/invoice',
            name: 'dashboard.invoice',
            meta: {
              protected: true,
              title: 'invoice',
            },
            // @ts-ignore
            component: () => import('@/views/dashboard/invoice/DashboardInvoicePage.vue'),
          }
        ],
      },
      {
        path: '/wallets',
        name: 'wallets',
        meta: {
          protected: true,
          clickable: true,
          icon: leftBarIcons.windowWallet,
          activeIcon: leftBarIcons.windowWalletActive,
        },
        // @ts-ignore
        component: () => import('@/views/wallets/Wallets.vue'),
      },
      /*
      
      {
        path: '/mosaic',
        name: 'mosaics',
        redirect: '/mosaicList',
        meta: {
          protected: true,
          clickable: true,
          icon: leftBarIcons.windowMosaic,
          activeIcon: leftBarIcons.windowMosaicActive,
        },
        // @ts-ignore
        component: () => import('@/views/mosaic/Mosaic.vue'),
        children: [
          {
            path: '/mosaicList',
            name: 'mosaics.index',
            meta: { protected: true},
            // @ts-ignore
            component: () => import('@/views/mosaic/mosaic-list/MosaicList.vue'),
          }, {
            path: '/createMosaic',
            name: 'mosaics.create',
            meta: { protected: true},
            // @ts-ignore
            component: () => import('@/components/forms/mosaic-creation/MosaicCreation.vue'),
          },
        ],
      },
      {
        path: '/namespace',
        name: 'namespaces',
        meta: {
          protected: true,
          clickable: true,
          icon: leftBarIcons.windowNamespace,
          activeIcon: leftBarIcons.windowNamespaceActive,
        },
        redirect: '/namespaceList',
        // @ts-ignore
        component: () => import('@/views/namespace/Namespace.vue'),
        children: [
          {
            path: '/namespaceList',
            name: 'namespaces.index',
            meta: { protected: true},
            // @ts-ignore
            component: () => import('@/views/namespace/namespace-function/namespace-list/NamespaceList.vue'),
          }, {
            path: '/createNamespace',
            name: 'namespaces.createRoot',
            meta: { protected: true},
            // @ts-ignore
            component: () => import('@/components/forms/create-root-namespace/CreateRootNamespace.vue'),
          }, {
            path: '/createSubNamespace',
            name: 'namespaces.createSub',
            meta: { protected: true},
            // @ts-ignore
            component: () => import('@/components/forms/create-sub-namespace/CreateSubNamespace.vue'),
          },
        ],
      },
      {
        path: '/multisigApi',
        name: 'multisig',
        meta: {
          protected: true,
          clickable: true,
          icon: leftBarIcons.windowMultisig,
          activeIcon: leftBarIcons.windowMultisigActive,
        },
        redirect: '/multisigConversion',
        // @ts-ignore
        component: () => import('@/views/multisig/Multisig.vue'),
        children: [
          {
            path: '/multisigConversion',
            name: 'multisig.convert',
            meta: { protected: true},
            // @ts-ignore
            component: () => import('@/views/multisig/MultisigConversion.vue'),
          }, {
            path: '/multisigManagement',
            name: 'multisig.manage',
            meta: { protected: true},
            // @ts-ignore
            component: () => import('@/views/multisig/MultisigModification.vue'),
          }, {
            path: '/multisigCosign',
            name: 'multisig.cosign',
            meta: { protected: true},
            // @ts-ignore
            component: () => import('@/views/multisig/multisig-cosign/MultisigCosign.vue'),
          },
        ],
      },
      */
      {
        path: '/communityPanel',
        name: 'community',
        redirect: '/information',
        meta: {
          protected: true,
          clickable: true,
          icon: leftBarIcons.windowCommunity,
          activeIcon: leftBarIcons.windowCommunityActive,
        },
        // @ts-ignore
        component: () => import('@/views/community/Community.vue'),
        children: [
          {
            path: '/information',
            name: 'community.index',
            meta: { protected: true},
            // @ts-ignore
            component: () => import('@/views/community/information/Information.vue'),
          },
        ],
      },
      {
        path: '/settingPanel',
        name: 'settings',
        redirect: '/generalSettings',
        meta: {
          protected: true,
          clickable: true,
          icon: leftBarIcons.windowSetting,
          activeIcon: leftBarIcons.windowSettingActive,
        },
        // @ts-ignore
        component: () => import('@/views/settings/Settings.vue'),
        /// region settings children
        children: [
          {
            path: '/generalSettings',
            name: 'general.settings',
            meta: {
              protected: true,
              title: 'general_settings',
            },
            // @ts-ignore
            component: () => import('@/views/settings/general-settings/GeneralSettings.vue'),
          },
          // {
          //   path: '/settingPassword',
          //   name: 'settings.password',
          //   meta: {
          //     protected: true,
          //     title: 'account_password',
          //   },
          //   // @ts-ignore
          //   component: () => import('@/views/setting/setting-password/SettingPassword.vue'),
          // },
          {
            path: '/about',
            name: 'settings.about',
            meta: {
              protected: true,
              title: 'about',
            },
            // @ts-ignore
            component: () => import('@/views/settings/about/About.vue'),
          },
        ],
        /// end-region settings children
      },
    ],
    /// end-region PageLayout children
  },
]

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
import {createStepImage, importStepImage} from '@/views/resources/Images'
import {AppRoute} from './AppRoute'
import i18n from '@/language'

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
        meta: {
          protected: false,
          hideFromMenu: true,
        },
        children: [
          {
            path: 'create',
            name: 'accounts.importAccount.importStrategy',
            meta: { protected: false },
            // @ts-ignore
            component: () => import('@/views/pages/accounts/import-account/import-strategy/ImportStrategy.vue'),
          },
          {
            path: 'create',
            name: 'accounts.createAccount',
            meta: { protected: false },
            // @ts-ignore
            component: () => import('@/views/pages/accounts/create-account/CreateAccount.vue'),
            children: [
              {
                path: 'info',
                name: 'accounts.createAccount.info',
                meta: {
                  protected: false,
                  icon: createStepImage.createStepImage1,
                  nextPage:'accounts.createAccount.generateMnemonic',
                },
                // @ts-ignore
                component: () => import('@/views/forms/FormAccountCreation/FormAccountCreation.vue'),
              }, {
                path: 'generateMnemonic',
                name: 'accounts.createAccount.generateMnemonic',
                meta: {
                  protected: false,
                  icon: createStepImage.createStepImage2
                },
                // @ts-ignore
                component: () => import('@/views/pages/accounts/create-account/generate-mnemonic/GenerateMnemonic.vue'),
              }, {
                path: 'showMnemonic',
                name: 'accounts.createAccount.showMnemonic',
                meta: {
                  protected: false,
                  icon: createStepImage.createStepImage3
                },
                // @ts-ignore
                component: () => import('@/views/pages/accounts/create-account/show-mnemonic/ShowMnemonic.vue'),
              }, {
                path: 'verifyMnemonic',
                name: 'accounts.createAccount.verifyMnemonic',
                meta: {
                  protected: false,
                  icon: createStepImage.createStepImage4
                },
                // @ts-ignore
                component: () => import('@/views/pages/accounts/create-account/verify-mnemonic/VerifyMnemonic.vue'),
              }, {
                path: 'finishCreate',
                name: 'accounts.createAccount.finalize',
                meta: {
                  protected: false,
                  icon: createStepImage.createStepImage5
                },
                // @ts-ignore
                component: () => import('@/views/pages/accounts/create-account/finalize/Finalize.vue'),
              }],
          },
          {
            path: 'import',
            name: 'accounts.importAccount',
            meta: { protected: false },
            // @ts-ignore
            component: () => import('@/views/pages/accounts/import-account/ImportAccount.vue'),
            children: [{
              path: 'inputAccountInfo',
              name: 'accounts.importAccount.info',
              meta: {
                protected: false,
                icon: importStepImage.importStepImage1,
                nextPage:'accounts.importAccount.importMnemonic',
              },
              // @ts-ignore
              component: () => import('@/views/forms/FormAccountCreation/FormAccountCreation.vue'),
            },{
              path: 'importMnemonic',
              name: 'accounts.importAccount.importMnemonic',
              meta: {
                protected: false,
                icon: importStepImage.importStepImage2
              },
              // @ts-ignore
              component: () => import('@/views/pages/accounts/import-account/import-mnemonic/ImportMnemonic.vue'),
            }, {
              path: 'walletChoose',
              name: 'accounts.importAccount.walletSelection',
              meta: {
                protected: false,
                icon: importStepImage.importStepImage3
              },
              // @ts-ignore
              component: () => import('@/views/pages/accounts/import-account/wallet-selection/WalletSelection.vue'),
            }, {
              path: 'finishImport',
              name: 'accounts.importAccount.finalize',
              meta: {
                protected: false,
                icon: importStepImage.importStepImage4
              },
              // @ts-ignore
              component: () => import('@/views/pages/accounts/import-account/finalize/Finalize.vue'),
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
          title: i18n.t('sidebar_item_home').toString(),
          icon: 'md-home',
        },
        redirect: '/home',
        // @ts-ignore
        component: () => import('@/views/pages/dashboard/Dashboard.vue'),
        children: [
          {
            path: '/home',
            name: 'dashboard.index',
            meta: {
              protected: true,
              title: i18n.t('page_title_dashboard').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/pages/dashboard/home/DashboardHomePage.vue'),
          }, {
            path: '/transfer',
            name: 'dashboard.transfer',
            meta: {
              protected: true,
              title: i18n.t('page_title_transfer').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/pages/dashboard/transfer/DashboardTransferPage.vue'),
          }, {
            path: '/invoice',
            name: 'dashboard.invoice',
            meta: {
              protected: true,
              title: i18n.t('page_title_invoice').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/pages/dashboard/invoice/DashboardInvoicePage.vue'),
          },
          {
            path: '/harvesting',
            name: 'dashboard.harvesting',
            meta: {
              protected: true,
              title: i18n.t('page_title_harvesting').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/pages/dashboard/harvesting/DashboardHarvestingPage.vue'),
          }
        ],
      },
      {
        path: '/wallets',
        name: 'wallets',
        redirect: '/wallets/details',
        meta: {
          protected: true,
          clickable: true,
          title: i18n.t('sidebar_item_wallets').toString(),
          icon: 'md-card',
        },
        // @ts-ignore
        component: () => import('@/views/pages/wallets/Wallets.vue'),
        children: [
          {
            path: 'details',
            name: 'wallet.details',
            meta: {
              protected: true,
              title: i18n.t('page_title_wallet_details').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/pages/wallets/WalletDetailsPage/WalletDetailsPage.vue'),
          },
          {
            path: 'backup',
            name: 'wallet.backup',
            meta: {
              protected: true,
              title: i18n.t('page_title_wallet_backup').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/pages/wallets/WalletBackupPage/WalletBackupPage.vue'),
          },
          {
            path: 'contracts',
            name: 'wallet.contracts',
            meta: {
              protected: true,
              title: i18n.t('page_title_wallet_actions').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/pages/wallets/WalletActionsPage/WalletActionsPage.vue'),
          },
        ],
      }, {
        path: '/mosaics',
        name: 'mosaics',
        redirect: '/mosaicList',
        meta: {
          protected: true,
          clickable: true,
          title: i18n.t('sidebar_item_mosaics').toString(),
          icon: 'md-apps',
        },
        // @ts-ignore
        component: () => import('@/views/pages/mosaics/MosaicsDashboardPage/MosaicsDashboardPage.vue'),
        children: [
          {
            path: '/mosaicList',
            name: 'mosaics.list',
            meta: {
              protected: true,
              title: i18n.t('page_title_mosaics').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/pages/mosaics/MosaicListPage/MosaicListPage.vue'),
          }, {
            path: '/createMosaic',
            name: 'mosaics.create',
            meta: {
              protected: true,
              title: i18n.t('page_title_mosaics_create').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/pages/mosaics/CreateMosaicPage/CreateMosaicPage.vue'),
          },
        ],
      },
      {
        path: '/namespaces',
        name: 'namespaces',
        meta: {
          protected: true,
          clickable: true,
          title: i18n.t('sidebar_item_namespaces').toString(),
          icon: 'md-text',
        },
        redirect: '/namespaceList',
        // @ts-ignore
        component: () => import('@/views/pages/namespaces/NamespacesDashboardPage/NamespacesDashboardPage.vue'),
        children: [
          {
            path: '/namespaceList',
            name: 'namespaces.list',
            meta: {
              protected: true,
              title: i18n.t('page_title_namespaces').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/pages/namespaces/NamespaceListPage/NamespaceListPage.vue'),
          },
          {
            path: '/createNamespace',
            name: 'namespaces.createRootNamespace',
            meta: {
              protected: true,
              title: i18n.t('page_title_namespaces_create').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/pages/namespaces/CreateNamespacePage/CreateNamespacePage.vue'),
          },
        ],
      }, {
        path: '/multisig',
        name: 'multisig',
        meta: {
          protected: true,
          clickable: true,
          title: i18n.t('sidebar_item_multisig').toString(),
          icon: 'md-contacts',
        },
        redirect: '/multisigConversion',
        // @ts-ignore
        component: () => import('@/views/pages/multisig/MultisigDashboardPage/MultisigDashboardPage.vue'),
        children: [
          {
            path: '/multisigConversion',
            name: 'multisig.conversion',
            meta: {
              protected: true,
              title: i18n.t('page_title_multisig_convert').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/pages/multisig/ConvertAccountPage/ConvertAccountPage.vue'),
          }, {
            path: '/multisigManagement',
            name: 'multisig.management',
            meta: {
              protected: true,
              title: i18n.t('page_title_multisig_manage').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/pages/multisig/ManageAccountPage/ManageAccountPage.vue'),
          }, {
            path: '/multisigCosign',
            name: 'multisig.cosign',
            meta: {
              protected: true,
              title: i18n.t('page_title_multisig_cosign').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/pages/multisig/PartialTransactionDashboardPage/PartialTransactionDashboardPage.vue'),
          },
        ],
      }, {
        path: '/communityPanel',
        name: 'community',
        redirect: '/information',
        meta: {
          protected: true,
          clickable: true,
          title: i18n.t('sidebar_item_community').toString(),
          icon: 'md-chatbubbles',
        },
        // @ts-ignore
        component: () => import('@/views/pages/community/Community.vue'),
        children: [
          {
            path: '/information',
            name: 'community.index',
            meta: { protected: true},
            // @ts-ignore
            component: () => import('@/views/pages/community/information/Information.vue'),
          },
        ],
      },
      {
        path: '/settings',
        name: 'settings',
        redirect: '/settings/general',
        meta: {
          protected: true,
          clickable: true,
          title: i18n.t('sidebar_item_settings').toString(),
          icon: 'md-settings',
        },
        // @ts-ignore
        component: () => import('@/views/pages/settings/Settings.vue'),
        /// region settings children
        children: [
          {
            path: 'general',
            name: 'settings.general',
            meta: {
              protected: true,
              title: i18n.t('page_title_settings_general').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/forms/FormGeneralSettings/FormGeneralSettings.vue'),
          },
          {
            path: 'password-reset',
            name: 'settings.password',
            meta: {
              protected: true,
              title: i18n.t('page_title_settings_password').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/forms/FormAccountPasswordUpdate/FormAccountPasswordUpdate.vue'),
          },
          {
            path: 'about',
            name: 'settings.about',
            meta: {
              protected: true,
              title: i18n.t('page_title_settings_about').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/pages/settings/AboutPage/AboutPage.vue'),
          },
          {
            path: 'diagnostic',
            name: 'settings.diagnostic',
            meta: {
              protected: true,
              title: i18n.t('page_title_settings_diagnostic').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/pages/settings/DiagnosticPage/DiagnosticPage.vue'),
          },
        ],
        /// end-region settings children
      },
    ],
    /// end-region PageLayout children
  }, {
    path: '/login',
    name: 'accounts.login',
    meta: { protected: false },
    // @ts-ignore
    component: () => import('@/views/pages/accounts/LoginPage.vue'),
  },
]

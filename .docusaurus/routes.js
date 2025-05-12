import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', '466'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/',
    component: ComponentCreator('/', '00f'),
    routes: [
      {
        path: '/next',
        component: ComponentCreator('/next', 'c5f'),
        routes: [
          {
            path: '/next',
            component: ComponentCreator('/next', 'e78'),
            routes: [
              {
                path: '/next/architecture/architecture-diagram',
                component: ComponentCreator('/next/architecture/architecture-diagram', 'e12'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/dashboard/',
                component: ComponentCreator('/next/dashboard/', 'ecd'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/dashboard/accesscontrolrights',
                component: ComponentCreator('/next/dashboard/accesscontrolrights', '6be'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/dashboard/apifunctionssamples',
                component: ComponentCreator('/next/dashboard/apifunctionssamples', '0a4'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/dashboard/azureADSetup',
                component: ComponentCreator('/next/dashboard/azureADSetup', 'a78'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/dashboard/custom-resumeresubmit',
                component: ComponentCreator('/next/dashboard/custom-resumeresubmit', '334'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/dashboard/datafactoryreceiver',
                component: ComponentCreator('/next/dashboard/datafactoryreceiver', 'ef5'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/dashboard/editflows',
                component: ComponentCreator('/next/dashboard/editflows', '3ba'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/dashboard/executiontree',
                component: ComponentCreator('/next/dashboard/executiontree', 'ebf'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/dashboard/flowauditing',
                component: ComponentCreator('/next/dashboard/flowauditing', 'b81'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/dashboard/flowdatatimetolive',
                component: ComponentCreator('/next/dashboard/flowdatatimetolive', '8db'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/dashboard/foldermanagement',
                component: ComponentCreator('/next/dashboard/foldermanagement', '27f'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/dashboard/foldersflows',
                component: ComponentCreator('/next/dashboard/foldersflows', '000'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/dashboard/forgotpassword',
                component: ComponentCreator('/next/dashboard/forgotpassword', '1e2'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/dashboard/groupmanagement',
                component: ComponentCreator('/next/dashboard/groupmanagement', '346'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/dashboard/home',
                component: ComponentCreator('/next/dashboard/home', '3c2'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/dashboard/importjob',
                component: ComponentCreator('/next/dashboard/importjob', 'd18'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/dashboard/importjobreceivers',
                component: ComponentCreator('/next/dashboard/importjobreceivers', '307'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/dashboard/installation/dashboard-buildpipeline',
                component: ComponentCreator('/next/dashboard/installation/dashboard-buildpipeline', 'b3d'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/dashboard/installation/dashboard-installation',
                component: ComponentCreator('/next/dashboard/installation/dashboard-installation', '326'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/dashboard/installation/dashboard-migration',
                component: ComponentCreator('/next/dashboard/installation/dashboard-migration', '581'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/dashboard/installation/dashboard-releasepipeline',
                component: ComponentCreator('/next/dashboard/installation/dashboard-releasepipeline', 'fcf'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/dashboard/installation/dashboard-vnet',
                component: ComponentCreator('/next/dashboard/installation/dashboard-vnet', 'd00'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/dashboard/messagehandling',
                component: ComponentCreator('/next/dashboard/messagehandling', 'b03'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/dashboard/role-management',
                component: ComponentCreator('/next/dashboard/role-management', 'a15'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/dashboard/search',
                component: ComponentCreator('/next/dashboard/search', 'dda'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/dashboard/settings',
                component: ComponentCreator('/next/dashboard/settings', '9df'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/dashboard/setup',
                component: ComponentCreator('/next/dashboard/setup', '415'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/dashboard/support/faq',
                component: ComponentCreator('/next/dashboard/support/faq', 'ef2'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/dashboard/usermanagement',
                component: ComponentCreator('/next/dashboard/usermanagement', 'be0'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/framework/',
                component: ComponentCreator('/next/framework/', 'cda'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/framework/components/exceptionHandler',
                component: ComponentCreator('/next/framework/components/exceptionHandler', 'cc2'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/framework/components/matrix',
                component: ComponentCreator('/next/framework/components/matrix', '62d'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/framework/components/matrix-basic',
                component: ComponentCreator('/next/framework/components/matrix-basic', '35e'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/framework/components/matrix-promote',
                component: ComponentCreator('/next/framework/components/matrix-promote', '420'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/framework/components/pubsub',
                component: ComponentCreator('/next/framework/components/pubsub', 'c38'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/framework/components/pubsubV2',
                component: ComponentCreator('/next/framework/components/pubsubV2', 'ec8'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/framework/components/regextranslation',
                component: ComponentCreator('/next/framework/components/regextranslation', 'a34'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/framework/components/sequencecontroller',
                component: ComponentCreator('/next/framework/components/sequencecontroller', '5a5'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/framework/components/timesequencer',
                component: ComponentCreator('/next/framework/components/timesequencer', 'ab3'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/framework/components/transco',
                component: ComponentCreator('/next/framework/components/transco', 'eb4'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/framework/components/transco-assemblies',
                component: ComponentCreator('/next/framework/components/transco-assemblies', '90d'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/framework/components/transco-extraction',
                component: ComponentCreator('/next/framework/components/transco-extraction', '794'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/framework/components/transcoV2',
                component: ComponentCreator('/next/framework/components/transcoV2', '606'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/framework/components/transcoV2-Example',
                component: ComponentCreator('/next/framework/components/transcoV2-Example', 'f6b'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/framework/components/transcoV2-Matrix',
                component: ComponentCreator('/next/framework/components/transcoV2-Matrix', '5ce'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/framework/components/xmljsonconverter',
                component: ComponentCreator('/next/framework/components/xmljsonconverter', '0ec'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/framework/components/xsd-validator',
                component: ComponentCreator('/next/framework/components/xsd-validator', '7e6'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/framework/datafactorydiagnostics',
                component: ComponentCreator('/next/framework/datafactorydiagnostics', '1b7'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/framework/installation/framework-buildpipeline',
                component: ComponentCreator('/next/framework/installation/framework-buildpipeline', '753'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/framework/installation/framework-installation',
                component: ComponentCreator('/next/framework/installation/framework-installation', 'a3b'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/framework/installation/framework-migration',
                component: ComponentCreator('/next/framework/installation/framework-migration', '66f'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/framework/installation/framework-releasepipeline',
                component: ComponentCreator('/next/framework/installation/framework-releasepipeline', 'db3'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/framework/installation/framework-vnet',
                component: ComponentCreator('/next/framework/installation/framework-vnet', '212'),
                exact: true,
                sidebar: "sidebar"
              },
              {
                path: '/next/framework/logicappsdiagnostics',
                component: ComponentCreator('/next/framework/logicappsdiagnostics', '231'),
                exact: true,
                sidebar: "sidebar"
              }
            ]
          }
        ]
      },
      {
        path: '/',
        component: ComponentCreator('/', '4fc'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', '1e6'),
            routes: [
              {
                path: '/architecture/architecture-diagram',
                component: ComponentCreator('/architecture/architecture-diagram', 'caf'),
                exact: true
              },
              {
                path: '/dashboard/',
                component: ComponentCreator('/dashboard/', 'a00'),
                exact: true
              },
              {
                path: '/dashboard/accesscontrolrights',
                component: ComponentCreator('/dashboard/accesscontrolrights', '7e6'),
                exact: true
              },
              {
                path: '/dashboard/apifunctionssamples',
                component: ComponentCreator('/dashboard/apifunctionssamples', 'cbd'),
                exact: true
              },
              {
                path: '/dashboard/azureADSetup',
                component: ComponentCreator('/dashboard/azureADSetup', 'cae'),
                exact: true
              },
              {
                path: '/dashboard/custom-resumeresubmit',
                component: ComponentCreator('/dashboard/custom-resumeresubmit', '915'),
                exact: true
              },
              {
                path: '/dashboard/datafactoryreceiver',
                component: ComponentCreator('/dashboard/datafactoryreceiver', 'ba3'),
                exact: true
              },
              {
                path: '/dashboard/editflows',
                component: ComponentCreator('/dashboard/editflows', 'c63'),
                exact: true
              },
              {
                path: '/dashboard/executiontree',
                component: ComponentCreator('/dashboard/executiontree', '419'),
                exact: true
              },
              {
                path: '/dashboard/flowauditing',
                component: ComponentCreator('/dashboard/flowauditing', 'b13'),
                exact: true
              },
              {
                path: '/dashboard/flowdatatimetolive',
                component: ComponentCreator('/dashboard/flowdatatimetolive', 'ec0'),
                exact: true
              },
              {
                path: '/dashboard/foldermanagement',
                component: ComponentCreator('/dashboard/foldermanagement', 'b02'),
                exact: true
              },
              {
                path: '/dashboard/foldersflows',
                component: ComponentCreator('/dashboard/foldersflows', 'c84'),
                exact: true
              },
              {
                path: '/dashboard/forgotpassword',
                component: ComponentCreator('/dashboard/forgotpassword', 'da4'),
                exact: true
              },
              {
                path: '/dashboard/groupmanagement',
                component: ComponentCreator('/dashboard/groupmanagement', 'c09'),
                exact: true
              },
              {
                path: '/dashboard/home',
                component: ComponentCreator('/dashboard/home', '954'),
                exact: true
              },
              {
                path: '/dashboard/importjob',
                component: ComponentCreator('/dashboard/importjob', '1fe'),
                exact: true
              },
              {
                path: '/dashboard/importjobreceivers',
                component: ComponentCreator('/dashboard/importjobreceivers', 'a5d'),
                exact: true
              },
              {
                path: '/dashboard/installation/dashboard-buildpipeline',
                component: ComponentCreator('/dashboard/installation/dashboard-buildpipeline', '68d'),
                exact: true
              },
              {
                path: '/dashboard/installation/dashboard-installation',
                component: ComponentCreator('/dashboard/installation/dashboard-installation', '5b4'),
                exact: true
              },
              {
                path: '/dashboard/installation/dashboard-migration',
                component: ComponentCreator('/dashboard/installation/dashboard-migration', '182'),
                exact: true
              },
              {
                path: '/dashboard/installation/dashboard-releasepipeline',
                component: ComponentCreator('/dashboard/installation/dashboard-releasepipeline', 'df7'),
                exact: true
              },
              {
                path: '/dashboard/installation/dashboard-vnet',
                component: ComponentCreator('/dashboard/installation/dashboard-vnet', '57a'),
                exact: true
              },
              {
                path: '/dashboard/messagehandling',
                component: ComponentCreator('/dashboard/messagehandling', '646'),
                exact: true
              },
              {
                path: '/dashboard/role-management',
                component: ComponentCreator('/dashboard/role-management', '22a'),
                exact: true
              },
              {
                path: '/dashboard/search',
                component: ComponentCreator('/dashboard/search', 'b26'),
                exact: true
              },
              {
                path: '/dashboard/settings',
                component: ComponentCreator('/dashboard/settings', '676'),
                exact: true
              },
              {
                path: '/dashboard/setup',
                component: ComponentCreator('/dashboard/setup', '368'),
                exact: true
              },
              {
                path: '/dashboard/support/faq',
                component: ComponentCreator('/dashboard/support/faq', '4fb'),
                exact: true
              },
              {
                path: '/dashboard/usermanagement',
                component: ComponentCreator('/dashboard/usermanagement', '89f'),
                exact: true
              },
              {
                path: '/framework/',
                component: ComponentCreator('/framework/', 'f8d'),
                exact: true
              },
              {
                path: '/framework/components/exceptionHandler',
                component: ComponentCreator('/framework/components/exceptionHandler', 'e3e'),
                exact: true
              },
              {
                path: '/framework/components/matrix',
                component: ComponentCreator('/framework/components/matrix', 'e91'),
                exact: true
              },
              {
                path: '/framework/components/matrix-basic',
                component: ComponentCreator('/framework/components/matrix-basic', 'b0b'),
                exact: true
              },
              {
                path: '/framework/components/matrix-promote',
                component: ComponentCreator('/framework/components/matrix-promote', '3ab'),
                exact: true
              },
              {
                path: '/framework/components/pubsub',
                component: ComponentCreator('/framework/components/pubsub', '5f9'),
                exact: true
              },
              {
                path: '/framework/components/pubsubV2',
                component: ComponentCreator('/framework/components/pubsubV2', '5c7'),
                exact: true
              },
              {
                path: '/framework/components/regextranslation',
                component: ComponentCreator('/framework/components/regextranslation', '7ac'),
                exact: true
              },
              {
                path: '/framework/components/sequencecontroller',
                component: ComponentCreator('/framework/components/sequencecontroller', 'ff8'),
                exact: true
              },
              {
                path: '/framework/components/timesequencer',
                component: ComponentCreator('/framework/components/timesequencer', '2de'),
                exact: true
              },
              {
                path: '/framework/components/transco',
                component: ComponentCreator('/framework/components/transco', 'ee7'),
                exact: true
              },
              {
                path: '/framework/components/transco-assemblies',
                component: ComponentCreator('/framework/components/transco-assemblies', 'e22'),
                exact: true
              },
              {
                path: '/framework/components/transco-extraction',
                component: ComponentCreator('/framework/components/transco-extraction', 'f6e'),
                exact: true
              },
              {
                path: '/framework/components/transcoV2',
                component: ComponentCreator('/framework/components/transcoV2', 'dfa'),
                exact: true
              },
              {
                path: '/framework/components/transcoV2-Example',
                component: ComponentCreator('/framework/components/transcoV2-Example', '63c'),
                exact: true
              },
              {
                path: '/framework/components/transcoV2-Matrix',
                component: ComponentCreator('/framework/components/transcoV2-Matrix', '638'),
                exact: true
              },
              {
                path: '/framework/components/xmljsonconverter',
                component: ComponentCreator('/framework/components/xmljsonconverter', '8de'),
                exact: true
              },
              {
                path: '/framework/components/xsd-validator',
                component: ComponentCreator('/framework/components/xsd-validator', '170'),
                exact: true
              },
              {
                path: '/framework/datafactorydiagnostics',
                component: ComponentCreator('/framework/datafactorydiagnostics', '112'),
                exact: true
              },
              {
                path: '/framework/installation/framework-buildpipeline',
                component: ComponentCreator('/framework/installation/framework-buildpipeline', '4a1'),
                exact: true
              },
              {
                path: '/framework/installation/framework-installation',
                component: ComponentCreator('/framework/installation/framework-installation', '735'),
                exact: true
              },
              {
                path: '/framework/installation/framework-migration',
                component: ComponentCreator('/framework/installation/framework-migration', '1db'),
                exact: true
              },
              {
                path: '/framework/installation/framework-releasepipeline',
                component: ComponentCreator('/framework/installation/framework-releasepipeline', '661'),
                exact: true
              },
              {
                path: '/framework/installation/framework-vnet',
                component: ComponentCreator('/framework/installation/framework-vnet', '01b'),
                exact: true
              },
              {
                path: '/framework/logicappsdiagnostics',
                component: ComponentCreator('/framework/logicappsdiagnostics', '7c9'),
                exact: true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];

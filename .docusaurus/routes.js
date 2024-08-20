import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/watsonx-vmware/markdown-page',
    component: ComponentCreator('/watsonx-vmware/markdown-page', '1f8'),
    exact: true
  },
  {
    path: '/watsonx-vmware/',
    component: ComponentCreator('/watsonx-vmware/', 'f63'),
    routes: [
      {
        path: '/watsonx-vmware/',
        component: ComponentCreator('/watsonx-vmware/', '42c'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/watsonx-vmware/install-cpd-watsonxai-deployer',
        component: ComponentCreator('/watsonx-vmware/install-cpd-watsonxai-deployer', '1db'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/watsonx-vmware/install-cpd-watsonxai-manually',
        component: ComponentCreator('/watsonx-vmware/install-cpd-watsonxai-manually', '0ca'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/watsonx-vmware/install-rag',
        component: ComponentCreator('/watsonx-vmware/install-rag', 'a35'),
        exact: true
      },
      {
        path: '/watsonx-vmware/k8s-storage-tests',
        component: ComponentCreator('/watsonx-vmware/k8s-storage-tests', '0b2'),
        exact: true,
        sidebar: "tutorialSidebar"
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];

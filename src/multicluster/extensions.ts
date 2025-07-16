import { EncodedExtension } from '@openshift/dynamic-plugin-sdk-webpack';
import { FeatureFlag, RoutePage, StandaloneRoutePage } from '@openshift-console/dynamic-plugin-sdk';
import type { ConsolePluginBuildMetadata } from '@openshift-console/dynamic-plugin-sdk-webpack';
import { ResourceRoute } from '@stolostron/multicluster-sdk';

export const exposedModules: ConsolePluginBuildMetadata['exposedModules'] = {
  acmFlags: './multicluster/flags.ts',
  ConsoleStandAlone: './utils/components/Consoles/ConsoleStandAlone.tsx',
  Navigator: './views/virtualmachines/navigator/VirtualMachineNavigator.tsx',
  urls: './multicluster/urls.ts',
  VirtualMachineSearchResults: './views/virtualmachines/search/VirtualMachineSearchResults.tsx',
};

export const extensions: EncodedExtension[] = [
  {
    flags: {
      required: ['KUBEVIRT_DYNAMIC_ACM'],
    },
    properties: {
      component: { $codeRef: 'ConsoleStandAlone' },
      exact: false,
      path: ['/multicloud/infrastructure/vmconsole/:cluster/:namespace/:name'],
    },
    type: 'console.page/route/standalone',
  } as EncodedExtension<StandaloneRoutePage>,

  {
    flags: {
      required: ['KUBEVIRT_DYNAMIC_ACM'],
    },
    properties: {
      component: {
        $codeRef: 'Navigator',
      },
      path: [
        '/multicloud/infrastructure/virtualmachines/:cluster/:ns/:name',
        '/multicloud/infrastructure/virtualmachines/:cluster/:ns',
        '/multicloud/infrastructure/virtualmachines/:cluster',
        '/multicloud/infrastructure/virtualmachines',
      ],
    },
    type: 'console.page/route',
  },
  {
    properties: {
      component: { $codeRef: 'VirtualMachineSearchResults' },
      path: ['/multicloud/infrastructure/virtualmachines/search'],
    },
    type: 'console.page/route',
  } as EncodedExtension<RoutePage>,
  {
    properties: {
      handler: { $codeRef: 'acmFlags.enableKubevirtDynamicACMFlag' },
    },
    type: 'console.flag',
  } as EncodedExtension<FeatureFlag>,
  {
    properties: {
      handler: { $codeRef: 'urls.getFleetResourceRoute' },
      model: {
        group: 'kubevirt.io',
        kind: 'VirtualMachine',
      },
    },
    type: 'acm.resource/route',
  } as EncodedExtension<ResourceRoute>,
  {
    properties: {
      handler: { $codeRef: 'urls.getFleetResourceRoute' },
      model: {
        group: 'kubevirt.io',
        kind: 'VirtualMachineInstance',
      },
    },
    type: 'acm.resource/route',
  } as EncodedExtension<ResourceRoute>,
];

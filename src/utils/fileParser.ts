import { UploadPreview, OntologyClass, OntologyProperty } from '../types/ontology';

// Mock function to simulate parsing ontology files
export const parseOntologyFile = async (file: File): Promise<UploadPreview> => {
  // Simulate file reading delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const fileName = file.name.toLowerCase();
  
  // Generate different mock data based on file extension
  if (fileName.endsWith('.owl') || fileName.endsWith('.rdf')) {
    return parseOWLFile(file);
  } else if (fileName.endsWith('.ttl')) {
    return parseTurtleFile(file);
  } else {
    return parseGenericFile(file);
  }
};

const parseOWLFile = (file: File): UploadPreview => {
  return {
    classes: [
      // Core system classes
      {
        id: 'controller',
        name: 'Controller',
        description: 'Main system controller',
        properties: ['controls', 'managedBy'],
        type: 'tbox',
        position: { x: 300, y: 350 }
      },
      {
        id: 'pod',
        name: 'Pod',
        description: 'Container pod',
        properties: ['discoveredPod', 'consumesConfig', 'selectsPod'],
        type: 'tbox',
        position: { x: 50, y: 550 }
      },
      {
        id: 'namespace',
        name: 'Namespace',
        description: 'Kubernetes namespace',
        properties: [],
        type: 'tbox',
        position: { x: 200, y: 850 }
      },
      {
        id: 'service',
        name: 'Service',
        description: 'Kubernetes service',
        properties: ['exposesService'],
        type: 'tbox',
        position: { x: 400, y: 700 }
      },
      {
        id: 'endpoint-slice',
        name: 'EndpointSlice',
        description: 'Network endpoint slice',
        properties: [],
        type: 'tbox',
        position: { x: 300, y: 600 }
      },
      {
        id: 'config-map',
        name: 'ConfigMap',
        description: 'Configuration map',
        properties: [],
        type: 'tbox',
        position: { x: 350, y: 650 }
      },
      // Additional nodes from the image
      {
        id: 'cronJob',
        name: 'CronJob',
        description: 'Scheduled job',
        properties: [],
        type: 'tbox',
        position: { x: 100, y: 100 }
      },
      {
        id: 'daemon-set',
        name: 'DaemonSet',
        description: 'Daemon set',
        properties: [],
        type: 'tbox',
        position: { x: 250, y: 50 }
      },
      {
        id: 'job',
        name: 'Job',
        description: 'Kubernetes job',
        properties: [],
        type: 'tbox',
        position: { x: 350, y: 50 }
      },
      {
        id: 'replica-set',
        name: 'ReplicaSet',
        description: 'Replica set controller',
        properties: [],
        type: 'tbox',
        position: { x: 500, y: 100 }
      },
      {
        id: 'stateful-set',
        name: 'StatefulSet',
        description: 'Stateful set controller',
        properties: [],
        type: 'tbox',
        position: { x: 550, y: 200 }
      },
      {
        id: 'deployment',
        name: 'Deployment',
        description: 'Application deployment',
        properties: ['usesStrategy'],
        type: 'tbox',
        position: { x: 700, y: 400 }
      },
      {
        id: 'deployment-strategy',
        name: 'DeploymentStrategy',
        description: 'Deployment strategy configuration',
        properties: [],
        type: 'tbox',
        position: { x: 950, y: 600 }
      },
      {
        id: 'recreate',
        name: 'Recreate',
        description: 'Recreate deployment strategy',
        properties: [],
        type: 'tbox',
        position: { x: 1200, y: 450 }
      },
      {
        id: 'rolling-update',
        name: 'RollingUpdate',
        description: 'Rolling update strategy',
        properties: [],
        type: 'tbox',
        position: { x: 1050, y: 850 }
      },
      {
        id: 'canary',
        name: 'Canary',
        description: 'Canary deployment strategy',
        properties: [],
        type: 'tbox',
        position: { x: 1150, y: 800 }
      },
      {
        id: 'blue-green',
        name: 'BlueGreen',
        description: 'Blue-green deployment strategy',
        properties: [],
        type: 'tbox',
        position: { x: 1200, y: 700 }
      }
    ],
    properties: [
      {
        id: 'controls',
        name: 'controls',
        description: 'Controls relationship',
        domain: 'controller',
        range: 'pod',
        type: 'tbox'
      },
      {
        id: 'managedBy',
        name: 'managedBy',
        description: 'Managed by relationship',
        domain: 'pod',
        range: 'controller',
        type: 'tbox'
      },
      {
        id: 'discoveredPod',
        name: 'discoveredPod',
        description: 'Pod discovery relationship',
        domain: 'controller',
        range: 'pod',
        type: 'tbox'
      },
      {
        id: 'consumesConfig',
        name: 'consumesConfig',
        description: 'Configuration consumption',
        domain: 'pod',
        range: 'config-map',
        type: 'tbox'
      },
      {
        id: 'selectsPod',
        name: 'selectsPod',
        description: 'Pod selection relationship',
        domain: 'endpoint-slice',
        range: 'pod',
        type: 'tbox'
      },
      {
        id: 'exposesService',
        name: 'exposesService',
        description: 'Service exposure relationship',
        domain: 'namespace',
        range: 'service',
        type: 'tbox'
      },
      {
        id: 'usesStrategy',
        name: 'usesStrategy',
        description: 'Deployment strategy usage',
        domain: 'deployment',
        range: 'deployment-strategy',
        type: 'tbox'
      }
    ],
    instances: [],
    relations: [
      // Core controller relationships
      {
        id: 'rel-controller-cronJob',
        sourceId: 'controller',
        targetId: 'cronJob',
        propertyId: 'controls',
        type: 'tbox'
      },
      {
        id: 'rel-controller-daemonset',
        sourceId: 'controller',
        targetId: 'daemon-set',
        propertyId: 'controls',
        type: 'tbox'
      },
      {
        id: 'rel-controller-job',
        sourceId: 'controller',
        targetId: 'job',
        propertyId: 'controls',
        type: 'tbox'
      },
      {
        id: 'rel-controller-replicaset',
        sourceId: 'controller',
        targetId: 'replica-set',
        propertyId: 'controls',
        type: 'tbox'
      },
      {
        id: 'rel-controller-statefulset',
        sourceId: 'controller',
        targetId: 'stateful-set',
        propertyId: 'controls',
        type: 'tbox'
      },
      {
        id: 'rel-controller-pod',
        sourceId: 'controller',
        targetId: 'pod',
        propertyId: 'controls',
        type: 'tbox'
      },
      {
        id: 'rel-controller-deployment',
        sourceId: 'controller',
        targetId: 'deployment',
        propertyId: 'controls',
        type: 'tbox'
      },
      // Pod relationships
      {
        id: 'rel-pod-endpointslice',
        sourceId: 'pod',
        targetId: 'endpoint-slice',
        propertyId: 'selectsPod',
        type: 'tbox'
      },
      {
        id: 'rel-pod-configmap',
        sourceId: 'pod',
        targetId: 'config-map',
        propertyId: 'consumesConfig',
        type: 'tbox'
      },
      {
        id: 'rel-pod-service',
        sourceId: 'pod',
        targetId: 'service',
        propertyId: 'exposesService',
        type: 'tbox'
      },
      {
        id: 'rel-pod-namespace',
        sourceId: 'pod',
        targetId: 'namespace',
        propertyId: 'exposesService',
        type: 'tbox'
      },
      // Deployment strategy relationships
      {
        id: 'rel-deployment-strategy',
        sourceId: 'deployment',
        targetId: 'deployment-strategy',
        propertyId: 'usesStrategy',
        type: 'tbox'
      },
      {
        id: 'rel-strategy-recreate',
        sourceId: 'deployment-strategy',
        targetId: 'recreate',
        propertyId: 'inheritance',
        type: 'tbox'
      },
      {
        id: 'rel-strategy-rollingupdate',
        sourceId: 'deployment-strategy',
        targetId: 'rolling-update',
        propertyId: 'inheritance',
        type: 'tbox'
      },
      {
        id: 'rel-strategy-canary',
        sourceId: 'deployment-strategy',
        targetId: 'canary',
        propertyId: 'inheritance',
        type: 'tbox'
      },
      {
        id: 'rel-strategy-bluegreen',
        sourceId: 'deployment-strategy',
        targetId: 'blue-green',
        propertyId: 'inheritance',
        type: 'tbox'
      }
    ]
  };
};

const parseTurtleFile = (file: File): UploadPreview => {
  // A-Box data (instances only) - to be added to existing T-Box
  return {
    classes: [], // No new classes, only instances
    properties: [], // No new properties  
    instances: [
      {
        id: 'instance-web-controller',
        name: 'WebController-001',
        classId: 'controller',
        properties: {
          name: 'WebController-001',
          namespace: 'production',
          replicas: 3
        },
        type: 'abox',
        position: { x: 300, y: 450 }
      },
      {
        id: 'instance-api-pod-1',
        name: 'api-pod-1',
        classId: 'pod',
        properties: {
          name: 'api-pod-1',
          status: 'Running',
          restartCount: 0,
          cpu: '200m',
          memory: '512Mi'
        },
        type: 'abox',
        position: { x: 150, y: 650 }
      },
      {
        id: 'instance-api-pod-2',
        name: 'api-pod-2',
        classId: 'pod',
        properties: {
          name: 'api-pod-2',
          status: 'Running',
          restartCount: 1,
          cpu: '180m',
          memory: '480Mi'
        },
        type: 'abox',
        position: { x: 250, y: 650 }
      },
      {
        id: 'instance-api-pod-3',
        name: 'api-pod-3',
        classId: 'pod',
        properties: {
          name: 'api-pod-3',
          status: 'Pending',
          restartCount: 0,
          cpu: '0m',
          memory: '0Mi'
        },
        type: 'abox',
        position: { x: 350, y: 650 }
      },
      {
        id: 'instance-web-service',
        name: 'web-service',
        classId: 'service',
        properties: {
          name: 'web-service',
          port: 80,
          targetPort: 8080,
          serviceType: 'LoadBalancer'
        },
        type: 'abox',
        position: { x: 400, y: 800 }
      },
      {
        id: 'instance-prod-namespace',
        name: 'production',
        classId: 'namespace',
        properties: {
          name: 'production',
          createdAt: '2024-01-15',
          resourceQuota: 'high'
        },
        type: 'abox',
        position: { x: 200, y: 950 }
      },
      {
        id: 'instance-web-deployment',
        name: 'web-deployment',
        classId: 'deployment',
        properties: {
          name: 'web-deployment',
          replicas: 3,
          image: 'nginx:1.21'
        },
        type: 'abox',
        position: { x: 700, y: 500 }
      },
      {
        id: 'instance-rolling-strategy',
        name: 'rolling-strategy',
        classId: 'rolling-update',
        properties: {
          maxUnavailable: '25%',
          maxSurge: '25%',
          progressDeadlineSeconds: 600
        },
        type: 'abox',
        position: { x: 1150, y: 950 }
      }
    ],
    relations: [
      {
        id: 'rel-instance-controller-pod1',
        sourceId: 'instance-web-controller',
        targetId: 'instance-api-pod-1',
        propertyId: 'controls',
        type: 'abox'
      },
      {
        id: 'rel-instance-controller-pod2',
        sourceId: 'instance-web-controller',
        targetId: 'instance-api-pod-2',
        propertyId: 'controls',
        type: 'abox'
      },
      {
        id: 'rel-instance-controller-pod3',
        sourceId: 'instance-web-controller',
        targetId: 'instance-api-pod-3',
        propertyId: 'controls',
        type: 'abox'
      },
      {
        id: 'rel-instance-deployment-strategy',
        sourceId: 'instance-web-deployment',
        targetId: 'instance-rolling-strategy',
        propertyId: 'usesStrategy',
        type: 'abox'
      },
      {
        id: 'rel-instance-service-namespace',
        sourceId: 'instance-web-service',
        targetId: 'instance-prod-namespace',
        propertyId: 'exposesService',
        type: 'abox'
      }
    ]
  };
};

const parseGenericFile = (file: File): UploadPreview => {
  return {
    classes: [
      {
        id: 'imported-concept',
        name: 'Concept',
        description: 'A general concept from imported file',
        properties: ['concept-label'],
        type: 'tbox',
        position: { x: 200, y: 150 }
      }
    ],
    properties: [
      {
        id: 'concept-label',
        name: 'label',
        description: 'Human-readable label',
        domain: 'imported-concept',
        range: 'string',
        type: 'tbox'
      }
    ],
    instances: [],
    relations: []
  };
};

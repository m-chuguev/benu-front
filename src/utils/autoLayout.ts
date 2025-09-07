import { Node } from 'reactflow';

// Simple auto-layout algorithm for better node positioning
export const autoLayoutNodes = (nodes: Node[]): Node[] => {
  if (nodes.length === 0) return nodes;

  const HORIZONTAL_SPACING = 250;
  const VERTICAL_SPACING = 200;
  const COLS = Math.ceil(Math.sqrt(nodes.length));

  return nodes.map((node, index) => {
    // If node already has a reasonable position, keep it
    if (node.position.x > 0 || node.position.y > 0) {
      return node;
    }

    // Auto-position nodes in a grid
    const col = index % COLS;
    const row = Math.floor(index / COLS);

    return {
      ...node,
      position: {
        x: 100 + col * HORIZONTAL_SPACING,
        y: 100 + row * VERTICAL_SPACING,
      },
    };
  });
};

// Hierarchical layout for inheritance relationships
export const hierarchicalLayout = (nodes: Node[], edges: any[]): Node[] => {
  console.log('AutoLayout input:', { nodes: nodes.length, edges: edges.length, edges });
  
  // Find inheritance relationships
  const inheritanceEdges = edges.filter(
    edge => edge.label === 'inherits' || edge.id.includes('inheritance')
  );

  console.log('Found inheritance edges:', inheritanceEdges);

  if (inheritanceEdges.length === 0) {
    console.log('No inheritance edges, using auto layout');
    return autoLayoutNodes(nodes);
  }

  // Build hierarchy tree
  const children: { [key: string]: string[] } = {};
  const parents: { [key: string]: string } = {};

  inheritanceEdges.forEach(edge => {
    if (!children[edge.target]) children[edge.target] = [];
    children[edge.target].push(edge.source);
    parents[edge.source] = edge.target;
  });

  // Find root nodes (no parents)
  const rootNodes = nodes.filter(node => !parents[node.id]);
  
  // Position nodes hierarchically
  const positioned = new Set<string>();
  const result = [...nodes];

  const positionHierarchy = (nodeId: string, x: number, y: number, level: number) => {
    if (positioned.has(nodeId)) return x;

    const nodeIndex = result.findIndex(n => n.id === nodeId);
    if (nodeIndex === -1) return x;

    result[nodeIndex] = {
      ...result[nodeIndex],
      position: { x, y: y + level * 150 }
    };
    positioned.add(nodeId);

    // Position children
    const childNodes = children[nodeId] || [];
    let currentX = x - (childNodes.length - 1) * 125;

    childNodes.forEach(childId => {
      currentX = positionHierarchy(childId, currentX, y, level + 1);
      currentX += 250;
    });

    return x + 250;
  };

  // Position each root hierarchy
  let currentX = 100;
  rootNodes.forEach(root => {
    currentX = positionHierarchy(root.id, currentX, 50, 0);
    currentX += 100; // Space between hierarchies
  });

  // Position remaining nodes that aren't in hierarchies
  const unpositioned = result.filter(node => !positioned.has(node.id));
  return [...result.filter(node => positioned.has(node.id)), ...autoLayoutNodes(unpositioned)];
};

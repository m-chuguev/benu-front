export interface LayoutNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'class' | 'instance';
  boxType: 'tbox' | 'abox';
  fixed?: boolean;
}

export interface LayoutEdge {
  source: string;
  target: string;
  type: 'inheritance' | 'relation';
}

export interface LayoutConfig {
  nodeSpacing: number;
  levelSpacing: number;
  groupSpacing: number;
  canvasWidth: number;
  canvasHeight: number;
  iterations: number;
  repulsionStrength: number;
  attractionStrength: number;
}

const DEFAULT_CONFIG: LayoutConfig = {
  nodeSpacing: 150,      // Минимальное расстояние между узлами
  levelSpacing: 200,     // Расстояние между уровнями иерархии
  groupSpacing: 100,     // Расстояние между группами T-Box/A-Box
  canvasWidth: 1200,
  canvasHeight: 800,
  iterations: 100,       // Количество итераций для force-directed
  repulsionStrength: 1000,
  attractionStrength: 0.1
};

export class GraphLayoutEngine {
  private config: LayoutConfig;
  private nodes: Map<string, LayoutNode> = new Map();
  private edges: LayoutEdge[] = [];

  constructor(config: Partial<LayoutConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  public layoutNodes(nodes: LayoutNode[], edges: LayoutEdge[]): LayoutNode[] {
    this.nodes.clear();
    this.edges = edges;
    
    // Инициализация узлов
    nodes.forEach(node => {
      this.nodes.set(node.id, { ...node });
    });

    // Применяем разные алгоритмы компоновки
    this.applyHierarchicalLayout();
    this.applyForceDirectedLayout();
    this.preventOverlaps();
    this.centerGraph();

    return Array.from(this.nodes.values());
  }

  private applyHierarchicalLayout() {
    const tboxNodes = Array.from(this.nodes.values()).filter(n => n.boxType === 'tbox');
    const aboxNodes = Array.from(this.nodes.values()).filter(n => n.boxType === 'abox');

    // Размещаем T-Box узлы в верхней части
    this.layoutTBoxHierarchy(tboxNodes);
    
    // Размещаем A-Box узлы в нижней части
    this.layoutABoxNodes(aboxNodes);
  }

  private layoutTBoxHierarchy(nodes: LayoutNode[]) {
    // Находим корневые классы (без родителей)
    const inheritanceEdges = this.edges.filter(e => e.type === 'inheritance');
    const childNodes = new Set(inheritanceEdges.map(e => e.source));
    const rootNodes = nodes.filter(n => !childNodes.has(n.id));
    
    // Строим дерево наследования
    const levels = this.buildInheritanceLevels(nodes, inheritanceEdges);
    
    // Размещаем по уровням
    levels.forEach((levelNodes, level) => {
      const y = 100 + level * this.config.levelSpacing;
      const totalWidth = levelNodes.length * this.config.nodeSpacing;
      const startX = (this.config.canvasWidth - totalWidth) / 2;
      
      levelNodes.forEach((node, index) => {
        const layoutNode = this.nodes.get(node.id);
        if (layoutNode) {
          layoutNode.x = startX + index * this.config.nodeSpacing;
          layoutNode.y = y;
        }
      });
    });
  }

  private buildInheritanceLevels(nodes: LayoutNode[], inheritanceEdges: LayoutEdge[]): LayoutNode[][] {
    const levels: LayoutNode[][] = [];
    const visited = new Set<string>();
    const childToParent = new Map<string, string>();
    
    // Строим карту наследования
    inheritanceEdges.forEach(edge => {
      childToParent.set(edge.source, edge.target);
    });
    
    // Находим корневые узлы
    const rootNodes = nodes.filter(n => !childToParent.has(n.id));
    
    // BFS для построения уровней
    let currentLevel = rootNodes;
    
    while (currentLevel.length > 0) {
      levels.push([...currentLevel]);
      currentLevel.forEach(node => visited.add(node.id));
      
      // Находим детей текущего уровня
      const nextLevel: LayoutNode[] = [];
      currentLevel.forEach(parent => {
        inheritanceEdges
          .filter(edge => edge.target === parent.id && !visited.has(edge.source))
          .forEach(edge => {
            const childNode = nodes.find(n => n.id === edge.source);
            if (childNode) {
              nextLevel.push(childNode);
            }
          });
      });
      
      currentLevel = nextLevel;
    }
    
    // Добавляем оставшиеся узлы
    const remaining = nodes.filter(n => !visited.has(n.id));
    if (remaining.length > 0) {
      levels.push(remaining);
    }
    
    return levels;
  }

  private layoutABoxNodes(nodes: LayoutNode[]) {
    // Группируем экземпляры по классам
    const instancesByClass = new Map<string, LayoutNode[]>();
    
    nodes.forEach(instance => {
      // Находим связанный класс через отношения
      const classRelation = this.edges.find(e => 
        e.source === instance.id && e.type === 'relation'
      );
      
      if (classRelation) {
        const classId = classRelation.target;
        if (!instancesByClass.has(classId)) {
          instancesByClass.set(classId, []);
        }
        instancesByClass.get(classId)!.push(instance);
      }
    });

    // Размещаем экземпляры под их классами
    instancesByClass.forEach((instances, classId) => {
      const classNode = this.nodes.get(classId);
      if (classNode) {
        const baseY = classNode.y + this.config.levelSpacing;
        const totalWidth = instances.length * this.config.nodeSpacing;
        const startX = classNode.x - totalWidth / 2;
        
        instances.forEach((instance, index) => {
          const layoutNode = this.nodes.get(instance.id);
          if (layoutNode) {
            layoutNode.x = startX + index * this.config.nodeSpacing;
            layoutNode.y = baseY;
          }
        });
      }
    });

    // Размещаем несвязанные экземпляры
    const unplacedInstances = nodes.filter(n => {
      const layoutNode = this.nodes.get(n.id);
      return layoutNode && (layoutNode.x === n.x && layoutNode.y === n.y);
    });

    if (unplacedInstances.length > 0) {
      const y = this.config.canvasHeight - 200;
      const totalWidth = unplacedInstances.length * this.config.nodeSpacing;
      const startX = (this.config.canvasWidth - totalWidth) / 2;
      
      unplacedInstances.forEach((instance, index) => {
        const layoutNode = this.nodes.get(instance.id);
        if (layoutNode) {
          layoutNode.x = startX + index * this.config.nodeSpacing;
          layoutNode.y = y;
        }
      });
    }
  }

  private applyForceDirectedLayout() {
    // Применяем force-directed алгоритм для финальной настройки
    for (let i = 0; i < this.config.iterations; i++) {
      this.applyRepulsionForces();
      this.applyAttractionForces();
      this.dampVelocities();
    }
  }

  private applyRepulsionForces() {
    const nodes = Array.from(this.nodes.values());
    
    nodes.forEach(nodeA => {
      let fx = 0, fy = 0;
      
      nodes.forEach(nodeB => {
        if (nodeA.id === nodeB.id) return;
        
        const dx = nodeA.x - nodeB.x;
        const dy = nodeA.y - nodeB.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.config.nodeSpacing) {
          const force = this.config.repulsionStrength / (distance * distance);
          fx += (dx / distance) * force;
          fy += (dy / distance) * force;
        }
      });
      
      nodeA.x += fx * 0.01;
      nodeA.y += fy * 0.01;
    });
  }

  private applyAttractionForces() {
    this.edges.forEach(edge => {
      const sourceNode = this.nodes.get(edge.source);
      const targetNode = this.nodes.get(edge.target);
      
      if (sourceNode && targetNode) {
        const dx = targetNode.x - sourceNode.x;
        const dy = targetNode.y - sourceNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const force = this.config.attractionStrength * distance;
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;
        
        sourceNode.x += fx * 0.01;
        sourceNode.y -= fy * 0.01;
        targetNode.x -= fx * 0.01;
        targetNode.y += fy * 0.01;
      }
    });
  }

  private dampVelocities() {
    // Применяем затухание для стабилизации
    this.nodes.forEach(node => {
      node.x *= 0.99;
      node.y *= 0.99;
    });
  }

  private preventOverlaps() {
    const nodes = Array.from(this.nodes.values());
    
    // Простой алгоритм предотвращения пересечений
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const nodeA = nodes[i];
        const nodeB = nodes[j];
        
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const minDistance = Math.max(nodeA.width, nodeA.height) + 
                           Math.max(nodeB.width, nodeB.height) + 20;
        
        if (distance < minDistance) {
          const overlap = minDistance - distance;
          const moveX = (dx / distance) * overlap * 0.5;
          const moveY = (dy / distance) * overlap * 0.5;
          
          nodeA.x -= moveX;
          nodeA.y -= moveY;
          nodeB.x += moveX;
          nodeB.y += moveY;
        }
      }
    }
  }

  private centerGraph() {
    const nodes = Array.from(this.nodes.values());
    if (nodes.length === 0) return;
    
    // Находим границы графа
    const minX = Math.min(...nodes.map(n => n.x));
    const maxX = Math.max(...nodes.map(n => n.x));
    const minY = Math.min(...nodes.map(n => n.y));
    const maxY = Math.max(...nodes.map(n => n.y));
    
    // Центрируем граф
    const graphWidth = maxX - minX;
    const graphHeight = maxY - minY;
    const offsetX = (this.config.canvasWidth - graphWidth) / 2 - minX;
    const offsetY = (this.config.canvasHeight - graphHeight) / 2 - minY;
    
    nodes.forEach(node => {
      node.x += offsetX;
      node.y += offsetY;
      
      // Ограничиваем границами canvas
      node.x = Math.max(node.width / 2, Math.min(this.config.canvasWidth - node.width / 2, node.x));
      node.y = Math.max(node.height / 2, Math.min(this.config.canvasHeight - node.height / 2, node.y));
    });
  }
}

export function autoLayoutGraph(
  nodes: LayoutNode[], 
  edges: LayoutEdge[], 
  config?: Partial<LayoutConfig>
): LayoutNode[] {
  const engine = new GraphLayoutEngine(config);
  return engine.layoutNodes(nodes, edges);
}
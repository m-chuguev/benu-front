import { BarChart3, Network, Database, GitBranch, Calendar } from 'lucide-react';
import {GraphDto} from "../../api";

interface StatsPanelProps {
  graphData: GraphDto | null;
}

export default function StatsPanel({ graphData }: StatsPanelProps) {
  const stats = [
    {
      label: 'Classes',
      value: graphData?.nodes.filter(n => n.kind === 'CLASS').length ?? 0,
      icon: BarChart3,
      color: 'bg-gray-500',
      description: 'T-Box concepts'
    },
    {
      label: 'Object Properties',
      value: graphData?.edges.length ?? 0,
      icon: GitBranch,
      color: 'bg-teal-500',
      description: 'Relations & attributes'
    },
    {
      label: 'Relations',
      value: graphData?.nodes.length ?? 0,
      icon: Network,
      color: 'bg-orange-500',
      description: 'Graph connections'
    },
    {
      label: 'Instances',
      value: graphData?.nodes.filter(n => n.kind === 'INDIVIDUAL').length ?? 0,
      icon: Database,
      color: 'bg-blue-500',
      description: 'A-Box data points'
    },
    {
      label: 'Timeline',
      value: null,
      icon: Calendar,
      color: 'bg-purple-500',
      description: 'Project dates',
      customContent: (
        <div className="text-xs text-gray-600 space-y-1">
          <div>Updated ...</div>
          <div>Created ...</div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="grid grid-cols-5 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:shadow-sm hover:border-gray-300 transition-all">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <IconComponent size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  {stat.customContent ? (
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">{stat.label}</div>
                      {stat.customContent}
                    </div>
                  ) : (
                    <div>
                      <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm font-medium text-gray-700">{stat.label}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
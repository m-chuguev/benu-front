import React from 'react';
import { Database, Zap, Network, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const features = [
    {
      icon: <Network className="w-6 h-6 text-blue-600" />,
      title: "Visual Ontology Builder",
      description: "Create knowledge graphs with an intuitive drag-and-drop interface"
    },
    {
      icon: <Database className="w-6 h-6 text-green-600" />,
      title: "Import & Export",
      description: "Support for OWL, RDF, TTL and other standard ontology formats"
    },
    {
      icon: <Zap className="w-6 h-6 text-purple-600" />,
      title: "AI-Powered Assistance",
      description: "Get intelligent suggestions for classes, properties and relationships"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Header */}
        <div className="mb-12">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Database size={40} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-blue-600">OpenOntology</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            The modern platform for creating, managing, and visualizing knowledge graphs and ontologies. 
            Start building your semantic data models today.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <button
            onClick={onGetStarted}
            className="inline-flex items-center space-x-3 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span>Get Started</span>
            <ArrowRight size={20} />
          </button>
          <p className="text-sm text-gray-500">
            No account required • Start building immediately
          </p>
        </div>

        {/* Bottom note */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-400">
            Built for researchers, developers, and knowledge engineers
          </p>
        </div>
      </div>
    </div>
  );
}

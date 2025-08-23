import React from 'react';
import { X, CheckCircle, AlertTriangle, XCircle, ExternalLink } from 'lucide-react';

interface ValidationResult {
  type: 'pass' | 'warning' | 'error';
  message: string;
  nodeId?: string;
  propertyId?: string;
}

interface ValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToNode?: (nodeId: string) => void;
}

export default function ValidationModal({ isOpen, onClose, onNavigateToNode }: ValidationModalProps) {
  if (!isOpen) return null;

  // Mock validation results
  const results: ValidationResult[] = [
    { type: 'pass', message: 'All class definitions are valid' },
    { type: 'pass', message: 'Property domains and ranges are consistent' },
    { type: 'warning', message: 'Instance "John Doe" missing required property "hasEmail"', nodeId: 'i2' },
    { type: 'error', message: 'Property "hasAge" has invalid range for instance "Dr. Jane Smith"', nodeId: 'i1', propertyId: 'p8' },
    { type: 'pass', message: 'All inheritance relationships are valid' }
  ];

  const passCount = results.filter(r => r.type === 'pass').length;
  const warningCount = results.filter(r => r.type === 'warning').length;
  const errorCount = results.filter(r => r.type === 'error').length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'pass': return <CheckCircle size={16} className="text-green-600" />;
      case 'warning': return <AlertTriangle size={16} className="text-amber-600" />;
      case 'error': return <XCircle size={16} className="text-red-600" />;
      default: return null;
    }
  };

  const getResultColor = (type: string) => {
    switch (type) {
      case 'pass': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-amber-50 border-amber-200';
      case 'error': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">SHACL Validation Results</h2>
            <p className="text-sm text-gray-600 mt-1">Ontology consistency check completed</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Summary */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{passCount}</div>
              <div className="text-sm text-gray-600">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{warningCount}</div>
              <div className="text-sm text-gray-600">Warnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{errorCount}</div>
              <div className="text-sm text-gray-600">Errors</div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
          {results.map((result, index) => (
            <div key={index} className={`p-4 rounded-lg border ${getResultColor(result.type)}`}>
              <div className="flex items-start space-x-3">
                {getIcon(result.type)}
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{result.message}</p>
                  {result.nodeId && (
                    <button
                      onClick={() => {
                        onNavigateToNode?.(result.nodeId!);
                        onClose();
                      }}
                      className="mt-2 flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <ExternalLink size={12} />
                      <span>Navigate to node</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { X, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

interface UpdateOntologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function UpdateOntologyModal({ isOpen, onClose, onConfirm }: UpdateOntologyModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsUpdating(true);
    
    // Simulate update process
    setTimeout(() => {
      setIsUpdating(false);
      setIsComplete(true);
      onConfirm();
      
      // Auto close after showing success
      setTimeout(() => {
        setIsComplete(false);
        onClose();
      }, 2000);
    }, 2000);
  };

  const handleClose = () => {
    if (!isUpdating) {
      setIsComplete(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Update Ontology</h2>
          {!isUpdating && (
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {!isUpdating && !isComplete && (
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle size={20} className="text-amber-600 mt-0.5" />
                <div>
                  <div className="font-medium text-amber-800">Confirm Update</div>
                  <div className="text-sm text-amber-700 mt-1">
                    This will merge all applied changes into the T-Box ontology. This action cannot be undone.
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <p className="mb-2">Changes to be applied:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-500">
                  <li>3 new classes added</li>
                  <li>5 new properties defined</li>
                  <li>2 class relationships updated</li>
                </ul>
              </div>
            </div>
          )}

          {isUpdating && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <RefreshCw size={32} className="text-blue-600 animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Updating Ontology...</h3>
              <p className="text-sm text-gray-600">
                Merging changes into T-Box structure
              </p>
              <div className="w-48 bg-gray-200 rounded-full h-2 mx-auto mt-4">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
              </div>
            </div>
          )}

          {isComplete && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Update Complete!</h3>
              <p className="text-sm text-gray-600">
                Ontology has been successfully updated with all changes.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isUpdating && !isComplete && (
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
            >
              Confirm Update
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
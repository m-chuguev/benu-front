import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle, FileText, Database } from 'lucide-react';
import { UploadPreview, ApprovedSections } from '../../types/ontology';

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  preview: UploadPreview | null;
  fileName: string;
  onApprove: (preview: UploadPreview, approvedSections: ApprovedSections) => void;
}



export default function FilePreviewModal({
  isOpen,
  onClose,
  preview,
  fileName,
  onApprove
}: FilePreviewModalProps) {
  const [approvedSections, setApprovedSections] = useState<ApprovedSections>({
    classes: true,
    properties: true,
    instances: false // По умолчанию instances не импортируем для T-Box
  });

  const [editedPreview, setEditedPreview] = useState<UploadPreview | null>(preview);

  // Update editedPreview when preview changes
  useEffect(() => {
    setEditedPreview(preview);
  }, [preview]);

  if (!isOpen || !preview) return null;

  const handleSectionToggle = (section: keyof ApprovedSections) => {
    setApprovedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleApprove = () => {
    if (editedPreview || preview) {
      onApprove(editedPreview || preview!, approvedSections);
    }
  };

  const totalItems = preview.classes.length + preview.properties.length + preview.instances.length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Review Import Preview
              </h2>
              <p className="text-sm text-gray-500">
                {fileName} • {totalItems} items found
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Import Sections */}
          <div className="space-y-6">
            
            {/* Classes Section */}
            <div className="border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={approvedSections.classes}
                    onChange={() => handleSectionToggle('classes')}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300"
                  />
                  <Database size={16} className="text-gray-600" />
                  <h3 className="font-medium text-gray-900">
                    Classes ({preview.classes.length})
                  </h3>
                </div>
                <span className="text-sm text-blue-600 font-medium">T-Box</span>
              </div>
              
              {approvedSections.classes && (
                <div className="p-4 space-y-3">
                  {preview.classes.map((cls, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{cls.name}</div>
                        {cls.description && (
                          <div className="text-sm text-gray-500">{cls.description}</div>
                        )}
                        <div className="text-xs text-gray-400 mt-1">
                          Properties: {cls.properties.length}
                        </div>
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        ✓ Include
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Properties Section */}
            <div className="border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={approvedSections.properties}
                    onChange={() => handleSectionToggle('properties')}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300"
                  />
                  <Database size={16} className="text-gray-600" />
                  <h3 className="font-medium text-gray-900">
                    Properties ({preview.properties.length})
                  </h3>
                </div>
                <span className="text-sm text-blue-600 font-medium">T-Box</span>
              </div>
              
              {approvedSections.properties && (
                <div className="p-4 space-y-3">
                  {preview.properties.map((prop, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{prop.name}</div>
                        {prop.description && (
                          <div className="text-sm text-gray-500">{prop.description}</div>
                        )}
                        <div className="text-xs text-gray-400 mt-1">
                          Domain: {prop.domain} → Range: {prop.range}
                        </div>
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        ✓ Include
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Instances Section */}
            {preview.instances.length > 0 && (
              <div className="border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={approvedSections.instances}
                      onChange={() => handleSectionToggle('instances')}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300"
                    />
                    <Database size={16} className="text-gray-600" />
                    <h3 className="font-medium text-gray-900">
                      Instances ({preview.instances.length})
                    </h3>
                  </div>
                  <span className="text-sm text-orange-600 font-medium">A-Box</span>
                </div>
                
                {approvedSections.instances && (
                  <div className="p-4 space-y-3">
                    {preview.instances.map((instance, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{instance.name}</div>
                          <div className="text-sm text-gray-500">
                            Instance of: {instance.classId}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Properties: {Object.keys(instance.properties).length}
                          </div>
                        </div>
                        <div className="text-sm text-green-600 font-medium">
                          ✓ Include
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Warning */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">Review before import</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Please review all items carefully. You can uncheck sections you don't want to import.
                  For T-Box imports, we recommend importing classes and properties but reviewing instances separately.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 bg-gray-50 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            {Object.values(approvedSections).filter(Boolean).length} of 3 sections selected
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApprove}
              disabled={!Object.values(approvedSections).some(Boolean)}
              className="inline-flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Check size={16} />
              <span>Import Selected</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

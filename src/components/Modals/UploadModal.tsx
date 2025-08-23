import React, { useState } from 'react';
import { X, Upload, FileUp, Check, AlertCircle } from 'lucide-react';
import { UploadPreview } from '../../types/ontology';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (preview: UploadPreview) => void;
  type: 'abox' | 'ontology';
}

export default function UploadModal({ isOpen, onClose, onApprove, type }: UploadModalProps) {
  const [step, setStep] = useState<'upload' | 'preview'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<UploadPreview | null>(null);

  if (!isOpen) return null;

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    // Simulate file processing and preview generation
    setTimeout(() => {
      const mockPreview: UploadPreview = {
        classes: type === 'ontology' ? [
          {
            id: 'new-c1',
            name: 'Vehicle',
            description: 'Transportation device',
            properties: [],
            type: 'tbox',
            position: { x: 150, y: 150 }
          },
          {
            id: 'new-c2',
            name: 'Car',
            description: 'Four-wheeled vehicle',
            properties: [],
            parentClass: 'new-c1',
            type: 'tbox',
            position: { x: 250, y: 250 }
          }
        ] : [],
        properties: type === 'ontology' ? [
          {
            id: 'new-p1',
            name: 'hasModel',
            description: 'Vehicle model',
            domain: 'new-c2',
            range: 'string',
            type: 'tbox'
          }
        ] : [],
        instances: type === 'abox' ? [
          {
            id: 'new-i1',
            name: 'My Toyota Camry',
            classId: 'c2',
            properties: {
              hasModel: 'Camry',
              hasYear: 2023
            },
            type: 'abox',
            position: { x: 300, y: 350 }
          },
          {
            id: 'new-i2',
            name: 'Honda Civic',
            classId: 'c2',
            properties: {
              hasModel: 'Civic',
              hasYear: 2022
            },
            type: 'abox',
            position: { x: 400, y: 350 }
          }
        ] : [],
        relations: [
          {
            id: 'new-r1',
            sourceId: type === 'ontology' ? 'new-c2' : 'new-i1',
            targetId: type === 'ontology' ? 'new-c1' : 'new-i2',
            propertyId: type === 'ontology' ? 'inheritance' : 'new-p1',
            type: type === 'ontology' ? 'tbox' : 'abox'
          }
        ]
      };
      setPreview(mockPreview);
      setStep('preview');
    }, 1500);
  };

  const handleApprove = () => {
    if (preview) {
      onApprove(preview);
      handleClose();
    }
  };

  const handleClose = () => {
    setStep('upload');
    setFile(null);
    setPreview(null);
    onClose();
  };

  const getTitle = () => {
    return type === 'abox' ? 'Upload A-Box Data' : 'Update Ontology';
  };

  const getDescription = () => {
    return type === 'abox' 
      ? 'Upload instance data to add to your knowledge graph'
      : 'Upload ontology files to update the T-Box structure';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{getTitle()}</h2>
            <p className="text-sm text-gray-600 mt-1">{getDescription()}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'upload' && (
            <div className="space-y-6">
              {!file ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept=".owl,.rdf,.ttl,.json,.csv"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0];
                      if (selectedFile) handleFileSelect(selectedFile);
                    }}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Drop your file here, or click to browse
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports OWL, RDF, TTL, JSON, CSV files up to 10MB
                    </p>
                  </label>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileUp size={24} className="text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Processing file...</h3>
                  <p className="text-sm text-gray-600">
                    Analyzing {file.name} and extracting {type} data
                  </p>
                  <div className="w-48 bg-gray-200 rounded-full h-2 mx-auto mt-4">
                    <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'preview' && preview && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-green-600 mb-4">
                <Check size={20} />
                <h3 className="font-semibold">File processed successfully</h3>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Detected Content</h4>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{preview.classes.length}</div>
                    <div className="text-gray-600">Classes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-600">{preview.properties.length}</div>
                    <div className="text-gray-600">Properties</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{preview.relations.length}</div>
                    <div className="text-gray-600">Relations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{preview.instances.length}</div>
                    <div className="text-gray-600">Instances</div>
                  </div>
                </div>
              </div>

              {/* Preview Lists */}
              <div className="max-h-96 overflow-y-auto space-y-4">
                {preview.classes.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      Classes ({preview.classes.length})
                    </h4>
                    <div className="space-y-2">
                      {preview.classes.map(cls => (
                        <div key={cls.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div>
                            <div className="font-medium text-gray-900">{cls.name}</div>
                            <div className="text-sm text-gray-600">{cls.description}</div>
                          </div>
                          <div className="text-xs bg-gray-100 px-2 py-1 rounded">{cls.type.toUpperCase()}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {preview.instances.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                      Instances ({preview.instances.length})
                    </h4>
                    <div className="space-y-2">
                      {preview.instances.map(instance => (
                        <div key={instance.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div>
                            <div className="font-medium text-gray-900">{instance.name}</div>
                            <div className="text-sm text-gray-600">
                              {Object.keys(instance.properties).length} properties
                            </div>
                          </div>
                          <div className="text-xs bg-blue-100 px-2 py-1 rounded text-blue-700">
                            {instance.classId}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Warning */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle size={20} className="text-amber-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-amber-800">Review before approval</div>
                    <div className="text-sm text-amber-700 mt-1">
                      This will add the detected content to your workspace. Make sure the data looks correct before proceeding.
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep('upload')}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleApprove}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Approve & Import
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
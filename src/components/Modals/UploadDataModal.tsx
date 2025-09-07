import React, { useState, useCallback } from 'react';
import { X, Upload, FileUp, Check, AlertCircle, CheckSquare, Square } from 'lucide-react';
import { UploadPreview, ApprovedSections } from '../../types/ontology';
import { parseOntologyFile } from '../../utils/fileParser';

interface UploadDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (preview: UploadPreview, approvedSections: ApprovedSections) => void;
}



export default function UploadDataModal({ isOpen, onClose, onApprove }: UploadDataModalProps) {
  const [step, setStep] = useState<'upload' | 'preview'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<UploadPreview | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [approvedSections, setApprovedSections] = useState<ApprovedSections>({
    classes: true,
    properties: true,
    instances: true
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, []);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsProcessing(true);
    
    try {
      // Use real file parsing
      const parsedPreview = await parseOntologyFile(selectedFile);
      setPreview(parsedPreview);
      setIsProcessing(false);
      setStep('preview');
    } catch (error) {
      console.error('Error parsing file:', error);
      setIsProcessing(false);
      // You could add error handling here
    }
  };

  const handleApprove = () => {
    if (preview) {
      onApprove(preview, approvedSections);
      handleClose();
    }
  };

  const handleClose = () => {
    setStep('upload');
    setFile(null);
    setPreview(null);
    setIsProcessing(false);
    setApprovedSections({ classes: true, properties: true, instances: true });
    onClose();
  };

  const toggleSection = (section: keyof ApprovedSections) => {
    setApprovedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const hasApprovedSections = Object.values(approvedSections).some(Boolean);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Upload Data</h2>
            <p className="text-sm text-gray-600 mt-1">
              Import ontology data to expand your knowledge graph
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'upload' && (
            <div>
              {!file && !isProcessing ? (
                <div
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                    isDragOver 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".owl,.rdf,.ttl,.json,.csv,.xml"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0];
                      if (selectedFile) handleFileSelect(selectedFile);
                    }}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Upload size={32} className="text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Drop your file here, or click to browse
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Supports OWL, RDF, TTL, JSON, CSV, XML files up to 50MB
                    </p>
                    <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Select File
                    </div>
                  </label>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileUp size={32} className="text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {isProcessing ? 'Processing file...' : 'File uploaded'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {isProcessing 
                      ? `Analyzing ${file?.name} and extracting ontology data`
                      : `Successfully processed ${file?.name}`
                    }
                  </p>
                  {isProcessing && (
                    <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto">
                      <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {step === 'preview' && preview && (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <Check size={20} className="text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">File processed successfully</h3>
                  <p className="text-sm text-green-700">Review the detected content and approve sections to import</p>
                </div>
              </div>

              {/* Content Sections */}
              <div className="space-y-4">
                {/* Classes Section */}
                {preview.classes.length > 0 && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => toggleSection('classes')}
                            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                          >
                            {approvedSections.classes ? (
                              <CheckSquare size={20} className="text-blue-600" />
                            ) : (
                              <Square size={20} className="text-gray-400" />
                            )}
                          </button>
                          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                          <h4 className="font-semibold text-gray-900">Classes</h4>
                        </div>
                        <span className="text-sm font-medium text-gray-600 bg-white px-2 py-1 rounded">
                          {preview.classes.length} items
                        </span>
                      </div>
                    </div>
                    <div className="p-4 space-y-2 max-h-32 overflow-y-auto">
                      {preview.classes.slice(0, 5).map(cls => (
                        <div key={cls.id} className="flex items-center justify-between py-2">
                          <div>
                            <div className="font-medium text-gray-900">{cls.name}</div>
                            <div className="text-sm text-gray-600">{cls.description}</div>
                          </div>
                          <div className="text-xs bg-gray-100 px-2 py-1 rounded font-medium">
                            {cls.type.toUpperCase()}
                          </div>
                        </div>
                      ))}
                      {preview.classes.length > 5 && (
                        <div className="text-sm text-gray-500 text-center py-2">
                          +{preview.classes.length - 5} more classes
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Properties Section */}
                {preview.properties.length > 0 && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => toggleSection('properties')}
                            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                          >
                            {approvedSections.properties ? (
                              <CheckSquare size={20} className="text-blue-600" />
                            ) : (
                              <Square size={20} className="text-gray-400" />
                            )}
                          </button>
                          <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                          <h4 className="font-semibold text-gray-900">Properties</h4>
                        </div>
                        <span className="text-sm font-medium text-gray-600 bg-white px-2 py-1 rounded">
                          {preview.properties.length} items
                        </span>
                      </div>
                    </div>
                    <div className="p-4 space-y-2 max-h-32 overflow-y-auto">
                      {preview.properties.slice(0, 5).map(prop => (
                        <div key={prop.id} className="flex items-center justify-between py-2">
                          <div>
                            <div className="font-medium text-gray-900">{prop.name}</div>
                            <div className="text-sm text-gray-600">{prop.description}</div>
                          </div>
                          <div className="text-xs bg-teal-100 px-2 py-1 rounded font-medium text-teal-700">
                            {prop.domain} → {prop.range}
                          </div>
                        </div>
                      ))}
                      {preview.properties.length > 5 && (
                        <div className="text-sm text-gray-500 text-center py-2">
                          +{preview.properties.length - 5} more properties
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Instances Section */}
                {preview.instances.length > 0 && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => toggleSection('instances')}
                            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                          >
                            {approvedSections.instances ? (
                              <CheckSquare size={20} className="text-blue-600" />
                            ) : (
                              <Square size={20} className="text-gray-400" />
                            )}
                          </button>
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <h4 className="font-semibold text-gray-900">Instances</h4>
                        </div>
                        <span className="text-sm font-medium text-gray-600 bg-white px-2 py-1 rounded">
                          {preview.instances.length} items
                        </span>
                      </div>
                    </div>
                    <div className="p-4 space-y-2 max-h-32 overflow-y-auto">
                      {preview.instances.slice(0, 5).map(instance => (
                        <div key={instance.id} className="flex items-center justify-between py-2">
                          <div>
                            <div className="font-medium text-gray-900">{instance.name}</div>
                            <div className="text-sm text-gray-600">
                              {Object.keys(instance.properties).length} properties
                            </div>
                          </div>
                          <div className="text-xs bg-blue-100 px-2 py-1 rounded font-medium text-blue-700">
                            {instance.classId}
                          </div>
                        </div>
                      ))}
                      {preview.instances.length > 5 && (
                        <div className="text-sm text-gray-500 text-center py-2">
                          +{preview.instances.length - 5} more instances
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Warning */}
              {!hasApprovedSections && (
                <div className="flex items-start space-x-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle size={20} className="text-amber-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-amber-800">No sections selected</div>
                    <div className="text-sm text-amber-700 mt-1">
                      Please select at least one section to import data into your workspace.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'preview' && (
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setStep('upload')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
            >
              Back
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={!hasApprovedSections}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Approve & Create
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
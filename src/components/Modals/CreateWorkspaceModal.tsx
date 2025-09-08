import  { useState } from 'react';
import { X, Upload, Edit3, Loader2 } from 'lucide-react';
import {OntologyImportApiService} from "../../api";

interface CreateWorkspaceModalProps {
  activeRepositoryId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateWorkspaceModal({ 
    isOpen,
    onClose,
    activeRepositoryId,
}: CreateWorkspaceModalProps) {
  const [step, setStep] = useState<'choose' | 'manual' | 'import'>('choose');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleReset = () => {
    setStep('choose');
    setName('');
    setDescription('');
    setFile(null);
    setIsProcessing(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleCreateManual = () => {
    if (name.trim()) {
      handleClose();
    }
  };

  const onUploadFile = async () => {
    if (activeRepositoryId && name && file) {
      setIsProcessing(true);
      OntologyImportApiService.importTboxFile(activeRepositoryId, name.trim(), {file}).then(response => {
        console.log(response)
        setIsProcessing(false);
        handleClose();
      }).catch(() => {
        setIsProcessing(false);
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Create your first T-Box
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'choose' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-6">
                Choose how you'd like to create your workspace
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => setStep('import')}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-all text-left group"
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <Upload size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Import T-Box</h3>
                      <p className="text-sm text-gray-500">
                        Upload an existing ontology file (OWL, RDF, TTL)
                      </p>
                    </div>
                  </div>
                </button>

                <button
                    disabled={true}
                  onClick={() => setStep('manual')}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-all text-left group opacity-20"
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                      <Edit3 size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Manual Creation</h3>
                      <p className="text-sm text-gray-500">
                        Start with an empty workspace and build from scratch
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {step === 'manual' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-gray-600 mb-4">
                <Edit3 size={16} />
                <span className="text-sm font-medium">Manual Creation</span>
              </div>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Workspace Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Academic Knowledge Graph"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this workspace will contain..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep('choose')}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateManual}
                  disabled={!name.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Create Workspace
                </button>
              </div>
            </div>
          )}

          {step === 'import' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-blue-600 mb-4">
                <Upload size={16} />
                <span className="text-sm font-medium">Import T-Box</span>
              </div>

              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                  Select File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    id="file"
                    type="file"
                    accept=".owl,.rdf,.ttl,.n3,.nt"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <label htmlFor="file" className="cursor-pointer">
                    <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      {file ? file.name : 'Click to select or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supports OWL, RDF, TTL, N3, NT formats
                    </p>
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="import-name" className="block text-sm font-medium text-gray-700 mb-2">
                  TBox Name
                </label>
                <input
                  id="import-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Imported Ontology"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="import-description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  id="import-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the imported ontology..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep('choose')}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={onUploadFile}
                  disabled={!file || !name.trim() || isProcessing}
                  className="inline-flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing && <Loader2 size={16} className="animate-spin" />}
                  <span>{isProcessing ? 'Processing...' : 'Save'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
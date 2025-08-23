import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface Property {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'IRI';
}

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (className: string, description: string, properties: Property[]) => void;
}

export default function AddClassModal({ isOpen, onClose, onSave }: AddClassModalProps) {
  const [className, setClassName] = useState('');
  const [description, setDescription] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);

  if (!isOpen) return null;

  const handleAddProperty = () => {
    const newProperty: Property = {
      id: Date.now().toString(),
      name: '',
      type: 'string'
    };
    setProperties([...properties, newProperty]);
  };

  const handleRemoveProperty = (id: string) => {
    setProperties(properties.filter(p => p.id !== id));
  };

  const handlePropertyChange = (id: string, field: keyof Property, value: string) => {
    setProperties(properties.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleSave = () => {
    if (!className.trim()) return;
    
    const validProperties = properties.filter(p => p.name.trim());
    onSave(className.trim(), description.trim(), validProperties);
    
    // Reset form
    setClassName('');
    setDescription('');
    setProperties([]);
    onClose();
  };

  const handleCancel = () => {
    setClassName('');
    setDescription('');
    setProperties([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Add Class</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Class Name */}
          <div>
            <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-2">
              Class Name <span className="text-red-500">*</span>
            </label>
            <input
              id="className"
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="e.g., Person, Vehicle, Document"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this class represents..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Properties */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">Properties</label>
              <button
                onClick={handleAddProperty}
                className="flex items-center space-x-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
              >
                <Plus size={14} />
                <span>Add Property</span>
              </button>
            </div>

            <div className="space-y-3">
              {properties.map((property) => (
                <div key={property.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    value={property.name}
                    onChange={(e) => handlePropertyChange(property.id, 'name', e.target.value)}
                    placeholder="Property name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select
                    value={property.type}
                    onChange={(e) => handlePropertyChange(property.id, 'type', e.target.value as Property['type'])}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="date">Date</option>
                    <option value="IRI">IRI</option>
                  </select>
                  <button
                    onClick={() => handleRemoveProperty(property.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              {properties.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <p className="text-sm">No properties added yet</p>
                  <p className="text-xs mt-1">Click "Add Property" to define class attributes</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!className.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Save Class
          </button>
        </div>
      </div>
    </div>
  );
}
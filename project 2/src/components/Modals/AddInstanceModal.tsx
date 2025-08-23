import React, { useState } from 'react';
import { X } from 'lucide-react';
import { OntologyClass, OntologyProperty } from '../../types/ontology';

interface PropertyValue {
  propertyId: string;
  value: string;
}

interface AddInstanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (instanceName: string, classId: string, propertyValues: Record<string, any>) => void;
  classes: OntologyClass[];
  properties: OntologyProperty[];
}

export default function AddInstanceModal({ 
  isOpen, 
  onClose, 
  onSave, 
  classes, 
  properties 
}: AddInstanceModalProps) {
  const [instanceName, setInstanceName] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [propertyValues, setPropertyValues] = useState<PropertyValue[]>([]);

  if (!isOpen) return null;

  const selectedClass = classes.find(c => c.id === selectedClassId);
  const classProperties = selectedClass 
    ? properties.filter(p => selectedClass.properties.includes(p.id))
    : [];

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    const newClass = classes.find(c => c.id === classId);
    if (newClass) {
      const newPropertyValues = newClass.properties.map(propId => ({
        propertyId: propId,
        value: ''
      }));
      setPropertyValues(newPropertyValues);
    }
  };

  const handlePropertyValueChange = (propertyId: string, value: string) => {
    setPropertyValues(prev => 
      prev.map(pv => 
        pv.propertyId === propertyId ? { ...pv, value } : pv
      )
    );
  };

  const getInputType = (propertyRange: string) => {
    switch (propertyRange) {
      case 'number': return 'number';
      case 'date': return 'date';
      case 'boolean': return 'checkbox';
      default: return 'text';
    }
  };

  const formatValue = (value: string, propertyRange: string) => {
    switch (propertyRange) {
      case 'number': return value ? Number(value) : 0;
      case 'boolean': return value === 'true';
      default: return value;
    }
  };

  const handleSave = () => {
    if (!instanceName.trim() || !selectedClassId) return;
    
    const formattedValues: Record<string, any> = {};
    propertyValues.forEach(pv => {
      const property = properties.find(p => p.id === pv.propertyId);
      if (property && pv.value.trim()) {
        formattedValues[property.name] = formatValue(pv.value, property.range);
      }
    });
    
    onSave(instanceName.trim(), selectedClassId, formattedValues);
    
    // Reset form
    setInstanceName('');
    setSelectedClassId('');
    setPropertyValues([]);
    onClose();
  };

  const handleCancel = () => {
    setInstanceName('');
    setSelectedClassId('');
    setPropertyValues([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Add Instance</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Instance Name */}
          <div>
            <label htmlFor="instanceName" className="block text-sm font-medium text-gray-700 mb-2">
              Instance Name/Label <span className="text-red-500">*</span>
            </label>
            <input
              id="instanceName"
              type="text"
              value={instanceName}
              onChange={(e) => setInstanceName(e.target.value)}
              placeholder="e.g., John Doe, Toyota Camry, Document #123"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Select Class */}
          <div>
            <label htmlFor="classSelect" className="block text-sm font-medium text-gray-700 mb-2">
              Select Class <span className="text-red-500">*</span>
            </label>
            <select
              id="classSelect"
              value={selectedClassId}
              onChange={(e) => handleClassChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a class...</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} {cls.description && `- ${cls.description}`}
                </option>
              ))}
            </select>
          </div>

          {/* Property Values */}
          {selectedClass && classProperties.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Property Values
              </label>
              <div className="space-y-4">
                {classProperties.map(property => {
                  const propertyValue = propertyValues.find(pv => pv.propertyId === property.id);
                  const inputType = getInputType(property.range);
                  
                  return (
                    <div key={property.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-900">
                          {property.name}
                        </label>
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                          {property.range}
                        </span>
                      </div>
                      {property.description && (
                        <p className="text-xs text-gray-600 mb-2">{property.description}</p>
                      )}
                      
                      {inputType === 'checkbox' ? (
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={propertyValue?.value === 'true'}
                            onChange={(e) => handlePropertyValueChange(property.id, e.target.checked.toString())}
                            className="text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">True/False</span>
                        </label>
                      ) : (
                        <input
                          type={inputType}
                          value={propertyValue?.value || ''}
                          onChange={(e) => handlePropertyValueChange(property.id, e.target.value)}
                          placeholder={`Enter ${property.name.toLowerCase()}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {selectedClass && classProperties.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <p className="text-sm">This class has no properties defined</p>
            </div>
          )}
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
            disabled={!instanceName.trim() || !selectedClassId}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Save Instance
          </button>
        </div>
      </div>
    </div>
  );
}
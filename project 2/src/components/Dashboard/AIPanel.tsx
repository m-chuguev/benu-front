import React, { useState } from 'react';
import { MessageSquare, Send, ChevronDown, ChevronRight, X, Brain, Database, Code, CheckCircle } from 'lucide-react';

interface AIMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  reasoning?: ReasoningTrace;
}

interface ReasoningTrace {
  query: string;
  sparql: string;
  entities: string[];
  properties: string[];
  finalAnswer: string;
}

interface AIPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  workspaceName: string;
}

export default function AIPanel({ isOpen, onToggle, workspaceName }: AIPanelProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedReasoning, setExpandedReasoning] = useState<string | null>(null);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const hasKnowledge = Math.random() > 0.3; // 70% chance of having knowledge
      
      let aiMessage: AIMessage;
      
      if (hasKnowledge) {
        aiMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `Based on the ontology data in "${workspaceName}", I found relevant information about your query. The knowledge graph contains several classes and instances that relate to your question.`,
          timestamp: new Date(),
          reasoning: {
            query: userMessage.content,
            sparql: `SELECT ?entity ?property ?value WHERE {
  ?entity rdf:type ?class .
  ?entity ?property ?value .
  FILTER(CONTAINS(LCASE(?value), "${userMessage.content.toLowerCase()}"))
}`,
            entities: ['Person', 'Professor', 'Student', 'Course'],
            properties: ['hasName', 'hasEmail', 'teaches', 'enrolledIn'],
            finalAnswer: 'Found 3 relevant entities with matching properties in the knowledge graph.'
          }
        };
      } else {
        aiMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: 'Not enough knowledge in ontology to answer.',
          timestamp: new Date()
        };
      }

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleReasoning = (messageId: string) => {
    setExpandedReasoning(expandedReasoning === messageId ? null : messageId);
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Brain size={16} className="text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Ask AI</h3>
              <p className="text-xs text-gray-600">Query your knowledge graph</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-md transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={24} className="text-purple-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Start a conversation</h4>
            <p className="text-sm text-gray-600">Ask questions about your ontology data and get AI-powered insights.</p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-lg px-4 py-2 ${
                message.type === 'user' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-purple-200' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Reasoning Button */}
            {message.type === 'ai' && message.reasoning && (
              <div className="flex justify-start">
                <button
                  onClick={() => toggleReasoning(message.id)}
                  className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-1"
                >
                  <span>View reasoning</span>
                  {expandedReasoning === message.id ? (
                    <ChevronDown size={12} />
                  ) : (
                    <ChevronRight size={12} />
                  )}
                </button>
              </div>
            )}

            {/* Reasoning Trace */}
            {message.type === 'ai' && message.reasoning && expandedReasoning === message.id && (
              <div className="ml-4 space-y-3">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  {/* Query Step */}
                  <div className="p-3 border-b border-gray-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <MessageSquare size={14} className="text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">Query</span>
                    </div>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded p-2">
                      {message.reasoning.query}
                    </p>
                  </div>

                  {/* SPARQL Step */}
                  <div className="p-3 border-b border-gray-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <Code size={14} className="text-green-600" />
                      <span className="text-sm font-medium text-gray-900">SPARQL</span>
                    </div>
                    <pre className="text-xs text-gray-700 bg-gray-50 rounded p-2 overflow-x-auto">
                      {message.reasoning.sparql}
                    </pre>
                  </div>

                  {/* Entities Step */}
                  <div className="p-3 border-b border-gray-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <Database size={14} className="text-orange-600" />
                      <span className="text-sm font-medium text-gray-900">Entities</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {message.reasoning.entities.map((entity, index) => (
                        <span key={index} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                          {entity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Properties Step */}
                  <div className="p-3 border-b border-gray-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <Database size={14} className="text-teal-600" />
                      <span className="text-sm font-medium text-gray-900">Properties</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {message.reasoning.properties.map((property, index) => (
                        <span key={index} className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded">
                          {property}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Final Answer Step */}
                  <div className="p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle size={14} className="text-purple-600" />
                      <span className="text-sm font-medium text-gray-900">Final Answer</span>
                    </div>
                    <p className="text-sm text-gray-700 bg-purple-50 rounded p-2">
                      {message.reasoning.finalAnswer}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-600">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your question..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
import React, { ReactNode, useState } from 'react';
import { Sidebar } from '../Sidebar';
import { Header } from '../Header';

interface BuilderLayoutProps {
  children: ReactNode;
  title: string;
  settingsPanel?: ReactNode;
  componentSelector?: ReactNode;
  showComponentSelector?: boolean;
}

export function BuilderLayout({ 
  children, 
  title, 
  settingsPanel, 
  componentSelector, 
  showComponentSelector = false 
}: BuilderLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
        </div>
      )}

      {/* Sidebar - Mobile */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-4 py-6">
          {settingsPanel}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0">
        {/* Settings Sidebar */}
        <div className="flex-1 flex flex-col bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {settingsPanel}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:pl-80 flex flex-col flex-1">
        {/* Top Navigation */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                {/* Mobile menu button */}
                <button
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="ml-2 lg:ml-0 text-2xl font-bold text-gray-900">{title}</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Action buttons can go here */}
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                  Save
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Preview
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Preview Area */}
        <div className="flex-1 flex flex-col">
          <div className={`flex-1 p-6 ${showComponentSelector ? 'pb-2' : ''}`}>
            <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {children}
            </div>
          </div>

          {/* Component Selector at Bottom */}
          {showComponentSelector && (
            <div className="px-6 pb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Choose Component</h3>
                </div>
                <div className="p-6">
                  {componentSelector}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
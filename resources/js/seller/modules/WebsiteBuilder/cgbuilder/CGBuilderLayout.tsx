import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BaseLayout from '../../../components/Layout/BaseLayout';

interface CGBuilderLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function CGBuilderLayout({ children, title = 'CG Builder' }: CGBuilderLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackToDashboard = () => {
    navigate('/');
  };

  const isPageBuilder = location.pathname.includes('/page');
  const isLayoutBuilder = location.pathname.includes('/layout');
  const isElementorBuilder = location.pathname.includes('/elementor');

  const getBuilderTitle = () => {
    if (isElementorBuilder) return 'Elementor Builder';
    if (isPageBuilder) return 'Page Builder';
    if (isLayoutBuilder) return 'Layout Builder';
    return title;
  };

  const getCurrentTab = () => {
    if (isElementorBuilder) return 'elementor';
    if (isPageBuilder) return 'page';
    if (isLayoutBuilder) return 'layout';
    return 'dashboard';
  };

  return (
    <BaseLayout>
      <div className="min-h-screen bg-gray-50">
      {/* CG Builder Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Side - Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {/* CG Builder Logo */}
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <span className="text-white font-bold text-lg">CG</span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{getBuilderTitle()}</h1>
                  <p className="text-sm text-gray-500">Website Building Platform</p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="hidden md:flex items-center space-x-1 ml-8">
                <button
                  onClick={() => navigate('/cg-builder/page')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    getCurrentTab() === 'page'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Page Builder
                </button>
                <button
                  onClick={() => navigate('/cg-builder/layout')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    getCurrentTab() === 'layout'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Layout Builder
                </button>
                <button
                  onClick={() => navigate('/cg-builder/elementor')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    getCurrentTab() === 'elementor'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Elementor Builder
                </button>
              </div>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center space-x-3">
              {/* Help Button */}
              <button
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                title="Help"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              {/* Settings Button */}
              <button
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                title="Settings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              {/* Divider */}
              <div className="w-px h-6 bg-gray-300"></div>

              {/* Back to Dashboard Button */}
              <button
                onClick={handleBackToDashboard}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-sm font-medium">Back to Dashboard</span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden mt-4 flex space-x-1">
            <button
              onClick={() => navigate('/cg-builder/page')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                getCurrentTab() === 'page'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Page Builder
            </button>
            <button
              onClick={() => navigate('/cg-builder/layout')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                getCurrentTab() === 'layout'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Layout Builder
            </button>
            <button
              onClick={() => navigate('/cg-builder/elementor')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                getCurrentTab() === 'elementor'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Elementor
            </button>
          </div>
        </div>
      </nav>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </BaseLayout>
  );
}
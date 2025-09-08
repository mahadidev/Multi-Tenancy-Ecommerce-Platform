import React from 'react';
import { CGBuilderLayout } from './CGBuilderLayout';
import { UnifiedPageBuilder } from '../components/UnifiedPageBuilder';
import { LayoutBuilderHeader } from './components/layout/LayoutBuilderHeader';
import { useLayoutBuilder } from './hooks/useLayoutBuilder';
import { useLayoutBuilderActions } from './hooks/useLayoutBuilderActions';

interface CGBuilderLayoutBuilderPageProps {
  type?: 'header' | 'footer';
}

export function CGBuilderLayoutBuilderPage({ type }: CGBuilderLayoutBuilderPageProps) {
  const {
    layoutType,
    sections,
    setSections,
    isLoading,
    websiteIdNum,
    selectedComponent,
    layoutComponentTypes,
    isUpdatingHeader,
    isUpdatingFooter,
    updateHeader,
    updateFooter,
    handleLayoutTypeChange,
    handleBack,
    handleExit,
    dispatch,
    setSelectedComponent,
    transformSectionsFromAPI,
  } = useLayoutBuilder(type);

  const {
    handleDropComponent,
    handleUpdateComponent,
    handleDeleteComponent,
    handleSelectComponent,
    handleSave,
  } = useLayoutBuilderActions({
    sections,
    setSections,
    layoutType,
    websiteIdNum,
    updateHeader,
    updateFooter,
    transformSectionsFromAPI,
    dispatch,
    setSelectedComponent,
  });

  if (isLoading) {
    return (
      <CGBuilderLayout title={`${layoutType === 'header' ? 'Header' : 'Footer'} Builder`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading {layoutType} builder...</p>
          </div>
        </div>
      </CGBuilderLayout>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <LayoutBuilderHeader
        layoutType={layoutType}
        onBack={handleBack}
        onLayoutTypeChange={handleLayoutTypeChange}
      />

      <div className="h-[calc(100vh-60px)]">
        <UnifiedPageBuilder
          componentTypes={layoutComponentTypes}
          sections={sections}
          websiteId={websiteIdNum}
          pageId={undefined}
          layoutMode={layoutType}
          onDropComponent={handleDropComponent}
          onUpdateComponent={handleUpdateComponent}
          onDeleteComponent={handleDeleteComponent}
          onSelectComponent={handleSelectComponent}
          selectedComponent={selectedComponent}
          onSave={handleSave}
          onExit={handleExit}
          externalSaving={layoutType === 'header' ? isUpdatingHeader : isUpdatingFooter}
        />
      </div>
    </div>
  );
}
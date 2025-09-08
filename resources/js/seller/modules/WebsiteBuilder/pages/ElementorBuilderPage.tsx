import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ElementorBuilder } from '../elementor/ElementorBuilder';

export function ElementorBuilderPage() {
  const { websiteId, pageId } = useParams();
  const navigate = useNavigate();

  const handleSave = (data: any) => {
    console.log('Saving Elementor page data:', data);
    // The actual save is handled by the UnifiedPageBuilder API mutation
  };

  const handleExit = () => {
    // Navigate back to CG Builder dashboard
    navigate('/cg-builder');
  };

  return (
    <ElementorBuilder
      websiteId={websiteId || '1'}
      pageId={pageId}
      onSave={handleSave}
      onExit={handleExit}
    />
  );
}
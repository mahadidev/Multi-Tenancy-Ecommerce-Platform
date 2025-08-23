import React from 'react';
import { useParams } from 'react-router-dom';
import WebsiteBuilderPage from './WebsiteBuilderPage';

// This component is just an alias for WebsiteBuilderPage
// since the page builder functionality is handled there
const PageBuilderPage: React.FC = () => {
  return <WebsiteBuilderPage />;
};

export default PageBuilderPage;
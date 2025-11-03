import React from 'react';

interface BreadcrumbProps {
  showHome?: boolean;
  items?: Array<{ label: string; href: string }>;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ 
  showHome = true,
  items = [] 
}) => {
  const breadcrumbItems = [
    ...(showHome ? [{ label: 'Home', href: '/' }] : []),
    ...items
  ];

  if (breadcrumbItems.length === 0) return null;

  return (
    <nav className="bg-gray-50 py-3">
      <div className="container mx-auto px-4">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbItems.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg className="w-4 h-4 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {index < breadcrumbItems.length - 1 ? (
                <a href={item.href} className="text-gray-600 hover:text-gray-900">
                  {item.label}
                </a>
              ) : (
                <span className="text-gray-900 font-medium">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;
import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  textAlign?: 'left' | 'center' | 'right';
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  description,
  backgroundImage,
  textAlign = 'center'
}) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  return (
    <section 
      className="relative bg-gray-900 text-white py-16 lg:py-24"
      style={backgroundImage ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {}}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-black/50" />
      )}
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`max-w-3xl ${textAlign === 'center' ? 'mx-auto' : ''} ${alignmentClasses[textAlign]}`}>
          {subtitle && (
            <p className="text-blue-400 font-medium mb-2 uppercase tracking-wide text-sm">
              {subtitle}
            </p>
          )}
          
          <h1 className="text-3xl lg:text-5xl font-bold mb-4">
            {title}
          </h1>
          
          {description && (
            <p className="text-lg text-gray-300">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageHeader;
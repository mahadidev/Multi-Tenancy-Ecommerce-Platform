import React from 'react';

interface ContentSectionProps {
  title?: string;
  subtitle?: string;
  content?: string;
  image?: string;
  imagePosition?: 'left' | 'right';
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
}

const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  subtitle,
  content,
  image,
  imagePosition = 'right',
  backgroundColor = 'white',
  textAlign = 'left'
}) => {
  const bgClasses = backgroundColor === 'gray' ? 'bg-gray-50' : 'bg-white';
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  return (
    <section className={`py-12 lg:py-16 ${bgClasses}`}>
      <div className="container mx-auto px-4">
        {image ? (
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className={`${imagePosition === 'right' ? 'lg:order-1' : 'lg:order-2'}`}>
              {subtitle && (
                <p className="text-blue-600 font-medium mb-2 uppercase tracking-wide text-sm">
                  {subtitle}
                </p>
              )}
              {title && (
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  {title}
                </h2>
              )}
              {content && (
                <div 
                  className="prose prose-lg text-gray-600"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              )}
            </div>
            <div className={`${imagePosition === 'right' ? 'lg:order-2' : 'lg:order-1'}`}>
              <img 
                src={image} 
                alt={title || 'Content image'}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        ) : (
          <div className={`max-w-4xl ${textAlign === 'center' ? 'mx-auto' : ''} ${alignmentClasses[textAlign]}`}>
            {subtitle && (
              <p className="text-blue-600 font-medium mb-2 uppercase tracking-wide text-sm">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                {title}
              </h2>
            )}
            {content && (
              <div 
                className="prose prose-lg text-gray-600 max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ContentSection;
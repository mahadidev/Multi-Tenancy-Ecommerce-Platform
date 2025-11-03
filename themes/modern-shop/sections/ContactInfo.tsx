import React from 'react';

interface ContactMethod {
  icon: string;
  title: string;
  value: string;
  link?: string;
}

interface ContactInfoProps {
  title?: string;
  subtitle?: string;
  methods?: ContactMethod[];
  showMap?: boolean;
  mapEmbedUrl?: string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({
  title = 'Contact Information',
  subtitle = 'Get in touch with us through any of these channels',
  methods = [],
  showMap = false,
  mapEmbedUrl
}) => {
  // Default contact methods if none provided
  const defaultMethods: ContactMethod[] = [
    {
      icon: 'phone',
      title: 'Phone',
      value: '+1 (555) 123-4567',
      link: 'tel:+15551234567'
    },
    {
      icon: 'email',
      title: 'Email',
      value: 'hello@modernshop.com',
      link: 'mailto:hello@modernshop.com'
    },
    {
      icon: 'location',
      title: 'Address',
      value: '123 Commerce Street\nSan Francisco, CA 94102'
    },
    {
      icon: 'clock',
      title: 'Business Hours',
      value: 'Mon-Fri: 9:00 AM - 6:00 PM\nSat-Sun: 10:00 AM - 4:00 PM'
    }
  ];

  const contactMethods = methods.length > 0 ? methods : defaultMethods;

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'phone':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      case 'email':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'location':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'clock':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <section className="py-12 lg:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {contactMethods.map((method, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                {getIcon(method.icon)}
              </div>
              <h3 className="font-semibold text-lg mb-2">{method.title}</h3>
              {method.link ? (
                <a 
                  href={method.link}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {method.value.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </a>
              ) : (
                <div className="text-gray-600">
                  {method.value.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {showMap && mapEmbedUrl && (
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactInfo;
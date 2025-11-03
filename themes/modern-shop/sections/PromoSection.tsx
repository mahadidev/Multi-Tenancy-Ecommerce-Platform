import React from 'react';
import { Button } from '../components/Button';

interface PromoSectionProps {
  title?: string;
  description?: string;
  discount?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  className?: string;
}

const PromoSection: React.FC<PromoSectionProps> = ({
  title = 'Limited Time Offer',
  description = 'Don\'t miss out on our biggest sale of the year',
  discount = '50% OFF',
  buttonText = 'Shop Sale',
  buttonLink = '/shop?filter=sale',
  backgroundImage,
  backgroundColor = 'from-red-500 to-pink-500',
  className = ''
}) => {
  return (
    <section className={`section-compact ${className}`}>
      <div className="container mx-auto px-4">
        <div className={`relative overflow-hidden rounded-2xl ${backgroundImage ? '' : `bg-gradient-to-r ${backgroundColor}`} text-white modern-shadow-lg`}>
          {/* Background Image */}
          {backgroundImage && (
            <div className="absolute inset-0">
              <img
                src={backgroundImage}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>
          )}

          {/* Content */}
          <div className="relative z-10 px-8 py-12 lg:px-16 lg:py-20">
            <div className="max-w-2xl">
              {/* Discount Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold uppercase tracking-wide mb-4">
                <SparkleIcon className="w-4 h-4 mr-2" />
                {discount}
              </div>

              {/* Title */}
              <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-balance">
                {title}
              </h2>

              {/* Description */}
              <p className="text-lg lg:text-xl text-white/90 mb-8 text-pretty">
                {description}
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a href={buttonLink}>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-white text-gray-900 hover:bg-white/90 modern-shadow"
                  >
                    {buttonText}
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </Button>
                </a>
                
                {/* Timer/Urgency */}
                <div className="flex items-center text-white/80">
                  <ClockIcon className="w-5 h-5 mr-2" />
                  <span className="text-sm">Ends in 3 days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
          <div className="absolute bottom-4 right-16 w-16 h-16 bg-white/5 rounded-full blur-xl" />
        </div>
      </div>
    </section>
  );
};

// Icons
const SparkleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

const ArrowRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default PromoSection;
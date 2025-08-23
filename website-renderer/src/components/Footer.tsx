'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Website } from '@/types';

interface FooterProps {
  website: Website;
}

export function Footer({ website }: FooterProps) {
  const footerMenus = website.menus.filter(menu => menu.location === 'footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Store Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              {website.store.logo && (
                <div className="relative w-8 h-8">
                  <Image
                    src={website.store.logo}
                    alt={website.store.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <span className="text-xl font-semibold">{website.store.name}</span>
            </div>
            
            {website.store.description && (
              <p className="text-gray-300 mb-4 max-w-md">
                {website.store.description}
              </p>
            )}

            {/* Contact Info */}
            {website.store.contact_info && (
              <div className="space-y-2 text-sm text-gray-300">
                {website.store.contact_info.address && (
                  <div className="flex items-start space-x-2">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>{website.store.contact_info.address}</span>
                  </div>
                )}
                
                {website.store.contact_info.phone && (
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <a href={`tel:${website.store.contact_info.phone}`} className="hover:text-blue-400">
                      {website.store.contact_info.phone}
                    </a>
                  </div>
                )}
                
                {website.store.contact_info.email && (
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <a href={`mailto:${website.store.contact_info.email}`} className="hover:text-blue-400">
                      {website.store.contact_info.email}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Menus */}
          {footerMenus.map((menu) => (
            <div key={menu.id}>
              <h3 className="text-lg font-semibold mb-4">{menu.name}</h3>
              <ul className="space-y-2">
                {menu.items.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.url}
                      target={item.target || '_self'}
                      rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                      className="text-gray-300 hover:text-blue-400 text-sm"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Media */}
          {website.store.contact_info?.social_media && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {Object.entries(website.store.contact_info.social_media).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-blue-400"
                    aria-label={`Follow us on ${platform}`}
                  >
                    <SocialIcon platform={platform} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400">
            © {currentYear} {website.store.name}. All rights reserved.
          </div>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-blue-400">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-sm text-gray-400 hover:text-blue-400">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface SocialIconProps {
  platform: string;
}

function SocialIcon({ platform }: SocialIconProps) {
  const iconClass = "w-5 h-5 fill-current";
  
  switch (platform.toLowerCase()) {
    case 'facebook':
      return (
        <svg className={iconClass} viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    case 'twitter':
      return (
        <svg className={iconClass} viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      );
    case 'instagram':
      return (
        <svg className={iconClass} viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986s11.987-5.368 11.987-11.986C24.014 5.367 18.635.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.473-3.342-1.275-.894-.802-1.407-1.917-1.407-3.188 0-1.272.513-2.387 1.407-3.188.894-.802 2.045-1.275 3.342-1.275s2.448.473 3.342 1.275c.894.801 1.407 1.916 1.407 3.188 0 1.271-.513 2.386-1.407 3.188-.894.802-2.045 1.275-3.342 1.275zm7.718-6.943a1.522 1.522 0 01-1.522-1.522c0-.84.682-1.522 1.522-1.522s1.522.682 1.522 1.522c0 .84-.682 1.522-1.522 1.522z"/>
        </svg>
      );
    case 'linkedin':
      return (
        <svg className={iconClass} viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      );
    case 'youtube':
      return (
        <svg className={iconClass} viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    default:
      return (
        <svg className={iconClass} viewBox="0 0 24 24">
          <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16l-.293 1.355c-.199.93-.73 1.16-1.48.72l-3.64-2.673L9.68 9.68c-.28.28-.52.19-.72-.19l-1.355-2.293c-.28-.48-.12-.73.4-.56l13.085 5.085c.52.2.68.52.48 1.04z"/>
        </svg>
      );
  }
}
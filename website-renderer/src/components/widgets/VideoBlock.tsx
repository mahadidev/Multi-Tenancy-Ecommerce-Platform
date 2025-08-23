'use client';

import React from 'react';

interface VideoBlockProps {
  src?: string;
  poster?: string;
  caption?: string;
  width?: string;
  height?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  alignment?: 'left' | 'center' | 'right';
}

export function VideoBlock({
  src = '',
  poster,
  caption,
  width = '100%',
  height = 'auto',
  autoplay = false,
  muted = true,
  loop = false,
  controls = true,
  alignment = 'center'
}: VideoBlockProps) {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  };

  const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');
  const isVimeo = src.includes('vimeo.com');

  // Extract YouTube video ID
  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&mute=${muted ? 1 : 0}&loop=${loop ? 1 : 0}&controls=${controls ? 1 : 0}`;
    }
    return url;
  };

  // Extract Vimeo video ID
  const getVimeoEmbedUrl = (url: string) => {
    const regExp = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/;
    const match = url.match(regExp);
    const videoId = match ? match[5] : null;
    if (videoId) {
      return `https://player.vimeo.com/video/${videoId}?autoplay=${autoplay ? 1 : 0}&muted=${muted ? 1 : 0}&loop=${loop ? 1 : 0}&controls=${controls ? 1 : 0}`;
    }
    return url;
  };

  const getEmbedUrl = () => {
    if (isYouTube) {
      return getYouTubeEmbedUrl(src);
    } else if (isVimeo) {
      return getVimeoEmbedUrl(src);
    }
    return src;
  };

  if (!src) {
    return (
      <div className={`flex ${alignmentClasses[alignment]} w-full`}>
        <div className="bg-gray-200 aspect-video rounded-lg flex items-center justify-center" style={{ width, height }}>
          <p className="text-gray-500">No video source provided</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${alignmentClasses[alignment]} w-full`}>
      <figure className="inline-block">
        {isYouTube || isVimeo ? (
          <div className="relative aspect-video" style={{ width }}>
            <iframe
              src={getEmbedUrl()}
              className="absolute inset-0 w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={caption || 'Video'}
            />
          </div>
        ) : (
          <video
            src={src}
            poster={poster}
            autoPlay={autoplay}
            muted={muted}
            loop={loop}
            controls={controls}
            className="rounded-lg"
            style={{ width, height }}
          >
            Your browser does not support the video tag.
          </video>
        )}
        
        {caption && (
          <figcaption className="mt-2 text-sm text-gray-600 text-center">
            {caption}
          </figcaption>
        )}
      </figure>
    </div>
  );
}
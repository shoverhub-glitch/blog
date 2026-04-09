import { useEffect, useRef } from 'react';
import { useTheme } from '../theme/ThemeContext';

interface VideoEmbedProps {
  url: string;
  title?: string;
}

interface VideoInfo {
  type: 'youtube' | 'vimeo' | 'unknown';
  videoId: string;
  embedUrl: string;
}

const parseVideoUrl = (url: string): VideoInfo | null => {
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch) {
    return {
      type: 'youtube',
      videoId: youtubeMatch[1],
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
    };
  }

  const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch) {
    return {
      type: 'vimeo',
      videoId: vimeoMatch[1],
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  return null;
};

export const VideoEmbed = ({ url, title = 'Video' }: VideoEmbedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const videoInfo = parseVideoUrl(url);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const aspectRatio = 16 / 9;
        const height = containerWidth / aspectRatio;
        containerRef.current.style.height = `${height}px`;
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  if (!videoInfo) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '56.25%',
        margin: '2rem 0',
        borderRadius: '8px',
        overflow: 'hidden',
        background: theme.colors.primary,
      }}
    >
      <iframe
        src={videoInfo.embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
        }}
      />
    </div>
  );
};

export const processContentWithVideos = (content: string): string => {
  const urlRegex = /(https?:\/\/(?:www\.)?(?:youtube\.com\/[^\s]+|vimeo\.com\/\d+))/g;
  
  return content.replace(urlRegex, (url) => {
    const videoInfo = parseVideoUrl(url);
    if (videoInfo) {
      return `<div class="video-embed-wrapper" data-video-url="${url}"></div>`;
    }
    return url;
  });
};

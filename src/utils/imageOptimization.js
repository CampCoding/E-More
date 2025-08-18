import { lazy } from 'react';

// Lazy load images
export const lazyLoadImage = (imagePath) => {
  return lazy(() => import(`../assets/${imagePath}`));
};

// Image optimization configuration
export const imageConfig = {
  quality: 80,
  format: 'webp',
  loading: 'lazy',
  decoding: 'async'
};

// Image component with optimization
export const OptimizedImage = ({ src, alt, className, ...props }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
};

// Convert image to WebP format
export const convertToWebP = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          'image/webp',
          0.8
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

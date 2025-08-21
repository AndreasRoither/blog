'use client';

import Image from "next/image";
import { useState } from "react";

interface LoadingImageProps {
  src: string;
  alt: string;
  title: string;
  className?: string;
  forceLoading?: boolean;
}

export default function LoadingImage({ src, alt, title, className = "", forceLoading = false }: LoadingImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const shouldShowLoading = isLoading || forceLoading;

  return (
    <div className={`relative overflow-hidden rounded-lg shadow-lg ${className}`}>
      {/* loading */}
      {shouldShowLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-green-200 dark:border-green-800 border-t-green-500 dark:border-t-green-400 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">
                  🍵
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 animate-pulse flex items-center gap-2">
              <span>Brewing content...</span>
              <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>🫖</span>
            </div>
          </div>
        </div>
      )}
      
      {/* error */}
      {hasError && (
        <div className="bg-gray-100 dark:bg-gray-800 p-8 text-center rounded-lg">
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            Failed to load image
          </div>
        </div>
      )}

      {/* image */}
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={630}
        className={`w-full h-auto object-cover transition-opacity duration-500 ${
          shouldShowLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        priority
        sizes="(max-width: 768px) 90vw, (max-width: 1024px) 80vw, 768px"
      />
    </div>
  );
}

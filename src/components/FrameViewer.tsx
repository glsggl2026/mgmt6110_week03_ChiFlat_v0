import React, { useState } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  RotateCw,
  Globe,
  Loader2,
  AlertCircle,
  Maximize2,
} from 'lucide-react';
import { ViewportMode } from './ComparisonHeader.tsx';

interface FrameViewerProps {
  id: 'left' | 'right';
  title: string;
  versionTag: string;
  versionBadgeColor: string;
  tagline: string;
  initialUrl: string;
  viewportMode: ViewportMode;
  reloadKey: number;
  onSingleReload: () => void;
  highlights: string[];
}

export const FrameViewer: React.FC<FrameViewerProps> = ({
  id,
  title,
  versionTag,
  versionBadgeColor,
  tagline,
  initialUrl,
  viewportMode,
  reloadKey,
  onSingleReload,
  highlights,
}) => {
  const [currentUrl, setCurrentUrl] = useState<string>(initialUrl);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (_) {
      // Fallback if clipboard API is restricted
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // Viewport container width constraints
  const getContainerMaxWidth = () => {
    switch (viewportMode) {
      case 'desktop':
        return 'max-w-[1200px]';
      case 'tablet':
        return 'max-w-[768px]';
      case 'mobile':
        return 'max-w-[390px]';
      case 'responsive':
      default:
        return 'w-full';
    }
  };

  return (
    <div className="flex flex-col h-full bg-stone-100 border border-stone-300 rounded-xl overflow-hidden shadow-xs">
      {/* Frame Top Bar */}
      <div className="bg-stone-50 border-b border-stone-200 px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded ${versionBadgeColor}`}
            >
              {versionTag}
            </span>
            <span className="font-semibold text-stone-900 text-sm truncate">
              {title}
            </span>
          </div>
          <span className="text-stone-300 hidden md:inline">|</span>
          <span className="text-xs text-stone-500 hidden md:inline truncate">
            {tagline}
          </span>
        </div>

        {/* URL and Action Tools */}
        <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
          {/* URL Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-stone-200 text-stone-600 text-xs font-mono max-w-[260px] sm:max-w-[300px] truncate shadow-2xs">
            <Globe className="w-3 h-3 text-stone-400 shrink-0" />
            <span className="truncate">{currentUrl.replace(/^https?:\/\//, '')}</span>
          </div>

          {/* Copy button */}
          <button
            type="button"
            onClick={handleCopy}
            title="Copy URL"
            className="p-1.5 rounded-md hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-colors"
          >
            {isCopied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Reload button */}
          <button
            type="button"
            onClick={() => {
              setIsLoading(true);
              onSingleReload();
            }}
            title="Reload this frame"
            className="p-1.5 rounded-md hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-colors"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* Open in external tab */}
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in new window"
            className="p-1.5 rounded-md hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Frame Key Highlights Pill Strip */}
      <div className="bg-stone-100/90 border-b border-stone-200/70 px-3.5 py-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-stone-600 shrink-0">
        <span className="font-semibold text-stone-500 uppercase tracking-wider text-[10px]">
          Highlights:
        </span>
        {highlights.map((h, i) => (
          <span key={i} className="flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-stone-400"></span>
            <span>{h}</span>
          </span>
        ))}
      </div>

      {/* Iframe Viewport Area */}
      <div className="flex-1 bg-stone-200/50 p-2 sm:p-3 overflow-hidden flex items-center justify-center relative">
        <div
          className={`h-full w-full ${getContainerMaxWidth()} mx-auto bg-white rounded-lg shadow-sm border border-stone-300 overflow-hidden relative flex flex-col transition-all duration-200`}
        >
          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-2xs flex flex-col items-center justify-center gap-2 z-10 text-stone-500">
              <Loader2 className="w-6 h-6 animate-spin text-stone-700" />
              <p className="text-xs font-medium">Loading {title}...</p>
            </div>
          )}

          {/* Fallback prompt if error */}
          {hasError ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-stone-600">
              <AlertCircle className="w-8 h-8 text-amber-600 mb-2" />
              <h3 className="font-semibold text-stone-900 mb-1">
                Unable to load preview
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mb-4">
                The target site may have security restrictions or temporary network latency.
              </p>
              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-stone-900 text-stone-100 text-xs font-medium hover:bg-stone-800 transition-colors inline-flex items-center gap-1.5"
              >
                <span>Open {title} in New Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <iframe
              id={`compare-frame-${id}`}
              key={`${id}-${reloadKey}`}
              src={currentUrl}
              title={title}
              onLoad={handleIframeLoad}
              onError={() => setHasError(true)}
              className="w-full h-full border-0"
              allow="clipboard-write; clipboard-read"
            />
          )}
        </div>
      </div>
    </div>
  );
};

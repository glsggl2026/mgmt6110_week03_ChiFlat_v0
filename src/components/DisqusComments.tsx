import React, { useEffect, useState } from 'react';
import { MessageSquare, ExternalLink } from 'lucide-react';

declare global {
  interface Window {
    disqus_config?: (this: { page: { url: string; identifier: string } }) => void;
    DISQUS?: {
      reset: (options: {
        reload: boolean;
        config?: (this: { page: { url: string; identifier: string } }) => void;
      }) => void;
    };
  }
}

const DISQUS_SHORTNAME = 'glsggl2026';
const DISQUS_SCRIPT_ID = 'disqus-embed-script';
const PAGE_URL = 'https://week3chiflat.vercel.app/';
const PAGE_IDENTIFIER = 'home';

export function DisqusComments() {
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
  const [loadFailed, setLoadFailed] = useState<boolean>(false);

  useEffect(() => {
    const configureDisqus = function (this: any) {
      const target = this || window;
      if (!target.page) {
        target.page = {};
      }
      target.page.url = PAGE_URL;
      target.page.identifier = PAGE_IDENTIFIER;
    };

    window.disqus_config = configureDisqus;

    try {
      if (window.DISQUS) {
        setScriptLoaded(true);
        window.DISQUS.reset({
          reload: true,
          config: configureDisqus,
        });
      } else {
        const existing = document.getElementById(DISQUS_SCRIPT_ID);
        if (!existing) {
          const script = document.createElement('script');
          script.id = DISQUS_SCRIPT_ID;
          script.src = `https://${DISQUS_SHORTNAME}.disqus.com/embed.js`;
          script.setAttribute('data-timestamp', String(+new Date()));
          script.async = true;
          script.onload = () => setScriptLoaded(true);
          script.onerror = () => {
            setScriptLoaded(true);
            setLoadFailed(true);
          };
          (document.head || document.body).appendChild(script);
        } else {
          setScriptLoaded(true);
        }
      }
    } catch {
      setLoadFailed(true);
    }
  }, []);

  return (
    <section
      id="feedback-discussion"
      aria-label="Community Feedback"
      className="mt-8 bg-[#5eead4]/25 border border-teal-300/80 rounded-2xl p-5 sm:p-7 shadow-xs"
    >
      {/* Header and short invitation line */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 mb-4 border-b border-teal-200/70">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-teal-800" />
            <h3 className="text-lg font-bold text-stone-900">
              Community Feedback & Discussion
            </h3>
          </div>
          <p className="text-sm text-stone-700 mt-1 font-medium">
            Tell us what worked for you and what did not.
          </p>
        </div>

        <a
          href={`https://${DISQUS_SHORTNAME}.disqus.com`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-teal-800 hover:text-teal-950 font-medium flex items-center gap-1 self-start sm:self-auto transition-colors"
        >
          <span>Powered by Disqus</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Disqus Container */}
      <div className="min-h-[220px] relative" style={{ color: '#1f2937' }}>
        {loadFailed ? (
          <div className="py-8 text-center text-xs text-stone-500 bg-stone-50 border border-stone-200 rounded-xl p-4">
            <p className="font-semibold text-stone-700 mb-1">
              Comments could not be loaded inline
            </p>
            <p className="max-w-md mx-auto mb-3">
              This usually happens when an ad-blocker or browser privacy shield blocks third-party scripts.
            </p>
            <a
              href={`https://${DISQUS_SHORTNAME}.disqus.com`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-stone-800 text-white rounded-lg hover:bg-stone-700"
            >
              <span>Open discussion on Disqus</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ) : !scriptLoaded ? (
          <div className="py-6 text-center text-xs text-stone-400">
            Connecting to Disqus discussion thread…
          </div>
        ) : null}
        <div id="disqus_thread" className="w-full" style={{ color: '#1f2937' }} />
      </div>

      <noscript>
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
          Please enable JavaScript to view the{' '}
          <a
            href="https://disqus.com/?ref_noscript"
            className="underline font-semibold"
          >
            comments powered by Disqus.
          </a>
        </div>
      </noscript>
    </section>
  );
}

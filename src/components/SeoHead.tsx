import React, { useEffect } from 'react';
import { Platform } from 'react-native';

const APP_TITLE = 'سیخوڕ - یاری کوردی | Spy Kurdish Game';
const APP_DESCRIPTION = 'یاری سیخوڕ بە زمانی کوردی - A Kurdish Spy party game.';
const APP_KEYWORDS = 'Kurdish game, spy game, party game, سیخوڕ, یاری کوردی';

const SeoHead: React.FC = () => {
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') {
      return;
    }

    const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const canonicalUrl = typeof window !== 'undefined' ? window.location.href : '';
    const ogImage = siteUrl ? `${siteUrl}/assets/spy-icon.png` : '';

    document.title = APP_TITLE;

    const upsertMeta = (selector: string, attrs: Record<string, string>) => {
      let meta = document.head.querySelector<HTMLMetaElement>(selector);
      if (!meta) {
        meta = document.createElement('meta');
        Object.entries(attrs).forEach(([key, value]) => meta!.setAttribute(key, value));
        document.head.appendChild(meta);
      } else {
        Object.entries(attrs).forEach(([key, value]) => meta!.setAttribute(key, value));
      }
    };

    const upsertLink = (relValue: string, hrefValue: string) => {
      let link = document.head.querySelector<HTMLLinkElement>(`link[rel="${relValue}"]`);
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', relValue);
        document.head.appendChild(link);
      }
      link.setAttribute('href', hrefValue);
    };

    upsertMeta('meta[name="description"]', { name: 'description', content: APP_DESCRIPTION });
    upsertMeta('meta[name="keywords"]', { name: 'keywords', content: APP_KEYWORDS });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: 'index,follow' });
    upsertMeta('meta[name="theme-color"]', { name: 'theme-color', content: '#667eea' });

    if (canonicalUrl) {
      upsertLink('canonical', canonicalUrl);
    }

    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'سیخوڕ' });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: APP_TITLE });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: APP_DESCRIPTION });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    if (siteUrl) {
      upsertMeta('meta[property="og:url"]', { property: 'og:url', content: siteUrl });
    }
    if (ogImage) {
      upsertMeta('meta[property="og:image"]', { property: 'og:image', content: ogImage });
    }

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: APP_TITLE });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: APP_DESCRIPTION });
    if (ogImage) {
      upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: ogImage });
    }
  }, []);

  return null;
};

export default SeoHead;

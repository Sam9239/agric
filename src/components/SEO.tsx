import { useEffect } from 'react';

const SITE_URL = 'https://jaosefagrosupplies.co.ke';
const DEFAULT_IMAGE = `${SITE_URL}/images/brand/jaosef-logo-light.webp`;

type SEOProps = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
};

function absoluteUrl(pathOrUrl: string) {
  if (pathOrUrl.startsWith('http')) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`;
}

function setMeta(selector: string, attr: 'content' | 'href', value: string) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;

  if (!element) {
    if (selector.startsWith('meta')) {
      element = document.createElement('meta');
      const nameMatch = selector.match(/name="([^"]+)"/);
      const propertyMatch = selector.match(/property="([^"]+)"/);
      if (nameMatch) element.setAttribute('name', nameMatch[1]);
      if (propertyMatch) element.setAttribute('property', propertyMatch[1]);
    } else {
      element = document.createElement('link');
      const relMatch = selector.match(/rel="([^"]+)"/);
      if (relMatch) element.setAttribute('rel', relMatch[1]);
    }
    document.head.appendChild(element);
  }

  element.setAttribute(attr, value);
}

export default function SEO({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
}: SEOProps) {
  useEffect(() => {
    const canonical = absoluteUrl(path);
    const ogImage = absoluteUrl(image);

    document.title = title;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('link[rel="canonical"]', 'href', canonical);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', canonical);
    setMeta('meta[property="og:type"]', 'content', type === 'product' ? 'website' : type);
    setMeta('meta[property="og:image"]', 'content', ogImage);
    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:image"]', 'content', ogImage);
  }, [description, image, path, title, type]);

  return null;
}

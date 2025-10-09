import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  keywords?: string[];
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
}

const SEO = ({
  title = 'MIDEESSI - Nous sommes indépendant',
  description = 'MIDEESSI est une startup béninoise dédiée à l’autonomie numérique. Nous créons des solutions d’automatisation, d’apprentissage et d’intelligence artificielle accessibles à tous. Notre mission : rendre la technologie simple, utile et locale.',
  image = '/og-image.jpg',
  type = 'website',
  keywords = [
    'MIDEESSI',
    'startup tech bénin',
    'innovation africaine',
    'indépendance technologique',
    'automatisation',
    'intelligence artificielle',
    'PDF éducatifs',
    'apprentissage mobile',
    'éducation numérique',
    'jeunes créateurs africains'
  ],
  article,
}: SEOProps) => {
  const location = useLocation();
  const siteUrl = 'https://mideessi.com';
  const fullUrl = `${siteUrl}${location.pathname}`;
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

  useEffect(() => {
    const seoTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
    document.title = seoTitle;

    const metaTags = [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords.join(', ') },
      { name: 'author', content: article?.author || 'MIDEESSI Team' },
      { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
      { name: 'googlebot', content: 'index, follow' },
      { name: 'language', content: 'fr' },
      { name: 'revisit-after', content: '5 days' },
      { name: 'rating', content: 'general' },

      // SEO local et géographique
      { name: 'geo.region', content: 'BJ' },
      { name: 'geo.placename', content: 'Cotonou' },
      { name: 'geo.position', content: '6.3703;2.3912' },
      { name: 'ICBM', content: '6.3703, 2.3912' },

      // Open Graph
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: type },
      { property: 'og:url', content: fullUrl },
      { property: 'og:site_name', content: 'MIDEESSI' },
      { property: 'og:locale', content: 'fr_FR' },
      { property: 'og:locale:alternate', content: 'en_US' },
      { property: 'og:image', content: fullImage },
      { property: 'og:image:secure_url', content: fullImage },
      { property: 'og:image:alt', content: 'MIDEESSI - Startup tech africaine' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },

      // Twitter / X
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@mideessi' },
      { name: 'twitter:creator', content: '@mideessi' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: fullImage },
      { name: 'twitter:image:alt', content: 'MIDEESSI - Communauté tech du Bénin' },

      // Mobile & PWA
      { name: 'theme-color', content: '#191970' },
      { name: 'msapplication-TileColor', content: '#191970' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'apple-mobile-web-app-title', content: 'MIDEESSI' },
      { name: 'format-detection', content: 'telephone=no' },

      // Sécurité
      { name: 'referrer', content: 'origin-when-cross-origin' },
      { 'http-equiv': 'Content-Type', content: 'text/html; charset=utf-8' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
    ];

    if (type === 'article' && article) {
      const articleMeta = [
        { property: 'article:published_time', content: article.publishedTime || new Date().toISOString() },
        { property: 'article:modified_time', content: article.modifiedTime || new Date().toISOString() },
        { property: 'article:author', content: article.author || 'MIDEESSI' },
        { property: 'article:section', content: article.section || 'Innovation' },
        { property: 'article:publisher', content: 'https://facebook.com/mideessi' },
      ];
      if (article.tags && article.tags.length > 0) {
        article.tags.forEach(tag => {
          articleMeta.push({ property: 'article:tag', content: tag });
        });
      }
      metaTags.push(...articleMeta);
    }

    metaTags.forEach(({ name, property, content, 'http-equiv': httpEquiv }) => {
      if (!content) return;
      const attribute = property ? 'property' : httpEquiv ? 'http-equiv' : 'name';
      const value = property || httpEquiv || name;
      let element = document.querySelector(`meta[${attribute}="${value}"]`);
      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        element.setAttribute(attribute, value);
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    });

    // Canonical
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullUrl);

    // JSON-LD
    const structuredData =
      type === 'article' && article
        ? {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: title,
            description,
            image: fullImage,
            author: {
              '@type': 'Organization',
              name: article.author || 'MIDEESSI',
              url: siteUrl,
            },
            publisher: {
              '@type': 'Organization',
              name: 'MIDEESSI',
              url: siteUrl,
              logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
            },
            datePublished: article.publishedTime || new Date().toISOString(),
            dateModified: article.modifiedTime || new Date().toISOString(),
            mainEntityOfPage: { '@type': 'WebPage', '@id': fullUrl },
            keywords: article.tags || keywords,
          }
        : {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'MIDEESSI',
            alternateName: 'MIDEESSI Tech Community',
            url: siteUrl,
            logo: `${siteUrl}/logo.png`,
            description:
              'MIDEESSI est une startup tech béninoise qui inspire, forme et crée. Nous développons des solutions locales d’automatisation et d’intelligence artificielle pour libérer le potentiel des jeunes africains.',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Cotonou',
              addressCountry: 'BJ',
            },
            sameAs: [
              'https://facebook.com/mideessi',
              'https://twitter.com/mideessi',
              'https://linkedin.com/company/mideessi',
              'https://github.com/mideessi',
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              email: 'contact@mideessi.com',
              contactType: 'Support',
              areaServed: 'Africa',
              availableLanguage: ['French', 'English'],
            },
          };

    let scriptTag = document.querySelector('script[type="application/ld+json"]#structured-data');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      scriptTag.setAttribute('id', 'structured-data');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

    const preconnects = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];
    preconnects.forEach(url => {
      if (!document.querySelector(`link[rel="preconnect"][href="${url}"]`)) {
        const link = document.createElement('link');
        link.setAttribute('rel', 'preconnect');
        link.setAttribute('href', url);
        if (url.includes('gstatic')) link.setAttribute('crossorigin', 'anonymous');
        document.head.appendChild(link);
      }
    });
  }, [title, description, image, type, keywords, article, fullUrl, fullImage]);

  return null;
};

export default SEO;

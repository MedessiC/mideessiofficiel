import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  keywords?: string[];
}

const SEO = ({
  title = 'MIDEESSI - Solutions d\'automatisation et d\'IA',
  description = 'MIDEESSI développe des solutions innovantes d\'automatisation et d\'intelligence artificielle. Nous sommes indépendants et dédiés à servir notre communauté technologique.',
  image = '/og-image.jpg',
  type = 'website',
  keywords = ['automatisation', 'intelligence artificielle', 'IA', 'technologie', 'innovation', 'MIDEESSI', 'Bénin', 'startup'],
}: SEOProps) => {
  const location = useLocation();
  const siteUrl = 'https://mideessi.com';
  const fullUrl = `${siteUrl}${location.pathname}`;

  useEffect(() => {
    document.title = title;

    const metaTags = [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords.join(', ') },
      { name: 'author', content: 'MIDEESSI' },
      { name: 'robots', content: 'index, follow' },
      { name: 'language', content: 'French' },
      { name: 'revisit-after', content: '7 days' },

      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: type },
      { property: 'og:url', content: fullUrl },
      { property: 'og:image', content: image },
      { property: 'og:site_name', content: 'MIDEESSI' },
      { property: 'og:locale', content: 'fr_FR' },

      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },

      { name: 'theme-color', content: '#191970' },
      { name: 'msapplication-TileColor', content: '#191970' },
    ];

    metaTags.forEach(({ name, property, content }) => {
      const attribute = property ? 'property' : 'name';
      const value = property || name;

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

    const canonicalLink = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    canonicalLink.setAttribute('href', fullUrl);
    if (!document.querySelector('link[rel="canonical"]')) {
      document.head.appendChild(canonicalLink);
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'MIDEESSI',
      description: description,
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      sameAs: [
        'https://facebook.com/mideessi',
        'https://linkedin.com/company/mideessi',
        'https://github.com/mideessi',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'contact@mideessi.com',
        contactType: 'Customer Service',
        areaServed: 'BJ',
        availableLanguage: ['French', 'English'],
      },
    };

    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);
  }, [title, description, image, type, keywords, fullUrl]);

  return null;
};

export default SEO;

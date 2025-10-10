import { Helmet } from 'react-helmet-async';
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
  description = 'MIDEESSI est une startup béninoise dédiée à l\'autonomie numérique. Nous créons des solutions d\'automatisation, d\'apprentissage et d\'intelligence artificielle accessibles à tous.',
  image = '/og-image.jpg',
  type = 'website',
  keywords = [
    'MIDEESSI',
    'startup tech bénin',
    'innovation africaine',
    'indépendance technologique',
    'automatisation',
    'intelligence artificielle',
  ],
  article,
}: SEOProps) => {
  const location = useLocation();
  const siteUrl = 'https://mideessi.com';
  const fullUrl = `${siteUrl}${location.pathname}`;
  
  // Gestion intelligente de l'URL de l'image
  let fullImage = '';
  if (image) {
    if (image.startsWith('http://') || image.startsWith('https://')) {
      fullImage = image;
    } else if (image.startsWith('/')) {
      fullImage = `${siteUrl}${image}`;
    } else {
      fullImage = `${siteUrl}/${image}`;
    }
  } else {
    fullImage = `${siteUrl}/og-image.jpg`;
  }

  const seoTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;

  // JSON-LD Structure Data
  const structuredData = type === 'article' && article
    ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description,
        image: {
          '@type': 'ImageObject',
          url: fullImage,
          width: 1200,
          height: 630
        },
        author: {
          '@type': 'Organization',
          name: article.author || 'MIDEESSI',
          url: siteUrl,
        },
        publisher: {
          '@type': 'Organization',
          name: 'MIDEESSI',
          url: siteUrl,
          logo: { 
            '@type': 'ImageObject', 
            url: `${siteUrl}/logo.png`,
            width: 200,
            height: 200
          },
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
        description,
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
      };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang="fr" />
      <title>{seoTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={article?.author || 'MIDEESSI Team'} />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook / WhatsApp / LinkedIn */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:secure_url" content={fullImage} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="MIDEESSI" />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@mideessi" />
      <meta name="twitter:creator" content="@mideessi" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={title} />

      {/* Article Specific Meta Tags */}
      {type === 'article' && article && (
        <>
          <meta property="article:published_time" content={article.publishedTime || new Date().toISOString()} />
          <meta property="article:modified_time" content={article.modifiedTime || new Date().toISOString()} />
          <meta property="article:author" content={article.author || 'MIDEESSI'} />
          <meta property="article:section" content={article.section || 'Innovation'} />
          <meta property="article:publisher" content="https://facebook.com/mideessi" />
          {article.tags?.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Mobile & Theme */}
      <meta name="theme-color" content="#191970" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* Structured Data JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ShareRedirect = () => {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isCrawler = /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|WhatsApp|TelegramBot|Slackbot|Discordbot|Pinterest|Googlebot|bingbot|Slurp/i.test(userAgent);

    const targetUrl = isCrawler
      ? `https://mideessi-seo.onrender.com/blog/${slug}`
      : `/blog/${slug}`;

    window.location.href = targetUrl;
  }, [slug]);

  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Redirection en cours...</h1>
      <p>Chargement de l’article <strong>{slug}</strong></p>
    </main>
  );
};

export default ShareRedirect;

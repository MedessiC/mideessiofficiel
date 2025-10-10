// server.js (Version ES6 Modules)
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configuration Supabase
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

// Vérifier que les variables sont chargées
console.log('🔍 Vérification des variables d\'environnement:');
console.log('SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? '✅ Défini' : '❌ Manquant');
console.log('SUPABASE_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? '✅ Défini' : '❌ Manquant');

if (!SUPABASE_URL || SUPABASE_URL === 'METTEZ_VOTRE_URL_ICI') {
  console.error('\n❌ ERREUR: Variables d\'environnement non configurées!');
  console.error('📝 Créez un fichier .env à la racine avec:');
  console.error('SUPABASE_URL=votre_url');
  console.error('SUPABASE_ANON_KEY=votre_clé\n');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Liste des User-Agents des crawlers de réseaux sociaux
const SOCIAL_CRAWLERS = [
  'facebookexternalhit',
  'Facebot',
  'Twitterbot',
  'LinkedInBot',
  'WhatsApp',
  'TelegramBot',
  'Slackbot',
  'Discordbot',
  'Pinterest',
  'Googlebot',
  'bingbot',
  'Slurp' // Yahoo
];

// Détecter si c'est un crawler
function isSocialCrawler(userAgent) {
  if (!userAgent) return false;
  return SOCIAL_CRAWLERS.some(bot => 
    userAgent.toLowerCase().includes(bot.toLowerCase())
  );
}

// Échapper les caractères HTML pour éviter les injections
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Générer le HTML avec les méta-tags Open Graph
function generateOGHtml(post, siteUrl) {
  const imageUrl = post.image_url?.startsWith('http') 
    ? post.image_url 
    : `${siteUrl}${post.image_url}`;
  
  const title = escapeHtml(post.title);
  const excerpt = escapeHtml(post.excerpt);
  const author = escapeHtml(post.author);
  const category = escapeHtml(post.category);
  
  const tags = post.tags?.map(tag => 
    `<meta property="article:tag" content="${escapeHtml(tag)}">`
  ).join('\n  ') || '';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | Blog MIDEESSI</title>
  <meta name="description" content="${excerpt}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  
  <!-- Open Graph / Facebook / WhatsApp / LinkedIn -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${siteUrl}/blog/${post.slug}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${excerpt}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:secure_url" content="${imageUrl}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${title}">
  <meta property="og:site_name" content="MIDEESSI">
  <meta property="og:locale" content="fr_FR">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@mideessi">
  <meta name="twitter:creator" content="@mideessi">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${excerpt}">
  <meta name="twitter:image" content="${imageUrl}">
  <meta name="twitter:image:alt" content="${title}">
  
  <!-- Article Meta -->
  <meta property="article:published_time" content="${post.published_at}">
  <meta property="article:modified_time" content="${post.updated_at || post.published_at}">
  <meta property="article:author" content="${author}">
  <meta property="article:section" content="${category}">
  <meta property="article:publisher" content="https://facebook.com/mideessi">
  ${tags}
  
  <!-- Canonical -->
  <link rel="canonical" href="${siteUrl}/blog/${post.slug}">
  
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  
  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "${title}",
    "description": "${excerpt}",
    "image": {
      "@type": "ImageObject",
      "url": "${imageUrl}",
      "width": 1200,
      "height": 630
    },
    "author": {
      "@type": "Person",
      "name": "${author}"
    },
    "publisher": {
      "@type": "Organization",
      "name": "MIDEESSI",
      "url": "${siteUrl}",
      "logo": {
        "@type": "ImageObject",
        "url": "${siteUrl}/logo.png"
      }
    },
    "datePublished": "${post.published_at}",
    "dateModified": "${post.updated_at || post.published_at}",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "${siteUrl}/blog/${post.slug}"
    }
  }
  </script>
  
  <!-- Redirection immédiate pour crawlers -->
  <meta http-equiv="refresh" content="0;url=/blog/${post.slug}">
  <script>
    // Redirection JavaScript (backup)
    if (!/bot|crawler|spider|crawling/i.test(navigator.userAgent)) {
      window.location.href = '/blog/${post.slug}';
    }
  </script>
  
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      line-height: 1.6;
    }
    img { max-width: 100%; height: auto; border-radius: 8px; }
    h1 { color: #191970; margin-bottom: 10px; }
    .meta { color: #666; font-size: 14px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <div class="meta">Par ${author} • ${category}</div>
  <img src="${imageUrl}" alt="${title}">
  <p>${excerpt}</p>
  <p><em>Chargement de l'article complet...</em></p>
</body>
</html>`;
}

// Middleware pour logger les requêtes
app.use((req, res, next) => {
  const userAgent = req.headers['user-agent'] || 'Unknown';
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log(`User-Agent: ${userAgent.substring(0, 100)}...`);
  next();
});

// Route spéciale pour les articles de blog
app.get('/blog/:slug', async (req, res, next) => {
  const userAgent = req.headers['user-agent'] || '';
  const { slug } = req.params;

  console.log(`\n📄 Article demandé: /blog/${slug}`);
  
  // Si c'est un crawler de réseau social
  if (isSocialCrawler(userAgent)) {
    console.log(`🔍 Crawler détecté! Génération du HTML statique...`);
    
    try {
      // Récupérer l'article depuis Supabase
      const { data: post, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) {
        console.error('❌ Erreur Supabase:', error.message);
        throw error;
      }

      if (post) {
        console.log(`✅ Article trouvé: "${post.title}"`);
        console.log(`🖼️  Image: ${post.image_url}`);
        
        const siteUrl = process.env.SITE_URL || 'https://mideessi.com';
        const html = generateOGHtml(post, siteUrl);
        
        res.set('Content-Type', 'text/html; charset=utf-8');
        res.set('Cache-Control', 'public, max-age=3600'); // Cache 1h
        return res.send(html);
      } else {
        console.log(`⚠️  Article non trouvé: ${slug}`);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération:', error);
    }
  } else {
    console.log(`👤 Visiteur normal, servir React App`);
  }

  // Pour les visiteurs normaux, continuer vers React
  next();
});

// Servir les fichiers statiques du build Vite
const distPath = path.join(__dirname, 'dist');
console.log(`📁 Dossier dist: ${distPath}`);
app.use(express.static(distPath));

// Fallback: toutes les autres routes servent index.html (pour React Router)
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 ========================================`);
  console.log(`🚀 Serveur MIDEESSI démarré avec succès!`);
  console.log(`🚀 ========================================`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📁 Dossier: ${distPath}`);
  console.log(`🔗 Supabase: ${process.env.VITE_SUPABASE_URL? '✅ Connecté' : '❌ Non configuré'}`);
  console.log(`🚀 ========================================\n`);
});
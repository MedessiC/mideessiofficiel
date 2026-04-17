// server.js (Version ES6 Modules) - Optimisé pour Render + Netlify Proxy
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configuration Supabase avec fallback pour les variables d'environnement
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const SITE_URL = process.env.SITE_URL || 'https://mideessi.com';

// Vérifier que les variables sont chargées
console.log('🔍 Vérification des variables d\'environnement:');
console.log('SUPABASE_URL:', SUPABASE_URL ? '✅ Défini' : '❌ Manquant');
console.log('SUPABASE_KEY:', SUPABASE_KEY ? '✅ Défini' : '❌ Manquant');
console.log('SITE_URL:', SITE_URL);

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('\n❌ ERREUR: Variables d\'environnement non configurées!');
  console.error('📝 Sur Render, ajoutez ces variables d\'environnement:');
  console.error('SUPABASE_URL=votre_url_supabase');
  console.error('SUPABASE_ANON_KEY=votre_clé_supabase');
  console.error('SITE_URL=https://mideessi.com\n');
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
<html lang="fr" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | Blog MIDEESSI</title>
  <meta name="description" content="${excerpt}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="author" content="${author}">
  
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
  <link rel="icon" type="image/x-icon" href="${siteUrl}/favicon.ico">
  
  <!-- Structured Data JSON-LD -->
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
        "url": "${siteUrl}/logo.png",
        "width": 200,
        "height": 200
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
  
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      line-height: 1.6;
      background: #f8f9fa;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    img { 
      max-width: 100%; 
      height: auto; 
      border-radius: 8px;
      margin: 20px 0;
    }
    h1 { 
      color: #191970; 
      margin-bottom: 10px;
      font-size: 2.5em;
      line-height: 1.2;
    }
    .meta { 
      color: #666; 
      font-size: 14px; 
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 2px solid #f0f0f0;
    }
    .excerpt {
      font-size: 1.2em;
      color: #333;
      line-height: 1.6;
      margin: 20px 0;
    }
    .loading {
      text-align: center;
      color: #666;
      font-style: italic;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${title}</h1>
    <div class="meta">Par ${author} • ${category} • ${new Date(post.published_at).toLocaleDateString('fr-FR')}</div>
    <img src="${imageUrl}" alt="${title}">
    <p class="excerpt">${excerpt}</p>
    <p class="loading">📱 Chargement de l'article complet...</p>
  </div>
</body>
</html>`;
}

// Trust proxy (important pour Netlify/Render)
app.set('trust proxy', true);

// Middleware CORS pour Netlify
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://mideessi.com');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// ============================================================
// STATIC FILES SERVING - Serve assets from public and dist
// ============================================================
// Serve dist folder (built React app)
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1y',
  etag: false
}));

// Serve public folder (static assets)
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1y',
  etag: false
}));

// ============================================================
// CACHE HEADERS - Cache busting intelligent
// ============================================================
app.use((req, res, next) => {
  // HTML files - Never cache (always check for updates)
  if (req.path.endsWith('.html') || req.path === '/') {
    res.set('Cache-Control', 'public, max-age=0, must-revalidate');
  }
  // Static assets with hash (JS, CSS, images) - Cache for 1 year
  else if (/\.(js|css|woff2|ttf|eot|svg|png|jpg|jpeg|webp|gif|webmanifest)$/.test(req.path)) {
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  // API routes and JSON and manifest - Never cache
  else if (req.path.startsWith('/api/') || req.path.endsWith('.json') || req.path.endsWith('.webmanifest')) {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }
  // Default - Don't cache
  else {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
  
  // Add version header for debugging
  res.set('X-Cache-Version', '1.0');
  next();
});

// Middleware pour logger les requêtes
app.use((req, res, next) => {
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const forwarded = req.headers['x-forwarded-for'] || req.ip;
  console.log(`\n${new Date().toISOString()}`);
  console.log(`📍 ${req.method} ${req.path}`);
  console.log(`🌍 IP: ${forwarded}`);
  console.log(`🤖 User-Agent: ${userAgent.substring(0, 80)}...`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'MIDEESSI SEO Server',
    supabase: SUPABASE_URL ? 'connected' : 'disconnected'
  });
});

// Route racine
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>MIDEESSI SEO Server</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          max-width: 600px;
          margin: 100px auto;
          padding: 40px;
          text-align: center;
          background: #f8f9fa;
        }
        .box {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 2px 20px rgba(0,0,0,0.1);
        }
        h1 { color: #191970; margin-bottom: 20px; }
        p { color: #666; line-height: 1.6; }
        .status { 
          display: inline-block;
          padding: 8px 16px;
          background: #28a745;
          color: white;
          border-radius: 20px;
          font-size: 14px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="box">
        <h1>🚀 MIDEESSI SEO Server</h1>
        <p>Serveur de génération de meta-tags Open Graph pour les articles de blog.</p>
        <p>Ce serveur est utilisé automatiquement par Netlify pour les crawlers de réseaux sociaux.</p>
        <div class="status">✅ Opérationnel</div>
      </div>
    </body>
    </html>
  `);
});

// Route spéciale pour les articles de blog
app.get('/blog/:slug', async (req, res) => {
  const userAgent = req.headers['user-agent'] || '';
  const { slug } = req.params;

  console.log(`\n📄 Article demandé: ${slug}`);
  
  // Si c'est un crawler de réseau social
  if (isSocialCrawler(userAgent)) {
    console.log(`🔍 Crawler détecté! Génération du HTML...`);
    
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
        return res.status(404).send(`
          <!DOCTYPE html>
          <html><head><title>Article introuvable</title></head>
          <body><h1>❌ Article non trouvé</h1><p>Erreur: ${error.message}</p></body>
          </html>
        `);
      }

      if (post) {
        console.log(`✅ Article trouvé: "${post.title}"`);
        console.log(`🖼️  Image: ${post.image_url}`);
        console.log(`📅 Publié: ${post.published_at}`);
        
        const html = generateOGHtml(post, SITE_URL);
        
        res.set('Content-Type', 'text/html; charset=utf-8');
        res.set('Cache-Control', 'public, max-age=3600'); // Cache 1h
        return res.send(html);
      } else {
        console.log(`⚠️  Article non trouvé: ${slug}`);
        return res.status(404).send(`
          <!DOCTYPE html>
          <html><head><title>Article introuvable</title></head>
          <body><h1>❌ Article non trouvé</h1></body>
          </html>
        `);
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      return res.status(500).send(`
        <!DOCTYPE html>
        <html><head><title>Erreur serveur</title></head>
        <body><h1>❌ Erreur serveur</h1><p>${error.message}</p></body>
        </html>
      `);
    }
  } else {
    // Visiteur normal : rediriger vers le site principal
    console.log(`👤 Visiteur normal → Redirection vers mideessi.com`);
    return res.redirect(301, `${SITE_URL}/blog/${slug}`);
  }
});

// Toutes les autres routes
app.use((req, res) => {
  console.log(`⚠️  Route inconnue: ${req.path}`);
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>404 - Page non trouvée</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          max-width: 600px;
          margin: 100px auto;
          padding: 40px;
          text-align: center;
        }
        h1 { color: #191970; }
        a { color: #FFD700; text-decoration: none; }
      </style>
    </head>
    <body>
      <h1>🔍 Page non trouvée</h1>
      <p>Cette route n'existe pas sur le serveur SEO MIDEESSI.</p>
      <p><a href="${SITE_URL}">← Retour au site principal</a></p>
    </body>
    </html>
  `);
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 ========================================`);
  console.log(`🚀 Serveur MIDEESSI SEO démarré!`);
  console.log(`🚀 ========================================`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🔗 Supabase: ${SUPABASE_URL ? '✅ Connecté' : '❌ Non configuré'}`);
  console.log(`🌍 Site principal: ${SITE_URL}`);
  console.log(`🚀 ========================================\n`);
});
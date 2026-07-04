// server.js (Version ES6 Modules) - Optimisé pour Render + Netlify Proxy
import 'dotenv/config';
import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { getSecurityHeaders } from './server/securityHeaders.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const allowedOrigins = new Set([
  'https://mideessi.com',
  'https://www.mideessi.com',
  'http://localhost:5173',
  'http://localhost:3000',
]);

function sanitizeText(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/[<>]/g, '').trim().slice(0, 200);
}

function normalizeEmail(value) {
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase();
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (Array.isArray(forwarded)) return forwarded[0];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.ip || 'unknown';
}

function createRateLimiter(maxRequests, windowMs) {
  const requests = new Map();

  return (req, res, next) => {
    const key = getClientIp(req);
    const now = Date.now();
    const windowStart = now - windowMs;
    const recent = requests.get(key) || [];
    const filtered = recent.filter(timestamp => timestamp > windowStart);

    filtered.push(now);
    requests.set(key, filtered);

    if (filtered.length > maxRequests) {
      return res.status(429).json({ error: 'Trop de requêtes, veuillez réessayer plus tard.' });
    }

    next();
  };
}

const generalLimiter = createRateLimiter(100, 15 * 60 * 1000);
const sensitiveLimiter = createRateLimiter(20, 15 * 60 * 1000);

// Configuration Supabase avec fallback pour les variables d'environnement
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const SITE_URL = process.env.SITE_URL || 'https://mideessi.com';
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || process.env.VITE_CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || process.env.VITE_CLOUDINARY_API_SECRET;

// Vérifier que les variables sont chargées
console.log('🔍 Vérification des variables d\'environnement:');
console.log('SUPABASE_URL:', SUPABASE_URL ? '✅ Défini' : '❌ Manquant');
console.log('SUPABASE_KEY:', SUPABASE_KEY ? '✅ Défini' : '❌ Manquant');
console.log('SITE_URL:', SITE_URL);
console.log('CLOUDINARY_CLOUD_NAME:', CLOUDINARY_CLOUD_NAME ? '✅ Défini' : '❌ Manquant');
console.log('CLOUDINARY_API_KEY:', CLOUDINARY_API_KEY ? '✅ Défini' : '❌ Manquant');
console.log('CLOUDINARY_API_SECRET:', CLOUDINARY_API_SECRET ? '✅ Défini' : '❌ Manquant');

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('\n❌ ERREUR: SUPABASE_URL ou SUPABASE_KEY manquant — configuration requise!');
  process.exit(1);
}

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.warn('\n⚠️  Cloudinary non configuré — certaines routes d\'upload seront désactivées en local.');
  console.warn('Ajoutez CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET, ou leurs versions VITE_CLOUDINARY_* dans votre .env.\n');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Create a server-side Supabase client using the service role key when available
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : supabase; // fallback to anon if service key not provided (less secure)

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
app.disable('x-powered-by');
app.set('trust proxy', true);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.has(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    res.header('Access-Control-Allow-Origin', 'https://mideessi.com');
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use((req, res, next) => {
  const headers = getSecurityHeaders();
  res.set(headers);
  next();
});

app.use('/api', generalLimiter);

// ============================================================
// STATIC FILES - Simple serving
// ============================================================
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'public')));

// Cache headers - simple
app.use((req, res, next) => {
  // Assets with hash - cache 1 year
  if (/\/assets\/.+\.[0-9a-f]{8}\./.test(req.path)) {
    res.set('Cache-Control', 'public, max-age=31536000');
  }
  // Everything else - no cache
  else {
    res.set('Cache-Control', 'no-cache');
  }
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

// Debug endpoint to verify database setup
app.get('/api/debug/db-status', async (req, res) => {
  if (process.env.NODE_ENV === 'production' && process.env.ENABLE_DEBUG_ENDPOINT !== 'true') {
    return res.status(404).json({ error: 'Endpoint indisponible' });
  }

  try {
    console.log('🔍 Checking database status...');
    
    // Check if sequences table exists
    const { data: seqData, error: seqError } = await supabaseAdmin
      .from('sequences')
      .select('*')
      .limit(1);
    
    if (seqError) {
      console.error('Sequences table check failed:', seqError);
      return res.status(400).json({ 
        error: 'Sequences table not found or accessible',
        details: seqError.message,
        hint: 'Run migration: 20260604_add_sequences_and_ids.sql'
      });
    }

    // Check if clients table exists
    const { data: clientsData, error: clientsError } = await supabaseAdmin
      .from('clients')
      .select('*')
      .limit(1);
    
    if (clientsError) {
      console.error('Clients table check failed:', clientsError);
      return res.status(400).json({ 
        error: 'Clients table not found or accessible',
        details: clientsError.message,
        hint: 'Run migration: 20260414_create_clients_system.sql'
      });
    }

    // Test RPC function
    const { data: rpcData, error: rpcError } = await supabaseAdmin.rpc('next_client_id', { pole_input: 'presence_digitale' });
    if (rpcError) {
      console.error('RPC function test failed:', rpcError);
      return res.status(400).json({ 
        error: 'next_client_id RPC function failed',
        details: rpcError.message,
        hint: 'Check migration: 20260604_add_sequences_and_ids.sql'
      });
    }

    res.json({ 
      status: 'ok',
      message: 'All database tables and functions are properly configured',
      checks: {
        sequences_table: 'accessible',
        clients_table: 'accessible', 
        client_infos_table: 'accessible',
        next_client_id_rpc: 'working',
        last_generated_id: rpcData
      }
    });
  } catch (err) {
    console.error('DB status check error:', err);
    res.status(500).json({ error: 'Error checking database', details: err.message });
  }
});

// Signature Cloudinary sécurisée pour l'upload client-side
app.get('/api/cloudinary-signature', (req, res) => {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return res.status(500).json({
      error: 'Cloudinary non configuré',
      details: 'Ajoutez CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET (ou leurs variantes VITE_CLOUDINARY_*) dans votre environnement.'
    });
  }

  const folder = typeof req.query.folder === 'string' ? sanitizeText(req.query.folder) : 'mideessi';
  if (!/^[a-zA-Z0-9/_-]{1,100}$/.test(folder)) {
    return res.status(400).json({ error: 'Nom de dossier invalide' });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signatureBase = `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
  const signature = crypto.createHash('sha1').update(signatureBase).digest('hex');

  res.json({
    cloudName: CLOUDINARY_CLOUD_NAME,
    apiKey: CLOUDINARY_API_KEY,
    timestamp,
    signature,
    folder,
  });
});

const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = process.env.EMAIL_PORT;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_FROM = process.env.EMAIL_FROM || 'MIDEESSI <no-reply@mideessi.com>';

const emailTransporter = EMAIL_HOST && EMAIL_PORT && EMAIL_USER && EMAIL_PASSWORD
  ? nodemailer.createTransport({
      host: EMAIL_HOST,
      port: Number(EMAIL_PORT),
      secure: Number(EMAIL_PORT) === 465,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
    })
  : null;

app.use('/api/send-client-invite', sensitiveLimiter);

app.post('/api/send-client-invite', async (req, res) => {
  if (!emailTransporter) {
    return res.status(500).json({ error: 'Serveur email non configuré' });
  }

  const { clientName, email, clientId, tempPassword, contractNumber, contractUrl } = req.body || {};

  const safeEmail = normalizeEmail(email);
  const safeClientName = sanitizeText(clientName);
  const safeClientId = sanitizeText(clientId);
  const safeTempPassword = sanitizeText(tempPassword);
  const safeContractNumber = sanitizeText(contractNumber);
  const safeContractUrl = typeof contractUrl === 'string' && /^https?:\/\//.test(contractUrl.trim())
    ? contractUrl.trim()
    : '';

  if (!safeEmail || !validateEmail(safeEmail) || !safeClientId || !safeTempPassword || !safeContractNumber) {
    return res.status(400).json({ error: 'Payload invalide pour email d\'invitation' });
  }

  const loginUrl = `${SITE_URL}/clients`;
  const emailHtml = `
    <p>Bonjour ${safeClientName || 'client'},</p>
    <p>Votre espace client MIDEESSI a été créé.</p>
    <ul>
      <li><strong>ID client :</strong> ${safeClientId}</li>
      <li><strong>Mot de passe temporaire :</strong> ${safeTempPassword}</li>
      <li><strong>Numéro de contrat :</strong> ${safeContractNumber}</li>
    </ul>
    ${safeContractUrl ? `<p>Votre contrat est disponible ici : <a href="${safeContractUrl}">${safeContractUrl}</a></p>` : ''}
    <p>Connectez-vous ici : <a href="${loginUrl}">${loginUrl}</a></p>
    <p>Pour des raisons de sécurité, changez votre mot de passe après votre première connexion.</p>
    <p>À bientôt,</p>
    <p>L'équipe MIDEESSI</p>
  `;

  try {
    await emailTransporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject: `Bienvenue chez MIDEESSI — accès client ${safeClientId}`,
      text: `Bonjour ${safeClientName || 'client'},\n\nVotre espace client MIDEESSI a été créé.\nID client : ${safeClientId}\nMot de passe temporaire : ${safeTempPassword}\nNuméro de contrat : ${safeContractNumber}\n${safeContractUrl ? `Contrat : ${safeContractUrl}\n` : ''}\nConnectez-vous ici : ${loginUrl}\n\nMerci,\nL'équipe MIDEESSI`,
      html: emailHtml,
    });

    return res.status(200).json({ status: 'sent' });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ error: 'Échec de l\'envoi de l\'email' });
  }
});

app.use('/api/send-quote-confirmation', sensitiveLimiter);

app.post('/api/send-quote-confirmation', async (req, res) => {
  if (!emailTransporter) {
    return res.status(500).json({ error: 'Serveur email non configuré' });
  }

  const { email, clientName, offerName, status, quoteUrl, comment } = req.body || {};
  const safeEmail = normalizeEmail(email);
  const safeClientName = sanitizeText(clientName);
  const safeOfferName = sanitizeText(offerName);
  const safeStatus = sanitizeText(status);
  const safeComment = sanitizeText(comment);
  const safeQuoteUrl = typeof quoteUrl === 'string' && /^https?:\/\//.test(quoteUrl.trim())
    ? quoteUrl.trim()
    : '';

  if (!safeEmail || !validateEmail(safeEmail) || !safeOfferName || !safeStatus) {
    return res.status(400).json({ error: 'Payload invalide pour notification de devis' });
  }

  const statusLabelMap = {
    quote_ready: 'Votre devis est prêt',
    confirmed: 'Votre dossier est confirmé',
  };

  const emailSubject = safeStatus === 'confirmed'
    ? `Devis confirmé – ${safeOfferName}`
    : `Devis disponible – ${safeOfferName}`;

  const emailHtml = `
    <p>Bonjour ${safeClientName || 'client'},</p>
    <p>${statusLabelMap[safeStatus] || 'Votre demande de devis a été mise à jour'} pour <strong>${safeOfferName}</strong>.</p>
    ${safeQuoteUrl ? `<p>Vous pouvez télécharger votre devis ici : <a href="${safeQuoteUrl}">${safeQuoteUrl}</a></p>` : ''}
    ${safeComment ? `<p>Message : ${safeComment}</p>` : ''}
    <p>Nous restons à votre disposition si vous souhaitez échanger sur cette proposition.</p>
    <p>Cordialement,</p>
    <p>L'équipe MIDEESSI</p>
  `;

  try {
    await emailTransporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject: emailSubject,
      text: `Bonjour ${safeClientName || 'client'},\n\n${statusLabelMap[safeStatus] || 'Votre demande de devis a été mise à jour'} pour ${safeOfferName}.\n${safeQuoteUrl ? `Téléchargez le devis ici : ${safeQuoteUrl}\n` : ''}${safeComment ? `Message : ${safeComment}\n` : ''}\nCordialement,\nL'équipe MIDEESSI`,
      html: emailHtml,
    });

    return res.status(200).json({ status: 'sent' });
  } catch (error) {
    console.error('Quote confirmation email error:', error);
    return res.status(500).json({ error: 'Échec de l\'envoi de l\'email de devis' });
  }
});

app.use('/api/next-client-id', sensitiveLimiter);

// Endpoint to get next client id for a given pole (presence_digitale | dev_tech)
app.post('/api/next-client-id', async (req, res) => {
  try {
    const { pole } = req.body || {};
    if (!pole || (pole !== 'presence_digitale' && pole !== 'dev_tech')) {
      return res.status(400).json({ error: 'Pole invalide. Use presence_digitale or dev_tech' });
    }

    // Call Postgres function next_client_id via Supabase RPC using service role for reliability
    const { data, error } = await supabaseAdmin.rpc('next_client_id', { pole_input: pole });
    if (error) {
      console.error('Error generating next client id:', error);
      return res.status(500).json({ error: 'Erreur génération ID' });
    }

    // supabaseAdmin.rpc returns plain value in data
    return res.json({ client_id: data });
  } catch (err) {
    console.error('Unexpected error in /api/next-client-id:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.use('/api/create-client', sensitiveLimiter);

// Create client server-side: generate id, hash password, insert and send invite (best-effort)
app.post('/api/create-client', async (req, res) => {
  try {
    const { pole, nom_marque, nom_responsable, email, pack, numero_contrat, date_debut, duree_mois } = req.body || {};
    const safePole = typeof pole === 'string' ? pole.trim() : '';
    const safeNomMarque = sanitizeText(nom_marque);
    const safeNomResponsable = sanitizeText(nom_responsable);
    const normalizedEmail = normalizeEmail(email);
    const safePack = sanitizeText(pack) || 'kpevi';
    const safeDureeMois = Number.isInteger(Number(duree_mois)) ? Number(duree_mois) : 12;
    
    // Validate required fields
    if (!safePole || !normalizedEmail || !safeNomMarque) {
      return res.status(400).json({ error: 'Payload invalide: pole, email, nom_marque requis' });
    }
    if (!['presence_digitale','dev_tech'].includes(safePole)) {
      return res.status(400).json({ error: 'Pole invalide' });
    }
    if (!validateEmail(normalizedEmail)) {
      return res.status(400).json({ error: 'Email invalide' });
    }

    // Get client id atomically using admin client for reliability
    const { data: idData, error: idError } = await supabaseAdmin.rpc('next_client_id', { pole_input: safePole });
    if (idError) {
      console.error('next_client_id error:', idError);
      return res.status(500).json({ error: 'Échec génération ID', details: idError.message });
    }
    const client_id = idData;
    console.log(`✅ Generated client_id: ${client_id}`);

    // Generate temporary password server-side
    const tempPassword = generateTempPassword();

    // Hash with SHA256
    const hash = crypto.createHash('sha256').update(tempPassword).digest('hex');

    // Optionally create Supabase Auth user when service role key available
    let authUserId = null;
    try {
      if (supabaseAdmin.auth && supabaseAdmin.auth.admin && typeof supabaseAdmin.auth.admin.createUser === 'function') {
        console.log(`Creating auth user for ${email}...`);
        const createRes = await supabaseAdmin.auth.admin.createUser({ email: normalizedEmail, password: tempPassword, user_metadata: { client_id } });
        if (createRes && createRes.user) {
          authUserId = createRes.user.id;
          console.log(`✅ Auth user created: ${authUserId}`);
        }
      }
    } catch (uErr) {
      console.warn('Supabase auth create user failed (continuing):', uErr.message || uErr);
    }

    // Prepare client data with proper defaults
    const clientData = {
      client_id,
      nom_marque: safeNomMarque,
      nom_responsable: safeNomResponsable,
      email: normalizedEmail,
      password_hash: hash,
      password_temp: tempPassword,
      pack: safePack,
      numero_contrat: sanitizeText(numero_contrat) || `CONTRAT-${client_id}`,
      date_debut: sanitizeText(date_debut) || new Date().toISOString().slice(0, 10),
      duree_mois: safeDureeMois,
      statut: 'actif',
    };

    // Only add auth_user_id if it's set
    if (authUserId) {
      clientData.auth_user_id = authUserId;
    }

    console.log(`Inserting client data:`, JSON.stringify(clientData, null, 2));

    // Insert into clients table using admin client
    const { data: insertRes, error: insertError } = await supabaseAdmin.from('clients').insert([clientData]);

    if (insertError) {
      console.error('Insert client error:', insertError);
      return res.status(500).json({ error: 'Échec insertion client', details: insertError.message });
    }

    console.log(`✅ Client inserted successfully`);

    // create client_infos row
    const { error: infoError } = await supabaseAdmin.from('client_infos').insert([{ client_id }]);
    if (infoError) {
      console.warn('client_infos insert warning:', infoError.message);
    } else {
      console.log(`✅ client_infos record created`);
    }

    // send invite email best-effort
    fetch(`${SITE_URL}/api/send-client-invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientName: safeNomResponsable, email: normalizedEmail, clientId: client_id, tempPassword, contractNumber: sanitizeText(numero_contrat) || `CONTRAT-${client_id}`, contractUrl: '' })
    }).catch(e => console.warn('Invite send failed', e));

    return res.json({ client_id, tempPassword });
  } catch (err) {
    console.error('Unexpected /api/create-client error:', err);
    return res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

// Helper server-side generateTempPassword (12 chars)
function generateTempPassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 12; i++) password += chars.charAt(Math.floor(Math.random() * chars.length));
  return password;
}

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
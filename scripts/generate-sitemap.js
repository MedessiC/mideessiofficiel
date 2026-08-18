// ============================================================
// SITEMAP MIDEESSI.COM - Version Corrigée Google Compliant
// ============================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const disableSupabase = ['DISABLE_SUPABASE', 'SUPABASE_DISABLED', 'VITE_DISABLE_SUPABASE'].some((key) => String(process.env[key] || '').toLowerCase() === 'true');
const hasSupabaseConfig = Boolean(process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY);
const supabase = !disableSupabase && hasSupabaseConfig
  ? createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)
  : null;

const BASE_URL = 'https://mideessi.com';

// Pages principales (6 pages exactes)
const SITE_PAGES = [
  {
    url: '/',
    priority: 1.0,
    changefreq: 'weekly',
    name: 'Page d\'accueil',
  },
  {
    url: '/article',
    priority: 0.7,
    changefreq: 'weekly',
    name: 'Articles',
  },
  {
    url: '/apprendre',
    priority: 0.7,
    changefreq: 'weekly',
    name: 'Apprendre',
  },
  {
    url: '/projects',
    priority: 0.9,
    changefreq: 'weekly',
    name: 'Projets',
  },
  {
    url: '/contact',
    priority: 0.75,
    changefreq: 'monthly',
    name: 'Contact',
  },
];

function getArticlePriority(publishedAt, isFeatured = false, views = 0) {
  const daysOld = Math.floor((Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60 * 24));
  
  let priority = 0.8;
  
  if (daysOld < 7) priority = 0.9;
  else if (daysOld < 30) priority = 0.85;
  else if (daysOld < 90) priority = 0.8;
  else if (daysOld < 180) priority = 0.75;
  else priority = 0.7;
  
  if (isFeatured) priority = Math.min(priority + 0.05, 0.95);
  if (views > 1000) priority = Math.min(priority + 0.05, 0.95);
  else if (views > 500) priority = Math.min(priority + 0.03, 0.95);
  
  return priority;
}

function getChangeFreq(publishedAt) {
  const daysOld = Math.floor((Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysOld < 7) return 'daily';
  if (daysOld < 30) return 'weekly';
  if (daysOld < 180) return 'monthly';
  return 'yearly';
}

async function generateSitemap() {
  console.log('🗺️  Génération du sitemap MIDEESSI.com\n');

  try {
    if (!supabase) {
      console.warn('⚠️ Supabase non configuré: génération du sitemap ignorée.');
      return;
    }

    // Récupérer les articles
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, published_at, is_featured, views, title')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;
    
    console.log(`✅ ${posts?.length || 0} articles récupérés\n`);

    const now = new Date().toISOString();
    
    // XML simplifié (sans namespaces inutiles)
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Pages principales
    SITE_PAGES.forEach(page => {
      sitemap += `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority.toFixed(2)}</priority>
  </url>
`;
    });

    // Articles de blog
    if (posts && posts.length > 0) {
      posts.forEach((post) => {
        const lastMod = new Date(post.updated_at || post.published_at).toISOString();
        const priority = getArticlePriority(post.published_at, post.is_featured, post.views || 0);
        const changefreq = getChangeFreq(post.published_at);
        
        sitemap += `  <url>
    <loc>${BASE_URL}/article/${post.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(2)}</priority>
  </url>
`;
      });
    }

    sitemap += `</urlset>`;

    // Sauvegarder sitemap.xml
    const publicDir = path.join(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    const xmlPath = path.join(publicDir, 'sitemap.xml');
    fs.writeFileSync(xmlPath, sitemap, 'utf-8');
    console.log('✅ sitemap.xml créé !\n');
    
    // Vérifier si robots.txt existe déjà
    const robotsPath = path.join(publicDir, 'robots.txt');
    if (!fs.existsSync(robotsPath)) {
      console.log('⚠️  robots.txt n\'existe pas, création d\'une version basique...\n');
      const robotsTxt = `# mideessi.com robots.txt
User-agent: *
Allow: /

# Sitemaps
Sitemap: ${BASE_URL}/sitemap.xml
Sitemap: ${BASE_URL}/sitemap.txt

# Règles spécifiques
Disallow: /api/
Disallow: /admin/
`;
      fs.writeFileSync(robotsPath, robotsTxt, 'utf-8');
      console.log('✅ robots.txt créé !\n');
    } else {
      console.log('✅ robots.txt existe déjà (non modifié)\n');
    }
    
    // Générer sitemap.txt
    const sitemapTxt = [
      ...SITE_PAGES.map(p => `${BASE_URL}${p.url}`),
      ...(posts?.map(p => `${BASE_URL}/article/${p.slug}`) || []),
    ].join('\n');
    
    const txtPath = path.join(publicDir, 'sitemap.txt');
    fs.writeFileSync(txtPath, sitemapTxt, 'utf-8');
    console.log('✅ sitemap.txt créé !\n');

    // Rapport
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📦 TOTAL URLS: ${6 + (posts?.length || 0)}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('📍 FICHIERS CRÉÉS:');
    console.log(`   ✓ ${xmlPath}`);
    console.log(`   ✓ ${robotsPath}`);
    console.log(`   ✓ ${txtPath}\n`);
    
    console.log('🎯 PROCHAINES ÉTAPES:');
    console.log('   1. Vérifiez: http://localhost:5173/sitemap.xml');
    console.log('   2. Vérifiez: http://localhost:5173/robots.txt');
    console.log('   3. Déployez sur Vercel/Netlify');
    console.log('   4. Testez: https://www.xml-sitemaps.com/validate-xml-sitemap.html');
    console.log('   5. Soumettez à Google Search Console\n');
    
    console.log('🔍 VALIDATION:');
    console.log('   Test XML: https://www.xml-sitemaps.com/validate-xml-sitemap.html?url=' + encodeURIComponent(BASE_URL + '/sitemap.xml'));
    console.log('   Google Test: https://search.google.com/search-console\n');
    
  } catch (error) {
    console.warn('⚠️ Impossible de récupérer les articles depuis Supabase. Le sitemap sera généré sans données dynamiques.', error.message || error);
    const publicDir = path.join(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const now = new Date().toISOString();
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    SITE_PAGES.forEach(page => {
      sitemap += `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority.toFixed(2)}</priority>
  </url>
`;
    });

    sitemap += `</urlset>`;
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf-8');
    fs.writeFileSync(path.join(publicDir, 'sitemap.txt'), SITE_PAGES.map(page => `${BASE_URL}${page.url}`).join('\n'), 'utf-8');
    console.log('✅ sitemap de secours généré sans Supabase\n');
  }
}

generateSitemap();

export { generateSitemap, getArticlePriority, getChangeFreq, SITE_PAGES, BASE_URL };
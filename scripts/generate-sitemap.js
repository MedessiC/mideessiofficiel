// ============================================================
// SITEMAP MIDEESSI.COM - Structure Exacte (6 Pages)
// Version ES Modules
// ============================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Obtenir __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Créer le client Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Configuration
const BASE_URL = 'https://mideessi.com';

// LES 6 PAGES EXACTES DE VOTRE SITE
const SITE_PAGES = [
  {
    url: '/',
    priority: 1.0,
    changefreq: 'weekly',
    name: 'Page d\'accueil',
  },
  {
    url: '/about',
    priority: 0.8,
    changefreq: 'monthly',
    name: 'À propos',
  },
  {
    url: '/learn',
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
    url: '/blog',
    priority: 0.95,
    changefreq: 'daily',
    name: 'Blog',
  },
  {
    url: '/contact',
    priority: 0.75,
    changefreq: 'monthly',
    name: 'Contact',
  },
];

// Calculer la priorité dynamique des articles
function getArticlePriority(publishedAt, isFeatured = false, views = 0) {
  const daysOld = Math.floor((Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60 * 24));
  
  let priority = 0.8; // Base
  
  // Boost selon l'âge
  if (daysOld < 7) priority = 0.9;        // Très récent
  else if (daysOld < 30) priority = 0.85; // Récent
  else if (daysOld < 90) priority = 0.8;  // Assez récent
  else if (daysOld < 180) priority = 0.75;
  else priority = 0.7;                    // Ancien
  
  // Bonus si featured
  if (isFeatured) priority = Math.min(priority + 0.05, 0.95);
  
  // Bonus si populaire
  if (views > 1000) priority = Math.min(priority + 0.05, 0.95);
  else if (views > 500) priority = Math.min(priority + 0.03, 0.95);
  
  return priority;
}

// Calculer la fréquence de changement
function getChangeFreq(publishedAt) {
  const daysOld = Math.floor((Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysOld < 7) return 'daily';
  if (daysOld < 30) return 'weekly';
  if (daysOld < 180) return 'monthly';
  return 'yearly';
}

// Générer le sitemap complet
async function generateSitemap() {
  console.log('🗺️  Génération du sitemap MIDEESSI.com\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    console.log('🔍 Vérification de la configuration...');
    console.log('   - Supabase URL:', process.env.VITE_SUPABASE_URL ? '✅ OK' : '❌ MANQUANT');
    console.log('   - Supabase Key:', process.env.VITE_SUPABASE_ANON_KEY ? '✅ OK' : '❌ MANQUANT');
    console.log('   - Dossier actuel:', __dirname);
    console.log('   - Dossier public:', path.join(__dirname, '../public'));
    console.log('');

    // Récupérer tous les articles publiés
    console.log('📡 Connexion à Supabase...');
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, published_at, is_featured, views, title')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('❌ Erreur Supabase:', error);
      throw error;
    }
    
    console.log(`✅ ${posts?.length || 0} articles récupérés\n`);

    const now = new Date().toISOString();
    
    // Construire le XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">

  <!-- ================================================ -->
  <!-- SITE MIDEESSI.COM - 6 PAGES PRINCIPALES -->
  <!-- Généré automatiquement le ${new Date().toLocaleDateString('fr-FR')} -->
  <!-- ================================================ -->
`;

    // Ajouter les 6 pages principales
    SITE_PAGES.forEach(page => {
      sitemap += `
  <!-- ${page.name} -->
  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>
`;
    });

    // Ajouter les articles de blog
    if (posts && posts.length > 0) {
      sitemap += `
  <!-- ================================================ -->
  <!-- ARTICLES DU BLOG (${posts.length} articles publiés) -->
  <!-- ================================================ -->
`;

      posts.forEach((post) => {
        const lastMod = new Date(post.updated_at || post.published_at).toISOString();
        const priority = getArticlePriority(post.published_at, post.is_featured, post.views || 0);
        const changefreq = getChangeFreq(post.published_at);
        
        sitemap += `
  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(2)}</priority>${post.is_featured ? '\n    <!-- ⭐ Article à la une -->' : ''}
  </url>
`;
      });
    }

    // Fermer le XML
    sitemap += `
</urlset>`;

    // Sauvegarder sitemap.xml
    const xmlPath = path.join(__dirname, '../public/sitemap.xml');
    console.log('💾 Sauvegarde du sitemap XML...');
    console.log('   Chemin:', xmlPath);
    
    // Vérifier que le dossier public existe
    const publicDir = path.join(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      console.log('📁 Création du dossier public...');
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    fs.writeFileSync(xmlPath, sitemap, 'utf-8');
    console.log('✅ sitemap.xml créé !\n');
    
    // Générer aussi sitemap.txt (format alternatif)
    console.log('💾 Sauvegarde du sitemap TXT...');
    const sitemapTxt = [
      ...SITE_PAGES.map(p => `${BASE_URL}${p.url}`),
      ...(posts?.map(p => `${BASE_URL}/blog/${p.slug}`) || []),
    ].join('\n');
    
    const txtPath = path.join(__dirname, '../public/sitemap.txt');
    console.log('   Chemin:', txtPath);
    fs.writeFileSync(txtPath, sitemapTxt, 'utf-8');
    console.log('✅ sitemap.txt créé !\n');

    // Afficher le rapport
    console.log('✅ SITEMAP GÉNÉRÉ AVEC SUCCÈS !\n');
    console.log('📊 CONTENU DU SITEMAP:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Détail des pages principales
    console.log('\n📄 PAGES PRINCIPALES (6):');
    SITE_PAGES.forEach(page => {
      console.log(`   ${page.priority === 1.0 ? '🏠' : page.priority >= 0.9 ? '⭐' : '📄'} ${page.name.padEnd(20)} → ${BASE_URL}${page.url}`);
      console.log(`      Priority: ${page.priority.toFixed(1)} | Freq: ${page.changefreq}`);
    });
    
    // Détail des articles
    if (posts && posts.length > 0) {
      console.log(`\n📝 ARTICLES DE BLOG (${posts.length}):`);
      console.log(`   Total URLs: ${BASE_URL}/blog/{slug} × ${posts.length}`);
      
      // Top 5 articles par priorité
      const topPosts = [...posts]
        .map(p => ({
          ...p,
          calculatedPriority: getArticlePriority(p.published_at, p.is_featured, p.views || 0)
        }))
        .sort((a, b) => b.calculatedPriority - a.calculatedPriority)
        .slice(0, 5);
      
      console.log('\n   Top 5 articles (priorité):');
      topPosts.forEach((p, i) => {
        const title = p.title.length > 40 ? p.title.substring(0, 40) + '...' : p.title;
        console.log(`   ${i + 1}. ${title}`);
        console.log(`      Priority: ${p.calculatedPriority.toFixed(2)} | ${p.is_featured ? '⭐ Featured | ' : ''}${p.views || 0} vues`);
      });
      
      // Distribution par âge
      const nowTime = Date.now();
      const distribution = {
        recent: posts.filter(p => (nowTime - new Date(p.published_at).getTime()) < 7 * 24 * 60 * 60 * 1000).length,
        week: posts.filter(p => {
          const age = nowTime - new Date(p.published_at).getTime();
          return age >= 7 * 24 * 60 * 60 * 1000 && age < 30 * 24 * 60 * 60 * 1000;
        }).length,
        month: posts.filter(p => {
          const age = nowTime - new Date(p.published_at).getTime();
          return age >= 30 * 24 * 60 * 60 * 1000 && age < 90 * 24 * 60 * 60 * 1000;
        }).length,
        old: posts.filter(p => (nowTime - new Date(p.published_at).getTime()) >= 90 * 24 * 60 * 60 * 1000).length,
      };
      
      console.log('\n   Distribution par âge:');
      console.log(`   📅 Moins de 7 jours:   ${distribution.recent} articles (priority ~0.9)`);
      console.log(`   📅 7-30 jours:         ${distribution.week} articles (priority ~0.85)`);
      console.log(`   📅 30-90 jours:        ${distribution.month} articles (priority ~0.8)`);
      console.log(`   📅 Plus de 90 jours:   ${distribution.old} articles (priority ~0.7)`);
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📦 TOTAL URLS: ${6 + (posts?.length || 0)}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('📍 FICHIERS CRÉÉS:');
    console.log(`   ✓ ${xmlPath}`);
    console.log(`   ✓ ${txtPath}\n`);
    
    console.log('🌐 URLS:');
    console.log(`   → https://mideessi.com/sitemap.xml`);
    console.log(`   → https://mideessi.com/sitemap.txt\n`);
    
    console.log('🎯 PROCHAINES ÉTAPES:');
    console.log('   1. Vérifiez localement: http://localhost:5173/sitemap.xml');
    console.log('   2. Déployez votre site');
    console.log('   3. Soumettez à Google Search Console:');
    console.log('      https://search.google.com/search-console');
    console.log('   4. Soumettez à Bing Webmaster Tools:');
    console.log('      https://www.bing.com/webmasters\n');
    
    console.log('💡 ASTUCE: Le sitemap sera automatiquement régénéré');
    console.log('   à chaque exécution de "npm run build"\n');
    
  } catch (error) {
    console.error('\n❌ ERREUR lors de la génération:');
    console.error(error);
    process.exit(1);
  }
}

// Exécuter
generateSitemap();

// Export pour utilisation ailleurs
export {
  generateSitemap,
  getArticlePriority,
  getChangeFreq,
  SITE_PAGES,
  BASE_URL,
};
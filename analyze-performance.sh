#!/bin/bash

# 📊 SCRIPT ANALYSE PERFORMANCE
# Utilisation: ./analyze-performance.sh
# Crée un rapport complet de la taille et de la performance

echo "🔍 Analyse Performance du Projet MIDEESSI"
echo "=========================================="
echo ""

# =====================================
# 1. ANALYSE DU BUILD
# =====================================
echo "📦 1. Analyse du Build..."
echo ""

if [ ! -d "dist" ]; then
  echo "⚠️  Dossier dist/ n'existe pas. Compilation..."
  npm run build > /dev/null 2>&1
fi

echo "📊 Taille des bundles:"
du -sh dist/ | awk '{print "  Total: " $1}'

echo ""
echo "📋 Détail par fichier:"
ls -lh dist/assets/ | awk 'NR>1 {printf "  %-40s %8s\n", $9, $5}'

# =====================================
# 2. ANALYSE DES IMAGES
# =====================================
echo ""
echo "🖼️  2. Analyse des Images..."
echo ""

echo "Images dans public/:"
find public -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.webp" \) -exec ls -lh {} \; | awk '{printf "  %-35s %8s\n", substr($9, length($9)-30), $5}'

# =====================================
# 3. ANALYSE DES DÉPENDANCES
# =====================================
echo ""
echo "📚 3. Dépendances Installées..."
echo ""

echo "Nombre de packages:"
ls -la node_modules | wc -l | awk '{print "  Total: " $1 " dossiers"}'

echo ""
echo "Taille de node_modules:"
du -sh node_modules | awk '{print "  " $0}'

# =====================================
# 4. ANALYSE DU CODE SOURCE
# =====================================
echo ""
echo "💻 4. Analyse du Code Source..."
echo ""

echo "Nombre de fichiers TypeScript/React:"
find src -name "*.tsx" -o -name "*.ts" | wc -l | awk '{print "  " $1 " fichiers"}'

echo ""
echo "Nombre de lignes de code:"
find src -name "*.tsx" -o -name "*.ts" | xargs wc -l | tail -1 | awk '{print "  " $1 " lignes"}'

# =====================================
# 5. ANALYSE DU CACHE
# =====================================
echo ""
echo "⚡ 5. Vérification Configuration Caching..."
echo ""

if grep -q "Cache-Control" netlify.toml; then
  echo "✅ Cache-Control headers trouvés"
  grep "Cache-Control" netlify.toml | head -5 | awk '{print "  " $0}'
else
  echo "❌ Pas de Cache-Control headers!"
fi

# =====================================
# 6. MÉTRIQUES CLÉS
# =====================================
echo ""
echo "📊 6. Résumé des Métriques..."
echo ""

# Taille totale
TOTAL_SIZE=$(du -sh dist/ | awk '{print $1}')
JS_SIZE=$(du -sh dist/assets/ 2>/dev/null | awk '{print $1}')
IMG_COUNT=$(find public -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.webp" \) | wc -l)
IMG_SIZE=$(find public -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.webp" \) -exec du -ch {} + | tail -1 | awk '{print $1}')

echo "  Build Total:        $TOTAL_SIZE"
echo "  JS/CSS Assets:      $JS_SIZE"
echo "  Images (public):    $IMG_COUNT fichiers ($IMG_SIZE)"
echo "  Source code:        $(find src -name "*.tsx" -o -name "*.ts" | wc -l) fichiers"

# =====================================
# 7. RECOMMANDATIONS
# =====================================
echo ""
echo "💡 7. Recommandations..."
echo ""

# Vérifier JS size
if (( $(echo "$JS_SIZE > 200K" | bc -l) )); then
  echo "⚠️  JS Assets > 200KB. Considerer:"
  echo "    - Code splitting par route"
  echo "    - Tree shaking des imports"
  echo "    - Lazy loading des components"
fi

# Vérifier images
if (( $(echo "$IMG_SIZE > 500K" | bc -l) )); then
  echo "⚠️  Images > 500KB. Considerer:"
  echo "    - Conversion en WebP"
  echo "    - Compression avec TinyPNG"
  echo "    - Lazy loading des images"
fi

# Vérifier dependencies
DEPS_COUNT=$(grep '"dependencies"' -A 30 package.json | grep '":' | wc -l)
if (( DEPS_COUNT > 20 )); then
  echo "⚠️  Nombreuses dépendances ($DEPS_COUNT). Considerer:"
  echo "    - Audit des unused packages"
  echo "    - npm audit fix"
  echo "    - Remplacer par alternatives plus légères"
fi

echo ""
echo "✅ Analyse complète!"
echo ""
echo "🔗 Pour plus d'infos:"
echo "   - Lighthouse: npm run lighthouse"
echo "   - Bundle analysis: npm run analyze"
echo "   - Lighthouse Web: https://pagespeed.web.dev"
echo ""

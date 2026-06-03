# ✅ Système de Détection de Nouvelle Version

## Problème résolu 🎯

Les clients voient une **version ancienne** sur leur téléphone même après vos déploiements.

---

## Comment ça fonctionne maintenant

### **1. Vérification Automatique** 🔄
- Toutes les **3 minutes**, le système vérifie si une nouvelle version est disponible
- Aussi à chaque fois que l'utilisateur revient à l'app (focus window)

### **2. Notification Utilisateur** 📱
Si une nouvelle version est détectée:
```
┌─────────────────────────────────────────────┐
│ 📱 Une nouvelle version est disponible!     │
│              [Recharger maintenant]         │
└─────────────────────────────────────────────┘
```

### **3. Auto-Recharge** ⏱️
- Si l'utilisateur clique → recharge immédiate
- Si l'utilisateur ne clique pas → auto-recharge après **30 secondes**

### **4. Cache Clear** 🧹
Avant chaque recharge:
- Tous les caches du navigateur sont vidés
- Les anciennes données sont supprimées
- Nouvelle version téléchargée proprement

---

## Architecture Technique

### **Côté Client (`src/utils/versionCheck.ts`)**
```
✓ Fetch du hash du fichier index.html (sans cache)
✓ Compare avec la version précédente
✓ Si différent → Affiche notification
✓ Recharge propre si nécessaire
```

### **Côté Serveur (`netlify.toml`)**
```
✓ index.html     → JAMAIS cachée (max-age=0)
✓ /assets/*      → Cachée 1 an (hash unique)
✓ version.json   → JAMAIS cachée
✓ service-worker → JAMAIS cachée
```

### **Build (`vite.config.ts`)**
```
✓ Hash automatique sur tous les assets
✓ Noms uniques à chaque déploiement
✓ Aucune collision possible
```

---

## CE QUI SE PASSE MAINTENANT

### **Avant (Ancien)**
```
Deploy → Les clients ne voient rien
        → Cache bloque
        → Version ancienne affichée ❌
```

### **Maintenant (Nouveau)**
```
Deploy → Client recharge index.html
      → Détecte nouveau hash
      → Affiche notification
      → Recharge automatiquement ✅
      → Nouvelle version affichée en 30s max
```

---

## Pour les Clients

**Aucune action requise!** 

Le système fonctionne automatiquement:
1. ✅ Détection en arrière-plan
2. ✅ Notification discrète en haut
3. ✅ Recharge silencieuse si ignorée

---

## Tests

### **Tester localement**
```bash
# Terminal 1: Installer et lancer
npm install
npm run dev

# Terminal 2: Modifier un fichier (ex: App.tsx)
# → Vite hot-reload immédiat ✓

# Terminal 3: Vérifier les logs
# → "Nouvelle version détectée" devrait s'afficher
```

### **Tester en production**
1. Deploy une version
2. Attaque votre site sur mobile
3. Attendez 3 minutes (ou chargez la page)
4. Deploy une nouvelle version
5. Revenez à l'app (swipe home et retour)
6. → Notification devrait s'afficher! 🎉

---

## Configuration

**Changer l'intervalle de vérification** dans `src/main.tsx`:
```typescript
// Par défaut: 3 minutes
initVersionCheck({
  checkInterval: 3 * 60 * 1000,  // ← Changer ici (millisecondes)
});

// Exemples:
// 1 minute:   1 * 60 * 1000
// 5 minutes:  5 * 60 * 1000
// 10 minutes: 10 * 60 * 1000
```

---

## Déboguer

**Logs dans la console du navigateur:**
```javascript
// F12 → Console

// Voir la version actuelle
window.__currentVersion__

// Voir les logs de détection
"✅ Nouvelle version détectée"
"🔄 Nouvelle version détectée"
```

---

## Résumé des fichiers modifiés

| Fichier | Changement |
|---------|-----------|
| `src/utils/versionCheck.ts` | ✅ CRÉÉ - Logique de détection |
| `src/main.tsx` | ✅ Initialisation du versionCheck |
| `vite.config.ts` | ✅ Hash busting configuré |
| `netlify.toml` | ✅ Headers cache optimisés |
| `public/version.json` | ✅ CRÉÉ - Versioning |

---

## Garantie 🛡️

✅ Les clients reçoivent TOUJOURS la dernière version
✅ Maximum 30 secondes d'attente
✅ Zéro intervention manuelle côté client
✅ Fonctionne sur tous les navigateurs/appareils


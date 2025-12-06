# 📦 Guide d'Installation - VR Shopping Game

## Installation Rapide (Recommandée)

### Méthode 1: Sans Installation (Le Plus Simple)
**Aucune installation requise!** Ouvrez simplement `index.html` dans votre navigateur:

1. Téléchargez ou clonez ce projet
2. Double-cliquez sur `index.html`
3. Le jeu se lance directement! 🎮

**Navigateurs recommandés:**
- ✅ Google Chrome (recommandé pour VR)
- ✅ Firefox
- ✅ Microsoft Edge
- ✅ Safari (macOS)

---

## Installation Complète (Pour Développeurs)

### Prérequis

#### 1. Node.js (Optionnel mais recommandé)
Pour utiliser le serveur local et les commandes npm.

**Windows:**
- Téléchargez depuis [nodejs.org](https://nodejs.org/)
- Installez la version LTS (Long Term Support)
- Vérifiez l'installation:
  ```bash
  node --version
  npm --version
  ```

**macOS:**
```bash
# Avec Homebrew
brew install node

# Ou téléchargez depuis nodejs.org
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install nodejs npm
```

**Linux (Fedora):**
```bash
sudo dnf install nodejs npm
```

#### 2. Git (Pour cloner le projet)
**Windows:**
- Téléchargez depuis [git-scm.com](https://git-scm.com/)

**macOS:**
```bash
# Avec Homebrew
brew install git

# Ou utiliser Xcode Command Line Tools
xcode-select --install
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt install git

# Fedora
sudo dnf install git
```

---

## 🚀 Installation Étape par Étape

### Étape 1: Cloner le Projet
```bash
git clone https://github.com/ADLIB-Mrani/VR-SHOPING-GAME.git
cd VR-SHOPING-GAME
```

### Étape 2: Installer les Dépendances (Optionnel)
```bash
npm install
```

Cette commande installe:
- `http-server`: Serveur web léger pour tester localement

### Étape 3: Lancer l'Application

#### Option A: Avec npm (Recommandé)
```bash
npm start
```
Le jeu s'ouvre automatiquement dans votre navigateur à `http://localhost:8080`

#### Option B: Avec Python 3
```bash
python -m http.server 8080
```
Puis ouvrez `http://localhost:8080` dans votre navigateur

#### Option C: Avec Python 2
```bash
python -m SimpleHTTPServer 8080
```
Puis ouvrez `http://localhost:8080` dans votre navigateur

#### Option D: Avec PHP
```bash
php -S localhost:8080
```
Puis ouvrez `http://localhost:8080` dans votre navigateur

#### Option E: Ouvrir directement
Double-cliquez sur `index.html` - Pas de serveur nécessaire!

---

## 🎮 Configuration VR (Optionnel)

### Pour Utiliser un Casque VR

#### 1. Casques Compatibles
- ✅ Meta Quest / Quest 2 / Quest 3
- ✅ Meta Quest Pro
- ✅ HTC Vive / Vive Pro
- ✅ Valve Index
- ✅ Windows Mixed Reality
- ✅ PlayStation VR (avec adaptateur PC)

#### 2. Configuration du Navigateur

**Pour Chrome (Recommandé):**
1. Ouvrez Chrome
2. Allez dans `chrome://flags`
3. Recherchez "WebXR"
4. Activez "WebXR Device API"
5. Redémarrez Chrome

**Pour Firefox:**
1. Ouvrez Firefox
2. Tapez `about:config` dans la barre d'adresse
3. Recherchez `dom.vr.enabled`
4. Mettez à `true`
5. Recherchez `dom.vr.webxr.enabled`
6. Mettez à `true`
7. Redémarrez Firefox

#### 3. Connecter Votre Casque
- **Oculus/Meta Quest**: Utilisez Oculus Link ou Air Link
- **Autres casques**: Connectez via SteamVR ou le logiciel du fabricant

---

## 🔧 Dépannage

### Problème: Le jeu ne se charge pas
**Solution:**
1. Vérifiez votre connexion Internet (nécessaire pour charger A-Frame)
2. Essayez un autre navigateur
3. Videz le cache du navigateur (Ctrl+Shift+Del)
4. Vérifiez la console JavaScript (F12)

### Problème: "npm: command not found"
**Solution:**
Node.js n'est pas installé. Suivez les instructions d'installation de Node.js ci-dessus.

### Problème: Port 8080 déjà utilisé
**Solution:**
Utilisez un autre port:
```bash
npx http-server -p 3000 -o
# Ou
python -m http.server 3000
```

### Problème: Les produits ne sont pas cliquables
**Solution:**
1. Assurez-vous que JavaScript est activé
2. Attendez que la scène VR soit complètement chargée (5-10 secondes)
3. Rapprochez-vous des produits dans la scène

### Problème: Le casque VR n'est pas détecté
**Solution:**
1. Vérifiez que le casque est bien connecté
2. Activez WebXR dans les paramètres du navigateur (voir ci-dessus)
3. Utilisez Chrome ou Firefox (meilleur support WebXR)
4. Redémarrez le navigateur après avoir connecté le casque

### Problème: "CORS error" ou erreurs de chargement
**Solution:**
N'ouvrez pas `index.html` directement depuis le système de fichiers pour éviter les erreurs CORS. Utilisez un serveur local:
```bash
npm start
# Ou
python -m http.server 8080
```

---

## 📱 Installation sur Mobile

### Android
1. Ouvrez Chrome ou Firefox sur votre téléphone
2. Allez sur l'URL du jeu hébergé
3. Ou transférez les fichiers sur votre téléphone et ouvrez `index.html`

**Pour VR Mobile (Google Cardboard):**
1. Installez Google Cardboard
2. Utilisez Chrome
3. Cliquez sur l'icône VR dans le jeu

### iOS (iPhone/iPad)
1. Ouvrez Safari
2. Allez sur l'URL du jeu
3. Support VR limité sur iOS

---

## 🌐 Hébergement en Ligne (Optionnel)

Pour partager votre jeu avec d'autres:

### Option 1: GitHub Pages (Gratuit)
1. Poussez votre code sur GitHub
2. Allez dans Settings > Pages
3. Sélectionnez la branche `main`
4. Votre jeu sera disponible sur `https://username.github.io/VR-SHOPING-GAME`

### Option 2: Netlify (Gratuit)
1. Créez un compte sur [netlify.com](https://netlify.com)
2. Glissez-déposez votre dossier de projet
3. Votre jeu est en ligne!

### Option 3: Vercel (Gratuit)
1. Créez un compte sur [vercel.com](https://vercel.com)
2. Importez votre projet GitHub
3. Déploiement automatique!

---

## 🧪 Vérifier l'Installation

Après l'installation, testez que tout fonctionne:

1. **Test Rapide**: Ouvrez `test.html` dans votre navigateur
   - Cliquez sur "Tester le Panier" → Devrait être tout vert ✅
   - Cliquez sur "Tester les Produits" → Devrait être tout vert ✅
   - Cliquez sur "Tester la Livraison" → Devrait être tout vert ✅

2. **Test VR**: Ouvrez `index.html`
   - Vous devriez voir le magasin VR
   - Le panneau "Panier" devrait être visible à droite
   - Vous devriez pouvoir vous déplacer avec WASD

---

## 📚 Ressources Supplémentaires

- **Documentation A-Frame**: [aframe.io/docs](https://aframe.io/docs/)
- **Guide WebXR**: [immersiveweb.dev](https://immersiveweb.dev/)
- **Issues GitHub**: [Signaler un problème](https://github.com/ADLIB-Mrani/VR-SHOPING-GAME/issues)

---

## ✅ Checklist d'Installation

- [ ] Node.js installé (optionnel)
- [ ] Git installé (pour cloner)
- [ ] Projet cloné localement
- [ ] Dépendances installées (`npm install`)
- [ ] Serveur lancé (`npm start`)
- [ ] Jeu accessible dans le navigateur
- [ ] Tests passent (test.html)
- [ ] VR configuré (si applicable)

---

## 🆘 Besoin d'Aide?

- 📧 **Email**: support@vr-store.com
- 🐛 **Bugs**: [GitHub Issues](https://github.com/ADLIB-Mrani/VR-SHOPING-GAME/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/ADLIB-Mrani/VR-SHOPING-GAME/discussions)

**Bon shopping en VR! 🎮🛍️**

# Guide de déploiement — Talent·Ya

Ce guide te mène du repo local jusqu'à l'app en ligne, étape par étape.

---

## ⚠️ Étape 0 — Avant tout

**Si tu ne l'as pas encore fait, révoque ta clé Anthropic exposée précédemment** :
1. https://console.anthropic.com/settings/keys
2. Trouve la clé qui commence par `sk-ant-api03-up_Db4ls...` → **Revoke**
3. Génère une nouvelle clé → garde-la précieusement (tu vas la coller dans Render uniquement)

---

## 🐙 Étape 1 — Pousser sur GitHub

### a) Créer le repo sur GitHub
1. Va sur https://github.com/new
2. Nom : `talent-ya` (ou ce que tu veux)
3. **Public ou Private** au choix
4. **NE coche RIEN** (pas de README, .gitignore ou licence — on les a déjà)
5. Crée le repo → copie l'URL HTTPS (ex : `https://github.com/TON-USERNAME/talent-ya.git`)

### b) Push depuis ton terminal
Place-toi dans le dossier `talent-ya` (celui qui contient `backend/` et `frontend/`) :

```bash
cd talent-ya

git init
git add .
git commit -m "Initial commit — Talent-Ya"
git branch -M main
git remote add origin https://github.com/TON-USERNAME/talent-ya.git
git push -u origin main
```

Si Git te demande tes identifiants, utilise un **Personal Access Token** (Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token) à la place du mot de passe.

---

## 🗄️ Étape 2 — Créer la base PostgreSQL sur Render

1. Va sur https://dashboard.render.com
2. **New +** (en haut à droite) → **PostgreSQL**
3. Configure :
   - Name : `talent-ya-db`
   - Database : `talent_ya`
   - User : `talent_ya`
   - Region : `Frankfurt` (le plus proche de l'Afrique de l'Ouest)
   - **Plan : Free**
4. **Create Database**
5. Attends ~1-2 minutes que la DB soit prête
6. Une fois prête, va dans la page de la DB → section **Connections** → copie la **Internal Database URL** (commence par `postgresql://...`). Garde-la sous le coude.

---

## 🚀 Étape 3 — Déployer le backend sur Render

1. **New +** → **Web Service**
2. **Build and deploy from a Git repository** → connecte ton compte GitHub si pas déjà fait
3. Sélectionne le repo `talent-ya`
4. Configure :
   - **Name** : `talent-ya-api`
   - **Region** : `Frankfurt` (la même que la DB !)
   - **Branch** : `main`
   - **Root Directory** : `backend`
   - **Runtime** : `Node`
   - **Build Command** : `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command** : `node src/index.js`
   - **Plan** : `Free`
5. Tout en bas : **Advanced** → **Add Environment Variable** (4 fois) :

| Key | Value |
|---|---|
| `DATABASE_URL` | (colle l'Internal Database URL de l'étape 2) |
| `JWT_SECRET` | (génère sur https://generate-secret.vercel.app/32 ou tape n'importe quoi de long et aléatoire) |
| `ANTHROPIC_API_KEY` | (ta nouvelle clé Anthropic) |
| `NODE_ENV` | `production` |

6. **Create Web Service**
7. Attends 2-5 minutes que le build se termine. Tu verras les logs en direct.
8. Une fois `Live` (vert), note l'URL en haut, ex : `https://talent-ya-api.onrender.com`
9. Teste rapidement : ouvre `https://talent-ya-api.onrender.com/health` — tu dois voir `{"ok":true,"ts":...}`

> **Note** : sur le plan Free, le service s'endort après 15 min d'inactivité. Le premier appel après réveil prend ~30s. Acceptable pour démarrer.

---

## 🌐 Étape 4 — Déployer le frontend sur Vercel

1. Va sur https://vercel.com → **Add New** → **Project**
2. Importe le repo `talent-ya`
3. Configure :
   - **Framework Preset** : `Vite` (devrait être détecté)
   - **Root Directory** : `frontend` (clique **Edit** pour le changer)
   - Build et Output settings : laisse les valeurs par défaut
4. **Environment Variables** → ajoute :

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://talent-ya-api.onrender.com` (ton URL Render de l'étape 3) |

5. **Deploy**
6. Attends ~2 minutes. Une fois fini, tu auras l'URL : `https://talent-ya.vercel.app` (ou similaire)

---

## 🔁 Étape 5 — Reboucler le CORS

Le backend doit autoriser les requêtes depuis l'URL Vercel. Retour sur Render :

1. Dashboard Render → ton service `talent-ya-api` → **Environment**
2. **Add Environment Variable** :
   - Key : `FRONTEND_URL`
   - Value : `https://talent-ya.vercel.app` (ton URL Vercel exacte, sans slash final)
3. Save → le service redémarre automatiquement (~1 min)

---

## ✅ Étape 6 — Test final

1. Ouvre ton URL Vercel
2. Crée un compte (3+ caractères pour le username, 6+ pour le mot de passe)
3. Lance une analyse → ça doit fonctionner
4. Teste la simulation → doit fonctionner
5. Vérifie la progression → tes données doivent être enregistrées

---

## 🐛 En cas de problème

**Le frontend marche mais l'analyse échoue** :
- Ouvre la console navigateur (F12) → onglet Network → relance l'analyse → regarde la requête `/api/analysis/run`
- Si erreur CORS : vérifie que `FRONTEND_URL` sur Render correspond exactement à ton URL Vercel
- Si 401 : le token JWT est invalide, déconnecte-toi et reconnecte-toi
- Si 500 : va voir les logs Render → onglet **Logs** du service

**Le backend ne démarre pas** :
- Onglet **Logs** sur Render → cherche l'erreur
- Erreur Prisma : la migration n'a pas tourné → vérifie le **Build Command**
- Erreur "DATABASE_URL not found" : vérifie l'env var

**Le service Render est lent au démarrage** :
- Plan Free → endormissement après 15 min. Normal. Solutions :
  - Upgrade en Starter ($7/mois) pour rester actif
  - Ping le `/health` toutes les 14 min via un cron externe (UptimeRobot gratuit)

---

## 🔄 Mises à jour

Toute modification poussée sur la branche `main` redéploie automatiquement les deux services.

```bash
git add .
git commit -m "ce que tu as changé"
git push
```

Render rebuild le backend, Vercel rebuild le frontend. Aucune action manuelle.

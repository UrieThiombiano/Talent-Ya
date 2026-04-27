# Talent·Ya

Agent IA pour l'amélioration des candidatures sur le marché africain.
Analyse de CV + simulation recruteur + suivi de progression + module de formation.

## Architecture

```
talent-ya/
├── backend/          # API Node.js + Express + Prisma + PostgreSQL
└── frontend/         # React + Vite + Tailwind
```

- **Backend** déployé sur Render (Web Service + PostgreSQL gratuit)
- **Frontend** déployé sur Vercel
- **IA** : API Claude (clé stockée UNIQUEMENT côté backend, jamais exposée)

---

## 🚀 Démarrage rapide en local

### Prérequis
- Node.js 20+
- PostgreSQL local (ou utilise la DB Render directement)
- Une clé API Anthropic ([console.anthropic.com](https://console.anthropic.com/settings/keys))

### Backend

```bash
cd backend
cp .env.example .env
# édite .env : DATABASE_URL, JWT_SECRET, ANTHROPIC_API_KEY
npm install
npx prisma migrate dev --name init
npm run dev
# → http://localhost:4000
```

### Frontend

```bash
cd frontend
cp .env.example .env
# par défaut : VITE_API_URL=http://localhost:4000
npm install
npm run dev
# → http://localhost:5173
```

---

## ☁️ Déploiement

### 1. Pousser sur GitHub

```bash
cd talent-ya
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<TON-USERNAME>/talent-ya.git
git push -u origin main
```

### 2. Déployer le backend sur Render

1. Va sur [render.com](https://render.com) → **New +** → **PostgreSQL** (Free tier)
   - Note la `Internal Database URL` (commence par `postgresql://...`)
2. **New +** → **Web Service** → connecte ton repo GitHub
   - **Root Directory** : `backend`
   - **Build Command** : `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command** : `node src/index.js`
3. **Environment Variables** :
   ```
   DATABASE_URL    = <Internal Database URL de l'étape 1>
   JWT_SECRET      = <génère une chaîne aléatoire de 32+ caractères>
   ANTHROPIC_API_KEY = <ta nouvelle clé Anthropic>
   FRONTEND_URL    = https://<ton-app>.vercel.app  (à mettre après l'étape 3)
   NODE_ENV        = production
   ```
4. Clique sur **Deploy**. Note l'URL : `https://<ton-app>.onrender.com`

### 3. Déployer le frontend sur Vercel

1. Va sur [vercel.com](https://vercel.com) → **Add New** → **Project** → importe le repo
2. **Root Directory** : `frontend`
3. **Framework Preset** : Vite
4. **Environment Variables** :
   ```
   VITE_API_URL = https://<ton-app>.onrender.com
   ```
5. **Deploy**.
6. Récupère l'URL Vercel (ex: `https://talent-ya.vercel.app`) et **retourne sur Render** mettre à jour `FRONTEND_URL` avec cette URL → redeploy automatique.

---

## 🔐 Sécurité

- La clé Anthropic n'est **jamais** dans le code source ni accessible depuis le frontend.
- Mots de passe hachés avec `bcrypt` (10 rounds).
- Authentification par JWT (expiration 7 jours).
- CORS restreint à `FRONTEND_URL`.
- Aucun fichier CV n'est stocké : ils sont analysés à la volée et oubliés.

## 📚 Stack

**Backend** : Express, Prisma, PostgreSQL, JWT, bcrypt, Anthropic SDK
**Frontend** : React 18, Vite, Tailwind CSS, lucide-react

## Licence

MIT
"# Talent-Ya" 

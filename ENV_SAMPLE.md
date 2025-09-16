# Variables d'Environnement - Game Vote Festival SaaS

Ce document liste toutes les variables d'environnement nécessaires pour faire fonctionner l'application Game Vote Festival en mode SaaS.

## 🚀 Configuration de Base

### Supabase (Obligatoire)
```bash
# URL de votre projet Supabase
VITE_SUPABASE_URL=https://votre-projet.supabase.co

# Clé publique Supabase (anon key)
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Clé de service Supabase (pour les edge functions)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# URL de connexion à la base de données (pour migrations)
SUPABASE_DB_URL=postgresql://postgres:[PASSWORD]@db.votre-projet.supabase.co:5432/postgres
```

## 💳 Paiements (Phase SaaS)

### Stripe
```bash
# Clé publique Stripe (frontend)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... # Mode test
# VITE_STRIPE_PUBLISHABLE_KEY=pk_live_... # Mode production

# Clé secrète Stripe (backend/edge functions)
STRIPE_SECRET_KEY=sk_test_... # Mode test
# STRIPE_SECRET_KEY=sk_live_... # Mode production

# Webhook secret pour vérifier les événements Stripe
STRIPE_WEBHOOK_SECRET=whsec_...

# URL de retour après paiement
STRIPE_SUCCESS_URL=https://votre-domaine.com/success
STRIPE_CANCEL_URL=https://votre-domaine.com/cancel
```

## 📧 Emails

### Resend (Recommandé)
```bash
# Clé API Resend pour l'envoi d'emails
RESEND_API_KEY=re_...

# Email d'expédition par défaut
FROM_EMAIL=noreply@votre-domaine.com

# Nom de l'expéditeur
FROM_NAME="Game Vote Festival"
```

### Alternative : SendGrid
```bash
# Clé API SendGrid
SENDGRID_API_KEY=SG....

# Email vérifié SendGrid
SENDGRID_FROM_EMAIL=noreply@votre-domaine.com
```

## 🔍 Monitoring & Analytics

### Sentry (Monitoring d'erreurs)
```bash
# DSN Sentry pour le frontend
VITE_SENTRY_DSN=https://...@....ingest.sentry.io/...

# Token d'authentification Sentry
SENTRY_AUTH_TOKEN=...

# Organisation et projet Sentry
SENTRY_ORG=votre-organisation
SENTRY_PROJECT=game-vote-festival
```

### Google Analytics
```bash
# ID de mesure Google Analytics 4
VITE_GA_MEASUREMENT_ID=G-...
```

### Posthog (Analyse comportementale)
```bash
# Clé publique Posthog
VITE_POSTHOG_KEY=phc_...

# URL de l'instance Posthog
VITE_POSTHOG_HOST=https://app.posthog.com
```

## 🔐 Authentification Externe

### Google OAuth
```bash
# Client ID Google pour OAuth
VITE_GOOGLE_CLIENT_ID=...apps.googleusercontent.com

# Secret client Google (edge functions)
GOOGLE_CLIENT_SECRET=GOCSPX-...
```

### GitHub OAuth
```bash
# Client ID GitHub
VITE_GITHUB_CLIENT_ID=...

# Secret client GitHub
GITHUB_CLIENT_SECRET=...
```

## 🏗️ Infrastructure

### Docker & Déploiement
```bash
# Mot de passe administrateur Grafana
GRAFANA_PASSWORD=votre-mot-de-passe-securise

# Mot de passe Redis
REDIS_PASSWORD=votre-mot-de-passe-redis

# Email pour les certificats Let's Encrypt
ACME_EMAIL=admin@votre-domaine.com
```

### Vercel (Si déployé sur Vercel)
```bash
# Token d'API Vercel
VERCEL_TOKEN=...

# ID de l'équipe Vercel (optionnel)
VERCEL_TEAM_ID=team_...
```

## 🧪 Tests & CI/CD

### GitHub Actions
```bash
# Token GitHub pour les actions
GITHUB_TOKEN=ghp_...

# Token Chromatic pour les tests visuels
CHROMATIC_PROJECT_TOKEN=...
```

### Tests E2E
```bash
# URL de base pour les tests E2E
E2E_BASE_URL=http://localhost:5173

# Utilisateur de test
E2E_TEST_EMAIL=test@example.com
E2E_TEST_PASSWORD=testpassword123
```

## 🔧 Configuration Avancée

### Performance
```bash
# Activer le mode de débogage
VITE_DEBUG=false

# Niveau de log
LOG_LEVEL=info # debug, info, warn, error

# Timeout des requêtes API (en ms)
API_TIMEOUT=30000
```

### Sécurité
```bash
# Secret pour JWT (si utilisé)
JWT_SECRET=votre-secret-jwt-ultra-securise

# Durée de validité des tokens (en secondes)
JWT_EXPIRES_IN=3600

# CORS origins autorisées
CORS_ORIGINS=https://votre-domaine.com,https://www.votre-domaine.com
```

## 📋 Comment utiliser ce fichier

1. **Développement local** : Copiez `.env.example` vers `.env.local`
2. **Staging** : Configurez les variables dans votre plateforme de déploiement
3. **Production** : Utilisez des secrets sécurisés, jamais de variables en dur

## ⚠️ Sécurité

- **Jamais de secrets en dur** dans le code source
- **Utilisez des variables d'environnement** pour tous les tokens/clés
- **Rotez régulièrement** vos clés d'API
- **Séparez** les environnements dev/staging/prod

## 🔗 Liens Utiles

- [Supabase Dashboard](https://app.supabase.com/)
- [Stripe Dashboard](https://dashboard.stripe.com/)
- [Resend Dashboard](https://resend.com/dashboard)
- [Sentry Dashboard](https://sentry.io/)
- [Vercel Dashboard](https://vercel.com/dashboard)

---

*Dernière mise à jour : 16/09/2025*
*Version : 1.0.0*
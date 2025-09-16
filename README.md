# 🎲 Game Vote Festival - SaaS Platform

> **Plateforme SaaS complète de vote et gestion de jeux de société pour événements et festivals**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Version](https://img.shields.io/badge/version-1.0.0-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()
[![TypeScript](https://img.shields.io/badge/typescript-5.5.3-blue)]()
[![React](https://img.shields.io/badge/react-18.3.1-blue)]()

## 🚀 Description du Projet

Game Vote Festival est une plateforme SaaS permettant aux organisateurs d'événements de créer et gérer des concours de vote pour jeux de société. Les participants peuvent découvrir, évaluer et voter pour leurs jeux préférés lors de festivals, salons et événements dédiés.

### ✨ Fonctionnalités Principales

- **🎯 Gestion d'événements** : Création et administration d'événements
- **🎲 Catalogue de jeux** : Base de données complète avec images et descriptions
- **🏆 Système de concours** : Création de concours avec périodes de vote
- **⭐ Votes et évaluations** : Interface intuitive pour voter et commenter
- **👥 Multi-utilisateurs** : Gestion des rôles (admin, organisateur, joueur)
- **📊 Analytics** : Tableaux de bord et statistiques détaillées
- **🔐 Authentification** : Système sécurisé avec Supabase Auth

## 🛠️ Stack Technique

### Frontend
- **React 18** avec TypeScript
- **Vite** pour le build et développement
- **Tailwind CSS** + **shadcn/ui** pour l'interface
- **React Router** pour la navigation
- **React Query** pour la gestion d'état asynchrone

### Backend & Base de Données
- **Supabase** (PostgreSQL + API REST + Auth)
- **Row Level Security (RLS)** pour la sécurité
- **Edge Functions** pour la logique métier
- **Real-time subscriptions** pour les mises à jour live

### DevOps & Infrastructure
- **Docker** + **Docker Compose** pour le déploiement
- **Nginx** comme reverse proxy et serveur statique
- **Prometheus** + **Grafana** pour le monitoring
- **GitHub Actions** pour CI/CD

## 🏗️ Installation et Développement

### Prérequis
- Node.js 20+ 
- npm ou yarn
- Docker (optionnel, pour le déploiement)

### Installation Locale

```bash
# 1. Cloner le repository
git clone <votre-repo-url>
cd game-vote-festival

# 2. Installer les dépendances
npm ci

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés Supabase

# 4. Démarrer le serveur de développement
npm run dev
```

### Variables d'Environnement

Consultez le fichier `ENV_SAMPLE.md` pour la liste complète des variables requises.

**Variables minimales pour le développement :**
```bash
VITE_SUPABASE_URL=votre-url-supabase
VITE_SUPABASE_PUBLISHABLE_KEY=votre-cle-publique
```

## 🐳 Déploiement avec Docker

### Développement
```bash
# Démarrer l'environnement de développement
npm run docker:dev
```

### Production
```bash
# Build et démarrage en production
npm run docker:prod

# Avec monitoring (Prometheus + Grafana)
npm run docker:monitoring
```

### Services Disponibles
- **Application** : http://localhost:8080
- **Grafana** : http://localhost:3001 (admin/admin123)
- **Prometheus** : http://localhost:9090
- **Traefik Dashboard** : http://localhost:8081

## 🧪 Tests et Qualité

```bash
# Tests unitaires
npm run test
npm run test:watch
npm run test:coverage

# Tests E2E
npm run e2e
npm run e2e:ui

# Linting et formatting
npm run lint
npm run lint:fix
npm run type-check
```

## 📊 Structure du Projet

```
game-vote-festival/
├── src/
│   ├── components/          # Composants React réutilisables
│   ├── pages/              # Pages de l'application
│   ├── context/            # Contextes React (Auth, etc.)
│   ├── lib/                # Utilitaires et configuration
│   ├── hooks/              # Hooks personnalisés
│   └── integrations/       # Intégrations externes (Supabase)
├── supabase/
│   ├── migrations/         # Migrations SQL
│   └── functions/          # Edge Functions
├── public/                 # Assets statiques
├── monitoring/             # Configuration monitoring
├── docs/                   # Documentation
└── tests/                  # Tests E2E
```

## 🚀 Déploiement en Production

### Vercel (Recommandé)
```bash
# Déploiement automatique via Vercel
vercel --prod
```

### Autres Plateformes
- **Netlify** : Glisser-déposer le dossier `dist/`
- **Docker** : Utiliser le `Dockerfile` fourni
- **VPS** : Via Docker Compose

## 🔐 Sécurité

- **RLS activé** sur toutes les tables Supabase
- **Authentication** obligatoire pour les actions sensibles
- **CSP headers** configurés pour prévenir XSS
- **HTTPS** forcé en production
- **Validation** côté client et serveur avec Zod

## 📈 Monitoring et Analytics

- **Prometheus** : Collecte des métriques techniques
- **Grafana** : Dashboards et visualisations
- **Sentry** : Tracking des erreurs (à configurer)
- **Supabase Analytics** : Métriques base de données

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📝 Scripts Disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run preview` | Preview du build |
| `npm run test` | Tests unitaires |
| `npm run e2e` | Tests E2E |
| `npm run lint` | Linting ESLint |
| `npm run type-check` | Vérification TypeScript |
| `npm run docker:dev` | Docker développement |
| `npm run docker:prod` | Docker production |

## 🐛 Débogage et Support

### Logs
```bash
# Logs de l'application
docker-compose logs -f app

# Logs Nginx
docker-compose logs -f app | grep nginx

# Logs monitoring
docker-compose logs -f prometheus grafana
```

### Issues Courantes
1. **Build qui échoue** : Vérifier les variables d'environnement
2. **Erreurs Supabase** : Vérifier la connectivité et les clés
3. **Tests qui échouent** : Vérifier les dépendances de test

## 📚 Documentation

- [Guide de développement](./docs/development.md) *(à créer)*
- [Architecture technique](./docs/architecture.md) *(à créer)*
- [Guide de déploiement](./docs/deployment.md) *(à créer)*
- [Troubleshooting](./docs/troubleshooting.md) *(à créer)*

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**Développé avec ❤️ pour la communauté des jeux de société**

*Dernière mise à jour : 16/09/2025 - Version 1.0.0*

# Changelog - Game Vote Festival SaaS

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Non publié]

### Phase 0 - Scaffolding SaaS (16/09/2025)

#### Ajouté ✨
- **Infrastructure Docker** : Dockerfile, docker-compose.yml avec services de monitoring
- **Configuration de déploiement** : vercel.json, nginx.conf optimisé
- **Documentation complète** : README.md mis à jour, ENV_SAMPLE.md détaillé
- **Monitoring** : Configuration Prometheus + Grafana
- **Sécurité** : Headers CSP, optimisations nginx
- **Audit système** : Rapport d'audit complet (AUDIT_RAPPORT.md)

#### Modifié 🔧
- **README.md** : Documentation complète avec instructions SaaS
- **Structure du projet** : Préparation pour architecture SaaS

#### Infrastructure 🏗️
- **Docker multi-stage** : Optimisation de la taille des images
- **Services de monitoring** : Prometheus, Grafana, Traefik
- **Configuration de sécurité** : Headers, utilisateurs non-root
- **Health checks** : Monitoring de l'état des services

## [1.0.0] - Version de Base

### Fonctionnalités Initiales
- Système d'authentification Supabase
- Gestion des jeux de société
- Système de vote et concours
- Interface utilisateur avec shadcn/ui
- Gestion des événements
- Dashboard administrateur

### Stack Technique
- React 18 + TypeScript
- Vite pour le build
- Tailwind CSS + shadcn/ui
- Supabase (Auth + Database)
- React Router
- React Query

---

## Format des Entrées

### Types de Modifications
- **Ajouté** ✨ : pour les nouvelles fonctionnalités
- **Modifié** 🔧 : pour les modifications de fonctionnalités existantes
- **Déprécié** ⚠️ : pour les fonctionnalités bientôt supprimées
- **Supprimé** 🗑️ : pour les fonctionnalités supprimées
- **Corrigé** 🐛 : pour les corrections de bugs
- **Sécurité** 🔒 : pour les correctifs de sécurité

### Phases de Développement SaaS
- **Phase 0** : Scaffolding et infrastructure
- **Phase 1** : Fonctionnalités SaaS de base
- **Phase 2** : Monétisation et abonnements
- **Phase 3** : Analytics et optimisations
- **Phase 4** : Fonctionnalités avancées
# Dockerfile pour Game Vote Festival - SaaS
# Étape de build multi-stage pour optimiser la taille de l'image finale

# === ÉTAPE 1: Builder ===
FROM node:20-alpine as builder

# Métadonnées de l'image
LABEL maintainer="Game Vote Festival Team"
LABEL description="Application SaaS de vote de jeux de société"
LABEL version="1.0.0"

# Installation des dépendances système nécessaires
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++

# Définition du répertoire de travail
WORKDIR /app

# Copie des fichiers de dépendances pour optimiser le cache Docker
COPY package*.json ./
COPY bun.lockb* ./

# Installation des dépendances avec optimisations pour production
RUN npm ci --only=production --silent && \
    npm cache clean --force

# Copie du code source de l'application
COPY . .

# Variables d'environnement pour le build
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY

# Build de l'application pour production
RUN npm run build

# === ÉTAPE 2: Runtime ===
FROM nginx:alpine as production

# Installation des utilitaires de sécurité
RUN apk add --no-cache \
    curl \
    tini

# Création d'un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Configuration Nginx optimisée pour SPA React
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# Configuration des permissions
RUN chown -R nextjs:nodejs /usr/share/nginx/html && \
    chown -R nextjs:nodejs /var/cache/nginx && \
    chown -R nextjs:nodejs /var/log/nginx && \
    chown -R nextjs:nodejs /etc/nginx/conf.d

# Création des répertoires nécessaires avec bonnes permissions
RUN touch /var/run/nginx.pid && \
    chown -R nextjs:nodejs /var/run/nginx.pid

# Utilisateur non-root pour la sécurité
USER nextjs

# Port d'exposition
EXPOSE 8080

# Health check pour vérifier que l'application fonctionne
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/ || exit 1

# Point d'entrée avec Tini pour une gestion propre des processus
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["nginx", "-g", "daemon off;"]
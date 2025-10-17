# Reddit-like (Projet social_media)

> Application fullstack TypeScript/Node + React inspirée de Reddit — projet d'hackathon.

## Description

Ce dépôt contient une API backend en TypeScript (Express + Mongoose) et un frontend en React (Vite + TypeScript). Le backend sert une API REST pour l'authentification, la gestion des posts et des commentaires. Le frontend consomme cette API et fournit une interface utilisateur minimale (inscription, connexion, création et affichage de posts/profils).

## Arborescence principale

- backend/ — serveur Node/Express (TypeScript)
  - src/ — code source TypeScript
    - index.ts — point d'entrée, connexion à MongoDB
    - routes.ts, controllers/, models/, middleware/
  - package.json — scripts et dépendances serveur

- frontend/ — application React (Vite + TypeScript)
  - src/ — code source React
    - api/api.ts — configuration des appels API
    - pages/, utils/, hooks/
  - package.json — scripts et dépendances client

## Prérequis

- Node.js (v18+ recommandé)
- npm ou yarn
- Une base de données MongoDB (Atlas ou locale)

## Variables d'environnement

Créer un fichier `.env` dans `backend/` contenant au minimum :

- MONGO_URI — chaîne de connexion MongoDB
- PORT — (optionnel) port sur lequel le backend écoute (par défaut 3000)

Exemple `.env` :

```
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxxx.mongodb.net/mydb?retryWrites=true&w=majority
PORT=3000
```

> Remarque : le code du backend lève une erreur si `MONGO_URI` n'est pas défini.

## Installation

Racine du projet — installer les dépendances séparément pour backend et frontend.

1. Installer et lancer le backend

```bash
cd backend
npm install
```

2. Installer le frontend

```bash
cd ../frontend
npm install
```

## Scripts utiles

Backend (`backend/package.json`) :

- `npm run dev` — compile TypeScript puis démarre `node --watch dist/index.js` (mode développement)
- `npm start` — démarre le serveur à partir de `dist/index.js` (prévu après build/compilation)

Frontend (`frontend/package.json`) :

- `npm run dev` — démarre Vite en mode développement
- `npm run build` — compile TypeScript puis lance `vite build`
- `npm run preview` — prévisualise le build produit
- `npm run lint` — lance ESLint

## Démarrer en développement (suggestion)

Ouvrez deux terminaux ou utilisez un gestionnaire de tâches pour lancer frontend et backend :

Terminal 1 — backend :

```bash
cd backend
npm run dev
```

Terminal 2 — frontend :

```bash
cd frontend
npm run dev
```

Le frontend Vite tourne par défaut sur http://localhost:5173 (ou autre port renseigné par Vite). Le backend écoute sur `PORT` (par défaut 3000) et expose les routes sous `/api` (par exemple `http://localhost:3000/api/auth/login`).

## Tests et qualité

- Aucun test automatisé n'est fourni pour l'instant.
- Le frontend contient une configuration ESLint (`npm run lint`).

## API (points d'entrée principaux)

Les routes backend sont montées sous `/api`. Parmi les endpoints implémentés (exemples) :

- `POST /api/auth/signup` — création d'utilisateur
- `POST /api/auth/login` — authentification (retourne un token)
- `POST /api/auth/logout` — déconnexion

Consultez `backend/src/routes.ts` et `backend/src/controllers/` pour la liste complète et la logique.

## Contributions

Contributions bienvenues :

- Ouvrez une issue décrivant la fonctionnalité ou le bug
- Faites une branche par fonctionnalité (`git checkout -b feat/ma-fonctionnalite`) et ouvrez une pull request

Avant de contribuer, merci de vérifier :

- cohérence des types TypeScript
- pas d'identifiants secrets committés (`.env` doit être ignoré)

## Améliorations possibles (idées)

- Ajouter des tests unitaires et d'intégration pour backend
- Ajouter CI (GitHub Actions) pour lint, build et tests
- Supporter refresh tokens et meilleure gestion des sessions JWT
- Ajouter upload d'images pour les posts

## Contact

Si vous avez des questions, ouvrez une issue ou contactez l'auteur du dépôt.

---

README généré automatiquement — adapté au projet présent dans ce dépôt.

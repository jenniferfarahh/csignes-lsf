# CSignes – Apprendre la LSF

Projet universitaire visant à concevoir une application web permettant l’apprentissage de la Langue des Signes Française (LSF) à travers des leçons vidéo interactives, des quiz, et un suivi personnalisé de la progression des utilisateurs.

---

## Contexte académique

Ce projet s’inscrit dans le cadre d’un **projet universitaire** dont l’objectif est de :

* Concevoir une **API REST documentée**
* Implémenter une **architecture backend / frontend claire**
* Mettre en pratique **OpenAPI**, la génération de code, et l’authentification moderne
* Gérer la **persistance des données** et la **sécurité**

---

## Objectifs pédagogiques

* Apprentissage progressif de la LSF via des **vidéos pédagogiques**
* Validation des acquis via des **QCM**
* Suivi de la **progression utilisateur** (XP, leçons complétées)
* Gestion d’utilisateurs authentifiés (Google OAuth)

---

## Architecture générale

Le projet est structuré en trois parties principales :

```
csignes-apprendre-lsf/
│
├── backend/        # API REST (Node.js + Express)
│
├── frontend/       # Application web (React + TypeScript)
│
├── generated-api/  # Client TypeScript généré automatiquement depuis OpenAPI
│
└── README.md
```

---

## Technologies utilisées

### Backend

* **Node.js**
* **Express**
* **TypeScript**
* **Prisma ORM**
* **PostgreSQL** (via Docker)
* **Google OAuth 2.0**
* **OpenAPI 3.0**
* **Swagger UI**

### Frontend

* **React**
* **TypeScript**
* **Vite**
* **React Query**
* **Google OAuth (frontend)**
* **TailwindCSS**

### Outillage
 
* **Docker / Docker Compose**
* **OpenAPI Generator**
* **Swagger Editor**
* **Git**

---

## Base de données

La base de données est gérée via **PostgreSQL dans Docker**, afin de garantir :

* Un environnement reproductible
* Aucune dépendance à une base locale de l’OS
* Une configuration proche de la production

Schéma principal :

* `Lesson`
* `LessonAttempt`
* `UserProgress`

---

## Authentification

L’authentification est basée sur **Google OAuth**.

### Principe

1. L’utilisateur se connecte via Google (frontend)
2. Google fournit un **ID Token**
3. Le backend vérifie le token avec Google
4. L’ID Google (`sub`) est utilisé comme `userId`
5. Le token est utilisé comme **Bearer Token** pour les requêtes protégées

### Avantages

* Pas de gestion de mots de passe
* Sécurité élevée
* Expérience utilisateur simplifiée

---

## Routes protégées

Certaines routes nécessitent une authentification via un middleware `requireAuth` :

* `GET /api/progress/me`
* `GET /api/progress/me/lesson/:lessonId/attempt`
* `POST /api/attempts`

L’utilisateur est identifié via le token, sans passer d’ID utilisateur dans l’URL.

---

## Leçons et contenu

Une leçon est composée de **steps** :

* Une **vidéo LSF**
* Un **QCM**

Exemple :

```json
{
  "id": "lesson-1",
  "title": "Dire bonjour",
  "steps": [
    { "type": "video", "videoUrl": "/videos/bonjour.mp4" },
    {
      "type": "qcm",
      "question": "Que signifie ce signe ?",
      "choices": ["Bonjour", "Merci", "Au revoir"],
      "correctIndex": 0
    }
  ]
}
```

---

## Gestion des vidéos

* Les vidéos sont stockées dans le backend (`public/videos`)
* Servies statiquement via `/videos/...`
* Accessibles à tous les utilisateurs
* Solution simple, gratuite et adaptée à un projet universitaire

---

## Progression utilisateur

Pour chaque utilisateur :

* XP cumulée
* Leçons complétées
* Dernière tentative
* Résultat du dernier quiz

Règle métier :

* ✅ Bonne réponse → +10 XP
* ❌ Mauvaise réponse → 0 XP
* Une leçon ne peut être tentée **qu’une seule fois**

---

## OpenAPI & génération de code

### Pourquoi OpenAPI ?

* Documenter formellement l’API
* Servir de contrat entre backend et frontend
* Faciliter la maintenance et l’évolutivité

### Fichier principal

```
backend/src/openapi.yaml
```

### Génération automatique

Un **client TypeScript** est généré automatiquement à partir de la spécification OpenAPI :

```
generated-api/
```

Outil utilisé :

* **openapi-generator**

Avantages :

* Pas de duplication manuelle des types
* Réduction des erreurs frontend/backend
* Approche professionnelle et académique

---

## Swagger UI

Une interface Swagger est disponible pour tester l’API :

```
http://localhost:3001/docs
```

---

## Lancer le projet

### Prérequis

* Node.js
* Docker
* npm

### Backend

```bash
cd backend
docker compose up -d
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## État actuel du projet

✔ API fonctionnelle
✔ Authentification Google
✔ Progression persistée par utilisateur
✔ OpenAPI documenté
✔ Client TypeScript généré
✔ Frontend connecté au backend

---


## Conclusion

Ce projet met en œuvre des **pratiques professionnelles** (OpenAPI, OAuth, Docker, génération de code) dans un cadre académique, tout en répondant à un besoin concret d’accessibilité et d’apprentissage.



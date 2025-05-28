# Platform API - Plateforme d'Investissement

Une API RESTful construite avec NestJS pour gérer une plateforme d'investissement, permettant aux investisseurs de découvrir et d'investir dans des projets, et aux entrepreneurs de présenter leurs projets.

## Fonctionnalités

- 🔐 Authentification et autorisation avec JWT
- 👥 Gestion des utilisateurs (Investisseurs, Entrepreneurs, Admins)
- 📊 Gestion des projets
- 💰 Système d'investissement
- ❤️ Système d'intérêts pour les projets
- 👮‍♂️ Rôles et permissions

## Prérequis

- Node.js (v16 ou supérieur)
- MySQL (v8 ou supérieur)
- npm ou yarn

## Installation

1. Cloner le repository :
```bash
git clone [URL_DU_REPO]
cd platform-api
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement :
Créez un fichier `.env` à la racine du projet avec les variables suivantes :
```env
JWT_SECRET=votre_cle_secrete_jwt
JWT_EXPIRES=1d
DB_HOST=localhost
DB_PORT=3306
DB_USER=votre_utilisateur_db
DB_PASSWORD=votre_mot_de_passe_db
DB_NAME=nom_de_votre_base
```

## Démarrage

Pour initialiser la base de données avec des données de test :
```bash
npm run seed
```
### Développement
```bash
# Démarrage en mode développement
npm run start:dev

# Démarrage en mode debug
npm run start:debug
```

### Production
```bash
# Build de l'application
npm run build

# Démarrage en mode production
npm run start:prod
```

## Structure du Projet

```
src/
├── admin/           # Module d'administration
├── auth/            # Authentification et autorisation
├── config/          # Configuration (TypeORM, etc.)
├── interests/       # Gestion des intérêts
├── investments/     # Gestion des investissements
├── projects/        # Gestion des projets
├── users/           # Gestion des utilisateurs
└── main.ts          # Point d'entrée de l'application
```

## API Endpoints

### Authentification
- `POST /auth/login` - Connexion (Public)
- `POST /auth/register` - Inscription (Public) - 3 rôles : admin - entrepreneur - investor

### Admin
- `GET /admin/users` - Voir tous les utilisateurs (admin)
- `DELETE /admin/users/:id` - Supprimer un utilisateur (admin)
- `GET /admin/investments` - Voir toutes les transactions (admin)

### Utilisateurs
- `GET /users` - Liste des utilisateurs (Admin)
- `GET /users/profile` - Consulter son profil (Authentifié)
- `PUT /users/profile` - Modifier son profil (Authentifié)
-`DELETE /users/:id` -Supprime un utilisateur (Admin)

### Projets
- `GET /projects` - Liste des projets (Authentifié)
- `POST /projects` - Création d'un projet (Entrepreneur)
- `GET /projects/:id` - Détails d'un projet (Authentifié)
- `PUT /projects/:id` - Mise à jour d'un projet (Créateur (Entrepreneur))
- `DELETE /projects/:id` - Suppression d'un projet ((Admin)- avec ses investissements s'il y en a )


### Intérêts
- `GET /interests` - Liste des intérêts (public)
- `GET /users/interests` - voir les intérêts d'un utilisateur (Authentifié)
- `POST /users/interests` - Associer des intérêts à un utilisateur (Authentifié)
- `GET /projects/recommended` - Recommander des projets en fonction des intérêts (Authentifié)


### Investissements
- `POST /investments` - Créer un investissement (Investisseur)
- `GET /investments` - Liste des investissements du créateur (Investisseur)
- `GET /investments/project/:id` - Voir les investissements d’un projet (Authentifié)
- `DELETE /investments/:id` - Annuler un investissement (Investisseur)



## Tests

```bash
# Tests unitaires
npm run test

## Base de Données

Le projet utilise TypeORM avec MySQL. Les migrations sont automatiquement synchronisées en développement.



## Sécurité

- Les mots de passe sont hashés avec bcrypt
- JWT pour l'authentification
- Validation des données avec class-validator
- Protection contre les injections SQL avec TypeORM


## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.


##Par
ELHADIDI Omar

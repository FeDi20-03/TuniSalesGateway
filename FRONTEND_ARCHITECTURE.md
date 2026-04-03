# Frontend Architecture Documentation — TuniSalesGateway

> **Projet** : TuniSalesGateway  
> **Type** : API Gateway (Microservices Architecture)  
> **Générateur** : JHipster 7.9.3  
> **Date de documentation** : Mars 2026

---

## Table des Matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Structure du Projet](#2-structure-du-projet)
3. [Pages / Écrans](#3-pages--écrans)
4. [Composants](#4-composants)
5. [Système de Layout](#5-système-de-layout)
6. [Navigation & Routage](#6-navigation--routage)
7. [Gestion d'État](#7-gestion-détat)
8. [Communication API](#8-communication-api)
9. [Formulaires & Validation](#9-formulaires--validation)
10. [Système de Design UI/UX](#10-système-de-design-uiux)
11. [Flux d'Authentification](#11-flux-dauthentification)
12. [Gestion des Erreurs](#12-gestion-des-erreurs)
13. [Optimisations de Performance](#13-optimisations-de-performance)
14. [Configuration d'Environnement](#14-configuration-denvironnement)
15. [Diagrammes UI](#15-diagrammes-ui)

---

## 1. Vue d'ensemble

### Framework & Technologies

| Élément             | Technologie                                           |
| ------------------- | ----------------------------------------------------- |
| **Framework**       | Angular 14.2.0                                        |
| **Langage**         | TypeScript 4.8.2                                      |
| **Bibliothèque UI** | Bootstrap 5.2.0 + Bootswatch 5.2.0                    |
| **Composants UI**   | ng-bootstrap 13.0.0                                   |
| **Icônes**          | FontAwesome (angular-fontawesome 0.11.1)              |
| **Gestion d'état**  | RxJS 7.5.6 (ReplaySubject / Observable)               |
| **Routage**         | Angular Router (lazy loading)                         |
| **i18n**            | @ngx-translate/core 14.0.0 (fr, en, ar-ly)            |
| **Dates**           | Day.js 1.11.5                                         |
| **Stockage**        | ngx-webstorage 10.0.1 (LocalStorage / SessionStorage) |
| **Scroll infini**   | ngx-infinite-scroll 14.0.0                            |
| **Build**           | Webpack 5.74.0 + Angular CLI 14.2.1                   |
| **Tests**           | Jest 28.1.3 + jest-preset-angular 12.2.2              |
| **Linting**         | ESLint 8.23.0 + Prettier 2.7.1                        |
| **PWA**             | @angular/service-worker (désactivé par défaut)        |

### Architecture Microservices

Le frontend est une **Gateway** qui consomme 3 microservices backend :

| Microservice         | Préfixe d'API                    | Domaine                                                               |
| -------------------- | -------------------------------- | --------------------------------------------------------------------- |
| **BusinessService**  | `services/businessservice/api/`  | Clients, Commandes, Produits, Factures, Livraisons, Missions, Visites |
| **InventoryService** | `services/inventoryservice/api/` | Stock, Entrepôts, Mouvements, Audits, Swaps                           |
| **PlatformService**  | `services/platformservice/api/`  | Audit Logs, Notifications, Documents, Objectifs, Scores, Tenants      |

---

## 2. Structure du Projet

```
src/main/webapp/
├── index.html                    # Point d'entrée HTML
├── main.ts                       # Bootstrap Angular
├── bootstrap.ts                  # Initialisation de l'application
├── polyfills.ts                  # Polyfills navigateur
├── manifest.webapp               # Manifest PWA
├── favicon.ico
├── 404.html
├── robots.txt
│
├── app/
│   ├── app.module.ts             # Module racine Angular
│   ├── app-routing.module.ts     # Routage principal
│   ├── app.constants.ts          # Constantes globales (VERSION, DEBUG)
│   │
│   ├── config/                   # Configuration applicative
│   │   ├── authority.constants.ts      # Rôles (ROLE_ADMIN, ROLE_USER)
│   │   ├── datepicker-adapter.ts       # Adaptateur DatePicker → Day.js
│   │   ├── dayjs.ts                    # Configuration Day.js
│   │   ├── error.constants.ts          # Types d'erreurs
│   │   ├── font-awesome-icons.ts       # Icônes FA importées
│   │   ├── input.constants.ts          # Formats date
│   │   ├── language.constants.ts       # Langues supportées (fr, en, ar-ly)
│   │   ├── navigation.constants.ts     # Constantes tri/navigation
│   │   ├── pagination.constants.ts     # Pagination (20 items/page)
│   │   ├── translation.config.ts       # Config traduction
│   │   └── uib-pagination.config.ts    # Config pagination ng-bootstrap
│   │
│   ├── core/                     # Services & logique cœur
│   │   ├── auth/                       # Authentification
│   │   │   ├── account.model.ts        # Modèle Account
│   │   │   ├── account.service.ts      # Service Account (identité, auth)
│   │   │   ├── auth-jwt.service.ts     # Service JWT (login, logout, token)
│   │   │   ├── state-storage.service.ts # Stockage URL précédente
│   │   │   └── user-route-access.service.ts # Guard de routes
│   │   ├── config/
│   │   │   └── application-config.service.ts  # Configuration URL API
│   │   ├── interceptor/                # Intercepteurs HTTP
│   │   │   ├── auth.interceptor.ts           # Injection token Bearer
│   │   │   ├── auth-expired.interceptor.ts   # Gestion 401
│   │   │   ├── error-handler.interceptor.ts  # Broadcast erreurs
│   │   │   ├── notification.interceptor.ts   # Notifications auto
│   │   │   └── index.ts                      # Registre intercepteurs
│   │   ├── request/
│   │   │   ├── request-util.ts         # Utilitaire HttpParams
│   │   │   └── request.model.ts        # Modèle pagination
│   │   └── util/
│   │       ├── alert.service.ts        # Service alertes
│   │       ├── data-util.service.ts    # Utilitaires données
│   │       ├── event-manager.service.ts # Bus d'événements RxJS
│   │       ├── operators.ts            # Opérateurs RxJS custom
│   │       └── parse-links.service.ts  # Parsing liens pagination
│   │
│   ├── shared/                   # Composants & modules partagés
│   │   ├── shared.module.ts            # Module partagé
│   │   ├── shared-libs.module.ts       # Réexport libs tierces
│   │   ├── alert/                      # Composants alerte
│   │   │   ├── alert.component.ts      # Alertes globales
│   │   │   ├── alert-error.component.ts # Alertes d'erreur
│   │   │   └── alert-error.model.ts    # Modèle AlertError
│   │   ├── auth/
│   │   │   └── has-any-authority.directive.ts # Directive *jhiHasAnyAuthority
│   │   ├── date/
│   │   │   ├── duration.pipe.ts              # Pipe durée
│   │   │   ├── format-medium-date.pipe.ts    # Pipe date médium
│   │   │   └── format-medium-datetime.pipe.ts # Pipe datetime médium
│   │   ├── filter/
│   │   │   ├── filter.component.ts     # Composant filtre
│   │   │   └── filter.model.ts         # Modèle filtre
│   │   ├── language/
│   │   │   ├── find-language-from-key.pipe.ts # Pipe langue
│   │   │   ├── translate.directive.ts         # Directive jhiTranslate
│   │   │   └── translation.module.ts          # Module traduction
│   │   ├── pagination/
│   │   │   └── item-count.component.ts  # Compteur d'éléments
│   │   └── sort/
│   │       ├── sort.directive.ts         # Directive jhiSort
│   │       ├── sort-by.directive.ts      # Directive jhiSortBy
│   │       └── sort.service.ts           # Service tri
│   │
│   ├── layouts/                  # Composants de structure
│   │   ├── main/                       # Layout principal
│   │   ├── navbar/                     # Barre de navigation
│   │   ├── footer/                     # Pied de page
│   │   ├── error/                      # Pages d'erreur
│   │   └── profiles/                   # Ribbon profil
│   │
│   ├── home/                     # Page d'accueil
│   ├── login/                    # Page de connexion
│   ├── account/                  # Gestion de compte
│   │   ├── register/                   # Inscription
│   │   ├── activate/                   # Activation compte
│   │   ├── password/                   # Changement mot de passe
│   │   ├── password-reset/             # Réinitialisation
│   │   │   ├── init/                   # Demande de reset
│   │   │   └── finish/                 # Finalisation reset
│   │   └── settings/                   # Paramètres profil
│   │
│   ├── admin/                    # Administration (ROLE_ADMIN)
│   │   ├── user-management/            # CRUD utilisateurs
│   │   ├── gateway/                    # Routes gateway
│   │   ├── health/                     # Health checks
│   │   ├── metrics/                    # Métriques JVM
│   │   ├── configuration/              # Configuration Spring
│   │   ├── logs/                       # Gestion logs
│   │   └── docs/                       # Swagger UI
│   │
│   └── entities/                 # Modules entités métier
│       ├── entity-routing.module.ts    # Routage entités
│       ├── entity-navbar-items.ts      # Items menu entités
│       ├── enumerations/               # Enums TypeScript
│       ├── user/                       # Service User
│       ├── BusinessService/            # Entités Business
│       │   ├── client/
│       │   ├── client-contact/
│       │   ├── delivery/
│       │   ├── invoice/
│       │   ├── mission/
│       │   ├── order/
│       │   ├── order-line/
│       │   ├── order-line-item/
│       │   ├── price-list/
│       │   ├── product/
│       │   └── visit/
│       ├── InventoryService/           # Entités Inventaire
│       │   ├── stock-audit/
│       │   ├── stock-audit-line/
│       │   ├── stock-item/
│       │   ├── stock-movement/
│       │   ├── swap/
│       │   └── warehouse/
│       └── PlatformService/            # Entités Plateforme
│           ├── audit-log/
│           ├── client-score/
│           ├── document/
│           ├── notification/
│           ├── objective/
│           ├── performance-score/
│           └── tenant/
│
├── content/                      # Assets statiques (images, CSS)
├── i18n/                         # Fichiers de traduction JSON
│   ├── fr/
│   ├── en/
│   └── ar-ly/
├── swagger-ui/                   # Swagger UI intégré
└── WEB-INF/                      # Configuration serveur
```

### Structure Standard d'une Entité

Chaque entité suit le pattern CRUD JHipster :

```
entity/
├── entity.model.ts               # Interface TypeScript du modèle
├── entity.module.ts              # Module Angular de l'entité
├── entity.test-samples.ts        # Données de test
├── route/
│   ├── entity-routing.module.ts        # Routes (list, detail, new, edit)
│   └── entity-routing-resolve.service.ts # Resolver
├── service/
│   └── entity.service.ts              # Service HTTP CRUD
├── list/
│   ├── entity.component.ts            # Composant liste
│   └── entity.component.html          # Template liste
├── detail/
│   ├── entity-detail.component.ts     # Composant détail
│   └── entity-detail.component.html   # Template détail
├── update/
│   ├── entity-update.component.ts     # Composant création/édition
│   ├── entity-update.component.html   # Template formulaire
│   └── entity-form.service.ts         # Service formulaire (FormGroup)
└── delete/
    ├── entity-delete-dialog.component.ts   # Modal de suppression
    └── entity-delete-dialog.component.html # Template modal
```

---

## 3. Pages / Écrans

### 3.1 Page d'Accueil (Home)

| Propriété     | Valeur                                               |
| ------------- | ---------------------------------------------------- |
| **Route**     | `/`                                                  |
| **Composant** | `HomeComponent`                                      |
| **Fichiers**  | `home/home.component.ts`, `home.component.html`      |
| **Accès**     | Public (contenu conditionnel selon authentification) |
| **Module**    | `HomeModule`                                         |

**Description** : Page de bienvenue affichant un message contextuel. Si l'utilisateur est connecté, affiche son nom d'utilisateur. Sinon, propose de se connecter ou créer un compte.

**Composants utilisés** : Aucun composant réutilisable, uniquement directives `jhiTranslate`, `ngSwitch`.

**API** : `GET /api/account` (via `AccountService.identity()`)

---

### 3.2 Page de Connexion (Login)

| Propriété     | Valeur                                             |
| ------------- | -------------------------------------------------- |
| **Route**     | `/login`                                           |
| **Composant** | `LoginComponent`                                   |
| **Fichiers**  | `login/login.component.ts`, `login.component.html` |
| **Accès**     | Public                                             |
| **Module**    | `LoginModule` (lazy loaded)                        |

**Description** : Formulaire d'authentification avec nom d'utilisateur, mot de passe et option "Se souvenir de moi".

**Champs du formulaire** :

| Champ        | Type     | Validation               |
| ------------ | -------- | ------------------------ |
| `username`   | text     | Required                 |
| `password`   | password | Required                 |
| `rememberMe` | checkbox | Required (défaut: false) |

**API** : `POST /api/authenticate`

**Logique** :

- Authentification via `LoginService.login()` → `AuthServerProvider.login()` → `AccountService.identity()`
- En cas de succès : navigation vers `/` ou URL stockée précédemment
- En cas d'erreur : affichage message d'erreur d'authentification
- Auto-redirect si déjà authentifié

**Liens** :

- `/account/reset/request` — Mot de passe oublié
- `/account/register` — Créer un compte

---

### 3.3 Page d'Inscription (Register)

| Propriété     | Valeur                                                              |
| ------------- | ------------------------------------------------------------------- |
| **Route**     | `/account/register`                                                 |
| **Composant** | `RegisterComponent`                                                 |
| **Fichiers**  | `account/register/register.component.ts`, `register.component.html` |
| **Accès**     | Public                                                              |

**Champs du formulaire** :

| Champ             | Type     | Validation                                        |
| ----------------- | -------- | ------------------------------------------------- |
| `login`           | text     | Required, min: 1, max: 50, pattern alphanumérique |
| `email`           | email    | Required, min: 5, max: 254, format email          |
| `password`        | password | Required, min: 4, max: 50                         |
| `confirmPassword` | password | Required, min: 4, max: 50                         |

**API** : `POST /api/register`

**Gestion d'erreurs** :

- Mots de passe ne correspondent pas → `doNotMatch = true`
- Login déjà utilisé (400 + `LOGIN_ALREADY_USED_TYPE`) → `errorUserExists = true`
- Email déjà utilisé (400 + `EMAIL_ALREADY_USED_TYPE`) → `errorEmailExists = true`
- Autre erreur → `error = true`

---

### 3.4 Page d'Activation de Compte

| Propriété     | Valeur              |
| ------------- | ------------------- |
| **Route**     | `/account/activate` |
| **Composant** | `ActivateComponent` |
| **Accès**     | Public              |

**Description** : Activation du compte via clé dans les query params.

**API** : `GET /api/activate?key={key}`

---

### 3.5 Page de Réinitialisation de Mot de Passe (Init)

| Propriété     | Valeur                       |
| ------------- | ---------------------------- |
| **Route**     | `/account/reset/request`     |
| **Composant** | `PasswordResetInitComponent` |
| **Accès**     | Public                       |

**Champs** :

| Champ   | Type  | Validation                               |
| ------- | ----- | ---------------------------------------- |
| `email` | email | Required, min: 5, max: 254, format email |

**API** : `POST /api/account/reset-password/init`

---

### 3.6 Page de Réinitialisation de Mot de Passe (Finish)

| Propriété     | Valeur                         |
| ------------- | ------------------------------ |
| **Route**     | `/account/reset/finish`        |
| **Composant** | `PasswordResetFinishComponent` |
| **Accès**     | Public                         |

**Champs** :

| Champ             | Type     | Validation                |
| ----------------- | -------- | ------------------------- |
| `newPassword`     | password | Required, min: 4, max: 50 |
| `confirmPassword` | password | Required, min: 4, max: 50 |

**API** : `POST /api/account/reset-password/finish`

---

### 3.7 Page Paramètres du Profil (Settings)

| Propriété     | Valeur              |
| ------------- | ------------------- |
| **Route**     | `/account/settings` |
| **Composant** | `SettingsComponent` |
| **Accès**     | Authentifié         |

**Champs** :

| Champ       | Type   | Validation                        |
| ----------- | ------ | --------------------------------- |
| `firstName` | text   | Required, min: 1, max: 50         |
| `lastName`  | text   | Required, min: 1, max: 50         |
| `email`     | email  | Required, min: 5, max: 254, email |
| `langKey`   | select | Non-nullable                      |

**API** :

- `GET /api/account` — Charger les infos
- `POST /api/account` — Sauvegarder les modifications

---

### 3.8 Page Changement de Mot de Passe

| Propriété     | Valeur              |
| ------------- | ------------------- |
| **Route**     | `/account/password` |
| **Composant** | `PasswordComponent` |
| **Accès**     | Authentifié         |

**Champs** :

| Champ             | Type     | Validation                |
| ----------------- | -------- | ------------------------- |
| `currentPassword` | password | Required                  |
| `newPassword`     | password | Required, min: 4, max: 50 |
| `confirmPassword` | password | Required, min: 4, max: 50 |

**API** : `POST /api/account/change-password`

---

### 3.9 Pages d'Administration (ROLE_ADMIN)

#### 3.9.1 Gestion des Utilisateurs

| Propriété       | Valeur                                 |
| --------------- | -------------------------------------- |
| **Route**       | `/admin/user-management`               |
| **Sous-routes** | `/new`, `/:login/view`, `/:login/edit` |
| **Accès**       | `ROLE_ADMIN`                           |

**Composants** : Liste, Détail, Formulaire Création/Édition, Modal Suppression

**Modèle User** :

| Champ              | Type     |
| ------------------ | -------- |
| `id`               | number   |
| `login`            | string   |
| `firstName`        | string   |
| `lastName`         | string   |
| `email`            | string   |
| `activated`        | boolean  |
| `langKey`          | string   |
| `authorities`      | string[] |
| `createdBy`        | string   |
| `createdDate`      | Date     |
| `lastModifiedBy`   | string   |
| `lastModifiedDate` | Date     |

**API** :

- `GET /api/admin/users`
- `GET /api/admin/users/:login`
- `POST /api/admin/users`
- `PUT /api/admin/users`
- `DELETE /api/admin/users/:login`

#### 3.9.2 Gateway Routes

| Propriété     | Valeur             |
| ------------- | ------------------ |
| **Route**     | `/admin/gateway`   |
| **Composant** | `GatewayComponent` |
| **Accès**     | `ROLE_ADMIN`       |

**Description** : Visualisation des routes du gateway Spring Cloud.

**API** : `GET /api/gateway/routes/`

#### 3.9.3 Métriques

| Propriété | Valeur           |
| --------- | ---------------- |
| **Route** | `/admin/metrics` |
| **Accès** | `ROLE_ADMIN`     |

**API** : `GET /management/jhimetrics`

#### 3.9.4 Health Checks

| Propriété | Valeur          |
| --------- | --------------- |
| **Route** | `/admin/health` |
| **Accès** | `ROLE_ADMIN`    |

**API** : `GET /management/health`

#### 3.9.5 Configuration

| Propriété | Valeur                 |
| --------- | ---------------------- |
| **Route** | `/admin/configuration` |
| **Accès** | `ROLE_ADMIN`           |

**API** :

- `GET /management/configprops`
- `GET /management/env`

#### 3.9.6 Logs

| Propriété | Valeur        |
| --------- | ------------- |
| **Route** | `/admin/logs` |
| **Accès** | `ROLE_ADMIN`  |

**API** :

- `GET /management/loggers`
- `POST /management/loggers/:name`

#### 3.9.7 API Documentation (Swagger)

| Propriété | Valeur                                                      |
| --------- | ----------------------------------------------------------- |
| **Route** | `/admin/docs`                                               |
| **Accès** | `ROLE_ADMIN` (visible seulement si profil `api-docs` actif) |

---

### 3.10 Pages d'Erreur

| Route           | Composant        | Description                   |
| --------------- | ---------------- | ----------------------------- |
| `/error`        | `ErrorComponent` | Erreur générique              |
| `/accessdenied` | `ErrorComponent` | Erreur 403 (accès refusé)     |
| `/404`          | `ErrorComponent` | Erreur 404 (page non trouvée) |
| `**`            | `ErrorComponent` | Wildcard → 404                |

---

### 3.11 Pages des Entités Métier

Chaque entité dispose de **4 sous-pages** (CRUD) avec le même pattern :

| Sous-route         | Composant                | Description                             |
| ------------------ | ------------------------ | --------------------------------------- |
| `/entity`          | `EntityComponent` (list) | Liste paginée, triable avec suppression |
| `/entity/:id/view` | `EntityDetailComponent`  | Vue en lecture seule                    |
| `/entity/new`      | `EntityUpdateComponent`  | Formulaire de création                  |
| `/entity/:id/edit` | `EntityUpdateComponent`  | Formulaire d'édition                    |

Toutes les sous-pages d'entités nécessitent une **authentification** (`UserRouteAccessService`).

#### BusinessService — Entités

| Entité              | Route              | Modèle           | Champs principaux                                                                                                                        |
| ------------------- | ------------------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Client**          | `/client`          | `IClient`        | tenantId, name, taxId, clientType, creditLimit, creditUsed, paymentTermsDays, status, lastOrderAt, isDeleted                             |
| **Client Contact**  | `/client-contact`  | `IClientContact` | fullName, email, phone, role, isPrimary, client (FK)                                                                                     |
| **Product**         | `/product`         | `IProduct`       | tenantId, sku, name, brand, category, price, taxRate, isActive, isDeleted                                                                |
| **Order**           | `/order`           | `IOrder`         | tenantId, orderNumber, status, subtotal, discountAmount, taxAmount, totalAmount, paymentTermsDays, dueDate, rejectionReason, client (FK) |
| **Order Line**      | `/order-line`      | `IOrderLine`     | quantity, unitPrice, discountPct, lineTotal, product (FK), order (FK)                                                                    |
| **Order Line Item** | `/order-line-item` | `IOrderLineItem` | stockItemId, stockItemImei, assignedAt, orderLine (FK)                                                                                   |
| **Invoice**         | `/invoice`         | `IInvoice`       | tenantId, invoiceNumber, amountHt, taxAmount, amountTtc, status, issueDate, dueDate, paidAt, client (FK), order (FK)                     |
| **Delivery**        | `/delivery`        | `IDelivery`      | tenantId, deliveryNumber, status, trackingNumber, shippedAt, deliveredAt, confirmedAt, notes, order (FK)                                 |
| **Price List**      | `/price-list`      | `IPriceList`     | unitPrice, maxDiscountPct, validFrom, validTo, isActive, product (FK), client (FK)                                                       |
| **Mission**         | `/mission`         | `IMission`       | tenantId, assignedToLogin, title, description, missionDate, status                                                                       |
| **Visit**           | `/visit`           | `IVisit`         | visitOrder, objective, status, latitude, longitude, checkinAt, checkoutAt, notes, client (FK), mission (FK)                              |

#### InventoryService — Entités

| Entité               | Route               | Modèle            | Champs principaux                                                                                                 |
| -------------------- | ------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Warehouse**        | `/warehouse`        | `IWarehouse`      | tenantId, name, type, address, city, minThreshold, isActive                                                       |
| **Stock Item**       | `/stock-item`       | `IStockItem`      | tenantId, productId, productName, imei, status, isDeleted, acquiredAt, warehouse (FK)                             |
| **Stock Movement**   | `/stock-movement`   | `IStockMovement`  | movementType, reason, reference, quantity, performedByLogin, fromWarehouse (FK), toWarehouse (FK), stockItem (FK) |
| **Stock Audit**      | `/stock-audit`      | `IStockAudit`     | tenantId, status, theoreticalCount, physicalCount, discrepancyCount, notes, auditorLogin, warehouse (FK)          |
| **Stock Audit Line** | `/stock-audit-line` | `IStockAuditLine` | foundPhysically, resolution, resolutionNote, stockItem (FK), audit (FK)                                           |
| **Swap**             | `/swap`             | `ISwap`           | tenantId, clientId, clientName, status, reason, outgoingItem (FK), incomingItem (FK)                              |

#### PlatformService — Entités

| Entité                | Route                | Modèle              | Champs principaux                                                                                     |
| --------------------- | -------------------- | ------------------- | ----------------------------------------------------------------------------------------------------- |
| **Tenant**            | `/tenant`            | `ITenant`           | name, code, status                                                                                    |
| **Audit Log**         | `/audit-log`         | `IAuditLog`         | tenantId, entityType, entityId, action, beforeJson, afterJson, ipAddress, userAgent, performedByLogin |
| **Notification**      | `/notification`      | `INotification`     | tenantId, recipientLogin, type, title, body, payloadJson, isRead, readAt                              |
| **Document**          | `/document`          | `IDocument`         | tenantId, entityType, entityId, docType, filename, storageUrl, mimeType, sizeBytes, uploadedByLogin   |
| **Objective**         | `/objective`         | `IObjective`        | tenantId, assignedToLogin, period, metricType, targetValue, achievedValue                             |
| **Client Score**      | `/client-score`      | `IClientScore`      | tenantId, clientId, clientName, period, score, classification, breakdownJson                          |
| **Performance Score** | `/performance-score` | `IPerformanceScore` | tenantId, userLogin, period, score, classification, breakdownJson, deltaVsPrevious                    |

---

## 4. Composants

### 4.1 Composants de Layout

| Composant             | Sélecteur         | Emplacement         | Description                                                             |
| --------------------- | ----------------- | ------------------- | ----------------------------------------------------------------------- |
| `MainComponent`       | `jhi-main`        | `layouts/main/`     | Composant racine, contient le router-outlet principal, navbar et footer |
| `NavbarComponent`     | `jhi-navbar`      | `layouts/navbar/`   | Barre de navigation responsive avec menus dropdown                      |
| `FooterComponent`     | `jhi-footer`      | `layouts/footer/`   | Pied de page simple                                                     |
| `ErrorComponent`      | `jhi-error`       | `layouts/error/`    | Page d'erreur (403, 404, générique)                                     |
| `PageRibbonComponent` | `jhi-page-ribbon` | `layouts/profiles/` | Ruban de profil (dev/prod)                                              |

#### NavbarComponent — Détail

**Props/State** :

- `account: Account | null` — Utilisateur connecté
- `isNavbarCollapsed: boolean` — État collapse mobile
- `version: string` — Version de l'app
- `languages: string[]` — Langues disponibles
- `inProduction: boolean` — Mode production
- `openAPIEnabled: boolean` — API docs activé
- `entitiesNavbarItems: any[]` — Éléments du menu entités

**Menus** :

- **Accueil** — Toujours visible
- **Entités** — Visible si authentifié (24 entités)
- **Administration** — Visible si `ROLE_ADMIN` (7 sous-menus)
- **Langues** — Toujours visible (fr, ar-ly, en)
- **Compte** — Login/Register (non authentifié) ou Settings/Password/Logout (authentifié)

---

### 4.2 Composants Partagés (SharedModule)

| Composant             | Sélecteur         | Emplacement          | Description                                                   |
| --------------------- | ----------------- | -------------------- | ------------------------------------------------------------- |
| `AlertComponent`      | `jhi-alert`       | `shared/alert/`      | Affiche les alertes globales (success, danger, warning, info) |
| `AlertErrorComponent` | `jhi-alert-error` | `shared/alert/`      | Gère et affiche les erreurs HTTP (400, 404, 0, etc.)          |
| `ItemCountComponent`  | `jhi-item-count`  | `shared/pagination/` | Affiche "X - Y sur Z" pour la pagination                      |
| `FilterComponent`     | `jhi-filter`      | `shared/filter/`     | Gestion et affichage des filtres actifs                       |

### 4.3 Directives Partagées

| Directive                  | Sélecteur             | Description                                                             |
| -------------------------- | --------------------- | ----------------------------------------------------------------------- |
| `HasAnyAuthorityDirective` | `*jhiHasAnyAuthority` | Affiche conditionnellement un élément si l'utilisateur a le rôle requis |
| `TranslateDirective`       | `jhiTranslate`        | Traduction i18n                                                         |
| `SortDirective`            | `[jhiSort]`           | Gestion du tri dans les tableaux                                        |
| `SortByDirective`          | `[jhiSortBy]`         | Tri par colonne spécifique                                              |
| `ActiveMenuDirective`      | `[jhiActiveMenu]`     | Marque le menu langue actif                                             |

### 4.4 Pipes Partagés

| Pipe                       | Description                             |
| -------------------------- | --------------------------------------- |
| `FindLanguageFromKeyPipe`  | Convertit un code langue en nom lisible |
| `DurationPipe`             | Formatage de durées                     |
| `FormatMediumDatePipe`     | Formatage date (format moyen)           |
| `FormatMediumDatetimePipe` | Formatage date-heure (format moyen)     |

### 4.5 Composants d'Entité (Pattern CRUD)

Chaque entité génère 4 composants :

| Type              | Sélecteur Pattern   | Description                                 |
| ----------------- | ------------------- | ------------------------------------------- |
| **List**          | `jhi-entity`        | Tableau paginé/trié avec boutons CRUD       |
| **Detail**        | `jhi-entity-detail` | Vue détaillée en lecture seule              |
| **Update**        | `jhi-entity-update` | Formulaire création/édition avec validation |
| **Delete Dialog** | — (modal NgbModal)  | Modal de confirmation de suppression        |

**Exemple — ClientComponent (List)** :

**Props/State** :

- `clients: IClient[]` — Liste des clients
- `isLoading: boolean` — État de chargement
- `predicate: string` — Champ de tri actuel
- `ascending: boolean` — Ordre de tri
- `itemsPerPage: number` — 20 par défaut
- `totalItems: number` — Total backend
- `page: number` — Page courante

**Fonctionnalités** :

- Pagination côté serveur
- Tri par colonnes
- Suppression via modal NgbModal
- Navigation vers création/détail/édition

---

## 5. Système de Layout

### Architecture de Layout

```
<jhi-main>                              ← MainComponent (Bootstrap)
├── <jhi-page-ribbon>                   ← Ruban dev/prod
├── <router-outlet name="navbar">       ← Outlet nommé
│   └── <jhi-navbar>                    ← Barre de navigation
├── <div class="container-fluid">
│   ├── <div class="card jh-card">
│   │   └── <router-outlet>            ← Contenu principal
│   └── <jhi-footer>                   ← Pied de page
```

### Navbar Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] TuniSalesGateway v0.0.1                                  │
│                                                                 │
│ [Home] [Entités ▼] [Admin ▼] [Langues ▼] [Compte ▼]           │
│          │             │          │           │                  │
│          ├ Audit Log   ├ Gateway  ├ Français  ├ Profil          │
│          ├ Client      ├ Users    ├ العربية   ├ Mot de passe    │
│          ├ Product     ├ Metrics  ├ English   ├ Déconnexion     │
│          ├ Order       ├ Health                                  │
│          ├ Invoice     ├ Config                                  │
│          ├ Delivery    ├ Logs                                    │
│          ├ Mission     └ API                                     │
│          ├ Visit                                                 │
│          ├ Warehouse                                             │
│          ├ Stock Item                                            │
│          ├ ...                                                   │
│          └ Tenant                                                │
└─────────────────────────────────────────────────────────────────┘
```

### Layout unique

L'application utilise un **layout unique** (`MainComponent`) :

- **Pas de layout séparé** pour admin, auth ou public
- La visibilité des éléments est contrôlée par :
  - `*ngSwitchCase="true/false"` sur `account !== null`
  - `*jhiHasAnyAuthority="'ROLE_ADMIN'"` pour le menu admin
  - `*ngIf="openAPIEnabled"` pour l'API docs

---

## 6. Navigation & Routage

### Système de Routage

Le routage utilise **Angular Router** avec **lazy loading** extensif.

### Hiérarchie des Routes

```
AppRoutingModule (forRoot)
├── /              → HomeModule (eagerly loaded)
├── /login         → LoginModule (lazy)
├── /account/*     → AccountModule (lazy)
├── /admin/*       → AdminRoutingModule (lazy, guard: ROLE_ADMIN)
│   ├── /user-management
│   ├── /gateway
│   ├── /health
│   ├── /metrics
│   ├── /configuration
│   ├── /logs
│   └── /docs
├── /*             → EntityRoutingModule (lazy)
│   ├── /audit-log      → PlatformServiceAuditLogModule (lazy)
│   ├── /client          → BusinessServiceClientModule (lazy)
│   ├── /client-contact  → BusinessServiceClientContactModule (lazy)
│   ├── /delivery        → BusinessServiceDeliveryModule (lazy)
│   ├── /invoice         → BusinessServiceInvoiceModule (lazy)
│   ├── /mission         → BusinessServiceMissionModule (lazy)
│   ├── /notification    → PlatformServiceNotificationModule (lazy)
│   ├── /order           → BusinessServiceOrderModule (lazy)
│   ├── /product         → BusinessServiceProductModule (lazy)
│   ├── /stock-item      → InventoryServiceStockItemModule (lazy)
│   ├── /warehouse       → InventoryServiceWarehouseModule (lazy)
│   └── ... (24 entités total)
├── /error         → ErrorComponent
├── /accessdenied  → ErrorComponent
├── /404           → ErrorComponent
└── /**            → ErrorComponent (wildcard)
```

### Table des Routes Complète

| Route                             | Page                  | Auth Required | Rôle  | Lazy Loaded |
| --------------------------------- | --------------------- | :-----------: | ----- | :---------: |
| `/`                               | Home                  |      Non      | —     |     Non     |
| `/login`                          | Login                 |      Non      | —     |     Oui     |
| `/account/register`               | Register              |      Non      | —     |     Oui     |
| `/account/activate`               | Activate              |      Non      | —     |     Oui     |
| `/account/reset/request`          | Password Reset Init   |      Non      | —     |     Oui     |
| `/account/reset/finish`           | Password Reset Finish |      Non      | —     |     Oui     |
| `/account/settings`               | Settings              |      Oui      | USER  |     Oui     |
| `/account/password`               | Change Password       |      Oui      | USER  |     Oui     |
| `/admin/user-management`          | User Management       |      Oui      | ADMIN |     Oui     |
| `/admin/gateway`                  | Gateway Routes        |      Oui      | ADMIN |     Oui     |
| `/admin/health`                   | Health                |      Oui      | ADMIN |     Oui     |
| `/admin/metrics`                  | Metrics               |      Oui      | ADMIN |     Oui     |
| `/admin/configuration`            | Configuration         |      Oui      | ADMIN |     Oui     |
| `/admin/logs`                     | Logs                  |      Oui      | ADMIN |     Oui     |
| `/admin/docs`                     | API Docs              |      Oui      | ADMIN |     Oui     |
| `/client`                         | Client List           |      Oui      | USER  |     Oui     |
| `/client/new`                     | Client Create         |      Oui      | USER  |     Oui     |
| `/client/:id/view`                | Client Detail         |      Oui      | USER  |     Oui     |
| `/client/:id/edit`                | Client Edit           |      Oui      | USER  |     Oui     |
| `/order`                          | Order List            |      Oui      | USER  |     Oui     |
| `/product`                        | Product List          |      Oui      | USER  |     Oui     |
| `/invoice`                        | Invoice List          |      Oui      | USER  |     Oui     |
| `/delivery`                       | Delivery List         |      Oui      | USER  |     Oui     |
| `/warehouse`                      | Warehouse List        |      Oui      | USER  |     Oui     |
| `/stock-item`                     | Stock Item List       |      Oui      | USER  |     Oui     |
| `/tenant`                         | Tenant List           |      Oui      | USER  |     Oui     |
| _... +17 entités supplémentaires_ |                       |               |       |             |
| `/error`                          | Error                 |      Non      | —     |     Non     |
| `/accessdenied`                   | Access Denied         |      Non      | —     |     Non     |
| `/404`                            | Not Found             |      Non      | —     |     Non     |
| `/**`                             | Not Found (wildcard)  |      Non      | —     |     Non     |

### Route Guard

**`UserRouteAccessService`** (implements `CanActivate`) :

```
Flux de vérification :
1. AccountService.identity() → Charger l'identité
2. Si account existe :
   a. Vérifier authorities requises dans route.data
   b. Si autorisé → return true
   c. Sinon → navigate('/accessdenied')
3. Si account null :
   a. Stocker l'URL courante
   b. navigate('/login')
   c. return false
```

---

## 7. Gestion d'État

### Architecture d'État

Le projet utilise une approche **RxJS pure** sans bibliothèque de state management externe :

```
┌─────────────────────────────────────────────┐
│                État Global                   │
├─────────────────────────────────────────────┤
│ AccountService                               │
│   ├── userIdentity: Account | null           │
│   ├── authenticationState: ReplaySubject<>   │
│   └── accountCache$: Observable<Account>     │
├─────────────────────────────────────────────┤
│ StateStorageService                          │
│   └── previousUrl (SessionStorage)           │
├─────────────────────────────────────────────┤
│ AuthServerProvider                           │
│   └── Token JWT (LocalStorage/Session)       │
├─────────────────────────────────────────────┤
│ AlertService                                 │
│   └── alerts: Alert[]                        │
├─────────────────────────────────────────────┤
│ EventManager                                 │
│   └── observable: Observable<Event>          │
└─────────────────────────────────────────────┘
```

### État Local (Composants)

Chaque composant de liste gère son propre état :

| État           | Type        | Description              |
| -------------- | ----------- | ------------------------ |
| `entities`     | `IEntity[]` | Données affichées        |
| `isLoading`    | `boolean`   | Indicateur de chargement |
| `page`         | `number`    | Page courante            |
| `totalItems`   | `number`    | Nombre total d'éléments  |
| `predicate`    | `string`    | Champ de tri             |
| `ascending`    | `boolean`   | Ordre de tri             |
| `itemsPerPage` | `number`    | 20 (constante)           |

### Flux de Données

```
URL (QueryParams) → Route Resolver → Component State → Template
                 ↑                                       │
                 └──── Navigation (page, sort) ──────────┘
```

---

## 8. Communication API

### Configuration des Endpoints

**`ApplicationConfigService`** centralise la construction des URLs :

```typescript
// API directe (Gateway)
getEndpointFor('api/authenticate')       → '/api/authenticate'
getEndpointFor('api/account')            → '/api/account'

// API via microservice
getEndpointFor('api/clients', 'businessservice')
  → '/services/businessservice/api/clients'

getEndpointFor('api/stock-items', 'inventoryservice')
  → '/services/inventoryservice/api/stock-items'

getEndpointFor('api/audit-logs', 'platformservice')
  → '/services/platformservice/api/audit-logs'
```

### Proxy de Développement

Fichier `webpack/proxy.conf.js` :

| Context        | Target                  |
| -------------- | ----------------------- |
| `/api`         | `http://localhost:8080` |
| `/services`    | `http://localhost:8080` |
| `/management`  | `http://localhost:8080` |
| `/v3/api-docs` | `http://localhost:8080` |
| `/h2-console`  | `http://localhost:8080` |
| `/auth`        | `http://localhost:8080` |
| `/health`      | `http://localhost:8080` |

### API — Authentification & Compte

| Méthode | Endpoint                             | Description              | Utilisé par                         |
| ------- | ------------------------------------ | ------------------------ | ----------------------------------- |
| `POST`  | `/api/authenticate`                  | Authentification JWT     | `AuthServerProvider.login()`        |
| `GET`   | `/api/account`                       | Récupérer identité       | `AccountService.identity()`         |
| `POST`  | `/api/account`                       | Mettre à jour profil     | `AccountService.save()`             |
| `POST`  | `/api/register`                      | Inscription              | `RegisterService.save()`            |
| `GET`   | `/api/activate?key=`                 | Activer le compte        | `ActivateService.get()`             |
| `POST`  | `/api/account/change-password`       | Changer mot de passe     | `PasswordService.save()`            |
| `POST`  | `/api/account/reset-password/init`   | Initier reset password   | `PasswordResetInitService.save()`   |
| `POST`  | `/api/account/reset-password/finish` | Finaliser reset password | `PasswordResetFinishService.save()` |

### API — Administration

| Méthode  | Endpoint                    | Description               |
| -------- | --------------------------- | ------------------------- |
| `GET`    | `/api/admin/users`          | Lister utilisateurs       |
| `GET`    | `/api/admin/users/:login`   | Détail utilisateur        |
| `POST`   | `/api/admin/users`          | Créer utilisateur         |
| `PUT`    | `/api/admin/users`          | Modifier utilisateur      |
| `DELETE` | `/api/admin/users/:login`   | Supprimer utilisateur     |
| `GET`    | `/api/gateway/routes/`      | Routes gateway            |
| `GET`    | `/management/health`        | Health checks             |
| `GET`    | `/management/jhimetrics`    | Métriques JVM             |
| `GET`    | `/management/configprops`   | Configuration Spring      |
| `GET`    | `/management/env`           | Variables d'environnement |
| `GET`    | `/management/loggers`       | Liste loggers             |
| `POST`   | `/management/loggers/:name` | Modifier niveau log       |
| `GET`    | `/management/info`          | Info profil actif         |

### API — Entités CRUD (Pattern Standard)

Chaque entité suit le pattern REST standard :

| Méthode  | Endpoint              | Description                                    |
| -------- | --------------------- | ---------------------------------------------- |
| `GET`    | `/api/{entities}`     | Liste paginée (query params: page, size, sort) |
| `GET`    | `/api/{entities}/:id` | Récupérer par ID                               |
| `POST`   | `/api/{entities}`     | Créer                                          |
| `PUT`    | `/api/{entities}/:id` | Modifier                                       |
| `PATCH`  | `/api/{entities}/:id` | Modifier partiellement                         |
| `DELETE` | `/api/{entities}/:id` | Supprimer                                      |

**Endpoints par Microservice** :

| Microservice         | Endpoints                                                                                                                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **BusinessService**  | `services/businessservice/api/clients`, `.../orders`, `.../products`, `.../invoices`, `.../deliveries`, `.../missions`, `.../visits`, `.../order-lines`, `.../order-line-items`, `.../price-lists`, `.../client-contacts` |
| **InventoryService** | `services/inventoryservice/api/warehouses`, `.../stock-items`, `.../stock-movements`, `.../stock-audits`, `.../stock-audit-lines`, `.../swaps`                                                                            |
| **PlatformService**  | `services/platformservice/api/tenants`, `.../audit-logs`, `.../notifications`, `.../documents`, `.../objectives`, `.../client-scores`, `.../performance-scores`                                                           |

### Headers HTTP

- **Authorization** : `Bearer {JWT_TOKEN}` — Injecté par `AuthInterceptor`
- **Response Headers parsés** :
  - `X-Total-Count` — Nombre total d'éléments (pagination)
  - `*-app-alert` — Message d'alerte serveur
  - `*-app-params` — Paramètres d'alerte
  - `*-app-error` — Code d'erreur

---

## 9. Formulaires & Validation

### Bibliothèque Utilisée

**Angular Reactive Forms** (`@angular/forms`) :

- `FormGroup` / `FormControl`
- `Validators` (required, min, max, minLength, maxLength, email, pattern)
- Services `FormService` dédiés par entité

### Pattern de Formulaire d'Entité

Chaque entité utilise un **FormService** dédié :

```
EntityFormService
  ├── createEntityFormGroup()     → Crée le FormGroup avec validateurs
  ├── getEntity(form)             → Extrait l'objet de la forme
  ├── resetForm(form, entity)     → Réinitialise avec des données
  └── convertDateFromClient()     → Convertit les dates Day.js → string
```

### Formulaires Détaillés

#### Formulaire Login

| Champ        | Contrôle               | Validateurs           |
| ------------ | ---------------------- | --------------------- |
| `username`   | `FormControl<string>`  | `Validators.required` |
| `password`   | `FormControl<string>`  | `Validators.required` |
| `rememberMe` | `FormControl<boolean>` | `Validators.required` |

#### Formulaire Register

| Champ             | Contrôle              | Validateurs                                    |
| ----------------- | --------------------- | ---------------------------------------------- |
| `login`           | `FormControl<string>` | required, minLength(1), maxLength(50), pattern |
| `email`           | `FormControl<string>` | required, minLength(5), maxLength(254), email  |
| `password`        | `FormControl<string>` | required, minLength(4), maxLength(50)          |
| `confirmPassword` | `FormControl<string>` | required, minLength(4), maxLength(50)          |

**Validation custom** : `password !== confirmPassword` → `doNotMatch`

#### Formulaire Settings

| Champ       | Contrôle              | Validateurs                                   |
| ----------- | --------------------- | --------------------------------------------- |
| `firstName` | `FormControl<string>` | required, minLength(1), maxLength(50)         |
| `lastName`  | `FormControl<string>` | required, minLength(1), maxLength(50)         |
| `email`     | `FormControl<string>` | required, minLength(5), maxLength(254), email |
| `langKey`   | `FormControl<string>` | non-nullable                                  |

#### Formulaire Client (Exemple Entité)

| Champ              | Contrôle                    | Validateurs              |
| ------------------ | --------------------------- | ------------------------ |
| `id`               | `FormControl<number>`       | required (disabled)      |
| `tenantId`         | `FormControl<number>`       | required                 |
| `name`             | `FormControl<string>`       | required, maxLength(255) |
| `taxId`            | `FormControl<string>`       | maxLength(50)            |
| `clientType`       | `FormControl<ClientType>`   | required                 |
| `creditLimit`      | `FormControl<number>`       | min(0)                   |
| `creditUsed`       | `FormControl<number>`       | min(0)                   |
| `paymentTermsDays` | `FormControl<number>`       | min(0)                   |
| `status`           | `FormControl<ClientStatus>` | required                 |
| `lastOrderAt`      | `FormControl<string>`       | —                        |
| `isDeleted`        | `FormControl<boolean>`      | required                 |
| `createdAt`        | `FormControl<string>`       | required                 |
| `updatedAt`        | `FormControl<string>`       | —                        |

### Logique de Soumission

```
1. Utilisateur clique "Sauvegarder"
2. FormService.getEntity(editForm) → extrait l'objet
3. Si entity.id !== null → update (PUT)
   Sinon → create (POST)
4. subscribeToSaveResponse(result)
   ├── onSaveSuccess() → window.history.back()
   ├── onSaveError() → (extensible par héritage)
   └── onSaveFinalize() → isSaving = false
```

---

## 10. Système de Design UI/UX

### Framework CSS

- **Bootstrap 5.2.0** — Système de grille, composants utilitaires
- **Bootswatch 5.2.0** — Thème personnalisé
- **SCSS** — Styles avec preprocesseur
- **postcss-rtlcss** — Support RTL pour l'arabe

### Composants UI Bootstrap Utilisés

| Composant     | Utilisation                                                                   |
| ------------- | ----------------------------------------------------------------------------- |
| **Navbar**    | Navigation principale (`.navbar`, `.navbar-dark`, `.bg-primary`)              |
| **Cards**     | Conteneur principal du contenu (`.card`, `.jh-card`)                          |
| **Tables**    | Listes d'entités (`.table`, `.table-striped`)                                 |
| **Forms**     | Formulaires CRUD (`.form-control`, `.mb-3`)                                   |
| **Buttons**   | Actions (`.btn`, `.btn-primary`, `.btn-danger`, `.btn-info`)                  |
| **Alerts**    | Notifications (`.alert`, `.alert-success`, `.alert-danger`, `.alert-warning`) |
| **Dropdowns** | Menus navbar (`ngbDropdown`, `ngbDropdownMenu`)                               |
| **Modals**    | Dialogues de suppression (`NgbModal`)                                         |
| **Badges**    | Statuts                                                                       |
| **Grid**      | Layout responsive (`.row`, `.col-md-*`)                                       |

### Composants ng-bootstrap Utilisés

| Composant       | Utilisation                                        |
| --------------- | -------------------------------------------------- |
| `NgbModal`      | Modales de suppression d'entités                   |
| `NgbDropdown`   | Menus déroulants navbar                            |
| `NgbCollapse`   | Collapse navbar mobile                             |
| `NgbDatepicker` | Sélection de dates (via `NgbDateAdapter` → Day.js) |
| `NgbPagination` | Pagination des listes                              |

### Icônes FontAwesome Utilisées

| Icône            | Contexte             |
| ---------------- | -------------------- |
| `home`           | Menu accueil         |
| `th-list`        | Menu entités         |
| `users-cog`      | Menu administration  |
| `users`          | Gestion utilisateurs |
| `tachometer-alt` | Métriques            |
| `heart`          | Health               |
| `cogs`           | Configuration        |
| `tasks`          | Logs                 |
| `book`           | API docs             |
| `road`           | Gateway              |
| `flag`           | Langues              |
| `user`           | Compte               |
| `user-plus`      | Inscription          |
| `sign-in-alt`    | Connexion            |
| `sign-out-alt`   | Déconnexion          |
| `wrench`         | Paramètres           |
| `lock`           | Mot de passe         |
| `bars`           | Hamburger menu       |
| `asterisk`       | Items entités        |
| `pencil-alt`     | Éditer               |
| `eye`            | Voir détail          |
| `plus`           | Créer                |
| `times`          | Supprimer            |
| `sort`           | Tri                  |

### Patterns UI Récurrents

#### Pattern Liste (Entity List)

```
┌─────────────────────────────────────────────────┐
│ [Titre]                              [+ Créer]  │
├─────────────────────────────────────────────────┤
│ <jhi-alert>                                      │
│ <jhi-alert-error>                                │
├──────┬──────────┬─────────┬──────────┬──────────┤
│  ID ▲│  Nom     │ Status  │ Date     │ Actions  │
├──────┼──────────┼─────────┼──────────┼──────────┤
│  1   │  Client1 │ ACTIVE  │ 01/01/25 │ 👁 ✏️ 🗑  │
│  2   │  Client2 │ INACTIVE│ 15/02/25 │ 👁 ✏️ 🗑  │
├──────┴──────────┴─────────┴──────────┴──────────┤
│ Affichage 1-20 sur 150      [< 1 2 3 4 ... >]   │
└─────────────────────────────────────────────────┘
```

#### Pattern Détail (Entity Detail)

```
┌─────────────────────────────────────────────┐
│ [Titre Entité]                               │
├─────────────────────────────────────────────┤
│  ID:         1                               │
│  Nom:        Client ABC                      │
│  Type:       NATIONAL_DISTRIBUTOR            │
│  Status:     ACTIVE                          │
│  Créé le:    01/01/2025 10:00                │
├─────────────────────────────────────────────┤
│         [◄ Retour]  [✏️ Éditer]              │
└─────────────────────────────────────────────┘
```

#### Pattern Formulaire (Entity Create/Edit)

```
┌─────────────────────────────────────────────┐
│ Créer / Modifier [Entité]                    │
├─────────────────────────────────────────────┤
│  Nom *:      [_________________]             │
│  Type *:     [▼ Sélectionner   ]             │
│  Status *:   [▼ Sélectionner   ]             │
│  Crédit:     [_________________]             │
│  Date:       [📅________________]            │
├─────────────────────────────────────────────┤
│         [◄ Annuler]  [💾 Sauvegarder]        │
└─────────────────────────────────────────────┘
```

#### Pattern Modal de Suppression

```
┌─────────────────────────────────────────────┐
│ Confirmer la suppression                     │
├─────────────────────────────────────────────┤
│ Êtes-vous sûr de vouloir supprimer          │
│ [Entité] id X ?                              │
├─────────────────────────────────────────────┤
│              [Annuler]  [Supprimer]          │
└─────────────────────────────────────────────┘
```

---

## 11. Flux d'Authentification

### Vue d'Ensemble

```
┌────────────────────────────────────────────────────────────────┐
│                   FLUX D'AUTHENTIFICATION                       │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  1. LOGIN                                                      │
│  ┌─────────┐     ┌──────────────┐     ┌───────────────────┐   │
│  │ Login   │────▶│ POST         │────▶│ AuthServerProvider │   │
│  │ Form    │     │ /authenticate│     │ .login()           │   │
│  └─────────┘     └──────────────┘     └─────────┬─────────┘   │
│                                                  │             │
│                  ┌──────────────────┐             │             │
│                  │ Stocker JWT      │◀────────────┘             │
│                  │ (Local/Session   │                           │
│                  │  Storage)        │                           │
│                  └────────┬─────────┘                           │
│                           │                                    │
│                  ┌────────▼─────────┐                           │
│                  │ AccountService   │                           │
│                  │ .identity(true)  │                           │
│                  │ GET /api/account │                           │
│                  └────────┬─────────┘                           │
│                           │                                    │
│                  ┌────────▼─────────┐                           │
│                  │ Navigate to      │                           │
│                  │ storedUrl || '/' │                           │
│                  └──────────────────┘                           │
│                                                                │
│  2. CHAQUE REQUÊTE HTTP                                        │
│  ┌─────────────┐     ┌──────────────────┐                      │
│  │ HTTP Request│────▶│ AuthInterceptor  │                      │
│  └─────────────┘     │ Ajoute header:   │                      │
│                      │ Authorization:   │                      │
│                      │ Bearer {token}   │                      │
│                      └──────────────────┘                      │
│                                                                │
│  3. TOKEN EXPIRÉ                                               │
│  ┌──────────┐     ┌──────────────────────┐                     │
│  │ 401      │────▶│ AuthExpiredInterceptor│                    │
│  │ Response │     │ .logout()             │                    │
│  └──────────┘     │ → navigate('/login')  │                    │
│                   └──────────────────────┘                     │
│                                                                │
│  4. LOGOUT                                                     │
│  ┌─────────────────────┐     ┌────────────────────┐           │
│  │ LoginService.logout()│───▶│ Supprimer token    │           │
│  └─────────────────────┘     │ Authenticate(null) │           │
│                              │ Navigate('/')      │           │
│                              └────────────────────┘           │
└────────────────────────────────────────────────────────────────┘
```

### Stockage du Token

| Mode                    | Storage                                      | Quand                                 |
| ----------------------- | -------------------------------------------- | ------------------------------------- |
| **Remember Me = true**  | `LocalStorage` (`jhi-authenticationToken`)   | Persistant entre sessions             |
| **Remember Me = false** | `SessionStorage` (`jhi-authenticationToken`) | Supprimé à la fermeture du navigateur |

### Modèle Account

```typescript
class Account {
  activated: boolean;
  authorities: string[]; // ['ROLE_ADMIN', 'ROLE_USER']
  email: string;
  firstName: string | null;
  langKey: string; // 'fr', 'en', 'ar-ly'
  lastName: string | null;
  login: string;
  imageUrl: string | null;
}
```

### Rôles & Autorisations

| Rôle         | Constante         | Accès                             |
| ------------ | ----------------- | --------------------------------- |
| `ROLE_ADMIN` | `Authority.ADMIN` | Administration + Entités + Compte |
| `ROLE_USER`  | `Authority.USER`  | Entités + Compte                  |

### Protection des Routes

- **Routes Admin** : Guard `UserRouteAccessService` + `data.authorities: [Authority.ADMIN]`
- **Routes Entités** : Guard `UserRouteAccessService` (authentifié sans rôle spécifique)
- **Routes Account** : Protégées par le composant (redirect si non authentifié)
- **Routes Publiques** : `/login`, `/account/register`, `/account/activate`, `/account/reset/*`

---

## 12. Gestion des Erreurs

### Architecture de Gestion d'Erreurs

```
HTTP Error
    │
    ├──── AuthExpiredInterceptor (401)
    │     └── Logout + Redirect /login
    │
    ├──── ErrorHandlerInterceptor (autres)
    │     └── EventManager.broadcast('httpError', err)
    │
    └──── NotificationInterceptor (succès)
          └── AlertService.addAlert('success')

EventManager
    │
    └──── AlertErrorComponent (écoute 'httpError')
          ├── 0:   "Server not reachable"
          ├── 400: Parse headers / fieldErrors / message
          ├── 404: "Not found"
          └── default: message du serveur
```

### Types d'Erreurs Gérées

| Code HTTP | Gestion                          | Affichage                            |
| --------- | -------------------------------- | ------------------------------------ |
| `0`       | Serveur non joignable            | Alerte danger                        |
| `400`     | Erreurs de validation / Business | Alerte avec détails des champs       |
| `401`     | Token expiré                     | Logout automatique + redirect /login |
| `403`     | Accès refusé                     | Page `/accessdenied`                 |
| `404`     | Ressource non trouvée            | Alerte danger                        |
| `5xx`     | Erreur serveur                   | Alerte avec message                  |

### Erreurs de Formulaire

| Type                               | Gestion                                                                             |
| ---------------------------------- | ----------------------------------------------------------------------------------- |
| Champs requis manquants            | Validation Angular native (`Validators.required`)                                   |
| Format email invalide              | `Validators.email`                                                                  |
| Longueur min/max                   | `Validators.minLength()` / `Validators.maxLength()`                                 |
| Mots de passe ne correspondent pas | Check manuel `password !== confirmPassword`                                         |
| Login/Email déjà utilisé           | Réponse 400 du serveur, codes `LOGIN_ALREADY_USED_TYPE` / `EMAIL_ALREADY_USED_TYPE` |

### Composants d'Alerte

**`AlertComponent`** : Affiche les alertes globales de `AlertService` avec auto-fermeture (timeout 5s).

**`AlertErrorComponent`** : Souscrit aux événements `httpError` et `error` via `EventManager`, parse les réponses HTTP et crée des alertes danger appropriées avec traduction.

---

## 13. Optimisations de Performance

### Lazy Loading

**Tous les modules fonctionnels** sont lazy-loaded via `loadChildren()` :

| Module                     | Type                                         |
| -------------------------- | -------------------------------------------- |
| `AccountModule`            | Lazy                                         |
| `AdminRoutingModule`       | Lazy                                         |
| `LoginModule`              | Lazy                                         |
| `EntityRoutingModule`      | Lazy                                         |
| Chaque entité individuelle | Double lazy (entity routing → entity module) |

Le seul module eagerly loaded est `HomeModule`.

### Caching

| Mécanisme              | Implémentation                                                                                     |
| ---------------------- | -------------------------------------------------------------------------------------------------- |
| **Account Cache**      | `AccountService.accountCache$` avec `shareReplay()` — un seul appel API `/api/account` par session |
| **Profile Info Cache** | `ProfileService.profileInfo$` avec `shareReplay()` — un seul appel `/management/info`              |
| **Token Cache**        | JWT stocké en `LocalStorage` / `SessionStorage`                                                    |
| **i18n Cache**         | Fichiers de traduction JSON mergés au build                                                        |

### Optimisation RxJS

- `shareReplay()` pour cacher les résultats d'observables
- `takeUntil(destroy$)` pour éviter les memory leaks
- `combineLatest` pour combiner paramètres de route et données

### PWA

- Service Worker disponible mais **désactivé par défaut** (`enabled: false` dans `app.module.ts`)
- Fichier `ngsw-config.json` configuré pour le caching des assets
- Manifest `manifest.webapp` présent

### Build

- **Webpack 5.74.0** avec custom config
- **BundleAnalyzerPlugin** disponible pour analyse des bundles
- **Tree-shaking** automatique via Angular CLI
- **AOT Compilation** en mode production

---

## 14. Configuration d'Environnement

### Variables Webpack

Fichier `webpack/environment.js` :

| Variable                 | Description               | Valeur par défaut                    |
| ------------------------ | ------------------------- | ------------------------------------ |
| `SERVER_API_URL`         | Préfixe API backend       | `''` (même origine)                  |
| `__VERSION__`            | Version de l'app          | `process.env.APP_VERSION` ou `'DEV'` |
| `__DEBUG_INFO_ENABLED__` | Mode debug Angular Router | `false`                              |
| `I18N_HASH`              | Hash des fichiers i18n    | Généré au build                      |

### Configuration Angular

Fichier `angular.json` :

- **Development** : `ng build --configuration development`
- **Production** : `ng build --configuration production`

### Proxy de Développement

En mode `ng serve`, le proxy redirige vers `http://localhost:8080` pour :

- `/api/*`
- `/services/*`
- `/management/*`
- `/v3/api-docs`
- `/h2-console`
- `/auth`
- `/health`

### Internationalisation

| Langue        | Code    | Fichier             |
| ------------- | ------- | ------------------- |
| Français      | `fr`    | `i18n/fr/*.json`    |
| Arabe (Libye) | `ar-ly` | `i18n/ar-ly/*.json` |
| Anglais       | `en`    | `i18n/en/*.json`    |

**Locale par défaut** : `fr` (configuré dans `app.module.ts` : `{ provide: LOCALE_ID, useValue: 'fr' }`)

### Constantes Applicatives

| Constante                     | Fichier                   | Valeur             |
| ----------------------------- | ------------------------- | ------------------ |
| `ITEMS_PER_PAGE`              | `pagination.constants.ts` | `20`               |
| `TOTAL_COUNT_RESPONSE_HEADER` | `pagination.constants.ts` | `'X-Total-Count'`  |
| `Authority.ADMIN`             | `authority.constants.ts`  | `'ROLE_ADMIN'`     |
| `Authority.USER`              | `authority.constants.ts`  | `'ROLE_USER'`      |
| `ASC` / `DESC`                | `navigation.constants.ts` | `'asc'` / `'desc'` |

---

## 15. Diagrammes UI

### Architecture Globale du Frontend

```
                    ┌─────────────────────┐
                    │    Angular App      │
                    │  (TuniSalesGateway) │
                    └────────┬────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
    ┌─────────▼────┐  ┌─────▼──────┐  ┌───▼──────────┐
    │ BusinessSvc  │  │InventorySvc│  │ PlatformSvc  │
    │ (Port 8081?) │  │ (Port 8082?)│  │ (Port 8083?) │
    └──────────────┘  └────────────┘  └──────────────┘
```

### Flux de Navigation Utilisateur

```
Utilisateur non authentifié :
─────────────────────────────
  /  (Home) ──→ /login ──→ /account/register
                   │              │
                   │         /account/activate
                   │
              /account/reset/request ──→ /account/reset/finish


Utilisateur authentifié (ROLE_USER) :
─────────────────────────────────────
  / (Home)
  ├── /client          → /client/new, /client/:id/view, /client/:id/edit
  ├── /order           → /order/new, /order/:id/view, /order/:id/edit
  ├── /product         → ...
  ├── /invoice         → ...
  ├── /delivery        → ...
  ├── /mission         → ...
  ├── /visit           → ...
  ├── /warehouse       → ...
  ├── /stock-item      → ...
  ├── /notification    → ...
  ├── /tenant          → ...
  ├── ... (24 entités)
  ├── /account/settings
  └── /account/password


Administrateur (ROLE_ADMIN) :
─────────────────────────────
  Tout ce qui précède +
  ├── /admin/user-management → /new, /:login/view, /:login/edit
  ├── /admin/gateway
  ├── /admin/health
  ├── /admin/metrics
  ├── /admin/configuration
  ├── /admin/logs
  └── /admin/docs
```

### Flux CRUD d'une Entité

```
┌──────────────────────────────────────────────────────────┐
│                    FLUX CRUD ENTITÉ                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────┐    GET /api/entities    ┌───────────┐  │
│  │ Entity List │◀───────────────────────│ Backend   │  │
│  │ Component   │                         │ API       │  │
│  └──┬──┬──┬────┘                         └─────┬─────┘  │
│     │  │  │                                    │        │
│  ┌──▼──┘  └──┐                                 │        │
│  │  ▼        ▼                                 │        │
│  │ [View]  [Edit]  [Delete]                    │        │
│  │  │        │       │                         │        │
│  │  │   ┌────▼────┐  │    ┌──────────┐         │        │
│  │  │   │ Update  │  └──▶│ Delete   │         │        │
│  │  │   │ Form    │      │ Modal    │         │        │
│  │  │   │         │      │          │         │        │
│  │  │   │ POST or │─────▶│ DELETE   │─────────▶│        │
│  │  │   │ PUT     │      │ /api/    │         │        │
│  │  │   └─────────┘      │ entity/  │         │        │
│  │  │                    │ :id      │         │        │
│  │  ▼                    └──────────┘         │        │
│  │ ┌──────────┐                               │        │
│  │ │ Detail   │◀──── GET /api/entities/:id ───┘        │
│  │ │ View     │                                        │
│  │ └──────────┘                                        │
│  │                                                     │
│  └── [+ New] ─▶ Update Form ─▶ POST /api/entities      │
│                                                        │
└──────────────────────────────────────────────────────────┘
```

### Architecture des Intercepteurs HTTP

```
Request sortante :                     Response entrante :
─────────────────                      ───────────────────

┌─────────────┐                        ┌─────────────────────┐
│ HTTP Client │                        │ NotificationInterceptor │
└──────┬──────┘                        │ (Alertes succès)        │
       │                               └───────────┬─────────────┘
┌──────▼───────────┐                               │
│ AuthInterceptor  │                   ┌───────────▼─────────────┐
│ (Inject Bearer)  │                   │ ErrorHandlerInterceptor │
└──────┬───────────┘                   │ (Broadcast erreurs)     │
       │                               └───────────┬─────────────┘
┌──────▼───────────────┐                           │
│ AuthExpiredInterceptor│               ┌───────────▼─────────────┐
│ (Détect 401)         │               │ AuthExpiredInterceptor  │
└──────┬───────────────┘               │ (Logout si 401)         │
       │                               └───────────┬─────────────┘
       ▼                                           ▼
   [Backend]                                   [Backend]
```

### Diagramme des Enumerations Métier

```
BusinessService:
├── ClientType: NATIONAL_DISTRIBUTOR | REGIONAL_WHOLESALER | INDEPENDENT_POS | TELECOM_OPERATOR
├── ClientStatus: ACTIVE | INACTIVE | SUSPENDED | CHURN_RISK
├── ContactRole: BUYER | ACCOUNTING | MANAGEMENT | TECHNICAL | OTHER
├── OrderStatus: DRAFT | SUBMITTED | UNDER_REVIEW | APPROVED | IN_PREPARATION | SHIPPED | DELIVERED | INVOICED | PAID | REJECTED | CANCELLED
├── InvoiceStatus: DRAFT | ISSUED | PARTIALLY_PAID | PAID | OVERDUE | CANCELLED
├── DeliveryStatus: PENDING | IN_PREPARATION | SHIPPED | DELIVERED | FAILED
├── MissionStatus: PLANNED | IN_PROGRESS | COMPLETED | CANCELLED
├── VisitObjective: SALE | PROSPECTING | AUDIT | COLLECTION | SUPPORT
└── VisitStatus: PLANNED | IN_PROGRESS | COMPLETED | MISSED | CANCELLED

InventoryService:
├── WarehouseType: LOCAL | SITE | SWAP | DEFECTIVE | MISSING
├── StockItemStatus: AVAILABLE | RESERVED | ALLOCATED | IN_TRANSIT | DEPLOYED | DEFECTIVE | MISSING | SOLD | RETIRED
├── MovementType: INBOUND | OUTBOUND | TRANSFER | RETURN | SWAP_OUT | SWAP_IN | INVENTORY_ADJUSTMENT
├── AuditStatus: IN_PROGRESS | CLOSED | CANCELLED
├── AuditResolution: FOUND | LOST_STOLEN | SYSTEM_ERROR | IN_PROGRESS
└── SwapStatus: PENDING | IN_PROGRESS | RESOLVED | CANCELLED

PlatformService:
├── TenantStatus: ACTIVE | INACTIVE | SUSPENDED | TRIAL
├── AuditAction: CREATE | UPDATE | DELETE | LOGIN | LOGOUT | EXPORT | VALIDATE | REJECT
├── NotificationType: STOCK_ALERT | APPROVAL_REQUIRED | ORDER_APPROVED | ORDER_REJECTED | DELIVERY_CONFIRMED | SCORE_CALCULATED | PAYMENT_DUE | STOCK_DISCREPANCY
├── DocumentEntityType: ORDER | DELIVERY | INVOICE | CLIENT | STOCK_AUDIT
├── DocumentType: DELIVERY_NOTE | INVOICE | CONTRACT | AMENDMENT | AUDIT_REPORT | PURCHASE_ORDER | OTHER
├── MetricType: REVENUE | UNIT_VOLUME | VISIT_COUNT | CONVERSION_RATE
└── ScoreClassification: EXCELLENT | GOOD | AVERAGE | POOR
```

### Relations entre Entités

```
                          ┌──────────────┐
                          │   Tenant     │
                          └──────┬───────┘
                                 │ tenantId (toutes entités)
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
┌───────▼──────┐         ┌───────▼──────┐         ┌───────▼──────┐
│  Client      │         │  Product     │         │  Warehouse   │
└───┬──┬───────┘         └───────┬──────┘         └───┬──────────┘
    │  │                         │                    │
    │  │  ┌──────────────────┐   │                    │
    │  ├─▶│ ClientContact    │   │         ┌──────────▼──────────┐
    │  │  └──────────────────┘   │         │    StockItem        │
    │  │                         │         └──┬──────────────┬───┘
    │  │  ┌──────────────────┐   │            │              │
    │  ├─▶│ ClientScore      │   │  ┌─────────▼──────┐ ┌────▼─────────┐
    │  │  └──────────────────┘   │  │ StockMovement  │ │StockAuditLine│
    │  │                         │  └────────────────┘ └──────┬───────┘
    │  │  ┌──────────────────┐   │                            │
    │  └─▶│ PriceList  ◀─────┼───┘                   ┌───────▼───────┐
    │     └──────────────────┘                        │  StockAudit   │
    │                                                 └───────────────┘
    │     ┌──────────────────┐
    ├────▶│    Order         │
    │     └──┬───────────┬───┘
    │        │           │
    │   ┌────▼────┐ ┌────▼──────┐     ┌──────────────┐
    │   │OrderLine│ │ Invoice   │     │   Mission     │
    │   └────┬────┘ └───────────┘     └──────┬────────┘
    │        │                               │
    │   ┌────▼─────────┐              ┌──────▼────────┐
    │   │OrderLineItem │              │    Visit      │◀─── Client
    │   └──────────────┘              └───────────────┘
    │
    │     ┌──────────────────┐
    └────▶│   Delivery       │◀── Order
          └──────────────────┘

Entités transversales :
┌───────────────┐  ┌──────────────┐  ┌──────────────────┐
│  AuditLog     │  │ Notification │  │ Document         │
│ (tout entity) │  │ (users)      │  │ (tout entity)    │
└───────────────┘  └──────────────┘  └──────────────────┘

┌───────────────┐  ┌──────────────────┐  ┌──────────┐
│  Objective    │  │ PerformanceScore │  │  Swap    │
│ (users)       │  │ (users)          │  │ (items)  │
└───────────────┘  └──────────────────┘  └──────────┘
```

---

## Annexe — Résumé Technique Rapide

| Aspect               | Détail                                                          |
| -------------------- | --------------------------------------------------------------- |
| **Framework**        | Angular 14.2 + TypeScript 4.8                                   |
| **UI**               | Bootstrap 5.2 + ng-bootstrap 13 + FontAwesome                   |
| **Authentification** | JWT (Bearer Token) via LocalStorage/SessionStorage              |
| **State**            | RxJS ReplaySubject (pas de NgRx/Redux)                          |
| **i18n**             | @ngx-translate (3 langues : fr, en, ar-ly)                      |
| **Routage**          | Angular Router avec lazy loading intégral                       |
| **Guards**           | `UserRouteAccessService` (CanActivate)                          |
| **HTTP**             | 4 intercepteurs (Auth, AuthExpired, ErrorHandler, Notification) |
| **Formulaires**      | Angular Reactive Forms avec FormServices dédiés                 |
| **Pagination**       | Serveur-side, 20 items/page, header X-Total-Count               |
| **Architecture**     | Gateway microservices (Business, Inventory, Platform)           |
| **Entités**          | 24 entités CRUD (11 Business + 6 Inventory + 7 Platform)        |
| **Générateur**       | JHipster 7.9.3                                                  |
| **Tests**            | Jest + jest-preset-angular                                      |
| **CI/Build**         | Webpack 5.74 + Angular CLI                                      |

---

> _Documentation générée automatiquement par analyse statique du code source._  
> _Dernière mise à jour : Mars 2026_

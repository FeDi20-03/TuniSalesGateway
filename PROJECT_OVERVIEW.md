# TuniSalesGateway — Vue d'ensemble du projet

> **API Gateway JHipster** pour l'écosystème de vente TuniSales (Tunisie / Libye).
> Point d'entrée unique de l'architecture microservices : authentification JWT centralisée, autorisation par rôles, routage dynamique via Eureka, relais JWT aux services downstream, notifications WebSocket temps réel.

| Composant   | Version |
| ----------- | ------- |
| JHipster    | 7.9.3   |
| Spring Boot | 2.7.3   |
| Java        | 11      |
| Angular     | 14.2    |
| Node.js     | ≥ 16.17 |
| PostgreSQL  | 14.5    |
| Liquibase   | 4.15    |

---

## Table des matières

1. [Objectif du projet](#1-objectif-du-projet)
2. [Stack technique](#2-stack-technique)
3. [Architecture globale](#3-architecture-globale)
4. [Structure des dossiers](#4-structure-des-dossiers)
5. [Modules backend clés](#5-modules-backend-clés)
6. [Modules frontend clés](#6-modules-frontend-clés)
7. [Dépendances principales](#7-dépendances-principales)
8. [Configuration et profils Spring](#8-configuration-et-profils-spring)
9. [Modèle de sécurité (rôles & matrice d'accès)](#9-modèle-de-sécurité-rôles--matrice-daccès)
10. [Flux de fonctionnement global](#10-flux-de-fonctionnement-global)
11. [Démarrer le projet en local](#11-démarrer-le-projet-en-local)
12. [Internationalisation](#12-internationalisation)
13. [Qualité, observabilité et CI](#13-qualité-observabilité-et-ci)
14. [Patterns architecturaux](#14-patterns-architecturaux)
15. [Pour aller plus loin](#15-pour-aller-plus-loin)

---

## 1. Objectif du projet

**TuniSalesGateway** est l'**API Gateway** de la plateforme TuniSales, conçu pour fédérer un ensemble de microservices métier (commerciaux, inventaire, plateforme transverse) derrière un point d'entrée unique.

### Rôle métier

Coordonner les workflows d'une force de vente terrain :

- Gestion des **commandes** (orders) avec workflow d'approbation (`SUBMITTED → VALIDATED / NEGOTIATING / REJECTED`).
- Gestion des **clients**, **livraisons**, **factures**, **missions**, **visites terrain**.
- Suivi de l'**inventaire** (stock, audits, mouvements, échanges).
- Plateforme transverse : **notifications**, **audit log**, **scoring**, **objectifs**, **multi-tenant**.
- Modules métier custom : `orders-pending`, `plan-vente`, `zone`, `bonus-rule`, `promotion`, `credit-note`, `complaint`, `onboarding`.

### Rôle technique

- **Authentification centralisée** : émission et validation de JWT.
- **Autorisation par rôles (RBAC)** : 8 rôles métier + 3 rôles standard JHipster.
- **Routage dynamique** : Spring Cloud Gateway + Eureka — toute requête vers `/services/{serviceId}/**` est routée vers le microservice correspondant découvert à chaud.
- **JWT relay** : le token validé en entrée est ré-injecté dans l'en-tête `Authorization` vers le service aval.
- **WebSocket** : exposition temps réel des notifications utilisateur via STOMP.
- **Multi-tenant** : extraction d'un tenant ID depuis les en-têtes HTTP.

---

## 2. Stack technique

### Backend

| Brique                              | Usage                                   |
| ----------------------------------- | --------------------------------------- |
| Spring Boot 2.7.3 + WebFlux         | Stack réactive (Mono/Flux)              |
| Spring Cloud Gateway                | Reverse proxy + routage                 |
| Spring Security + JJWT              | JWT HMAC-SHA, expiration 24h            |
| R2DBC + PostgreSQL                  | Accès base réactif                      |
| Liquibase                           | Migrations versionnées                  |
| Eureka Client + Spring Cloud Config | Service discovery + config externalisée |
| Resilience4j                        | Circuit breaker                         |
| Bucket4j                            | Rate limiting                           |
| Springdoc OpenAPI                   | Documentation API                       |
| Micrometer + Prometheus             | Métriques                               |
| Zalando Problem                     | Erreurs RFC 7807                        |
| MapStruct                           | DTO ↔ Entity                            |

### Frontend

| Brique                               | Usage                              |
| ------------------------------------ | ---------------------------------- |
| Angular 14.2                         | SPA                                |
| `@ng-bootstrap/ng-bootstrap` 13      | Composants UI (modales, dropdowns) |
| `@ngx-translate/core` 14             | i18n                               |
| RxJS 7                               | Programmation réactive             |
| `@stomp/rx-stomp` + `sockjs-client`  | WebSocket STOMP                    |
| `@fortawesome/angular-fontawesome` 6 | Icônes                             |
| `ngx-infinite-scroll`                | Pagination infinie                 |
| `ngx-webstorage`                     | Persistance locale (token, langue) |
| `dayjs`                              | Manipulation des dates             |
| Bootstrap 5.2 + Bootswatch           | Thème                              |
| `postcss-rtlcss`                     | Support RTL (Arabe)                |

### Build & Dev

Maven (`mvnw`), npm + Angular CLI, Webpack custom (`webpack/webpack.custom.js`), Jib (image Docker), Husky, ESLint, Prettier (avec plugin Java), Checkstyle, Jest, SonarQube.

### Infrastructure

Docker Compose : PostgreSQL, JHipster Registry, Prometheus + Grafana, SonarQube, Zipkin (optionnel), JHipster Control Center.

---

## 3. Architecture globale

```
            ┌────────────────────────────────────────────────┐
            │            Navigateur — Angular 14             │
            │   (SPA servie depuis le gateway lui-même)      │
            └──────────────────┬─────────────────────────────┘
                               │ HTTPS / WS (STOMP)
                               ▼
            ┌────────────────────────────────────────────────┐
            │      TuniSalesGateway — port 8080              │
            │                                                │
            │  ┌──────────────────────────────────────────┐  │
            │  │ SecurityConfiguration  +  JWTFilter      │  │
            │  │ TenantHeaderFilter  +  SpaWebFilter      │  │
            │  └──────────────────────────────────────────┘  │
            │                                                │
            │  ┌──────────────────────────────────────────┐  │
            │  │   Spring Cloud Gateway                   │  │
            │  │   /services/{serviceId}/**               │  │
            │  │   → JWTRelayGatewayFilterFactory         │  │
            │  └──────────────────────────────────────────┘  │
            └─────────┬──────────────────┬───────────────────┘
                      │                  │
            ┌─────────▼─────┐  ┌─────────▼─────┐  ┌──────────────┐
            │ JHipster      │  │   Eureka      │  │ Spring Cloud │
            │ Registry 8761 │◄─┤  discovery    │  │ Config       │
            └───────────────┘  └─────────┬─────┘  └──────────────┘
                                         │
       ┌─────────────────────────────────┼──────────────────────────────┐
       │                                 │                              │
       ▼                                 ▼                              ▼
┌────────────────┐              ┌────────────────┐             ┌────────────────┐
│ BusinessService│              │InventoryService│             │PlatformService │
│ orders, clients│              │  stock, swap   │             │  ws, audit, …  │
│ invoices, …    │              │  warehouse, …  │             │  notifications │
└────────────────┘              └────────────────┘             └────────────────┘
```

- **JWT relay** ([`JWTRelayGatewayFilterFactory.java`](src/main/java/com/tunisales/gateway/security/jwt/JWTRelayGatewayFilterFactory.java)) : le token validé en entrée est propagé tel quel vers le microservice aval, ce qui permet aux services de réutiliser la même politique de sécurité sans ré-authentification.
- **Multi-tenant** ([`TenantHeaderFilter.java`](src/main/java/com/tunisales/gateway/web/filter/TenantHeaderFilter.java)) : extraction d'un identifiant de tenant depuis un en-tête HTTP, propagé aux services downstream.
- **WebSocket** : le navbar ouvre une connexion STOMP via `/services/platform/ws/websocket?access_token=...`, relayée vers le PlatformService qui pousse les notifications sur `/topic/notifications/{login}`.
- **SPA serving** ([`SpaWebFilter.java`](src/main/java/com/tunisales/gateway/web/filter/SpaWebFilter.java)) : les routes Angular non reconnues côté serveur retournent `index.html`.

---

## 4. Structure des dossiers

```
TuniSalesGateway/
├── src/main/java/com/tunisales/gateway/        # Backend Java
│   ├── TuniSalesGatewayApp.java                 # Point d'entrée Spring Boot
│   ├── config/                                  # SecurityConfiguration, WebConfigurer, DatabaseConfiguration, …
│   ├── security/jwt/                            # TokenProvider, JWTFilter, JWTRelayGatewayFilterFactory
│   ├── security/AuthoritiesConstants.java       # Constantes de rôles
│   ├── domain/                                  # User, Authority
│   ├── repository/                              # UserRepository (R2DBC réactif)
│   ├── service/                                 # UserService, MailService, DTOs, MapStruct
│   ├── web/rest/                                # UserJWTController, AccountResource, UserResource, GatewayResource
│   ├── web/filter/                              # SpaWebFilter, TenantHeaderFilter, ModifyServersOpenApiFilter
│   ├── aop/                                     # Logging aspect
│   └── management/                              # Métriques & health
│
├── src/main/resources/
│   ├── config/                                  # application.yml, application-dev.yml, application-prod.yml,
│   │                                            #   bootstrap.yml, bootstrap-prod.yml, application-tls.yml
│   ├── config/liquibase/changelog/              # 00000000000000_initial_schema.xml,
│   │                                            #   20260507000001_add_business_roles.xml
│   ├── i18n/messages*.properties                # Messages backend (en, fr, ar_LY)
│   └── logback-spring.xml                       # Configuration logs
│
├── src/main/webapp/                            # Frontend Angular
│   ├── app/
│   │   ├── app.module.ts, app-routing.module.ts
│   │   ├── core/
│   │   │   ├── auth/                            # account, auth-jwt, user-route-access, state-storage
│   │   │   ├── interceptor/                     # auth, auth-expired, token-refresh, error-handler, notification
│   │   │   ├── config/                          # application-config.service.ts
│   │   │   ├── util/                            # alert, event-manager, data-util, parse-links
│   │   │   └── websocket/                       # notifications-websocket.service.ts
│   │   ├── entities/                            # Modules métier
│   │   │   ├── BusinessService/                 # order, order-line, client, delivery, invoice, mission, …
│   │   │   ├── InventoryService/                # warehouse, stock-item, stock-movement, stock-audit, swap
│   │   │   ├── PlatformService/                 # notification, audit-log, document, objective, tenant
│   │   │   ├── orders-pending/                  # Module custom : validation workflow
│   │   │   ├── plan-vente/, zone/, bonus-rule/, promotion/, credit-note/, complaint/, onboarding/
│   │   │   └── enumerations/                    # Enums partagées
│   │   ├── layouts/                             # navbar, footer, main, error
│   │   ├── shared/                              # alerts, pipes, directives (HasAnyAuthority, SortBy, …)
│   │   ├── admin/, account/, login/, home/      # UI standard JHipster
│   │   ├── dashboard/, stats/                   # Surveillance & analytics
│   │   └── config/                              # authority.constants.ts, language.constants.ts, …
│   ├── i18n/                                    # JSON de traduction (fr, en, ar-ly)
│   ├── content/                                 # Assets (images, scss)
│   └── WEB-INF/web.xml
│
├── src/main/docker/                            # docker-compose : postgresql, jhipster-registry,
│   │                                            #   monitoring, sonar, zipkin, app, jhipster-control-center
│   ├── postgresql.yml, jhipster-registry.yml, app.yml
│   ├── monitoring.yml (Prometheus + Grafana), sonar.yml, zipkin.yml
│   └── central-server-config/                   # Configuration native Cloud Config
│
├── webpack/                                    # webpack.custom.js, proxy.conf.js (proxy /api → :8080)
├── pom.xml                                     # Maven (profils : webapp, dev, prod, war, no-liquibase, …)
├── package.json, angular.json                  # Build npm + Angular
├── tsconfig*.json, .eslintrc.json              # TS & lint
├── checkstyle.xml, sonar-project.properties    # Qualité
├── README.md                                   # README JHipster d'origine
└── PROJECT_OVERVIEW.md                         # (ce document)
```

---

## 5. Modules backend clés

### Point d'entrée

- [TuniSalesGatewayApp.java](src/main/java/com/tunisales/gateway/TuniSalesGatewayApp.java) — bootstrap Spring Boot, activation des profils, log de démarrage avec URL Eureka.

### Sécurité & JWT

- [SecurityConfiguration.java](src/main/java/com/tunisales/gateway/config/SecurityConfiguration.java) — chaîne `SecurityWebFilterChain` réactive, matrice d'accès par chemin, désactivation CSRF (token-based), CORS.
- [TokenProvider.java](src/main/java/com/tunisales/gateway/security/jwt/TokenProvider.java) — création / parsing / validation du JWT (HMAC-SHA, base64 secret). Claims : `sub` (login), `auth` (rôles concaténés), `tenantId`.
- [JWTFilter.java](src/main/java/com/tunisales/gateway/security/jwt/JWTFilter.java) — extrait le token de `Authorization: Bearer …`, peuple le `SecurityContext` réactif.
- [JWTRelayGatewayFilterFactory.java](src/main/java/com/tunisales/gateway/security/jwt/JWTRelayGatewayFilterFactory.java) — filtre Gateway qui ré-injecte le token côté requête sortante.
- [AuthoritiesConstants.java](src/main/java/com/tunisales/gateway/security/AuthoritiesConstants.java) — 3 rôles JHipster + 8 rôles métier (voir [§9](#9-modèle-de-sécurité-rôles--matrice-daccès)).

### Filtres web

- [SpaWebFilter.java](src/main/java/com/tunisales/gateway/web/filter/SpaWebFilter.java) — fallback `index.html` pour le routage Angular.
- [TenantHeaderFilter.java](src/main/java/com/tunisales/gateway/web/filter/TenantHeaderFilter.java) — extraction tenant ID multi-tenant.
- [ModifyServersOpenApiFilter.java](src/main/java/com/tunisales/gateway/web/filter/ModifyServersOpenApiFilter.java) — réécriture des URL de serveurs dans la documentation OpenAPI agrégée.

### REST controllers (`src/main/java/com/tunisales/gateway/web/rest/`)

| Controller           | Endpoints                                                                                                                                                 | Rôle                      |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `UserJWTController`  | `POST /api/authenticate`                                                                                                                                  | Login → JWT               |
| `AccountResource`    | `POST /api/register`, `GET /api/activate`, `GET/POST /api/account`, `POST /api/account/change-password`, `/reset-password/init`, `/reset-password/finish` | Cycle de vie du compte    |
| `UserResource`       | `POST/PUT/GET/DELETE /api/admin/users`                                                                                                                    | CRUD utilisateurs (admin) |
| `PublicUserResource` | `GET /api/users`                                                                                                                                          | Listes publiques          |
| `GatewayResource`    | `GET /api/gateway/routes`                                                                                                                                 | Routes actives (admin)    |

### Domaine & persistance

- Entités : `User` (table `jhi_user`, hérite de `AbstractAuditingEntity`) et `Authority` (table `jhi_authority`).
- Repository : `UserRepository` (R2DBC, `Mono<User>` / `Flux<User>`).
- Service : `UserService` (création, activation, reset password), `MailService` (envoi mails), `DomainUserDetailsService` (Spring Security).
- DTO + MapStruct : `UserDTO`, `AdminUserDTO`, `PasswordChangeDTO`, `UserMapper`.

### Migrations Liquibase

- [00000000000000_initial_schema.xml](src/main/resources/config/liquibase/changelog/00000000000000_initial_schema.xml) — `jhi_user`, `jhi_authority`, `jhi_user_authority`, admin par défaut.
- `20260507000001_add_business_roles.xml` — insertion des 8 rôles métier TuniSales.

---

## 6. Modules frontend clés

### Routing & démarrage

- [app-routing.module.ts](src/main/webapp/app/app-routing.module.ts) — routes lazy-loaded, guardées par `UserRouteAccessService`.
- [entity-routing.module.ts](src/main/webapp/app/entities/entity-routing.module.ts) — chargement paresseux de chaque module métier.

### Authentification (`src/main/webapp/app/core/auth/`)

- [account.service.ts](src/main/webapp/app/core/auth/account.service.ts) — état authentifié, observable `getAuthenticationState()`.
- [auth-jwt.service.ts](src/main/webapp/app/core/auth/auth-jwt.service.ts) — login / logout / refresh.
- [user-route-access.service.ts](src/main/webapp/app/core/auth/user-route-access.service.ts) — guard `CanActivate` par autorité.
- [state-storage.service.ts](src/main/webapp/app/core/auth/state-storage.service.ts) — persistance via `ngx-webstorage`.

### Interceptors HTTP (`src/main/webapp/app/core/interceptor/`)

| Fichier                                                                                           | Rôle                                                                             |
| ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| [auth.interceptor.ts](src/main/webapp/app/core/interceptor/auth.interceptor.ts)                   | Injecte `Authorization: Bearer …`                                                |
| [auth-expired.interceptor.ts](src/main/webapp/app/core/interceptor/auth-expired.interceptor.ts)   | Déconnexion sur 401 si refresh échoue                                            |
| [token-refresh.interceptor.ts](src/main/webapp/app/core/interceptor/token-refresh.interceptor.ts) | Rafraîchissement transparent sur 401, mutualisé pour éviter le _thundering herd_ |
| [error-handler.interceptor.ts](src/main/webapp/app/core/interceptor/error-handler.interceptor.ts) | Centralise les erreurs HTTP                                                      |
| [notification.interceptor.ts](src/main/webapp/app/core/interceptor/notification.interceptor.ts)   | Déclenche les toasts depuis les en-têtes `X-…-Alert`                             |

### WebSocket

- [notifications-websocket.service.ts](src/main/webapp/app/core/websocket/notifications-websocket.service.ts) — connexion RxStomp à `/services/platform/ws/websocket?access_token=…`, subscription `/topic/notifications/{login}`, heartbeat 20s, reconnect 5s, observable `notifications$` typé `NotificationDTO`.

### Layout

- [navbar.component.ts](src/main/webapp/app/layouts/navbar/navbar.component.ts) — menus, sélecteur de langue (`fr`, `ar-ly`, `en`), badge de notifications non lues, dropdown des 5 dernières notifications, intégration `EntityNavbarItems`.

### Domaine `Order` (BusinessService)

- [order.module.ts](src/main/webapp/app/entities/BusinessService/order/order.module.ts)
- [list/order.component.ts](src/main/webapp/app/entities/BusinessService/order/list/order.component.ts)
- [detail/order-detail.component.ts](src/main/webapp/app/entities/BusinessService/order/detail/order-detail.component.ts)
- [update/order-update.component.ts](src/main/webapp/app/entities/BusinessService/order/update/order-update.component.ts) + `order-form.service.ts`
- [service/order.service.ts](src/main/webapp/app/entities/BusinessService/order/service/order.service.ts) — CRUD, conversion dates `dayjs`.

### Module custom `orders-pending`

- [orders-pending.component.ts](src/main/webapp/app/entities/orders-pending/orders-pending.component.ts) — workflow d'approbation pour `ROLE_ADMIN_COMMERCIAL` / `ROLE_ADMIN` :
  1. Récupère les commandes avec `status = SUBMITTED` (pagination 200).
  2. Actions disponibles : **accept** (→ endpoint validate), **negotiate** (avec motif), **reject** (avec motif).
  3. Modales `@ng-bootstrap` + `ReactiveFormsModule` pour saisir le motif.
  4. Feedback via `AlertService` ; navigation vers le détail (`/order/{id}/view`).

### Autres modules custom

`plan-vente`, `zone`, `bonus-rule`, `promotion`, `credit-note`, `complaint`, `onboarding` — chacun avec ses composants list / detail / update / service.

### Shared (`src/main/webapp/app/shared/`)

- Directives : `HasAnyAuthorityDirective`, `SortDirective`, `SortByDirective`.
- Pipes : `FindLanguageFromKeyPipe`, `DurationPipe`, `FormatMediumDatePipe`, `FormatMediumDatetimePipe`.
- Composants : `AlertComponent`, `AlertErrorComponent`, `ItemCountComponent`, `FilterComponent`.
- Module `shared-libs.module.ts` ré-exporte `@ng-bootstrap`, `ngx-infinite-scroll`, `@fortawesome`, `ngx-translate`, `ReactiveFormsModule`.

---

## 7. Dépendances principales

### Backend (extraits de [pom.xml](pom.xml))

| Dépendance                                            | Rôle                    |
| ----------------------------------------------------- | ----------------------- |
| `spring-boot-starter-webflux`                         | Stack web réactive      |
| `spring-cloud-starter-gateway`                        | Reverse proxy & routage |
| `spring-cloud-starter-netflix-eureka-client`          | Service discovery       |
| `spring-cloud-starter-config`                         | Config centralisée      |
| `spring-boot-starter-data-r2dbc` + `r2dbc-postgresql` | Persistance réactive    |
| `spring-boot-starter-security` + `jjwt-*`             | Sécurité JWT            |
| `liquibase-core`                                      | Migrations DB           |
| `mapstruct`                                           | Mapping DTO/Entity      |
| `springdoc-openapi-webflux-ui`                        | Swagger UI              |
| `micrometer-registry-prometheus`                      | Métriques               |
| `resilience4j-*`                                      | Circuit breaker         |
| `bucket4j-core`                                       | Rate limiting           |
| `feign-reactor-*`                                     | Clients HTTP réactifs   |
| `jhipster-framework`                                  | Utilitaires JHipster    |

### Frontend (extraits de [package.json](package.json))

| Dépendance                                             | Rôle                   |
| ------------------------------------------------------ | ---------------------- |
| `@angular/*` 14.2                                      | Framework SPA          |
| `@ng-bootstrap/ng-bootstrap` 13                        | Composants UI          |
| `@ngx-translate/core` + `http-loader`                  | i18n                   |
| `@stomp/rx-stomp` + `@stomp/stompjs` + `sockjs-client` | WebSocket              |
| `@fortawesome/*` 6.2                                   | Icônes                 |
| `bootstrap` + `bootswatch` 5.2                         | Thèmes                 |
| `dayjs`                                                | Dates                  |
| `ngx-infinite-scroll`                                  | Pagination             |
| `ngx-webstorage`                                       | Persistance navigateur |
| `rxjs` 7.5                                             | Programmation réactive |
| `postcss-rtlcss` (dev)                                 | Support RTL            |

---

## 8. Configuration et profils Spring

### Fichiers

- [bootstrap.yml](src/main/resources/config/bootstrap.yml) / [bootstrap-prod.yml](src/main/resources/config/bootstrap-prod.yml) — récupération de la config depuis Spring Cloud Config (`http://admin:***@localhost:8761/config`).
- [application.yml](src/main/resources/config/application.yml) — base commune : Eureka activé, Spring Cloud Gateway `discovery.locator.enabled=true`, filtre `JWTRelay` par défaut, Springdoc, Prometheus.
- [application-dev.yml](src/main/resources/config/application-dev.yml) :
  - Port `8080`, DB `r2dbc:postgresql://localhost:5432/TuniSalesGateway` (user `postgres`).
  - CORS autorisé pour `localhost:4200`, `8100`, `9000`.
  - Liquibase contexts `dev,faker` (données de démo).
  - JWT base64 secret par défaut, **à NE PAS utiliser en prod**.
  - DevTools actif, logs `DEBUG`.
- [application-prod.yml](src/main/resources/config/application-prod.yml) :
  - Compression HTTP, cache 1461 jours, graceful shutdown.
  - Liquibase contexts `prod` (pas de faker).
  - Secret JWT à surcharger via variable d'environnement.

### Variables d'environnement importantes (prod)

| Variable                                             | Usage                            |
| ---------------------------------------------------- | -------------------------------- |
| `JHIPSTER_REGISTRY_PASSWORD`                         | Auth contre le JHipster Registry |
| `SPRING_DATASOURCE_PASSWORD`                         | Mot de passe PostgreSQL          |
| `JHIPSTER_SECURITY_AUTHENTICATION_JWT_BASE64_SECRET` | Secret JWT (obligatoire en prod) |
| `EUREKA_CLIENT_SERVICE_URL_DEFAULT_ZONE`             | URL Eureka                       |

---

## 9. Modèle de sécurité (rôles & matrice d'accès)

### Rôles définis ([AuthoritiesConstants.java](src/main/java/com/tunisales/gateway/security/AuthoritiesConstants.java))

**Standard JHipster** : `ROLE_ADMIN`, `ROLE_USER`, `ROLE_ANONYMOUS`.

**Métier TuniSales** :
| Rôle | Cible |
|------|-------|
| `ROLE_ADMIN_SYSTEME` | Administrateur système |
| `ROLE_ADMIN_COMMERCIAL` | Direction commerciale |
| `ROLE_COMMERCIAL` | Commercial |
| `ROLE_MAGASINIER` | Magasinier / entrepôt |
| `ROLE_CLIENT` | Client final |
| `ROLE_RESP_PV` | Responsable point de vente |
| `ROLE_VENDEUR` | Vendeur terrain |
| `ROLE_CHEF_PARC` | Chef de parc (flotte) |

### Matrice indicative

| Chemin                                                                          | Rôles autorisés                                                 |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `/api/authenticate`, `/api/register`, `/api/activate`, `/api/reset-password/**` | Public                                                          |
| `/api/account/**`                                                               | Authentifié                                                     |
| `/api/admin/**`                                                                 | `ADMIN`, `ADMIN_SYSTEME`                                        |
| `/services/inventory/**`                                                        | `MAGASINIER`, `COMMERCIAL`, `ADMIN_COMMERCIAL`, `ADMIN_SYSTEME` |
| `/services/business/**`                                                         | Rôles commerciaux + admins                                      |
| `/services/platform/**`                                                         | Authentifié                                                     |
| `/management/**`                                                                | `ADMIN`                                                         |
| `/v3/api-docs/**`, `/swagger-ui/**`                                             | Public (dev)                                                    |

### Flux d'authentification

```
1. POST /api/authenticate (login + password)
2. TokenProvider.createToken() ──► JWT (24h, claims: sub, auth, tenantId)
3. Front stocke le JWT (ngx-webstorage)
4. Toute requête : auth.interceptor ajoute Authorization: Bearer …
5. Gateway : JWTFilter valide ──► SecurityContext réactif
6. Routage /services/{x}/** ──► JWTRelayGatewayFilterFactory ré-injecte le JWT
7. Microservice aval valide à nouveau (même secret partagé)
```

---

## 10. Flux de fonctionnement global

1. **Service de la SPA** — le navigateur charge `index.html` servi par le gateway ; [SpaWebFilter](src/main/java/com/tunisales/gateway/web/filter/SpaWebFilter.java) renvoie l'app pour tout chemin non-API.
2. **Login** — `POST /api/authenticate` → [TokenProvider](src/main/java/com/tunisales/gateway/security/jwt/TokenProvider.java) émet un JWT signé HMAC-SHA, valide 24 h.
3. **Stockage front** — le token est persisté via `ngx-webstorage`. Les requêtes suivantes sont enrichies par [auth.interceptor.ts](src/main/webapp/app/core/interceptor/auth.interceptor.ts).
4. **Routage vers microservice** — toute requête `/services/{serviceId}/**` traverse [JWTFilter](src/main/java/com/tunisales/gateway/security/jwt/JWTFilter.java) (validation) puis [JWTRelayGatewayFilterFactory](src/main/java/com/tunisales/gateway/security/jwt/JWTRelayGatewayFilterFactory.java) (relais du token au service aval découvert via Eureka).
5. **Expiration / refresh** — sur 401, [token-refresh.interceptor.ts](src/main/webapp/app/core/interceptor/token-refresh.interceptor.ts) tente un refresh transparent, mutualisé pour ne pas paralléliser plusieurs refresh.
6. **Notifications temps réel** — [notifications-websocket.service.ts](src/main/webapp/app/core/websocket/notifications-websocket.service.ts) ouvre une connexion STOMP relayée vers PlatformService ; le navbar affiche les notifications poussées sur `/topic/notifications/{login}`.
7. **Workflow métier `orders-pending`** (exemple end-to-end) :
   1. Un commercial soumet une commande (`POST /services/business/api/orders` → status `SUBMITTED`).
   2. PlatformService pousse une notification au commercial admin → toast + badge incrémenté.
   3. L'admin commercial ouvre `/orders-pending` ([orders-pending.component.ts](src/main/webapp/app/entities/orders-pending/orders-pending.component.ts)).
   4. Il choisit **Accept** / **Negotiate** (avec motif) / **Reject** (avec motif).
   5. Le service Order appelle `/services/business/api/orders/{id}/validate` (ou équivalent).
   6. BusinessService met à jour le statut → publie un événement → PlatformService notifie le commercial créateur.

---

## 11. Démarrer le projet en local

### Prérequis

- Java 11 (JDK), Maven wrapper inclus (`./mvnw` / `mvnw.cmd`).
- Node.js ≥ 16.17 + npm 8+.
- Docker + Docker Compose.
- Un port libre pour : 8080 (gateway), 8761 (registry), 5432 (Postgres), 9090/3000 (monitoring).

### Démarrage standard (dev)

```bash
# 1. Installer les dépendances frontend
npm install

# 2. Lancer l'infrastructure
npm run docker:db:up               # PostgreSQL
npm run docker:jhipster-registry:up   # Eureka + Cloud Config

# 3. Lancer le backend (compile et démarre Spring Boot)
./mvnw                             # ou: npm run app:start

# 4. Dans un autre terminal, lancer le front en hot reload
npm start                          # ng serve sur http://localhost:9000 (proxy /api → 8080)
```

### Build de production

```bash
./mvnw -Pprod verify               # Build JAR optimisé
# ou
npm run java:jar:prod
```

### Image Docker

```bash
npm run java:docker:prod           # Jib → tunisalesgateway:latest
```

### Démarrer l'app complète via Docker

```bash
npm run docker:app:up              # gateway + Postgres + Registry
```

### Tests

```bash
npm test                           # Jest (frontend, avec couverture)
./mvnw verify                      # Backend (JUnit 5 + Testcontainers)
```

### Comptes de démonstration (profil dev/faker)

| Login   | Mot de passe | Rôles                     |
| ------- | ------------ | ------------------------- |
| `admin` | `admin`      | `ROLE_ADMIN`, `ROLE_USER` |
| `user`  | `user`       | `ROLE_USER`               |

---

## 12. Internationalisation

- **Langues supportées** : `fr` (français, défaut), `ar-ly` (arabe libyen, RTL), `en` (anglais).
- Configuration : [language.constants.ts](src/main/webapp/app/config/language.constants.ts).
- Traductions front : `src/main/webapp/i18n/{fr,en,ar-ly}/*.json` (un fichier par domaine, p. ex. `businessServiceOrder.json`, `BusinessService-orderStatus.json`, `BusinessService-paymentMethod.json`).
- Traductions back : `src/main/resources/i18n/messages*.properties`.
- **RTL** : `postcss-rtlcss` génère automatiquement les variantes RTL pour l'arabe.
- Chargement runtime via `@ngx-translate/http-loader`.

---

## 13. Qualité, observabilité et CI

### Qualité du code

- **ESLint** ([.eslintrc.json](.eslintrc.json)) + `@typescript-eslint` + plugin Angular.
- **Prettier** (avec `prettier-plugin-java` pour formater le Java).
- **Husky** pre-commit : lance lint + prettier.
- **Checkstyle** ([checkstyle.xml](checkstyle.xml)) côté Java.
- **SonarQube** ([sonar-project.properties](sonar-project.properties)) — couverture JaCoCo + Jest.

### Tests

- **Backend** : JUnit 5, Spring WebFlux Test, Testcontainers PostgreSQL (configuration : [src/test/resources/testcontainers.properties](src/test/resources/testcontainers.properties)).
- **Frontend** : Jest + jest-preset-angular + jest-date-mock.

### Observabilité

- **Métriques** : endpoint `/management/prometheus` exposé via Micrometer.
- **Prometheus** + **Grafana** : `npm run docker:others:up` ne lance pas le monitoring par défaut — utiliser `docker-compose -f src/main/docker/monitoring.yml up -d`.
- **Tracing** : Zipkin optionnel (profil `zipkin`).
- **Logs** : Logback ([logback-spring.xml](src/main/resources/logback-spring.xml)), niveaux ajustés par profil.
- **Healthchecks** : `/management/health`.

### CI/CD

Aucun pipeline n'est défini dans le repo (`.github/workflows/`, `.gitlab-ci.yml` et `Jenkinsfile` absents). Peut être généré via `jhipster ci-cd`.

---

## 14. Patterns architecturaux

- **API Gateway** (Spring Cloud Gateway) — point d'entrée unique, routage dynamique.
- **Service Discovery** (Eureka) — découverte des microservices.
- **Externalized Configuration** (Spring Cloud Config) — config centralisée pour tous les services.
- **JWT relay** — un seul login, propagation transparente aux services aval.
- **DTO + Mapper (MapStruct)** — séparation entité / contrat REST.
- **Service / Repository layering** — couches métier et accès données.
- **Reactive Streams** (Mono / Flux, R2DBC, WebFlux) — non-bloquant de bout en bout.
- **AOP logging** — annotations `@Loggable` interceptées par un aspect.
- **Multi-tenant** (via header) — discrimination par client.
- **Lazy modules Angular** — chargement à la demande.
- **HTTP interceptor chain** — auth, refresh, erreurs, notifications.
- **Workflow par statut** — `SUBMITTED → VALIDATED / NEGOTIATING / REJECTED` côté commandes.

---

## 15. Pour aller plus loin

- [README.md](README.md) — README JHipster d'origine (généré par le générateur).
- [src/main/docker/central-server-config/README.md](src/main/docker/central-server-config/README.md) — configuration native du JHipster Registry.
- Documentation OpenAPI agrégée : `http://localhost:8080/v3/api-docs` (en dev).
- Swagger UI : `http://localhost:8080/swagger-ui/index.html`.
- JHipster Registry UI : `http://localhost:8761` (admin / admin).
- Pour ajouter un microservice downstream : l'enregistrer auprès d'Eureka — il sera automatiquement routé via `/services/{serviceName}/**`.
- Pour ajouter une langue : éditer [language.constants.ts](src/main/webapp/app/config/language.constants.ts) + ajouter le dossier dans `src/main/webapp/i18n/`.
- Pour ajouter un rôle : ajouter une constante dans [AuthoritiesConstants.java](src/main/java/com/tunisales/gateway/security/AuthoritiesConstants.java), créer un changelog Liquibase, et mettre à jour [SecurityConfiguration.java](src/main/java/com/tunisales/gateway/config/SecurityConfiguration.java).

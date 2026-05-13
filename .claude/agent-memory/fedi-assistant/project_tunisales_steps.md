---
name: TuniSalesGateway etapes 4.1-4.9
description: Implémentation Angular des étapes 4.1 à 4.9 pour TuniSalesGateway (PFE project)
type: project
---

Étapes 4.1–4.9 implémentées (sans commit) sur la branche `claude/analyze-pdf-missing-tasks-oRF9Y`.

**Why:** PFE Angular frontend pour un Gateway Spring Cloud multi-tenant multi-rôle TuniSales.

**How to apply:** Les nouveaux modules sont lazy-loaded dans entity-routing.module.ts (entités) et app-routing.module.ts (dashboard/stats). Pas de commits voulus par le user.

Modules créés :
- 4.1 : admin/client-activation + MAJ user-management-update (checkboxes rôles)
- 4.2 : entities/plan-vente (grille semaine × commercial + modal création)
- 4.3 : entities/zone (CRUD + affectations clients)
- 4.4 : entities/orders-pending (workflow validate/negotiate/reject)
- 4.5 : dashboard/surveillance (KPI + charts)
- 4.6 : entities/bonus-rule, entities/promotion, entities/credit-note, entities/complaint
- 4.7 : stats/ (3 onglets + recompute)
- 4.8 : entities/onboarding (wizard 3 étapes PDV + RespPV + Vendeurs)
- 4.9 : core/websocket/notifications-websocket.service + cloche navbar

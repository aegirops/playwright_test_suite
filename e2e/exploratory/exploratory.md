# Cahier des charges — Nuxt Dashboard Template

> Document reconstruit par exploration manuelle (MCP Playwright) de l'application déployée sur
> https://dashboard-template.nuxt.dev, croisée avec le code source du dépôt (`app/`, `server/`).

## 1. Contexte et objectif

L'application est un **tableau de bord d'administration (back-office)** de type SaaS, permettant à un
utilisateur authentifié de :
- suivre des indicateurs commerciaux (ventes, clients, revenus, conversions) ;
- gérer une base de clients ;
- consulter une messagerie interne (inbox) ;
- gérer les paramètres du compte, de l'équipe et de la sécurité.

Stack technique observée : Nuxt 3 + Nuxt UI (composants `U*`), rendu SPA/SSR, données mockées via
une API interne (`server/api/*.ts`).

## 2. Structure générale de l'interface

### 2.1 Barre latérale (sidebar), commune à toutes les pages
- Logo/organisation "Nuxt" avec sélecteur (bouton "Nuxt Nuxt", ouvre un menu de switch d'équipe).
- Champ de recherche globale "Search…" avec raccourci clavier `⌘K` (Cmd Palette).
- Menu de navigation principal :
  - **Home** (`/`)
  - **Inbox** (`/inbox`) avec badge indiquant le nombre de messages non lus (ex. "4")
  - **Customers** (`/customers`)
  - **Settings** (menu extensible) → General (`/settings`), Members (`/settings/members`),
    Notifications (`/settings/notifications`), Security (`/settings/security`)
- Menu secondaire en bas : liens externes "Feedback" et "Help & Support" (vers le repo GitHub du
  template).
- Bouton utilisateur en bas de la sidebar (avatar + nom, "Benjamin Canac") ouvrant un menu
  utilisateur (`UserMenu`).
- Bouton "Collapse/Open sidebar" pour réduire/agrandir la barre latérale (responsive).
- Un bandeau de consentement cookies ("We use first-party cookies…") avec actions **Accept** /
  **Opt out**, affiché en surcouche sur toutes les pages.

### 2.2 En-tête de page
Chaque page affiche un titre (`h1`) correspondant à la section active, et parfois des actions
contextuelles à droite (ex. boutons d'icône sur Home, bouton "New customer" sur Customers).

## 3. Page Home (`/`)

### 3.1 Filtres de période
- Sélecteur de plage de dates (ex. "Aug 31, 2026 - Sep 14, 2026") ouvrant un date range picker.
- Sélecteur de granularité : `daily` / `weekly` / `monthly` (type `Period`).

### 3.2 Cartes statistiques (KPI)
4 cartes cliquables (redirigent vers `/customers`), chacune avec icône, libellé, valeur et variation
en % (positive en vert, négative en rouge) :
| KPI | Exemple de valeur | Format |
|---|---|---|
| Customers | 452 | Nombre entier |
| Conversions | 1469 | Nombre entier |
| Revenue | $466,968 | Devise USD |
| Orders | 133 | Nombre entier |

### 3.3 Graphique de revenus
- Zone de graphique (area chart) affichant l'évolution du revenu jour par jour sur la période
  sélectionnée, avec axe des abscisses en dates ("1 Sep", "2 Sep", …) et une valeur totale mise en
  avant (ex. "$79,078").

### 3.4 Table des dernières ventes (Sales)
Colonnes : **ID**, **Date**, **Status** (`paid` | `failed` | `refunded`), **Email**, **Amount**
(devise €). Les 5 dernières ventes sont affichées sans pagination visible sur la home.

## 4. Page Customers (`/customers`)

### 4.1 Barre d'outils
- Bouton **"New customer"** (en-tête) → ouvre une modale de création (`AddModal.vue`) avec un
  formulaire (nom, email, etc.).
- Champ de filtre texte **"Filter emails..."** pour rechercher un client par email.
- Bouton **"Delete"** avec compteur de sélection (actif si des lignes sont cochées) → ouvre une
  modale de confirmation (`DeleteModal.vue`).
- Sélecteur **"All"** (filtre par statut probable : subscribed / unsubscribed / bounced).
- Bouton **"Display"** pour gérer la visibilité/l'ordre des colonnes de la table.

### 4.2 Table des clients
Colonnes : case à cocher (sélection multiple + "sélectionner tout"), **ID**, **Name** (avec
sous-libellé "@username"), **Email** (colonne triable via bouton), **Location**, **Status**
(`subscribed` | `unsubscribed` | `bounced`), et une colonne d'actions (menu contextuel par ligne).

### 4.3 Pagination
- Pied de table indiquant le nombre de lignes sélectionnées (ex. "1 of 20 row(s) selected").
- Navigation de pagination : First Page, Previous Page, Page 1, Page 2, Next Page, Last Page
  (10 lignes par page, 20 clients au total dans le jeu de données mocké).

## 5. Page Inbox (`/inbox`)

- Titre "Inbox" avec compteur total de messages (ex. "20").
- Onglets de filtre : **All** / **Unread**.
- Liste de messages (panneau gauche) : expéditeur, heure/date d'envoi, objet, aperçu du corps du
  message. Chaque message est cliquable.
- Sélection d'un message ouvre le contenu complet du mail dans un panneau de lecture
  (`InboxMail.vue`), incluant vraisemblablement des actions (archiver, marquer comme lu, etc.).
- Modèle de données `Mail` : `id`, `unread`, `from` (User), `subject`, `body`, `date`.

## 6. Section Settings (`/settings/*`)

Sous-navigation commune (onglets verticaux) : **General**, **Members**, **Notifications**,
**Security**, plus un lien externe "Documentation".

### 6.1 General (`/settings`)
Formulaire "Profile" avec bouton **"Save changes"**, composé de champs :
- **Name*** (texte) — "Will appear on receipts, invoices, and other communication."
- **Email*** (texte) — "Used to sign in, for email receipts and product updates."
- **Username*** (texte) — "Your unique username for logging in and your profile URL."
- **Avatar** (upload image, JPG/GIF/PNG, 1 Mo max) avec bouton **"Choose"**.
- **Bio** (zone de texte libre, avec liens hypertexte auto-détectés).

### 6.2 Members (`/settings/members`)
- Bouton **"Invite people"** (invitation par email).
- Champ de recherche **"Search members"**.
- Liste des membres de l'équipe : nom, `@username`, rôle modifiable via combobox (`member` |
  `owner`), et bouton d'actions par ligne (ex. retirer le membre).
- Jeu de données observé : Anthony Fu, Baptiste Leproux, Benjamin Canac (owner), Céline Dumerc,
  Daniel Roe, Farnabaz, Ferdinand Coumau, Hugo Richard, … (liste plus longue, scrollable).

### 6.3 Notifications (`/settings/notifications`)
Deux groupes de préférences, chacun avec des interrupteurs (switch) on/off :
- **Notification channels** : Email (activé par défaut), Desktop.
- **Account updates** : Weekly digest, Product updates (activé par défaut), Important updates
  (activé par défaut, non désactivable pour les mises à jour de sécurité).

### 6.4 Security (`/settings/security`)
- Bloc **Password** : champs "Current password" / "New password" + bouton **"Update"**.
- Bloc **Account** (zone à risque) : bouton **"Delete account"** — action destructive et
  irréversible, avec avertissement explicite.

## 7. Éléments transverses / UX

- **Recherche globale** (`⌘K`) accessible depuis n'importe quelle page.
- **Menu de notifications** (`NotificationsSlideover.vue`) accessible depuis un bouton d'icône en
  en-tête, affichant une liste de notifications (modèle `Notification`).
- **Bandeau cookies RGPD** persistant tant qu'aucun choix n'est fait (Accept / Opt out).
- **Responsive** : la sidebar se replie en drawer mobile (bouton "Open/Collapse sidebar" caché en
  desktop ≥ `lg`).
- **Thème** : interface en mode clair par défaut (support dark mode probable via Nuxt UI, non
  vérifié en exploration).

## 8. Modèle de données (déduit du code source `app/types/index.d.ts`)

| Entité | Champs principaux |
|---|---|
| `User` | id, name, email, avatar, status (`subscribed`\|`unsubscribed`\|`bounced`), location |
| `Mail` | id, unread, from (User), subject, body, date |
| `Member` | name, username, role (`member`\|`owner`), avatar |
| `Stat` | title, icon, value, variation, formatter |
| `Sale` | id, date, status (`paid`\|`failed`\|`refunded`), email, amount |
| `Notification` | id, unread, sender (User), body, date |
| `Period` | `daily` \| `weekly` \| `monthly` |
| `Range` | start (Date), end (Date) |

## 9. API interne observée (`server/api/*.ts`)

- `GET /api/customers` — liste des clients (`User[]`)
- `GET /api/mails` — liste des messages (`Mail[]`)
- `GET /api/members` — liste des membres d'équipe (`Member[]`)
- `GET /api/notifications` — liste des notifications (`Notification[]`)

## 10. Pistes de tests E2E à couvrir (non exhaustif)

- Navigation entre toutes les sections via la sidebar et vérification du titre de page.
- Home : changement de période/plage de dates, affichage des 4 KPI, affichage du graphique et de la
  table des ventes.
- Customers : recherche par email, sélection de lignes, suppression (modale de confirmation),
  création d'un client (modale d'ajout), tri de colonne, pagination.
- Inbox : filtre All/Unread, sélection d'un message et affichage du détail.
- Settings/General : édition et sauvegarde du profil.
- Settings/Members : invitation, changement de rôle, recherche.
- Settings/Notifications : activation/désactivation des switches.
- Settings/Security : mise à jour du mot de passe, suppression de compte (à tester avec prudence /
  mock).
- Bandeau cookies : Accept / Opt out.

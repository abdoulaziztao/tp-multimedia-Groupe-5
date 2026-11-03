# Faso — Récits vivants

**Plateforme web multimédia et carte interactive des contes et légendes du Burkina Faso**

Projet universitaire — Groupe 5 · Livrable du 4 novembre 2026
Destinataire : Odilon.simpore@gobelab.org
**Lien du site : `À_REMPLACER_PAR_L_URL_VERCEL`**
Code source : https://github.com/abdoulaziztao/tp-multimedia-groupe-5

---

## 1. Contexte et objectif

Le sujet demande une application web immersive pour **préserver, numériser et transmettre le patrimoine oral burkinabè** : carte interactive 3D/2D, contes et légendes locaux, illustrations animées, bandes sonores en langues nationales (mooré, dioula, fulfulde…) et expérience narrative interactive.

Faso — Récits vivants répond à chacun de ces points et ajoute ce qui rend une plateforme de patrimoine durable : un atelier pour **collecter de vraies voix**, des garde-fous éthiques et une accessibilité sérieuse.

## 2. Conformité au sujet

| Exigence du sujet | Réalisation |
|---|---|
| Carte interactive **3D/2D** | Carte vectorielle WebGL (MapLibre GL) avec **relief réel** (modèle numérique de terrain, exagération ×3), bascule 3D ↔ 2D, plan ↔ satellite, **13 régions** cliquables, 8 marqueurs, **visite guidée** automatique. |
| Contes, légendes, récits locaux | **8 contes** rattachés à 8 régions et à 8 cultures (Mossi, Bobo, Peul, Gourmantché, Sénoufo, Lobi, Bwa…), avec contexte culturel et morale. |
| Illustrations animées | **6 décors SVG animés** générés en code (savane, mare, dune, cascade, village, forêt), jour/nuit, pluie, feu, ondulations ; plus la scène « Veillée sous le baobab ». |
| Bandes sonores en langues nationales | Lecteur audio multi-langue (français, mooré, dioula, fulfulde). Le site lit un **enregistrement réel** s’il existe (`public/audio/<conte>.<langue>.mp3`), sinon une voix de synthèse en repli, avec le texte surligné en synchronisation. **Ambiance sonore synthétisée** (Web Audio) propre à chaque décor. |
| Expérience narrative interactive | **Histoire à embranchements** (plusieurs choix, trois types de fins : sage / équilibrée / risquée), **quiz** de compréhension, **carnet du griot** avec badges et progression. |
| Rapport + lien du site | Ce document et l’URL de déploiement ci-dessus. |

## 3. Fonctionnalités ajoutées (au-delà du sujet)

- **Atelier d’enregistrement** (`/contribuer`) : enregistrement micro dans le navigateur, visualisation du signal, **consentement obligatoire** de la personne enregistrée, export de l’audio et d’une fiche de métadonnées JSON. Rien n’est envoyé à un serveur.
- **Lexique des langues** (`/langues`) : présentation du mooré, du dioula et du fulfulde avec mini-lexique, signalé comme « à valider avec des locuteurs ».
- **Catalogue** (`/contes`) avec recherche insensible aux accents et filtre par langue de tradition.
- **Progression locale** (contes terminés, scores, fins découvertes) conservée dans le navigateur, sans compte.
- **SEO et partage** : métadonnées par page, données structurées JSON-LD, sitemap, robots, image Open Graph générée, manifeste d’application installable.

## 4. Architecture

```
app/                 pages (App Router) : accueil, contes, conte/[slug], langues, contribuer, à propos
components/          carte, lecteur audio, récit à choix, quiz, carnet, enregistreur, scènes SVG
lib/stories.ts       corpus des contes (typé) — seule source de vérité
lib/types.ts         modèle de données (Story, BranchNode, QuizQuestion…)
lib/use-narration.ts narration : enregistrement réel ou synthèse vocale, synchronisation du texte
lib/ambient.ts       ambiances sonores synthétisées (Web Audio)
lib/progress.ts      progression et badges (localStorage via useSyncExternalStore)
public/data/         limites des 13 régions (GeoJSON)
public/audio/        enregistrements déposés par les contributeurs
```

Ajouter un conte = ajouter **un objet** dans `lib/stories.ts` : la carte, le catalogue, la page, le sitemap, le quiz et l’histoire à choix se mettent à jour seuls.

## 5. Choix techniques

- **Next.js 16 (App Router) + React 19 + TypeScript strict** : pages pré-générées en statique (19 routes), rapides et indexables.
- **MapLibre GL** plutôt que Leaflet : seule une carte WebGL permet un **vrai relief 3D**. Fonds OpenStreetMap/CARTO, satellite Esri, relief AWS Terrain Tiles, limites geoBoundaries.
- **SVG + CSS animés** plutôt que des images ou vidéos : quelques Ko, nets à toute taille, aucun média à héberger.
- **Web Audio API** : ambiances générées en direct, donc aucun fichier sonore à diffuser ni à licencier.
- **MediaRecorder** : collecte de voix sans serveur ni compte.
- **Polices auto-hébergées** (Manrope, DM Mono, Cormorant Garamond) : aucun appel à un service tiers, build reproductible.
- **Base UI** pour les onglets accessibles ; **lucide-react** pour les icônes.

## 6. Accessibilité

- Navigation complète au clavier, lien d’évitement, focus visible, structure de titres cohérente.
- Marqueurs de carte natifs (`<button>`) avec libellés explicites ; liste de repli par région si WebGL est indisponible.
- Le **texte intégral** de chaque conte est toujours affiché : on ne dépend jamais de l’audio.
- Animations désactivées si l’appareil demande de les réduire (`prefers-reduced-motion`) ; la carte coupe aussi ses animations de caméra.
- Interface responsive, testée de 390 px à 1366 px de large.

## 7. Éthique et honnêteté des contenus

Les 8 textes sont des **adaptations originales** écrites pour ce projet, inspirées de thèmes classiques de la tradition orale ouest-africaine (le petit rusé face au puissant, l’esprit de la mare, etc.). Ils **ne prétendent pas** reproduire la version d’un conteur précis, et le site le dit explicitement. La suite naturelle est la collecte auprès de vrais conteurs, avec leur accord : c’est le rôle de l’atelier, qui impose le consentement avant tout enregistrement.

Le lexique des langues est pédagogique et doit être relu par des locuteurs natifs avant diffusion officielle ; le site le signale.

## 8. Limites connues

1. **Voix en langues nationales** : tant qu’aucun enregistrement n’est déposé, le mooré, le dioula et le fulfulde retombent sur la voix de synthèse en français (le site l’indique à l’écran). Les synthèses vocales courantes ne savent pas lire ces langues, d’où l’atelier d’enregistrement.
2. **Fonds de carte en ligne** : la carte nécessite une connexion pour charger les tuiles.
3. **5 régions sur 13** n’ont pas encore de conte ; elles sont signalées « à collecter » et renvoient vers l’atelier.
4. Le corpus compte 8 textes courts ; il n’a pas été validé par des conteurs ou des ethnologues.

## 9. Perspectives

- Collecte de voix auprès de conteurs, avec fiches de provenance (conteur, lieu, date, consentement).
- Couverture des 5 régions restantes.
- Mode hors-ligne (PWA avec tuiles en cache) pour les zones à faible connectivité.
- Back-office de modération pour recevoir des contributions sans passer par GitHub.
- Relecture du lexique par des linguistes et locuteurs.

## 10. Prise en main

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm typecheck
pnpm build
```

Parcours conseillé pour la démonstration : accueil → **Relief 3D** + **Visite guidée** → ouvrir un conte → **Écouter** (activer l’ambiance) → **Vivre l’histoire** (découvrir plusieurs fins) → **Quiz** → revenir au **carnet du griot** → **Contribuer**.

## 11. Crédits

Fonds de carte © OpenStreetMap contributors et © CARTO ; imagerie satellite © Esri ; relief Mapzen / AWS Terrain Tiles ; limites administratives geoBoundaries (CC BY 4.0) ; moteur cartographique MapLibre GL ; polices Manrope, DM Mono et Cormorant Garamond (licence SIL OFL).

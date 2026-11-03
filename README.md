# Faso — Récits vivants

Plateforme web multimédia et carte interactive des contes et légendes du Burkina Faso.
Projet universitaire — Groupe 5.

- Carte **3D/2D** en relief (MapLibre GL), satellite, visite guidée, 13 régions
- **8 contes** illustrés par des scènes SVG animées
- Narration audio **mooré / dioula / fulfulde** (enregistrements réels ou voix de repli) avec texte synchronisé
- **Histoires à embranchements**, quiz, carnet du griot (badges)
- **Atelier d'enregistrement** dans le navigateur, avec consentement
- Accessible (clavier, `prefers-reduced-motion`, texte intégral), responsive, SEO

## Démarrer

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm typecheck
pnpm build
```

## Documentation

- [`docs/RAPPORT.md`](docs/RAPPORT.md) — rapport du projet (conformité au sujet, architecture, choix, limites)
- [`docs/AUDIO.md`](docs/AUDIO.md) — ajouter des enregistrements en langues nationales

## Ajouter un conte

Ajouter un objet dans `lib/stories.ts` (voir `lib/types.ts`) : carte, catalogue, page, sitemap, quiz et histoire à choix se mettent à jour automatiquement.

## Contenus

Les textes sont des adaptations originales, non des versions collectées auprès de conteurs. Le lexique doit être relu par des locuteurs natifs.

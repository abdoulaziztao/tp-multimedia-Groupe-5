# Ajouter des enregistrements audio

Le site cherche automatiquement, pour chaque conte et chaque langue, un fichier :

```
public/audio/<slug-du-conte>.<code-langue>.<extension>
```

- **Codes de langue** : `fr`, `mos` (mooré), `dyu` (dioula), `ful` (fulfulde).
- **Extensions acceptées** : `mp3`, `m4a`, `ogg`, `webm` (essayées dans cet ordre).
- **Slugs** : `la-hyene-et-le-lievre`, `le-genie-de-la-mare-sacree`, `le-chant-de-la-dune`, `la-fille-aux-cauris`, `les-larmes-de-la-falaise`, `le-tambour-qui-disait-vrai`, `les-murs-de-pierre`, `le-masque-de-feuilles`.

Exemple : `public/audio/la-hyene-et-le-lievre.mos.mp3`.

Sans fichier, le site lit le texte avec la voix de synthèse du navigateur (en français) et l'indique à l'écran.

## Workflow recommandé

1. Ouvrir la page **Contribuer** du site.
2. Choisir le conte et la langue, **obtenir l'accord** de la personne enregistrée et cocher la case.
3. Enregistrer, puis télécharger l'audio **et** la fiche `.json` (conteur, lieu, date, consentement).
4. Déposer l'audio dans `public/audio/` et la fiche dans `docs/provenance/`.
5. Commit + push : le site utilise l'enregistrement au prochain déploiement.

## Bonnes pratiques

- Enregistrer dans un endroit calme, micro à environ 20 cm.
- Ne jamais publier une voix sans consentement écrit ou enregistré.
- Conserver la fiche de provenance à côté de chaque fichier audio.
- Si le conteur raconte sa propre version, adapter aussi le texte dans `lib/stories.ts` et le signaler dans le champ `context`.

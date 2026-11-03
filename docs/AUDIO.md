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

## Pourquoi le mooré, le dioula et le fulfulde ne sont pas « générés »

Les voix de synthèse des navigateurs ne savent pas lire ces langues. La seule façon d'avoir une narration fidèle est l'**enregistrement par un locuteur natif**, qui raconte le conte dans sa langue (il peut le traduire à l'oral, il n'a pas besoin de lire mot à mot le texte français).

## Voix française

En lecture de repli, le lecteur propose le choix de la **voix** (celles installées sur l'appareil) et de la **vitesse**. Les meilleures voix françaises sont souvent « Google français » (Chrome) ou les voix Siri / Amélie (Safari, Apple).

## Ajouter le texte d'un conte en mooré (ou dioula, fulfulde)

1. Ouvrir `lib/translations.ts`.
2. Ajouter une entrée avec le slug du conte, le code de langue et **un texte par chapitre** (même nombre de chapitres que le texte français) :

```ts
'la-hyene-et-le-lievre': {
  mos: { chapters: ['…', '…', '…', '…'], moral: '…' },
},
```

3. Dès que « Mooré » est choisi dans le lecteur, la page affiche ce texte avec la mention « à relire par un locuteur natif ». Si le nombre de chapitres ne correspond pas, le français reste affiché.

Le texte doit être écrit ou relu par un locuteur natif. Il s'affiche, mais **l'audio reste à enregistrer** (voir plus haut) : aucune voix de synthèse ne lit le mooré.

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


## Envoi direct depuis le site (sans passer par GitHub)

La page **Contribuer** peut publier l'enregistrement directement : le conteur clique sur « Publier sur le site », l'équipe valide sur `/moderation`, et la voix apparaît dans le lecteur du conte, sans commit ni redéploiement.

### Activer (une seule fois, ~5 minutes)

1. Sur vercel.com, ouvre ton projet → onglet **Storage** → **Create** → **Blob**. Choisis un store **Public** et connecte-le au projet : Vercel ajoute seul la variable `BLOB_READ_WRITE_TOKEN`.
2. Projet → **Settings → Environment Variables** : ajoute `ADMIN_TOKEN` avec un mot de passe long et unique (c'est celui de la page `/moderation`).
3. *(Facultatif)* Ajoute `RECORDINGS_MODE` = `open` pour publier tout de suite, sans validation. Par défaut (`moderated`), chaque envoi attend ton accord.
4. **Redéploie** le projet (Deployments → Redeploy).

Sans ces réglages, le bouton « Publier » n'apparaît pas et l'atelier propose seulement le téléchargement (procédure ci-dessus).

### Valider les envois

Ouvre `/moderation`, saisis le mot de passe, écoute chaque enregistrement, vérifie que l'accord est déclaré, puis **Publier** ou **Refuser**. Un nouvel enregistrement pour le même conte et la même langue remplace le précédent.

### Garde-fous

- Accord obligatoire côté serveur ; le fichier doit être un vrai audio (webm, ogg, m4a, mp3, contrôlé sur les premiers octets) de 2 Ko à 4 Mo (≈ 4 minutes enregistrées).
- Champ piège contre les robots ; `/api` et `/moderation` exclus des moteurs de recherche.
- Pas de limitation de débit : en mode `open`, n'importe qui peut remplacer une voix. Garde `moderated` pour une diffusion publique.
- Les fiches (nom du conteur, village, date, accord) sont conservées avec le fichier. Le nom du conteur est facultatif ; ne publie pas sans son accord.
- En développement (`pnpm dev`), les envois vont dans le dossier local `.recordings/` : aucun compte nécessaire pour tester (mot de passe de modération : `dev`).

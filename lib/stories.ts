import type { Story } from './types'

/**
 * Corpus des contes.
 *
 * Les textes sont des ADAPTATIONS ORIGINALES écrites pour ce projet, inspirées de
 * thèmes classiques de la tradition orale ouest-africaine. Ils ne prétendent pas
 * reproduire une version collectée auprès d'un conteur précis. Voir `docs/AUDIO.md`
 * pour remplacer/compléter ces textes par des enregistrements de terrain.
 */
export const STORIES: Story[] = [
  {
    slug: 'la-hyene-et-le-lievre',
    title: 'La hyène et le lièvre',
    region: 'Centre',
    city: 'Ouagadougou',
    coords: { lat: 12.3714, lng: -1.5197 },
    color: '#db6b32',
    tag: 'SAGESSE',
    culture: 'Mossi',
    tradLanguage: 'Mooré',
    preferredLang: 'mos',
    variant: 'savane',
    night: false,
    summary: 'Une ruse du lièvre pour rappeler que la sagesse triomphe de la force.',
    chapters: [
      "La saison sèche durait depuis trop longtemps. La mare du village n'était plus qu'une flaque, et la Hyène, forte et affamée, régnait sur ce dernier point d'eau en grondant contre quiconque s'en approchait.",
      "Le Lièvre, petit et maigre, avait soif lui aussi. Il ne chercha pas à lutter. Il s'assit à distance, sortit un petit tambour et se mit à compter à voix haute les pas qui le séparaient de la mare, comme s'il préparait une grande fête.",
      "« Pour qui danses-tu, Lièvre ? demanda la Hyène, intriguée. — Pour le Roi des Eaux, qui vient bénir celui qui garde la mare. Mais seul celui qui partage l'eau pourra le saluer », répondit-il.",
      "La Hyène, qui voulait la bénédiction pour elle seule, ouvrit la mare à tous les animaux. Chacun but à sa soif. Quand la nuit tomba, personne n'avait vu le Roi des Eaux, mais la pluie, elle, avait fini par arriver, comme si le partage l'avait appelée.",
    ],
    moral: "La ruse bien employée vaut mieux que la force, et ce que l'on partage finit toujours par revenir.",
    context:
      "Le duo du lièvre rusé et du puissant glouton est un grand classique des contes d'Afrique de l'Ouest : le petit qui l'emporte par l'intelligence. Ces récits servent aussi à apprendre aux enfants à réfléchir avant d'agir. Texte : adaptation originale.",
    branching: {
      start: 'debut',
      nodes: [
        {
          id: 'debut',
          text: "Le Lièvre arrive à la mare presque vide. La Hyène en barre l'accès en grognant. Que fait-il ?",
          choices: [
            { label: "Foncer pour arracher de l'eau", to: 'force' },
            { label: 'Inventer une ruse', to: 'ruse' },
          ],
        },
        {
          id: 'force',
          text: "La Hyène l'attrape par l'oreille et le projette loin de la mare. Le Lièvre n'a pas la force pour lui.",
          ending: { title: 'Chassé !', tone: 'risque', lesson: "Quand on est le plus faible, la force est un mauvais outil." },
        },
        {
          id: 'ruse',
          text: "Le Lièvre sort son petit tambour et annonce l'arrivée du Roi des Eaux. La Hyène s'approche, curieuse. Que propose-t-il ?",
          choices: [
            { label: 'Dire que le Roi bénit ceux qui partagent', to: 'partage' },
            { label: 'Promettre à la Hyène une double part', to: 'double' },
          ],
        },
        {
          id: 'partage',
          text: "La Hyène ouvre la mare à tous. Chacun boit, et la pluie finit par tomber sur le village.",
          ending: { title: "L'eau pour tous", tone: 'sage', lesson: "Le partage attire ce que la force ne peut pas prendre." },
        },
        {
          id: 'double',
          text: "La Hyène accepte, à condition que le secret reste entre eux. Le Lièvre boit, mais les autres animaux restent assoiffés.",
          ending: { title: 'Un marché fragile', tone: 'equilibre', lesson: "Une ruse qui ne profite qu'à soi laisse un goût amer." },
        },
      ],
    },
    quiz: [
      {
        question: "Pourquoi la Hyène garde-t-elle la mare ?",
        options: ["Elle est la chef du village", "Elle est forte et veut garder la dernière eau", "Le Roi des Eaux le lui a demandé"],
        answer: 1,
        explanation: "Forte et affamée, elle règne sur le dernier point d'eau.",
      },
      {
        question: "Que fait le Lièvre pour obtenir de l'eau ?",
        options: ["Il se bat avec la Hyène", "Il creuse un puits", "Il invente l'arrivée du Roi des Eaux"],
        answer: 2,
        explanation: "Il utilise la ruse et son petit tambour plutôt que la force.",
      },
      {
        question: "Que s'est-il passé à la fin ?",
        options: ["La mare est asséchée", "La pluie arrive après le partage", "La Hyène part loin du village"],
        answer: 1,
        explanation: "Le partage semble avoir appelé la pluie.",
      },
    ],
  },
  {
    slug: 'le-genie-de-la-mare-sacree',
    title: 'Le génie de la mare sacrée',
    region: 'Hauts-Bassins',
    city: 'Bobo-Dioulasso',
    coords: { lat: 11.1771, lng: -4.2979 },
    color: '#b84d38',
    tag: 'MYSTÈRE',
    culture: 'Bobo et Dioula',
    tradLanguage: 'Dioula (Jula)',
    preferredLang: 'dyu',
    variant: 'mare',
    night: true,
    summary: "Au bord de l'eau, un pacte ancien protège les villages et leurs récoltes.",
    chapters: [
      "Au bord de la grande mare, les anciens avaient conclu un pacte : les poissons seraient intouchables, et en échange l'eau ne manquerait jamais au village. Chaque matin, les enfants venaient jeter quelques grains de mil aux silures, par respect.",
      "Une année, la récolte fut pauvre. Un jeune pêcheur, Sékou, que la faim rendait impatient, jura que quelques poissons ne manqueraient à personne. La veille, il vit une lueur étrange sur l'eau, mais il choisit de n'en parler à personne.",
      "À l'aube, il lança son filet. L'eau resta calme, trop calme. Puis une voix grave, qui semblait monter de la vase, murmura : « Celui qui reprend ce qu'il a promis de protéger perd ce qu'il voulait garder. »",
      "Sékou laissa tomber le filet et courut avertir les anciens. Ensemble, ils renouvelèrent le pacte, et la mare se remplit à la première pluie. On dit depuis que le génie de la mare veille sur ceux qui tiennent parole.",
    ],
    moral: "Une promesse faite à la communauté protège aussi celui qui la tient.",
    context:
      "Dans plusieurs régions d'Afrique de l'Ouest, des mares ou des bois sont dits sacrés ; près de Bobo-Dioulasso, la mare aux poissons sacrés de Dafra en est un exemple connu, où l'on ne pêche pas. Le récit présenté ici est une adaptation originale inspirée de ce type de tradition.",
    branching: {
      start: 'debut',
      nodes: [
        {
          id: 'debut',
          text: "La récolte est mauvaise et Sékou a faim. Au bord de la mare, les silures sacrés nagent paisiblement. Que fait-il ?",
          choices: [
            { label: 'Jeter son filet en secret', to: 'filet' },
            { label: 'Parler de sa faim aux anciens', to: 'anciens' },
          ],
        },
        {
          id: 'filet',
          text: "L'eau se fige et une voix grave résonne. Sékou lâche le filet, effrayé, mais le mal est fait : le pacte est brisé.",
          ending: { title: 'Le pacte brisé', tone: 'risque', lesson: "Reprendre sa parole, c'est perdre la confiance qui protège tout le village." },
        },
        {
          id: 'anciens',
          text: "Les anciens l'écoutent. Ils proposent deux solutions : partager les réserves de mil, ou organiser une cérémonie pour renouveler le pacte.",
          choices: [
            { label: 'Partager les réserves de mil', to: 'mil' },
            { label: 'Renouveler le pacte à la mare', to: 'pacte' },
          ],
        },
        {
          id: 'mil',
          text: "Chaque famille donne un peu. Personne ne meurt de faim, mais la mare, négligée, baisse un peu cette année-là.",
          ending: { title: 'La solidarité', tone: 'equilibre', lesson: "Aider les siens est essentiel, mais il faut aussi honorer ce qui nous protège." },
        },
        {
          id: 'pacte',
          text: "Au lever du jour, tout le village se réunit au bord de l'eau. Les silures remontent à la surface, et la première pluie remplit la mare.",
          ending: { title: 'Le pacte renouvelé', tone: 'sage', lesson: "Tenir parole ensemble, c'est ce qui fait durer un village." },
        },
      ],
    },
    quiz: [
      {
        question: "Que promettent les anciens aux habitants ?",
        options: ["Une récolte abondante chaque année", "Que l'eau ne manquera jamais s'ils protègent les poissons", "De construire une nouvelle mare"],
        answer: 1,
        explanation: "En échange de la protection des poissons, l'eau ne manque jamais.",
      },
      {
        question: "Pourquoi Sékou veut-il pêcher ?",
        options: ["Il aime la pêche", "Il a faim après une mauvaise récolte", "Les anciens le lui ont demandé"],
        answer: 1,
        explanation: "La récolte était pauvre et la faim le rendait impatient.",
      },
      {
        question: "Que fait Sékou après avoir entendu la voix ?",
        options: ["Il s'enfuit sans rien dire", "Il continue de pêcher", "Il prévient les anciens"],
        answer: 2,
        explanation: "Il court avertir les anciens, qui renouvellent le pacte.",
      },
    ],
  },
  {
    slug: 'le-chant-de-la-dune',
    title: 'Le chant de la dune',
    region: 'Sahel',
    city: 'Dori',
    coords: { lat: 14.0354, lng: -0.0345 },
    color: '#c58a3a',
    tag: 'VOYAGE',
    culture: 'Peul',
    tradLanguage: 'Fulfulde',
    preferredLang: 'ful',
    variant: 'dune',
    night: true,
    summary: 'Une histoire de voyage, de courage et de transmission sous les étoiles.',
    chapters: [
      "Au Sahel, un jeune berger nommé Hamidou menait son troupeau d'un puits à l'autre. Chaque soir, son grand-père lui rappelait qu'on ne traverse pas le désert avec des jambes seulement, mais aussi avec des chants.",
      "Une nuit, une tempête de sable effaça les traces et sépara Hamidou de ses bêtes. Perdu, il s'assit sur la crête d'une dune, la gorge sèche, et ne vit plus que le ciel.",
      "Il se souvint alors d'un chant de son grand-père, qui nommait les étoiles comme on nomme des cousins. En chantant, il reconnut celle qui ne bouge jamais, celle qui montre le nord.",
      "Il marcha jusqu'à l'aube, chantant à voix basse, et retrouva son troupeau près d'un puits. Depuis, il enseigne à chaque enfant le chant de la dune, pour que la mémoire serve de boussole quand le chemin disparaît.",
    ],
    moral: "Ce que l'on transmet de voix en voix peut nous guider quand tout le reste disparaît.",
    context:
      "Les éleveurs peuls du Sahel pratiquent la transhumance et se transmettent à l'oral poèmes pastoraux, chants de bétail et généalogies. Ce conte est une adaptation originale inspirée de ces pratiques.",
    branching: {
      start: 'debut',
      nodes: [
        {
          id: 'debut',
          text: "Une tempête de sable a effacé les traces. Hamidou est seul sur la dune, sans son troupeau. Que fait-il ?",
          choices: [
            { label: 'Courir au hasard pour retrouver ses bêtes', to: 'courir' },
            { label: 'S\'asseoir et se souvenir du chant', to: 'chant' },
          ],
        },
        {
          id: 'courir',
          text: "Il court dans tous les sens, s'épuise et finit par tomber de fatigue. Au matin, des bergers le retrouvent, sain et sauf, mais très affaibli.",
          ending: { title: 'Sauvé de justesse', tone: 'risque', lesson: "Sans repère, la vitesse ne remplace pas la direction." },
        },
        {
          id: 'chant',
          text: "Il se rappelle les étoiles nommées par son grand-père. Faut-il suivre l'étoile qui ne bouge jamais, ou attendre le jour ?",
          choices: [
            { label: "Suivre l'étoile fixe", to: 'etoile' },
            { label: "Attendre le lever du soleil", to: 'attendre' },
          ],
        },
        {
          id: 'etoile',
          text: "Il marche vers le nord en chantant. Au petit matin, il retrouve son troupeau près d'un puits.",
          ending: { title: 'La mémoire pour boussole', tone: 'sage', lesson: "Un savoir transmis de génération en génération peut sauver la vie." },
        },
        {
          id: 'attendre',
          text: "Il chante jusqu'à l'aube et retrouve ses bêtes à la lumière du jour, un peu plus tard que prévu, mais sans danger.",
          ending: { title: 'La patience du berger', tone: 'equilibre', lesson: "Savoir attendre est aussi une façon de se guider." },
        },
      ],
    },
    quiz: [
      {
        question: "Qui est Hamidou ?",
        options: ["Un jeune berger", "Un marchand de sel", "Un chasseur"],
        answer: 0,
        explanation: "Hamidou mène son troupeau d'un puits à l'autre.",
      },
      {
        question: "Qu'est-ce qui sépare Hamidou de ses bêtes ?",
        options: ["Une rivière en crue", "Une tempête de sable", "La nuit"],
        answer: 1,
        explanation: "La tempête efface les traces et le sépare du troupeau.",
      },
      {
        question: "Comment retrouve-t-il son chemin ?",
        options: ["Grâce au chant de son grand-père et aux étoiles", "En suivant des traces de pas", "En suivant un autre berger"],
        answer: 0,
        explanation: "Le chant lui fait reconnaître l'étoile qui montre le nord.",
      },
    ],
  },
  {
    slug: 'la-fille-aux-cauris',
    title: 'La fille aux cauris',
    region: 'Est',
    city: "Fada N'Gourma",
    coords: { lat: 12.0616, lng: 0.3581 },
    color: '#b8742f',
    tag: 'INITIATION',
    culture: 'Gourmantché',
    tradLanguage: 'Gulmancema',
    preferredLang: 'mos',
    variant: 'savane',
    night: true,
    summary: 'Une jeune fille trouve sa voie en écoutant les signes laissés par ses ancêtres.',
    chapters: [
      "Quand sa mère disparut, une jeune fille hérita du petit sac de cauris que celle-ci portait toujours. « Écoute-les, lui avait-elle dit un jour, ils parlent à qui sait se taire. »",
      "Elle quitta le village pour trouver quelqu'un qui lui apprendrait à les entendre. Le forgeron lui parla du feu, la tisseuse du fil, le vieux chasseur du silence de la brousse. Chacun lui offrit un morceau de réponse.",
      "Pendant sept nuits, elle écouta le vent, les grillons, le crépitement du feu. Au huitième matin, elle jeta les cauris sur le sol et comprit qu'ils ne disaient pas l'avenir : ils montraient le chemin entre ce qu'elle avait vu et ce qu'elle savait.",
      "Elle revint au village avec une certitude : la voie qu'on cherche est déjà écrite dans ce que les ancêtres ont laissé. Depuis, les enfants viennent à elle pour apprendre à écouter avant de parler.",
    ],
    moral: "Savoir écouter est le premier pas de toute initiation.",
    context:
      "Les cauris, coquillages longtemps utilisés comme monnaie en Afrique de l'Ouest, interviennent aussi dans des pratiques de divination. Ce récit est une adaptation originale : il ne reproduit aucun rite précis.",
    branching: {
      start: 'debut',
      nodes: [
        {
          id: 'debut',
          text: "La jeune fille tient les cauris dans ses mains. Elle ne sait pas encore les écouter. Vers qui se tourne-t-elle ?",
          choices: [
            { label: 'Demander la réponse au forgeron', to: 'forgeron' },
            { label: 'Partir seule dans la brousse', to: 'brousse' },
          ],
        },
        {
          id: 'forgeron',
          text: "Le forgeron lui parle du feu et de la patience du métal. « Reviens quand tu auras écouté plus longtemps », dit-il.",
          ending: { title: 'Une leçon du feu', tone: 'equilibre', lesson: "Chaque métier enseigne une part de la sagesse, mais il faut ensuite chercher la sienne." },
        },
        {
          id: 'brousse',
          text: "Elle s'installe sous un grand arbre, loin du bruit. Le silence est difficile. Que fait-elle ?",
          choices: [
            { label: 'Rester sept nuits en écoutant', to: 'sept' },
            { label: 'Rentrer au village dès le premier soir', to: 'rentrer' },
          ],
        },
        {
          id: 'sept',
          text: "Peu à peu, elle distingue le vent, les grillons et le feu. Au huitième matin, les cauris lui parlent.",
          ending: { title: "L'oreille qui comprend", tone: 'sage', lesson: "L'écoute patiente ouvre ce que l'impatience ferme." },
        },
        {
          id: 'rentrer',
          text: "Elle se persuade qu'elle n'a rien appris. Pourtant, en route, elle remarque pour la première fois le chant d'un oiseau.",
          ending: { title: 'Le premier pas', tone: 'risque', lesson: "Abandonner trop tôt retarde la sagesse, mais le premier pas est déjà fait." },
        },
      ],
    },
    quiz: [
      {
        question: "Que reçoit la jeune fille de sa mère ?",
        options: ["Un sac de cauris", "Un bijou en or", "Un tambour"],
        answer: 0,
        explanation: "Elle hérite du petit sac de cauris que sa mère portait toujours.",
      },
      {
        question: "Combien de nuits écoute-t-elle ?",
        options: ["Trois", "Sept", "Dix"],
        answer: 1,
        explanation: "Pendant sept nuits, puis au huitième matin elle comprend.",
      },
      {
        question: "Que comprend-elle finalement ?",
        options: ["Les cauris prédisent l'avenir", "Les cauris montrent le chemin entre ce qu'elle a vu et ce qu'elle sait", "Les cauris n'ont aucun pouvoir"],
        answer: 1,
        explanation: "Ils ne disent pas l'avenir : ils éclairent le chemin intérieur.",
      },
    ],
  },
  {
    slug: 'les-larmes-de-la-falaise',
    title: 'Les larmes de la falaise',
    region: 'Cascades',
    city: 'Banfora',
    coords: { lat: 10.6333, lng: -4.7667 },
    color: '#71905a',
    tag: 'NATURE',
    culture: 'Sénoufo et Dioula',
    tradLanguage: 'Dioula (Jula)',
    preferredLang: 'dyu',
    variant: 'cascade',
    night: false,
    summary: 'Une légende née du murmure des cascades et de la mémoire des griots.',
    chapters: [
      "Près de Banfora, une falaise de grès surplombe une rivière paisible. Les griots racontent qu'autrefois, une jeune femme y venait chaque soir attendre le retour de son fiancé, parti commercer au loin.",
      "Les saisons passèrent. Les marchands rentraient, les caravanes se succédaient, mais lui ne revenait pas. La jeune femme continuait de chanter, et le rocher semblait garder chacune de ses notes.",
      "Le jour où elle ne vint plus, la falaise se mit à pleurer : un mince filet d'eau coula de sa crête et grossit à chaque saison des pluies, jusqu'à devenir cascade.",
      "Les villageois comprirent qu'on ne perd jamais tout à fait ceux qu'on attend avec fidélité : la nature garde leur mémoire. Depuis, on dit que les grandes pluies sont le chant revenu du rocher.",
    ],
    moral: "La mémoire et la fidélité transforment la peine en source de vie.",
    context:
      "La région des Cascades, au sud-ouest du pays, est connue pour ses chutes (Karfiguéla), ses dômes de Fabédougou et les pics de Sindou. Ce récit est une adaptation originale inspirée de légendes qui expliquent les paysages.",
    branching: {
      start: 'debut',
      nodes: [
        {
          id: 'debut',
          text: "Chaque soir, la jeune femme monte sur la falaise. Les années passent et son fiancé ne revient pas. Que fait-elle ?",
          choices: [
            { label: 'Continuer de chanter chaque soir', to: 'chanter' },
            { label: 'Partir à sa recherche', to: 'partir' },
          ],
        },
        {
          id: 'chanter',
          text: "Elle chante pendant des saisons. Un jour, elle sent que sa voix devient celle du rocher. Faut-il lui confier son chant ?",
          choices: [
            { label: 'Confier son chant au rocher', to: 'rocher' },
            { label: 'Le garder pour elle', to: 'garder' },
          ],
        },
        {
          id: 'rocher',
          text: "Le rocher garde son chant. Quand elle ne vient plus, une source naît de sa crête et devient cascade.",
          ending: { title: 'La cascade', tone: 'sage', lesson: "Ce qu'on confie à la nature devient mémoire vivante." },
        },
        {
          id: 'garder',
          text: "Elle garde le chant pour elle, et il s'éteint avec elle. Les villageois ne le connaîtront jamais.",
          ending: { title: 'Un chant perdu', tone: 'risque', lesson: "Un souvenir qui n'est pas partagé disparaît avec celui qui le porte." },
        },
        {
          id: 'partir',
          text: "Elle suit les caravanes pendant des mois. Elle ne retrouve pas son fiancé, mais elle rencontre des griots qui lui apprennent des chants du monde entier.",
          ending: { title: 'La voyageuse', tone: 'equilibre', lesson: "Chercher peut offrir autre chose que ce qu'on attendait." },
        },
      ],
    },
    quiz: [
      {
        question: "Que fait la jeune femme sur la falaise ?",
        options: ["Elle attend son fiancé en chantant", "Elle surveille les récoltes", "Elle cueille des plantes"],
        answer: 0,
        explanation: "Elle y vient chaque soir attendre son fiancé.",
      },
      {
        question: "Que se passe-t-il quand elle cesse de venir ?",
        options: ["La falaise s'effondre", "Un filet d'eau coule et devient cascade", "La rivière change de lit"],
        answer: 1,
        explanation: "La falaise « pleure » et l'eau grossit jusqu'à former une cascade.",
      },
      {
        question: "Que disent les villageois des grandes pluies ?",
        options: ["Elles annoncent un malheur", "Elles sont le chant revenu du rocher", "Elles viennent de l'océan"],
        answer: 1,
        explanation: "Elles sont vues comme le chant revenu du rocher.",
      },
    ],
  },
  {
    slug: 'le-tambour-qui-disait-vrai',
    title: 'Le tambour qui disait vrai',
    region: 'Nord',
    city: 'Ouahigouya',
    coords: { lat: 13.5828, lng: -2.4216 },
    color: '#8f5fa8',
    tag: 'VÉRITÉ',
    culture: 'Mossi (Yatenga)',
    tradLanguage: 'Mooré',
    preferredLang: 'mos',
    variant: 'village',
    night: true,
    summary: "Un tambour de cour refuse de mentir et rappelle que la vérité sait se faire entendre.",
    chapters: [
      "À la cour d'un grand chef, un tambour ancien annonçait les fêtes, les deuils et les arrivées. On disait qu'il ne savait pas mentir : sous les mains du tambourinaire, chaque rythme portait une vérité.",
      "Un conseiller ambitieux voulut s'en servir pour accuser un rival. Il offrit de l'or au tambourinaire pour qu'il frappe, dans la nuit, un faux message.",
      "Le tambourinaire leva les baguettes, hésita, puis joua tout autre chose : le nom du conseiller, suivi d'un seul mot, « mensonge ». La place entière l'entendit.",
      "Le chef ne punit personne ce soir-là. Il convoqua simplement une assemblée, pour que chacun puisse parler à son tour. On dit depuis que le tambour a deux voix : celle des mains et celle de la conscience.",
    ],
    moral: "La vérité finit toujours par trouver un rythme pour se faire entendre.",
    context:
      "Dans plusieurs sociétés d'Afrique de l'Ouest, des tambours imitent les tons de la langue parlée et transmettent des messages à distance. Ouahigouya fut la capitale du royaume mossi du Yatenga. Ce conte est une adaptation originale.",
    branching: {
      start: 'debut',
      nodes: [
        {
          id: 'debut',
          text: "Le conseiller tend une bourse d'or au tambourinaire et lui demande de frapper un faux message. Que fait-il ?",
          choices: [
            { label: "Accepter l'or et frapper le faux message", to: 'accepter' },
            { label: 'Refuser et dire la vérité', to: 'refuser' },
          ],
        },
        {
          id: 'accepter',
          text: "Le tambour sonne faux, d'une voix étrange. Les villageois se regardent, inquiets. Le chef finit par comprendre la supercherie, et le tambourinaire est chassé de la cour.",
          ending: { title: 'Le tambour trahi', tone: 'risque', lesson: "La confiance se perd plus vite qu'elle ne se gagne." },
        },
        {
          id: 'refuser',
          text: "Le tambourinaire hésite. Comment dire la vérité sans provoquer un drame ?",
          choices: [
            { label: 'Frapper le nom du conseiller et « mensonge »', to: 'nommer' },
            { label: 'Aller discrètement trouver le chef', to: 'chef' },
          ],
        },
        {
          id: 'nommer',
          text: "Toute la place entend. Le chef convoque une assemblée où chacun peut parler à son tour.",
          ending: { title: 'La place entend', tone: 'sage', lesson: "La vérité dite à tous protège mieux qu'un secret." },
        },
        {
          id: 'chef',
          text: "Le chef écoute à l'écart et renvoie discrètement le conseiller. L'affaire est réglée, mais le village ne saura jamais ce qui s'est passé.",
          ending: { title: 'Une justice discrète', tone: 'equilibre', lesson: "La discrétion protège, mais elle prive aussi de la leçon commune." },
        },
      ],
    },
    quiz: [
      {
        question: "Que dit-on du tambour ?",
        options: ["Qu'il ne sait pas mentir", "Qu'il est magique et invisible", "Qu'il joue seul"],
        answer: 0,
        explanation: "Chaque rythme joué sur ce tambour porte une vérité.",
      },
      {
        question: "Que veut le conseiller ?",
        options: ["Faire accuser un rival", "Gagner un concours de danse", "Réparer le tambour"],
        answer: 0,
        explanation: "Il veut accuser un rival grâce à un faux message.",
      },
      {
        question: "Que joue finalement le tambourinaire ?",
        options: ["Une danse de fête", "Un chant de deuil", "Le nom du conseiller suivi de « mensonge »"],
        answer: 2,
        explanation: "Il refuse l'or et révèle la tromperie à toute la place.",
      },
    ],
  },
  {
    slug: 'les-murs-de-pierre',
    title: 'Les murs de pierre',
    region: 'Sud-Ouest',
    city: 'Gaoua',
    coords: { lat: 10.3269, lng: -3.1806 },
    color: '#2f6c63',
    tag: 'MÉMOIRE',
    culture: 'Lobi',
    tradLanguage: 'Lobiri et Dioula',
    preferredLang: 'dyu',
    variant: 'foret',
    night: false,
    summary: "Des ruines de pierre dans la forêt gardent les noms de ceux que l'on ne veut pas oublier.",
    chapters: [
      "Au cœur de la forêt du Sud-Ouest, d'immenses murs de pierre dorée se dressent depuis des siècles. Personne ne sait vraiment qui les a bâtis ni pourquoi, et c'est pour cela que les histoires poussent autour d'eux comme des lianes.",
      "On raconte qu'un jeune chasseur, égaré par la brume, trouva un mur plus haut que les arbres. Intrigué, il longea la pierre jusqu'à une ouverture étroite.",
      "À l'intérieur, il entendit des voix qui murmuraient des noms. Il n'osa pas entrer, mais il retint chacun de ces noms pour ne pas les laisser tomber dans l'oubli.",
      "De retour au village, il les récita aux anciens. Depuis, le village garde cette liste de noms, comme une façon de dire que même une ruine peut parler quand quelqu'un se souvient.",
    ],
    moral: "Tant qu'on se souvient, rien n'est tout à fait perdu.",
    context:
      "Les ruines de Loropéni, dans le Sud-Ouest, sont inscrites au patrimoine mondial de l'UNESCO depuis 2009 et sont associées à l'ancien commerce de l'or. Leur histoire reste en partie mystérieuse. Ce conte est une adaptation originale, sans prétention historique.",
    branching: {
      start: 'debut',
      nodes: [
        {
          id: 'debut',
          text: "Le chasseur est devant une ouverture étroite entre deux murs de pierre. Des voix murmurent à l'intérieur. Que fait-il ?",
          choices: [
            { label: "Entrer pour voir d'où viennent les voix", to: 'entrer' },
            { label: 'Rester dehors et écouter', to: 'ecouter' },
          ],
        },
        {
          id: 'entrer',
          text: "À peine entré, il perd le fil des voix et ne retient aucun nom. Le brouillard se lève et il retrouve son chemin les mains vides.",
          ending: { title: 'Les mains vides', tone: 'risque', lesson: "La curiosité sans écoute ne rapporte rien." },
        },
        {
          id: 'ecouter',
          text: "Les voix répètent des noms. Comment les garder ?",
          choices: [
            { label: 'Les répéter à voix basse jusqu\'au village', to: 'repeter' },
            { label: 'Les graver sur un bâton', to: 'graver' },
          ],
        },
        {
          id: 'repeter',
          text: "Il arrive au village, récite les noms aux anciens, qui les transmettent à leur tour.",
          ending: { title: 'La voix qui transmet', tone: 'sage', lesson: "La mémoire vit tant qu'elle passe de bouche en bouche." },
        },
        {
          id: 'graver',
          text: "Il grave quelques signes sur un bâton, mais certains noms lui échappent. Le bâton, lui, restera longtemps dans la case du village.",
          ending: { title: 'Un souvenir partiel', tone: 'equilibre', lesson: "Les traces écrites aident, mais ne remplacent pas la parole vivante." },
        },
      ],
    },
    quiz: [
      {
        question: "Que trouve le chasseur ?",
        options: ["Un village abandonné", "Un mur de pierre plus haut que les arbres", "Une rivière souterraine"],
        answer: 1,
        explanation: "Il trouve un mur de pierre dorée qui dépasse les arbres.",
      },
      {
        question: "Qu'entend-il à l'intérieur ?",
        options: ["Des chants de fête", "Des voix qui murmurent des noms", "Des tambours"],
        answer: 1,
        explanation: "Des voix qui murmurent des noms à retenir.",
      },
      {
        question: "Que fait le village de ces noms ?",
        options: ["Il les garde comme une liste de mémoire", "Il les oublie vite", "Il les chante au marché"],
        answer: 0,
        explanation: "Le village conserve cette liste pour ne pas oublier.",
      },
    ],
  },
  {
    slug: 'le-masque-de-feuilles',
    title: 'Le masque de feuilles',
    region: 'Boucle du Mouhoun',
    city: 'Dédougou',
    coords: { lat: 12.4634, lng: -3.4608 },
    color: '#4c7fa6',
    tag: 'CÉRÉMONIE',
    culture: 'Bwa',
    tradLanguage: 'Bwamu',
    preferredLang: 'dyu',
    variant: 'village',
    night: false,
    rain: true,
    summary: "Un jeune danseur découvre qu'il peut servir quelque chose de plus grand que lui.",
    chapters: [
      "Dans la Boucle du Mouhoun, on danse parfois sous des masques de feuilles pour remercier la terre quand la pluie revient. Celui qui porte le masque disparaît : il n'est plus un homme, mais une idée.",
      "Un jeune danseur, très doué, rêvait pourtant qu'on le reconnaisse. Il ajouta en cachette une plume brillante à son masque, pour que la foule murmure son nom.",
      "Pendant la danse, la plume attira les regards, mais le rythme se brisa : les spectateurs ne regardaient plus la terre, seulement le danseur. Le ciel resta clair, sans un nuage.",
      "Honteux, le jeune homme retira la plume le lendemain et dansa de nouveau, simplement, au service de la danse. Cette fois, les nuages s'amoncelèrent. Il comprit que certaines fiertés se transmettent mieux en s'effaçant.",
    ],
    moral: "Servir quelque chose de plus grand que soi est la plus belle des signatures.",
    context:
      "Les masques de feuilles et de fibres sont un art célèbre des communautés bwa de la région ; ils apparaissent lors de cérémonies. Ce conte est une adaptation originale qui ne décrit aucun rituel précis.",
    branching: {
      start: 'debut',
      nodes: [
        {
          id: 'debut',
          text: "Le jour de la cérémonie, le jeune danseur tient une plume brillante. Va-t-il l'ajouter à son masque ?",
          choices: [
            { label: 'Ajouter la plume pour être remarqué', to: 'plume' },
            { label: 'Danser sans artifice', to: 'simple' },
          ],
        },
        {
          id: 'plume',
          text: "La foule murmure son nom, mais le rythme se brise. Le ciel reste vide de nuages. Que fait-il le lendemain ?",
          choices: [
            { label: 'Retirer la plume et recommencer', to: 'retirer' },
            { label: 'Garder la plume malgré tout', to: 'garder' },
          ],
        },
        {
          id: 'retirer',
          text: "Il danse humblement. Les nuages s'amoncellent et la pluie tombe sur les champs.",
          ending: { title: 'La pluie revient', tone: 'sage', lesson: "S'effacer au service du collectif, c'est aussi grandir." },
        },
        {
          id: 'garder',
          text: "Il continue d'attirer les regards. Les villageois l'applaudissent, mais la pluie se fait attendre toute la saison.",
          ending: { title: 'Un nom sans pluie', tone: 'risque', lesson: "La gloire personnelle ne nourrit pas les champs." },
        },
        {
          id: 'simple',
          text: "Il danse avec le masque simple. La pluie vient, mais personne ne remarque son talent. Lui-même est partagé entre fierté et regret.",
          ending: { title: 'Le danseur anonyme', tone: 'equilibre', lesson: "Servir sans être vu demande du courage, et de la paix intérieure." },
        },
      ],
    },
    quiz: [
      {
        question: "Pourquoi danse-t-on sous des masques de feuilles ?",
        options: ["Pour effrayer les animaux", "Pour remercier la terre quand la pluie revient", "Pour célébrer un mariage"],
        answer: 1,
        explanation: "La danse remercie la terre au retour de la pluie.",
      },
      {
        question: "Que fait le jeune danseur en cachette ?",
        options: ["Il ajoute une plume brillante à son masque", "Il change de danse", "Il enlève son masque"],
        answer: 0,
        explanation: "Il veut qu'on reconnaisse son nom dans la foule.",
      },
      {
        question: "Que se passe-t-il quand il danse sans la plume ?",
        options: ["Il est chassé du village", "La pluie finit par arriver", "Le rythme s'arrête"],
        answer: 1,
        explanation: "Les nuages s'amoncellent : la danse est au service de la terre.",
      },
    ],
  },
]

export const REGION_COUNT = 13

export function getStory(slug: string): Story | undefined {
  return STORIES.find((s) => s.slug === slug)
}

export function getStoryByRegion(region: string): Story | undefined {
  return STORIES.find((s) => s.region === region)
}

/** Texte complet d'un conte (pour la synthèse vocale, le SEO, l'export). */
export function storyText(story: Story): string {
  return story.chapters.join(' ')
}

/** Temps de lecture estimé, en minutes (≈ 150 mots/min à voix haute). */
export function readingMinutes(story: Story): number {
  const words = storyText(story).split(/\s+/).length
  return Math.max(1, Math.round(words / 150))
}

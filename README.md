# PxGrove

Jeu web idle de jardin pixel lié à des collections NFT pixel (Normies, OnChain Hoodies). Livré comme **un seul fichier HTML autonome**, sans backend, sauvegarde locale dans le navigateur.

Ce dépôt reprend la « version test » (nouvelle interface : onglets, scène au ratio de l'illustration, panneaux Ressources / Plante, potager en sprite). L'ancienne interface, telle qu'encore publiée sur l'artifact principal, est conservée pour référence dans `legacy/index-classic.html` (non maintenue ici).

## Arborescence

```
src/
  index.html      gabarit de page (marqueurs /*__CSS__*/ et /*__JS__*/)
  styles.css      tout le CSS
  game.js         tout le jeu (moteur, rendu canvas, UI, i18n EN/FR, recettes, tutos)
  assets/         images détourées ; référencées dans game.js par __ASSET__('nom.ext')
build/build.mjs   assemble src/ → dist/index.html (assets inlinés en data URI, BUILD_STAMP horodaté Europe/Brussels)
tests/unit/       suites node (sans navigateur) sur la logique de jeu : équilibrage, recettes, pots, gants, hydratation
tests/e2e/        test d'acceptation visuel Playwright sur dist/index.html (ratio, alignement du potager, clics, pas de scroll)
scripts/deploy.sh envoie dist/index.html sur Hostinger en FTP (identifiants dans .env, jamais commités)
legacy/           ancienne interface (référence)
```

## Commandes

```bash
npm install                 # une fois (Playwright pour les tests e2e)
npx playwright install chromium

npm run build               # → dist/index.html  (Hostinger : à déposer dans public_html)
npm run build:test          # idem, stamp suffixé « TEST UI »
npm run build:artifact      # → dist/artifact.html (format artifact claude.ai : sans doctype/head/body)
npm test                    # suites unitaires (~155 assertions, < 5 s)
npm run test:e2e            # build + vérification visuelle sur 4 formats d'écran (captures dans .tmp/)
npm run serve               # build + serveur local http://localhost:4173
npm run deploy              # build + upload FTP (voir .env.example)
```

## Pipeline d'une modification

1. Modifier `src/` (le code de jeu est dans `game.js` ; le CSS dans `styles.css` ; un nouvel asset = fichier dans `src/assets/` + `__ASSET__('fichier')` dans `game.js`).
2. `npm test` — la logique doit rester verte (79 + 24 + 35 + 7 + 10 assertions).
3. `npm run test:e2e` — critères visuels verts sur les 4 formats. **Boucler jusqu'à ce que tout passe** avant de publier.
4. `npm run deploy` (Hostinger) ou `npm run build:artifact` puis publication de `dist/artifact.html` comme artifact.
5. Documenter la décision (Notion : sous-pages de la fiche PxGrove, en tableaux) et committer.

## Conventions du jeu (rappels utiles avant de toucher au code)

- EN et FR sont édités **en tandem** (objet `I18N` dans `game.js`, clés `en:` puis `fr:`).
- Le jeu est en anglais par défaut ; l'interface PC tient sur une page sans scroll ; une seule zone de notifications (haut de la scène) ; aucune dimension ne change à l'affichage d'un pop-up.
- Invariants de début de partie : 1ʳᵉ coupe à 100 % = 21 bois ; 2ᵉ coupe = 2 graines + tuto pleine terre.
- Bornes de vitesse : pousse 24 h (communes) → 18 h (rapides) ; 4-8 h avec toutes les améliorations ; ce qui accélère la pousse accélère le séchage.
- Le potager (`BED_SPRITE`, `BED_META`) impose le pas des emplacements : les pots, plantes et jauges sont dessinés à l'échelle du compartiment et posés sur le bord avant de la terre (`bedGroundY`). Le fond (`SCENE_BG`) impose le ratio de la scène (`layoutScene`).
- Sauvegarde : `localStorage`, clé `LS_KEY` — ne pas la changer sans migration, sinon les joueurs perdent leur partie.

## Assets à produire (2D, PNG/WebP transparent, même perspective que le potager, ~2× la taille d'affichage)

Pots par matière (argile, céramique, grand céramique, terre cuite, plastique, béton, auto-arrosant), parcelle nue, lampe (3 niveaux, allumée/éteinte), goutte-à-goutte (3 niveaux), réservoir, générateur. Les plantes restent procédurales (pixel) pour l'instant.

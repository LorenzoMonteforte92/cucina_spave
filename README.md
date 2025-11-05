# CucinaSpave — Vue + Vite + Pinia + Firebase

## Avvio
```bash
npm install
npm run dev
```

## Build & Deploy (GitHub Pages)
- Imposta `base: '/<repo>/'` in `vite.config.js` (se pubblichi sotto /<repo>/)
- `npm run build` → cartella `dist/`
- Carica `dist/` su GitHub Pages (Branch: `gh-pages` o tramite action)

## Firebase Realtime
1. Firebase Console → Progetto → Web App → copia l'oggetto config (JSON)
2. Apri l'app → **Configura Realtime** → incolla il JSON → **Attiva**
3. Firestore:
   - Collection: `orders` (ordini)
   - Collection: `recipes` (menù)

## Funzioni incluse
- Ordini, coda, totali, completati
- Categorie fisse: Appetizer, Burgers, Dolci
- **Menu Editor** (aggiungi/rinomina/elimina voci, ingredienti)
- Sync Firestore in tempo reale (ordini e ricette)
- PWA base (manifest + sw)

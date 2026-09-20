# Fabrizio Lanfranchi — Sito Web Personale

Sito web bilingue (IT/DE) per atleta di sci di fondo, ottimizzato per GitHub Pages.

## 🚀 Pubblicazione su GitHub Pages (GRATIS)

### Passo 1: Crea account GitHub
1. Vai su [github.com](https://github.com)
2. Registrati con email (gratuito)

### Passo 2: Crea repository
1. Clicca "New repository"
2. Nome: `fabriziolanfranchi.github.io` (esatto!)
3. Seleziona "Public"
4. Clicca "Create repository"

### Passo 3: Carica i file
Opzione A — Upload manuale:
1. Nella pagina del repository, clicca "uploading an existing file"
2. Trascina TUTTO il contenuto di questa cartella
3. Clicca "Commit changes"

Opzione B — Git (avanzato):
```bash
git init
git add .
git commit -m "Sito iniziale"
git remote add origin https://github.com/tuousername/fabriziolanfranchi.github.io.git
git push -u origin main
```

### Passo 4: Attiva GitHub Pages
1. Vai su Settings → Pages
2. Source: seleziona "main" branch
3. Clicca Save

### Passo 5: Verifica
Dopo 2-3 minuti, il sito sarà live su:
**https://fabriziolanfranchi.github.io**

---

## 📁 Struttura file

```
fabriziolanfranchi.github.io/
├── index.html          # Pagina principale
├── assets/
│   ├── css/
│   │   └── style.css   # Stili completi
│   ├── js/
│   │   └── main.js     # Interazioni + traduzioni
│   └── img/            # Foto ottimizzate
│       ├── hero-action.jpg
│       ├── portrait-vertical.jpg
│       └── ...
└── README.md           # Questo file
```

---

## 🌍 Cambio lingua

Il sito rileva automaticamente la lingua del browser (IT/DE).
L'utente può cambiare manualmente con i bottoni IT/DE in alto.

Le traduzioni sono in `assets/js/main.js` nell'oggetto `translations`.

---

## ✏️ Modifiche rapide

### Cambiare testi
Modifica `index.html` — cerca `data-translate="chiave"` e aggiorna il testo.

### Aggiungere foto alla galleria
1. Copia foto in `assets/img/`
2. In `index.html`, duplica un blocco:
```html
<div class="gallery-item" data-category="race">
  <img src="assets/img/nuova-foto.jpg" alt="Descrizione">
  <div class="gallery-overlay">Titolo foto</div>
</div>
```

### Aggiornare risultati
Modifica la tabella in `index.html` sezione `#results`.

---

## 🎨 Colori

| Colore | Codice | Uso |
|--------|--------|-----|
| Blu scuro | `#082B5A` | Sfondi e testo principale |
| Bianco | `#FFFFFF` | Sfondo principale |
| Blu ghiaccio | `#43C3F0` | Dettagli e accenti chiari |
| Rosso corsa | `#E43A4B` | Accenti e bottoni |

Modifica in `assets/css/style.css` sezione `:root`.

---

## 📱 Responsive

Il sito è ottimizzato per:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1200px+)

---

## 🔧 Supporto tecnico

Per problemi o modifiche avanzate, contatta chi ha creato il sito.

**Versione:** 1.0  
**Data:** Settembre 2025  
**Licenza:** Uso personale

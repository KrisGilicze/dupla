# Dupla - Dobble Clone

Ein Dobble (Spot It!) Klon-Spiel mit eigenem Kartengenerator, gebaut mit React, TypeScript und Vite.

## 🎮 Spielen

**Live-Demo:** [https://krisgilicze.github.io/dupla/](https://krisgilicze.github.io/dupla/)

## 🎯 Spielprinzip

Dupla ist ein Reaktionsspiel basierend auf dem beliebten Kartenspiel Dobble. Finde das gemeinsame Symbol zwischen deiner Karte und der Zielkarte so schnell wie möglich!

### Spiel-Features

-   ⏱️ **20 Sekunden Countdown** - Die Zeit startet beim ersten Klick
-   ✅ **+1 Sekunde Bonus** bei richtiger Antwort
-   🎯 **+1 Punkt** für jedes richtig gefundene Symbol
-   ❌ **-2 Punkte Strafe** für falsche Antworten (außer beim ersten Versuch)
-   🏆 **Bestenliste** mit Top 10 Scores
-   🎨 **Farbige Symbole** mit visuellen Animationen
-   🔊 **Sound-Effekte** (aktivierbar/deaktivierbar)
-   👤 **Anpassbarer Spielername**
-   📱 **Mobile-Responsive** Design

### 🎴 Eigene Karten erstellen

Erstelle dein eigenes Dobble-Spiel mit persönlichen Fotos:

-   📸 **Bild-Upload** via Drag & Drop oder File Picker
-   ✨ **Automatische Kartengenerierung** basierend auf mathematischen Prinzipien
-   🎮 **Spielbar** mit eigenen Karten
-   💾 **Export als JSON** für späteren Import
-   🖨️ **Druckvorschau** für physische Karten
-   📊 **Echtzeit-Feedback** über gültige Symbolanzahl

**Unterstützte Kartengrößen:**
- 7 Symbole → 7 Karten mit je 3 Symbolen (n=2)
- 13 Symbole → 13 Karten mit je 4 Symbolen (n=3)
- 21 Symbole → 21 Karten mit je 5 Symbolen (n=4)
- 31 Symbole → 31 Karten mit je 6 Symbolen (n=5)
- 57 Symbole → 57 Karten mit je 8 Symbolen (n=7)

### Spielregeln

1. Du siehst zwei Karten: deine eigene (oben) und die Zielkarte (unten)
2. Jede Kartenpaarung hat **genau ein gemeinsames Symbol**
3. Klicke auf das gemeinsame Symbol auf der Zielkarte
4. Du hast 20 Sekunden Zeit - richtige Antworten geben +1 Sekunde
5. Game Over bei Score unter 0 oder wenn die Zeit abläuft

## 🔬 Mathematische Grundlagen

Das Spiel nutzt **projektive Ebenen** mit mathematisch garantierten Eigenschaften:

### Standard-Spiel (n=2 - Fano-Ebene)
-   **7 Symbole** insgesamt
-   **7 Karten** mit je **3 Symbolen**
-   Jede Kartenpaarung hat **genau 1 gemeinsames Symbol**

### Allgemeine Konstruktion
Für projektive Ebenen der Ordnung **n** gilt:
-   Anzahl Symbole: `n² + n + 1`
-   Anzahl Karten: `n² + n + 1`
-   Symbole pro Karte: `n + 1`
-   Gemeinsame Symbole pro Kartenpaar: **genau 1**

**Implementierte Ordnungen:** n ∈ {2, 3, 4, 5, 7}

Die Kartengenerierung nutzt:
- **Fano-Ebene** für n=2 (klassische Konstruktion)
- **Galois-Field-Arithmetik** für n=3,4,5,7 (Primzahlpotenzen)

> **Hinweis:** n=6 ist mathematisch nicht konstruierbar (Bruck-Ryser-Chowla-Theorem)

## 🛠️ Technologie-Stack

-   **React 19** - UI-Framework
-   **TypeScript** - Type Safety & Strict Mode
-   **Vite 7** - Build Tool & Dev Server
-   **Vitest** - Unit Testing (67 Tests)
-   **React Icons** - Symbol-Icons
-   **Web Audio API** - Sound-Generierung
-   **GitHub Pages** - Hosting
-   **GitHub Actions** - Automatisches Deployment

## 🚀 Lokale Entwicklung

```bash
# Dependencies installieren
npm install

# Dev-Server starten
npm run dev

# Tests ausführen
npm test

# Production Build
npm run build

# Build lokal testen
npm run preview
```

## 📦 Deployment

Das Projekt verwendet GitHub Actions für automatisches Deployment auf GitHub Pages. Bei jedem Push auf den `main` Branch wird die App automatisch gebaut und deployed.

## 🔮 Roadmap / Geplante Features

- [ ] **Edit Cards Layout** - UI zum Anpassen des Karten-Layouts (Symbol-Rotation, Position, Größe), Drag & Drop zum Neuanordnen, Template-Auswahl (kreisförmig, zufällig, grid)
- [ ] **Custom Cropping & Bild-Bearbeitung** - Crop-Tool für hochgeladene Bilder, Zoom, Filter, Helligkeit/Kontrast-Anpassung
- [ ] **LocalStorage Persistence** - Speicherung von Custom-Kartensets im Browser
- [ ] **Multiplayer Mode** - Zwei Spieler auf einem Bildschirm
- [ ] **Schwierigkeitsstufen** - Verschiedene Zeit-Limits und Punktesysteme

## 📊 Projekt-Struktur

```
src/
├── components/          # React-Komponenten
│   ├── Card.tsx        # Karten-Darstellung
│   ├── CardGallery.tsx # Karten-Browser
│   ├── CardExport.tsx  # Export/Import UI
│   ├── ImageUpload.tsx # Bild-Upload
│   └── SymbolCountFeedback.tsx
├── projectivePlane.ts  # Mathematik-Utilities
├── utils.ts            # Kartengenerierung
├── imageConverter.ts   # Bild → Symbol Konverter
├── exportCards.ts      # Export/Import Logik
├── types.ts            # TypeScript Definitionen
└── App.tsx             # Haupt-App
```

## 🧪 Testing

Das Projekt hat umfassende Unit-Tests für die mathematischen Funktionen:

```bash
npm test
```

**Test-Coverage:**
- ✅ Projektive Ebenen Berechnungen (48 Tests)
- ✅ Kartengenerierung & Validation (19 Tests)
- ✅ Familie Grüber Kartensatz (31 Symbole, 465 Paarvalidierungen)

## 📄 Lizenz

MIT

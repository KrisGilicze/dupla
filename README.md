# Dupla - Dobble Clone

Ein Dobble (Spot It!) Klon-Spiel, gebaut mit React, TypeScript und Vite.

## 🎮 Spielen

**Live-Demo:** [https://krisgilicze.github.io/dupla/](https://krisgilicze.github.io/dupla/)

## 🎯 Spielprinzip

Dupla ist ein Reaktionsspiel basierend auf dem beliebten Kartenspiel Dobble. Finde das gemeinsame Symbol zwischen deiner Karte und der Zielkarte so schnell wie möglich!

### Features

-   ⏱️ **20 Sekunden Countdown** - Die Zeit startet beim ersten Klick
-   ✅ **+1 Sekunde Bonus** bei richtiger Antwort
-   🎯 **+1 Punkt** für jedes richtig gefundene Symbol
-   ❌ **-2 Punkte Strafe** für falsche Antworten (außer beim ersten Versuch)
-   🏆 **Bestenliste** mit Top 10 Scores
-   🎨 **Farbige Symbole** mit visuellen Animationen
-   🔊 **Sound-Effekte** (aktivierbar/deaktivierbar)
-   👤 **Anpassbarer Spielername**

### Spielregeln

1. Du siehst zwei Karten: deine eigene (oben) und die Zielkarte (unten)
2. Jede Kartenpaarung hat **genau ein gemeinsames Symbol**
3. Klicke auf das gemeinsame Symbol auf der Zielkarte
4. Du hast 20 Sekunden Zeit - richtige Antworten geben +1 Sekunde
5. Game Over bei Score unter 0 oder wenn die Zeit abläuft

## 🔬 Mathematische Grundlagen

Das Spiel nutzt eine **Projektionsebene der Ordnung n=2** (Fano-Ebene):

-   **7 Symbole** insgesamt
-   **7 Karten** mit je **3 Symbolen**
-   Jede Kartenpaarung hat **genau 1 gemeinsames Symbol**

Dies basiert auf der Formel: `n² + n + 1 = 2² + 2 + 1 = 7`

## 🛠️ Technologie-Stack

-   **React 18** - UI-Framework
-   **TypeScript** - Type Safety
-   **Vite** - Build Tool & Dev Server
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

# Production Build
npm run build

# Build lokal testen
npm run preview
```

## 📦 Deployment

Das Projekt verwendet GitHub Actions für automatisches Deployment auf GitHub Pages. Bei jedem Push auf den `main` Branch wird die App automatisch gebaut und deployed.

## 📄 Lizenz

MIT

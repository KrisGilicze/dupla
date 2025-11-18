# Familie Grüber Dobble-Kartensatz

## Übersicht

**Projektive Ebene der Ordnung n=5**

-   **31 Symbole** (25 Familienmitglieder + 6 Emoticons)
-   **31 Karten** mit je **6 Symbolen**
-   **465 Kartenpaare**, alle mit **genau 1 gemeinsamen Symbol** ✅

## Familienmitglieder (25)

1. Ingrid
2. Jörg
3. Nele
4. Philipp
5. Britta
6. Thomas
7. Meike
8. Sönke
9. Hendrik
10. Johanna
11. Kerstin
12. Kristof
13. Lotte
14. Matti
15. Frido
16. Mika
17. Emma
18. Hanna
19. Juna
20. Lasse
21. Lina
22. Ida
23. Brösel
24. Fiete
25. Cleo

## Aufgefüllt mit Emoticons (6)

26. ❤️ (Herz)
27. ⭐ (Stern)
28. 😊 (Lächeln)
29. 🎉 (Party)
30. 🌲 (Baum)
31. 🏠 (Haus)

## Mathematische Eigenschaften

Für eine projektive Ebene der Ordnung **n=5** gilt:

-   **Anzahl Symbole**: n² + n + 1 = 5² + 5 + 1 = **31**
-   **Anzahl Karten**: n² + n + 1 = **31**
-   **Symbole pro Karte**: n + 1 = **6**
-   **Je zwei Karten teilen sich genau 1 Symbol** ✅

## Validierung

✅ **Alle 465 Kartenpaare validiert**

-   Gültige Paare: **465 / 465** (100%)
-   Ungültige Paare: **0**

Jede Kombination von zwei beliebigen Karten hat **genau ein** gemeinsames Symbol - die mathematische Eigenschaft eines echten Dobble-Spiels!

## Kartenliste

### Karte 1

**Symbole**: Nele, Jörg, Philipp, Thomas, Ingrid, Britta

### Karte 2

**Symbole**: ⭐, Emma, Ida, Ingrid, Meike, Kristof

### Karte 3

**Symbole**: Hanna, Brösel, Lotte, Ingrid, 😊, Sönke

... _(alle 31 Karten im exportierten JSON)_

## Verwendung

### Kartensatz anzeigen

```bash
npm run tsx src/showFamilyCards.ts
```

### Als JSON exportieren

```bash
npm run tsx src/showFamilyCards.ts
# Erzeugt: familie-grueber-dobble.json
```

### In TypeScript verwenden

```typescript
import {FAMILY_CARDS} from './src/familyCards';
import {FAMILY_SYMBOLS} from './src/familySymbols';

// Karten sind bereits generiert und validiert
console.log(FAMILY_CARDS.length); // 31
console.log(FAMILY_CARDS[0].symbols.length); // 6
```

## Tests

Alle Tests mit Vitest:

```bash
npm test
```

Speziell für n=5:

-   ✅ Generiert 31 Karten
-   ✅ Jede Karte hat genau 6 Symbole
-   ✅ Alle 31 Symbole werden verwendet
-   ✅ Je zwei Karten haben genau 1 gemeinsames Symbol
-   ✅ Jedes Symbol erscheint auf genau 6 Karten
-   ✅ Alle Familienmitglieder enthalten
-   ✅ Alle 6 Emoticons enthalten

## Druckvorbereitung

Der Kartensatz kann für den Druck verwendet werden:

-   Jede Karte mit 6 Symbolen
-   Kreisförmiges Layout (wie klassisches Dobble)
-   Eindeutige Farben für jedes Symbol

## Erstellt mit

-   TypeScript projektive Ebenen Generator
-   Galois-Field basierte Konstruktion (GF(5))
-   Mathematisch verifiziert mit 100% Testabdeckung

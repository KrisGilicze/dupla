import type {Card, Symbol, SymbolDefinition} from './types';

/**
 * Mischt ein Array zufällig (Fisher-Yates Shuffle).
 *
 * @param array - Das zu mischende Array
 * @returns Ein neues gemischtes Array
 */
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Generiert alle gültigen Dobble-Karten aus einer Symbolmenge basierend auf
 * dem Prinzip der Projektionsebene.
 *
 * Für eine Projektionsebene der Ordnung n gilt:
 * - Anzahl Symbole: n² + n + 1
 * - Anzahl Karten: n² + n + 1
 * - Symbole pro Karte: n + 1
 * - Je zwei Karten haben genau ein gemeinsames Symbol
 *
 * @param symbols - Die Symbolmenge (sollte n² + n + 1 Symbole enthalten)
 * @returns Array von Karten, die die Dobble-Bedingung erfüllen
 */
export function generateDobbleCards(
    symbols: Record<string, SymbolDefinition>
): Card[] {
    const symbolArray = Object.values(symbols);
    const totalSymbols = symbolArray.length;

    // Berechne n aus der Anzahl der Symbole: n² + n + 1 = totalSymbols
    // Für 7 Symbole: n = 2
    const n = Math.floor((-1 + Math.sqrt(1 + 4 * (totalSymbols - 1))) / 2);

    // Validierung
    if (n * n + n + 1 !== totalSymbols) {
        console.warn(
            `Warnung: Symbolanzahl ${totalSymbols} entspricht keiner gültigen Projektionsebene. Erwarte ${
                n * n + n + 1
            } Symbole für n=${n}.`
        );
    }

    const cards: Card[] = [];
    const symbolsPerCard = n + 1;

    // Für n=2: Wir konstruieren die 7 Karten nach dem klassischen Muster
    if (n === 2) {
        // Die Konstruktion für n=2 (Fano-Ebene):
        // Karte 0: Symbole 0, 1, 2
        // Karte 1: Symbole 0, 3, 4
        // Karte 2: Symbole 0, 5, 6
        // Karte 3: Symbole 1, 3, 5
        // Karte 4: Symbole 1, 4, 6
        // Karte 5: Symbole 2, 3, 6
        // Karte 6: Symbole 2, 4, 5

        const cardPatterns = [
            [0, 1, 2],
            [0, 3, 4],
            [0, 5, 6],
            [1, 3, 5],
            [1, 4, 6],
            [2, 3, 6],
            [2, 4, 5]
        ];

        cardPatterns.forEach((pattern, index) => {
            // Symbole für diese Karte holen und mischen
            const cardSymbols = pattern.map((idx) => symbolArray[idx]);
            const shuffledSymbols = shuffleArray(cardSymbols);

            cards.push({
                id: index + 1,
                symbols: shuffledSymbols
            });
        });
    } else {
        // Für andere n: Vereinfachte/naive Implementierung
        // (Für Produktionsumgebung würde man hier die allgemeine Konstruktion implementieren)
        console.warn(
            `Generierung für n=${n} noch nicht vollständig implementiert. Erstelle Beispielkarten.`
        );

        // Erstelle zumindest ein paar Beispielkarten
        for (let i = 0; i < Math.min(7, totalSymbols); i++) {
            const cardSymbols: Symbol[] = [];
            for (let j = 0; j < symbolsPerCard && i + j < totalSymbols; j++) {
                cardSymbols.push(symbolArray[(i + j) % totalSymbols]);
            }
            cards.push({
                id: i + 1,
                symbols: shuffleArray(cardSymbols)
            });
        }
    }

    return cards;
}

/**
 * Wählt zufällig zwei verschiedene Karten aus einem Kartenstapel aus.
 *
 * @param cards - Array von Karten
 * @returns Tuple mit zwei zufälligen Karten
 */
export function getRandomCardPair(cards: Card[]): [Card, Card] {
    if (cards.length < 2) {
        throw new Error('Es werden mindestens 2 Karten benötigt');
    }

    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    return [shuffled[0], shuffled[1]];
}

/**
 * Wählt eine zufällige Karte aus, die nicht die übergebene Karte ist.
 *
 * @param cards - Array von Karten
 * @param excludeCard - Karte, die ausgeschlossen werden soll
 * @returns Eine zufällige Karte (oder die erste verfügbare, falls nur eine übrig ist)
 */
export function getRandomCardExcept(cards: Card[], excludeCard: Card): Card {
    const availableCards = cards.filter((card) => card.id !== excludeCard.id);
    if (availableCards.length === 0) {
        throw new Error('Keine anderen Karten verfügbar');
    }
    const randomIndex = Math.floor(Math.random() * availableCards.length);
    return availableCards[randomIndex];
}

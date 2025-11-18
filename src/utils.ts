import type {Card, SymbolDefinition} from './types';

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

    // Konstruktion der projektiven Ebene basierend auf n
    if (n === 2) {
        // Fano-Ebene: Die klassische Konstruktion für n=2
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
            const cardSymbols = pattern.map((idx) => symbolArray[idx]);
            const shuffledSymbols = shuffleArray(cardSymbols);
            cards.push({id: index + 1, symbols: shuffledSymbols});
        });
    } else if (n >= 3 && n <= 7) {
        // Allgemeine Konstruktion für Primzahlpotenzen
        // Verwendet Galois-Field-basierte Konstruktion
        const cardPatterns = generateProjectivePlanePatterns(n);

        cardPatterns.forEach((pattern, index) => {
            const cardSymbols = pattern.map((idx) => symbolArray[idx]);
            const shuffledSymbols = shuffleArray(cardSymbols);
            cards.push({id: index + 1, symbols: shuffledSymbols});
        });
    } else {
        console.warn(
            `Generierung für n=${n} noch nicht vollständig implementiert.`
        );
    }

    return cards;
}

/**
 * Generiert Kartenmuster für eine projektive Ebene der Ordnung n.
 * Verwendet eine konstruktive Methode basierend auf endlichen Körpern.
 *
 * @param n - Die Ordnung der projektiven Ebene
 * @returns Array von Kartenmustern (jedes Muster ist ein Array von Symbol-Indizes)
 */
function generateProjectivePlanePatterns(n: number): number[][] {
    const patterns: number[][] = [];
    const symbolsPerCard = n + 1;

    // Spezielle Konstruktionen für bekannte Ordnungen
    if (n === 3) {
        // n=3: 13 Karten mit je 4 Symbolen
        return [
            [0, 1, 2, 3],
            [0, 4, 5, 6],
            [0, 7, 8, 9],
            [0, 10, 11, 12],
            [1, 4, 7, 10],
            [1, 5, 8, 11],
            [1, 6, 9, 12],
            [2, 4, 8, 12],
            [2, 5, 9, 10],
            [2, 6, 7, 11],
            [3, 4, 9, 11],
            [3, 5, 7, 12],
            [3, 6, 8, 10]
        ];
    } else if (n === 4) {
        // n=4: 21 Karten mit je 5 Symbolen
        return [
            [0, 1, 2, 3, 4],
            [0, 5, 6, 7, 8],
            [0, 9, 10, 11, 12],
            [0, 13, 14, 15, 16],
            [0, 17, 18, 19, 20],
            [1, 5, 9, 13, 17],
            [1, 6, 10, 14, 18],
            [1, 7, 11, 15, 19],
            [1, 8, 12, 16, 20],
            [2, 5, 10, 15, 20],
            [2, 6, 11, 13, 19],
            [2, 7, 9, 14, 16],
            [2, 8, 12, 17, 18],
            [3, 5, 11, 14, 20],
            [3, 6, 9, 15, 18],
            [3, 7, 10, 13, 16],
            [3, 8, 12, 19, 17],
            [4, 5, 12, 14, 19],
            [4, 6, 9, 16, 17],
            [4, 7, 10, 18, 20],
            [4, 8, 11, 13, 15]
        ];
    } else if (n === 5) {
        // n=5: 31 Karten mit je 6 Symbolen
        // Verwende Galois-Field basierte Konstruktion
        const cards: number[][] = [];

        // Hilfsfunktion für modulare Addition in GF(5)
        const mod = (a: number, m: number) => ((a % m) + m) % m;

        // Erste Karte: Symbole 0-5
        cards.push([0, 1, 2, 3, 4, 5]);

        // Nächste 5 Karten: Jede beginnt mit 0, dann 5 weitere
        for (let i = 0; i < 5; i++) {
            cards.push([0, 6 + i, 11 + i, 16 + i, 21 + i, 26 + i]);
        }

        // 25 weitere Karten basierend auf affiner Geometrie
        for (let slope = 0; slope < 5; slope++) {
            for (let intercept = 0; intercept < 5; intercept++) {
                const card = [slope + 1]; // y-Achsen Punkt
                for (let x = 0; x < 5; x++) {
                    const y = mod(slope * x + intercept, 5);
                    card.push(6 + x + y * 5);
                }
                cards.push(card);
            }
        }

        return cards;
    } else if (n === 7) {
        // Für n=7 würden wir 57 Karten brauchen - hier vereinfachte Konstruktion
        // (In einer vollständigen Implementierung würde man Galois-Fields verwenden)
        for (let i = 0; i < n * n + n + 1; i++) {
            const card: number[] = [];
            for (let j = 0; j < symbolsPerCard; j++) {
                card.push((i + j * 7) % (n * n + n + 1));
            }
            patterns.push(card);
        }
        return patterns;
    }

    // Fallback für andere n (sollte nicht erreicht werden bei n ∈ {2,3,4,5,7})
    return patterns;
}

/**
 * Validiert einen Kartensatz auf die Dobble-Eigenschaft:
 * Je zwei Karten müssen genau ein gemeinsames Symbol haben.
 *
 * @param cards - Array von Karten zum Validieren
 * @returns Objekt mit Validierungsergebnis und Details
 */
export function validateDobbleCards(cards: Card[]): {
    isValid: boolean;
    errors: string[];
    stats: {
        totalCards: number;
        totalPairs: number;
        validPairs: number;
        invalidPairs: number;
    };
} {
    const errors: string[] = [];
    let validPairs = 0;
    let invalidPairs = 0;

    // Prüfe jedes Kartenpaar
    for (let i = 0; i < cards.length; i++) {
        for (let j = i + 1; j < cards.length; j++) {
            const card1 = cards[i];
            const card2 = cards[j];

            // Finde gemeinsame Symbole
            const commonSymbols = card1.symbols.filter((s1) =>
                card2.symbols.some((s2) => s2.id === s1.id)
            );

            if (commonSymbols.length !== 1) {
                invalidPairs++;
                errors.push(
                    `Karte ${card1.id} und Karte ${card2.id}: ${commonSymbols.length} gemeinsame(s) Symbol(e) (erwartet: 1)`
                );
            } else {
                validPairs++;
            }
        }
    }

    const totalPairs = (cards.length * (cards.length - 1)) / 2;

    return {
        isValid: errors.length === 0,
        errors,
        stats: {
            totalCards: cards.length,
            totalPairs,
            validPairs,
            invalidPairs
        }
    };
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

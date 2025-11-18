/**
 * Mathematische Utilities für projektive Ebenen (Dobble/Spot It Kartengenerierung)
 *
 * Eine projektive Ebene der Ordnung n hat folgende Eigenschaften:
 * - Anzahl Symbole: n² + n + 1
 * - Anzahl Karten: n² + n + 1
 * - Symbole pro Karte: n + 1
 * - Je zwei Karten teilen sich genau ein Symbol
 *
 * Wichtig: Nicht alle n-Werte sind konstruierbar!
 * Gesichert konstruierbar sind nur Primzahlpotenzen (2, 3, 4, 5, 7, 8, 9, 11, ...)
 * n=6 ist NICHT konstruierbar (Bruck-Ryser-Chowla Theorem)
 */

/**
 * Liste der unterstützten projektiven Ebenenordnungen.
 * Beschränkt auf praktikable Werte für Spielkarten.
 */
export const SUPPORTED_ORDERS = [2, 3, 4, 5, 7] as const;
export type SupportedOrder = (typeof SUPPORTED_ORDERS)[number];

/**
 * Statistiken einer projektiven Ebene
 */
export interface ProjectivePlaneStats {
    /** Ordnung der projektiven Ebene */
    order: number;
    /** Anzahl benötigter Symbole */
    symbolCount: number;
    /** Anzahl generierbarer Karten */
    cardCount: number;
    /** Symbole pro Karte */
    symbolsPerCard: number;
}

/**
 * Berechnet die Anzahl der Symbole für eine projektive Ebene der Ordnung n.
 * Formel: n² + n + 1
 *
 * @param n - Die Ordnung der projektiven Ebene
 * @returns Anzahl der benötigten Symbole
 *
 * @example
 * calculateSymbolCount(2) // 7
 * calculateSymbolCount(3) // 13
 * calculateSymbolCount(5) // 31
 */
export function calculateSymbolCount(n: number): number {
    return n * n + n + 1;
}

/**
 * Berechnet die Anzahl der Karten für eine projektive Ebene der Ordnung n.
 * Formel: n² + n + 1 (identisch zur Symbolanzahl)
 *
 * @param n - Die Ordnung der projektiven Ebene
 * @returns Anzahl der generierbaren Karten
 *
 * @example
 * calculateCardCount(2) // 7
 * calculateCardCount(3) // 13
 */
export function calculateCardCount(n: number): number {
    return n * n + n + 1;
}

/**
 * Berechnet die Anzahl der Symbole pro Karte für eine projektive Ebene der Ordnung n.
 * Formel: n + 1
 *
 * @param n - Die Ordnung der projektiven Ebene
 * @returns Anzahl der Symbole pro Karte
 *
 * @example
 * calculateSymbolsPerCard(2) // 3
 * calculateSymbolsPerCard(3) // 4
 * calculateSymbolsPerCard(5) // 6
 */
export function calculateSymbolsPerCard(n: number): number {
    return n + 1;
}

/**
 * Prüft, ob eine gegebene Ordnung n eine unterstützte projektive Ebene ist.
 *
 * @param n - Die zu prüfende Ordnung
 * @returns true wenn n in SUPPORTED_ORDERS enthalten ist
 *
 * @example
 * isValidProjectivePlaneOrder(2) // true
 * isValidProjectivePlaneOrder(3) // true
 * isValidProjectivePlaneOrder(6) // false (nicht konstruierbar!)
 */
export function isValidProjectivePlaneOrder(n: number): n is SupportedOrder {
    return SUPPORTED_ORDERS.includes(n as SupportedOrder);
}

/**
 * Gibt alle unterstützten projektiven Ebenenordnungen zurück.
 *
 * @param maxN - Optional: maximale Ordnung (inklusiv)
 * @returns Array aller unterstützten n-Werte
 *
 * @example
 * getValidProjectivePlaneOrders() // [2, 3, 4, 5, 7]
 * getValidProjectivePlaneOrders(4) // [2, 3, 4]
 */
export function getValidProjectivePlaneOrders(maxN?: number): number[] {
    if (maxN === undefined) {
        return [...SUPPORTED_ORDERS];
    }
    return SUPPORTED_ORDERS.filter((n) => n <= maxN);
}

/**
 * Ergebnis der Suche nach passenden projektiven Ebenen
 */
export interface FindBestNResult {
    /** Exakte Übereinstimmung (falls vorhanden) */
    exact?: {
        order: number;
        symbolCount: number;
    };
    /** Nächstkleinere gültige Ordnung */
    smaller?: {
        order: number;
        symbolCount: number;
        /** Wie viele Symbole müssen entfernt werden */
        toRemove: number;
    };
    /** Nächstgrößere gültige Ordnung */
    larger?: {
        order: number;
        symbolCount: number;
        /** Wie viele Symbole müssen hinzugefügt werden */
        toAdd: number;
    };
}

/**
 * Findet die beste projektive Ebenenordnung für eine gegebene Symbolanzahl.
 * Gibt exakte Übereinstimmung sowie nächstkleinere und nächstgrößere Optionen zurück.
 *
 * @param symbolCount - Anzahl der verfügbaren Symbole
 * @returns Objekt mit exact, smaller und larger Optionen
 *
 * @example
 * findBestN(7)  // { exact: { order: 2, symbolCount: 7 }, smaller: undefined, larger: {...} }
 * findBestN(20) // { exact: undefined, smaller: { order: 3, symbolCount: 13, toRemove: 7 }, larger: { order: 4, symbolCount: 21, toAdd: 1 } }
 */
export function findBestN(symbolCount: number): FindBestNResult {
    const result: FindBestNResult = {};

    // Prüfe alle unterstützten Ordnungen
    for (const n of SUPPORTED_ORDERS) {
        const requiredSymbols = calculateSymbolCount(n);

        if (requiredSymbols === symbolCount) {
            // Exakte Übereinstimmung gefunden
            result.exact = {
                order: n,
                symbolCount: requiredSymbols
            };
            // Weiter suchen für larger Option
        } else if (requiredSymbols < symbolCount) {
            // Diese Ordnung ist kleiner als die verfügbaren Symbole
            result.smaller = {
                order: n,
                symbolCount: requiredSymbols,
                toRemove: symbolCount - requiredSymbols
            };
        } else if (requiredSymbols > symbolCount && !result.larger) {
            // Diese Ordnung ist größer - erste größere Option merken
            result.larger = {
                order: n,
                symbolCount: requiredSymbols,
                toAdd: requiredSymbols - symbolCount
            };
            // Wenn wir exact und larger haben, können wir aufhören
            if (result.exact) break;
        }
    }

    return result;
}

/**
 * Berechnet alle statistischen Kennzahlen für eine projektive Ebene der Ordnung n.
 *
 * @param n - Die Ordnung der projektiven Ebene
 * @returns Objekt mit allen Statistiken
 * @throws Error wenn n keine unterstützte Ordnung ist
 *
 * @example
 * getProjectivePlaneStats(2)
 * // { order: 2, symbolCount: 7, cardCount: 7, symbolsPerCard: 3 }
 */
export function getProjectivePlaneStats(n: number): ProjectivePlaneStats {
    if (!isValidProjectivePlaneOrder(n)) {
        throw new Error(
            `Ordnung ${n} ist nicht unterstützt. Gültige Ordnungen: ${SUPPORTED_ORDERS.join(
                ', '
            )}`
        );
    }

    return {
        order: n,
        symbolCount: calculateSymbolCount(n),
        cardCount: calculateCardCount(n),
        symbolsPerCard: calculateSymbolsPerCard(n)
    };
}

/**
 * Berechnet alle möglichen projektiven Ebenen mit ihren Statistiken.
 *
 * @returns Array aller unterstützten projektiven Ebenen mit Statistiken
 *
 * @example
 * getAllProjectivePlaneStats()
 * // [
 * //   { order: 2, symbolCount: 7, cardCount: 7, symbolsPerCard: 3 },
 * //   { order: 3, symbolCount: 13, cardCount: 13, symbolsPerCard: 4 },
 * //   ...
 * // ]
 */
export function getAllProjectivePlaneStats(): ProjectivePlaneStats[] {
    return SUPPORTED_ORDERS.map((n) => getProjectivePlaneStats(n));
}

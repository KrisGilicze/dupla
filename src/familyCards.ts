import {generateDobbleCards, validateDobbleCards} from './utils';
import {FAMILY_SYMBOLS} from './familySymbols';

/**
 * Generierter Dobble-Kartensatz für Familie Grüber
 * 31 Symbole (25 Familienmitglieder + 6 Emoticons)
 * 31 Karten mit je 6 Symbolen
 * Projektive Ebene der Ordnung n=5
 */
export const FAMILY_CARDS = generateDobbleCards(FAMILY_SYMBOLS);

// Validierung beim Import (optional)
const validation = validateDobbleCards(FAMILY_CARDS);
if (!validation.isValid) {
    console.error('Familie Grüber Kartensatz ist ungültig!', validation.errors);
}

/**
 * Exportiert den Kartensatz als JSON für externe Verwendung
 */
export function exportFamilyCardsAsJSON(): string {
    return JSON.stringify(
        {
            name: 'Familie Grüber Dobble Set',
            order: 5,
            totalSymbols: 31,
            totalCards: 31,
            symbolsPerCard: 6,
            created: new Date().toISOString(),
            cards: FAMILY_CARDS.map((card) => ({
                id: card.id,
                symbols: card.symbols.map((s) => ({
                    id: s.id,
                    name: s.name,
                    color: s.color
                }))
            }))
        },
        null,
        2
    );
}

/**
 * Gibt eine lesbare Übersicht aller Karten aus
 */
export function printFamilyCards(): void {
    console.log('\n=== Familie Grüber Dobble-Kartensatz ===\n');
    console.log(`Projektive Ebene der Ordnung n=5`);
    console.log(`31 Symbole (25 Familienmitglieder + 6 Emoticons)`);
    console.log(`31 Karten mit je 6 Symbolen\n`);

    FAMILY_CARDS.forEach((card) => {
        const symbolNames = card.symbols.map((s) => s.name).join(', ');
        console.log(`Karte ${card.id}: ${symbolNames}`);
    });

    console.log('\n=== Validierung ===');
    const validation = validateDobbleCards(FAMILY_CARDS);
    console.log(`Gültig: ${validation.isValid ? '✅' : '❌'}`);
    console.log(`Geprüfte Kartenpaare: ${validation.stats.totalPairs}`);
    console.log(`Gültige Paare: ${validation.stats.validPairs}`);
    console.log(`Ungültige Paare: ${validation.stats.invalidPairs}`);
}

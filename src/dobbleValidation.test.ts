import {describe, it, expect} from 'vitest';
import {generateDobbleCards, validateDobbleCards} from './utils';
import {SYMBOLS} from './types';
import {FAMILY_SYMBOLS} from './familySymbols';

describe('Dobble Card Generation and Validation', () => {
    describe('validateDobbleCards', () => {
        it('validiert n=2 (Fano-Ebene) korrekt', () => {
            const cards = generateDobbleCards(SYMBOLS);
            const validation = validateDobbleCards(cards);

            expect(validation.isValid).toBe(true);
            expect(validation.errors).toHaveLength(0);
            expect(validation.stats.totalCards).toBe(7);
            expect(validation.stats.totalPairs).toBe(21); // 7 * 6 / 2
            expect(validation.stats.validPairs).toBe(21);
            expect(validation.stats.invalidPairs).toBe(0);
        });

        it('validiert n=5 (Familie Grüber, 31 Symbole) korrekt', () => {
            const cards = generateDobbleCards(FAMILY_SYMBOLS);
            const validation = validateDobbleCards(cards);

            expect(validation.isValid).toBe(true);
            expect(validation.errors).toHaveLength(0);
            expect(validation.stats.totalCards).toBe(31);
            expect(validation.stats.totalPairs).toBe(465); // 31 * 30 / 2
            expect(validation.stats.validPairs).toBe(465);
            expect(validation.stats.invalidPairs).toBe(0);
        });

        it('erkennt ungültige Karten (zu viele gemeinsame Symbole)', () => {
            const invalidCards = [
                {
                    id: 1,
                    symbols: [
                        {id: 'a', name: 'A', icon: () => null, color: '#000'},
                        {id: 'b', name: 'B', icon: () => null, color: '#000'},
                        {id: 'c', name: 'C', icon: () => null, color: '#000'}
                    ]
                },
                {
                    id: 2,
                    symbols: [
                        {id: 'a', name: 'A', icon: () => null, color: '#000'},
                        {id: 'b', name: 'B', icon: () => null, color: '#000'},
                        {id: 'd', name: 'D', icon: () => null, color: '#000'}
                    ]
                }
            ];

            const validation = validateDobbleCards(invalidCards);
            expect(validation.isValid).toBe(false);
            expect(validation.errors.length).toBeGreaterThan(0);
            expect(validation.stats.invalidPairs).toBe(1);
        });

        it('erkennt ungültige Karten (keine gemeinsamen Symbole)', () => {
            const invalidCards = [
                {
                    id: 1,
                    symbols: [
                        {id: 'a', name: 'A', icon: () => null, color: '#000'},
                        {id: 'b', name: 'B', icon: () => null, color: '#000'}
                    ]
                },
                {
                    id: 2,
                    symbols: [
                        {id: 'c', name: 'C', icon: () => null, color: '#000'},
                        {id: 'd', name: 'D', icon: () => null, color: '#000'}
                    ]
                }
            ];

            const validation = validateDobbleCards(invalidCards);
            expect(validation.isValid).toBe(false);
            expect(validation.errors).toContain(
                'Karte 1 und Karte 2: 0 gemeinsame(s) Symbol(e) (erwartet: 1)'
            );
        });
    });

    describe('generateDobbleCards für n=2', () => {
        it('generiert 7 Karten für 7 Symbole', () => {
            const cards = generateDobbleCards(SYMBOLS);
            expect(cards).toHaveLength(7);
        });

        it('jede Karte hat genau 3 Symbole', () => {
            const cards = generateDobbleCards(SYMBOLS);
            cards.forEach((card) => {
                expect(card.symbols).toHaveLength(3);
            });
        });

        it('alle Karten haben eindeutige IDs', () => {
            const cards = generateDobbleCards(SYMBOLS);
            const ids = cards.map((c) => c.id);
            const uniqueIds = new Set(ids);
            expect(uniqueIds.size).toBe(cards.length);
        });

        it('je zwei Karten haben genau ein gemeinsames Symbol', () => {
            const cards = generateDobbleCards(SYMBOLS);

            for (let i = 0; i < cards.length; i++) {
                for (let j = i + 1; j < cards.length; j++) {
                    const commonSymbols = cards[i].symbols.filter((s1) =>
                        cards[j].symbols.some((s2) => s2.id === s1.id)
                    );
                    expect(commonSymbols).toHaveLength(1);
                }
            }
        });
    });

    describe('generateDobbleCards für n=5 (Familie Grüber)', () => {
        it('generiert 31 Karten für 31 Symbole', () => {
            const cards = generateDobbleCards(FAMILY_SYMBOLS);
            expect(cards).toHaveLength(31);
        });

        it('jede Karte hat genau 6 Symbole (n+1 für n=5)', () => {
            const cards = generateDobbleCards(FAMILY_SYMBOLS);
            cards.forEach((card) => {
                expect(card.symbols).toHaveLength(6);
            });
        });

        it('alle 31 Symbole werden verwendet', () => {
            const cards = generateDobbleCards(FAMILY_SYMBOLS);
            const usedSymbolIds = new Set<string>();

            cards.forEach((card) => {
                card.symbols.forEach((symbol) => {
                    usedSymbolIds.add(symbol.id);
                });
            });

            expect(usedSymbolIds.size).toBe(31);
        });

        it('je zwei Karten haben genau ein gemeinsames Symbol', () => {
            const cards = generateDobbleCards(FAMILY_SYMBOLS);

            // Teste alle Paare
            for (let i = 0; i < cards.length; i++) {
                for (let j = i + 1; j < cards.length; j++) {
                    const card1 = cards[i];
                    const card2 = cards[j];

                    const commonSymbols = card1.symbols.filter((s1) =>
                        card2.symbols.some((s2) => s2.id === s1.id)
                    );

                    expect(commonSymbols).toHaveLength(1);
                }
            }
        });

        it('enthält alle Familienmitglieder', () => {
            const cards = generateDobbleCards(FAMILY_SYMBOLS);
            const allSymbolIds = cards.flatMap((card) =>
                card.symbols.map((s) => s.id)
            );

            const familyMembers = [
                'ingrid',
                'joerg',
                'nele',
                'philipp',
                'britta',
                'thomas',
                'meike',
                'soenke',
                'hendrik',
                'johanna',
                'kerstin',
                'kristof',
                'lotte',
                'matti',
                'frido',
                'mika',
                'emma',
                'hanna',
                'juna',
                'lasse',
                'lina',
                'ida',
                'broesel',
                'fiete',
                'cleo'
            ];

            familyMembers.forEach((member) => {
                expect(allSymbolIds).toContain(member);
            });
        });

        it('enthält die 6 Emoticons', () => {
            const cards = generateDobbleCards(FAMILY_SYMBOLS);
            const allSymbolIds = cards.flatMap((card) =>
                card.symbols.map((s) => s.id)
            );

            const emoticons = [
                'heart',
                'star',
                'smile',
                'party',
                'tree',
                'home'
            ];

            emoticons.forEach((emoji) => {
                expect(allSymbolIds).toContain(emoji);
            });
        });

        it('jedes Symbol erscheint auf genau 6 Karten (n+1 für n=5)', () => {
            const cards = generateDobbleCards(FAMILY_SYMBOLS);
            const symbolCounts = new Map<string, number>();

            cards.forEach((card) => {
                card.symbols.forEach((symbol) => {
                    symbolCounts.set(
                        symbol.id,
                        (symbolCounts.get(symbol.id) || 0) + 1
                    );
                });
            });

            // Jedes Symbol sollte auf genau n+1 = 6 Karten erscheinen
            symbolCounts.forEach((count) => {
                expect(count).toBe(6);
            });
        });
    });

    describe('Mathematische Eigenschaften', () => {
        it('Anzahl der Karten entspricht n²+n+1 für n=2', () => {
            const cards = generateDobbleCards(SYMBOLS);
            const n = 2;
            expect(cards.length).toBe(n * n + n + 1);
        });

        it('Anzahl der Karten entspricht n²+n+1 für n=5', () => {
            const cards = generateDobbleCards(FAMILY_SYMBOLS);
            const n = 5;
            expect(cards.length).toBe(n * n + n + 1);
        });

        it('Symbole pro Karte entspricht n+1 für n=2', () => {
            const cards = generateDobbleCards(SYMBOLS);
            const n = 2;
            expect(cards[0].symbols.length).toBe(n + 1);
        });

        it('Symbole pro Karte entspricht n+1 für n=5', () => {
            const cards = generateDobbleCards(FAMILY_SYMBOLS);
            const n = 5;
            expect(cards[0].symbols.length).toBe(n + 1);
        });
    });
});

import {describe, it, expect} from 'vitest';
import {
    calculateSymbolCount,
    calculateCardCount,
    calculateSymbolsPerCard,
    isValidProjectivePlaneOrder,
    getValidProjectivePlaneOrders,
    findBestN,
    getProjectivePlaneStats,
    getAllProjectivePlaneStats,
    SUPPORTED_ORDERS
} from '../lib/projectivePlane';

describe('projectivePlane utils', () => {
    describe('calculateSymbolCount', () => {
        it('berechnet korrekt für n=2', () => {
            expect(calculateSymbolCount(2)).toBe(7);
        });

        it('berechnet korrekt für n=3', () => {
            expect(calculateSymbolCount(3)).toBe(13);
        });

        it('berechnet korrekt für n=4', () => {
            expect(calculateSymbolCount(4)).toBe(21);
        });

        it('berechnet korrekt für n=5', () => {
            expect(calculateSymbolCount(5)).toBe(31);
        });

        it('berechnet korrekt für n=7', () => {
            expect(calculateSymbolCount(7)).toBe(57);
        });

        it('verwendet die Formel n² + n + 1 korrekt', () => {
            const n = 10;
            expect(calculateSymbolCount(n)).toBe(n * n + n + 1);
        });
    });

    describe('calculateCardCount', () => {
        it('gibt denselben Wert wie calculateSymbolCount zurück', () => {
            for (const n of SUPPORTED_ORDERS) {
                expect(calculateCardCount(n)).toBe(calculateSymbolCount(n));
            }
        });

        it('berechnet korrekt für n=2', () => {
            expect(calculateCardCount(2)).toBe(7);
        });

        it('berechnet korrekt für n=5', () => {
            expect(calculateCardCount(5)).toBe(31);
        });
    });

    describe('calculateSymbolsPerCard', () => {
        it('berechnet korrekt für n=2', () => {
            expect(calculateSymbolsPerCard(2)).toBe(3);
        });

        it('berechnet korrekt für n=3', () => {
            expect(calculateSymbolsPerCard(3)).toBe(4);
        });

        it('berechnet korrekt für n=4', () => {
            expect(calculateSymbolsPerCard(4)).toBe(5);
        });

        it('berechnet korrekt für n=5', () => {
            expect(calculateSymbolsPerCard(5)).toBe(6);
        });

        it('berechnet korrekt für n=7', () => {
            expect(calculateSymbolsPerCard(7)).toBe(8);
        });

        it('verwendet die Formel n + 1 korrekt', () => {
            const n = 10;
            expect(calculateSymbolsPerCard(n)).toBe(n + 1);
        });
    });

    describe('isValidProjectivePlaneOrder', () => {
        it('gibt true für alle unterstützten Ordnungen zurück', () => {
            expect(isValidProjectivePlaneOrder(2)).toBe(true);
            expect(isValidProjectivePlaneOrder(3)).toBe(true);
            expect(isValidProjectivePlaneOrder(4)).toBe(true);
            expect(isValidProjectivePlaneOrder(5)).toBe(true);
            expect(isValidProjectivePlaneOrder(7)).toBe(true);
        });

        it('gibt false für nicht unterstützte Ordnungen zurück', () => {
            expect(isValidProjectivePlaneOrder(0)).toBe(false);
            expect(isValidProjectivePlaneOrder(1)).toBe(false);
            expect(isValidProjectivePlaneOrder(6)).toBe(false); // Nicht konstruierbar!
            expect(isValidProjectivePlaneOrder(8)).toBe(false);
            expect(isValidProjectivePlaneOrder(10)).toBe(false);
            expect(isValidProjectivePlaneOrder(100)).toBe(false);
        });

        it('gibt false für negative Zahlen zurück', () => {
            expect(isValidProjectivePlaneOrder(-1)).toBe(false);
            expect(isValidProjectivePlaneOrder(-5)).toBe(false);
        });
    });

    describe('getValidProjectivePlaneOrders', () => {
        it('gibt alle unterstützten Ordnungen ohne maxN zurück', () => {
            expect(getValidProjectivePlaneOrders()).toEqual([2, 3, 4, 5, 7]);
        });

        it('filtert korrekt mit maxN=3', () => {
            expect(getValidProjectivePlaneOrders(3)).toEqual([2, 3]);
        });

        it('filtert korrekt mit maxN=5', () => {
            expect(getValidProjectivePlaneOrders(5)).toEqual([2, 3, 4, 5]);
        });

        it('gibt leeres Array für maxN=1 zurück', () => {
            expect(getValidProjectivePlaneOrders(1)).toEqual([]);
        });

        it('gibt alle Ordnungen für sehr großes maxN zurück', () => {
            expect(getValidProjectivePlaneOrders(100)).toEqual([2, 3, 4, 5, 7]);
        });
    });

    describe('findBestN', () => {
        it('findet exakte Übereinstimmung für 7 Symbole (n=2)', () => {
            const result = findBestN(7);
            expect(result.exact).toEqual({order: 2, symbolCount: 7});
            expect(result.smaller).toBeUndefined();
            expect(result.larger).toBeDefined();
        });

        it('findet exakte Übereinstimmung für 13 Symbole (n=3)', () => {
            const result = findBestN(13);
            expect(result.exact).toEqual({order: 3, symbolCount: 13});
        });

        it('findet exakte Übereinstimmung für 21 Symbole (n=4)', () => {
            const result = findBestN(21);
            expect(result.exact).toEqual({order: 4, symbolCount: 21});
        });

        it('findet exakte Übereinstimmung für 31 Symbole (n=5)', () => {
            const result = findBestN(31);
            expect(result.exact).toEqual({order: 5, symbolCount: 31});
        });

        it('findet exakte Übereinstimmung für 57 Symbole (n=7)', () => {
            const result = findBestN(57);
            expect(result.exact).toEqual({order: 7, symbolCount: 57});
        });

        it('findet smaller und larger für 20 Symbole', () => {
            const result = findBestN(20);
            expect(result.exact).toBeUndefined();
            expect(result.smaller).toEqual({
                order: 3,
                symbolCount: 13,
                toRemove: 7
            });
            expect(result.larger).toEqual({
                order: 4,
                symbolCount: 21,
                toAdd: 1
            });
        });

        it('findet smaller und larger für 10 Symbole', () => {
            const result = findBestN(10);
            expect(result.exact).toBeUndefined();
            expect(result.smaller).toEqual({
                order: 2,
                symbolCount: 7,
                toRemove: 3
            });
            expect(result.larger).toEqual({
                order: 3,
                symbolCount: 13,
                toAdd: 3
            });
        });

        it('findet nur larger für 5 Symbole (weniger als kleinste Ordnung)', () => {
            const result = findBestN(5);
            expect(result.exact).toBeUndefined();
            expect(result.smaller).toBeUndefined();
            expect(result.larger).toEqual({
                order: 2,
                symbolCount: 7,
                toAdd: 2
            });
        });

        it('findet nur smaller für 60 Symbole (mehr als größte Ordnung)', () => {
            const result = findBestN(60);
            expect(result.exact).toBeUndefined();
            expect(result.smaller).toEqual({
                order: 7,
                symbolCount: 57,
                toRemove: 3
            });
            expect(result.larger).toBeUndefined();
        });

        it('findet smaller und larger für 25 Symbole (zwischen n=4 und n=5)', () => {
            const result = findBestN(25);
            expect(result.exact).toBeUndefined();
            expect(result.smaller).toEqual({
                order: 4,
                symbolCount: 21,
                toRemove: 4
            });
            expect(result.larger).toEqual({
                order: 5,
                symbolCount: 31,
                toAdd: 6
            });
        });

        it('behandelt 1 Symbol korrekt', () => {
            const result = findBestN(1);
            expect(result.exact).toBeUndefined();
            expect(result.smaller).toBeUndefined();
            expect(result.larger).toBeDefined();
        });
    });

    describe('getProjectivePlaneStats', () => {
        it('gibt korrekte Statistiken für n=2 zurück', () => {
            const stats = getProjectivePlaneStats(2);
            expect(stats).toEqual({
                order: 2,
                symbolCount: 7,
                cardCount: 7,
                symbolsPerCard: 3
            });
        });

        it('gibt korrekte Statistiken für n=3 zurück', () => {
            const stats = getProjectivePlaneStats(3);
            expect(stats).toEqual({
                order: 3,
                symbolCount: 13,
                cardCount: 13,
                symbolsPerCard: 4
            });
        });

        it('gibt korrekte Statistiken für n=5 zurück', () => {
            const stats = getProjectivePlaneStats(5);
            expect(stats).toEqual({
                order: 5,
                symbolCount: 31,
                cardCount: 31,
                symbolsPerCard: 6
            });
        });

        it('wirft Fehler für nicht unterstützte Ordnung n=6', () => {
            expect(() => getProjectivePlaneStats(6)).toThrow(
                'Ordnung 6 ist nicht unterstützt'
            );
        });

        it('wirft Fehler für n=0', () => {
            expect(() => getProjectivePlaneStats(0)).toThrow();
        });

        it('wirft Fehler für n=10', () => {
            expect(() => getProjectivePlaneStats(10)).toThrow();
        });
    });

    describe('getAllProjectivePlaneStats', () => {
        it('gibt Statistiken für alle unterstützten Ordnungen zurück', () => {
            const allStats = getAllProjectivePlaneStats();
            expect(allStats).toHaveLength(5);
            expect(allStats[0].order).toBe(2);
            expect(allStats[1].order).toBe(3);
            expect(allStats[2].order).toBe(4);
            expect(allStats[3].order).toBe(5);
            expect(allStats[4].order).toBe(7);
        });

        it('enthält korrekte Daten für jede Ordnung', () => {
            const allStats = getAllProjectivePlaneStats();
            allStats.forEach((stats) => {
                expect(stats.symbolCount).toBe(
                    stats.order * stats.order + stats.order + 1
                );
                expect(stats.cardCount).toBe(stats.symbolCount);
                expect(stats.symbolsPerCard).toBe(stats.order + 1);
            });
        });
    });

    describe('Integration Tests', () => {
        it('alle Funktionen arbeiten konsistent zusammen', () => {
            for (const n of SUPPORTED_ORDERS) {
                const symbolCount = calculateSymbolCount(n);
                const cardCount = calculateCardCount(n);
                const symbolsPerCard = calculateSymbolsPerCard(n);
                const stats = getProjectivePlaneStats(n);

                expect(stats.order).toBe(n);
                expect(stats.symbolCount).toBe(symbolCount);
                expect(stats.cardCount).toBe(cardCount);
                expect(stats.symbolsPerCard).toBe(symbolsPerCard);
            }
        });

        it('findBestN findet alle exakten Übereinstimmungen', () => {
            for (const n of SUPPORTED_ORDERS) {
                const symbolCount = calculateSymbolCount(n);
                const result = findBestN(symbolCount);
                expect(result.exact).toBeDefined();
                expect(result.exact?.order).toBe(n);
            }
        });
    });

    describe('Mathematische Eigenschaften', () => {
        it('symbolCount und cardCount sind immer gleich', () => {
            for (const n of SUPPORTED_ORDERS) {
                expect(calculateSymbolCount(n)).toBe(calculateCardCount(n));
            }
        });

        it('symbolCount ist immer ungerade (für n>0)', () => {
            for (const n of SUPPORTED_ORDERS) {
                expect(calculateSymbolCount(n) % 2).toBe(1);
            }
        });

        it('symbolsPerCard ist immer kleiner als symbolCount', () => {
            for (const n of SUPPORTED_ORDERS) {
                expect(calculateSymbolsPerCard(n)).toBeLessThan(
                    calculateSymbolCount(n)
                );
            }
        });

        it('symbolCount wächst quadratisch', () => {
            // Für n=2: 7, n=3: 13, n=4: 21, n=5: 31, n=7: 57
            expect(calculateSymbolCount(3) - calculateSymbolCount(2)).toBe(6);
            expect(calculateSymbolCount(4) - calculateSymbolCount(3)).toBe(8);
            expect(calculateSymbolCount(5) - calculateSymbolCount(4)).toBe(10);
        });
    });
});

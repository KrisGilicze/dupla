import type {Card} from './types';
import {SYMBOLS} from './types';

// Beispielkarten mit je 3 Symbolen
// Gemeinsames Symbol: Kreis
export const card1: Card = {
    id: 1,
    symbols: [SYMBOLS.CIRCLE, SYMBOLS.TRIANGLE, SYMBOLS.SQUARE]
};

export const card2: Card = {
    id: 2,
    symbols: [SYMBOLS.CIRCLE, SYMBOLS.STAR, SYMBOLS.HEART]
};

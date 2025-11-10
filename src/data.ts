import type {Card} from './types';
import {SYMBOLS} from './types';
import {generateDobbleCards} from './utils';

// Generiere alle gültigen Dobble-Karten aus der Symbolmenge
export const allCards: Card[] = generateDobbleCards(SYMBOLS);

// Für Abwärtskompatibilität: Erste zwei Karten
export const card1 = allCards[0];
export const card2 = allCards[1];

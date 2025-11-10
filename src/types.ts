// Symbolmenge für Dobble
export const SYMBOLS = {
    CIRCLE: 'Kreis',
    TRIANGLE: 'Dreieck',
    SQUARE: 'Quadrat',
    PENTAGON: 'Fünfeck',
    HEXAGON: 'Sechseck',
    STAR: 'Stern',
    HEART: 'Herz'
} as const;

export type Symbol = (typeof SYMBOLS)[keyof typeof SYMBOLS];

export interface Card {
    id: number;
    symbols: Symbol[];
}

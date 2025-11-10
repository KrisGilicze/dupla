import type {IconType} from 'react-icons';
import {FaCircle, FaStar, FaHeart} from 'react-icons/fa';
import {FaSquare, FaPlay as FaTriangle} from 'react-icons/fa6';
import {TbPentagon, TbHexagon} from 'react-icons/tb';

// Symbol-Definitionen mit Icon-Komponenten
export interface SymbolDefinition {
    id: string;
    name: string;
    icon: IconType;
    color: string;
}

export const SYMBOLS: Record<string, SymbolDefinition> = {
    CIRCLE: {id: 'circle', name: 'Kreis', icon: FaCircle, color: '#ff4444'},
    TRIANGLE: {
        id: 'triangle',
        name: 'Dreieck',
        icon: FaTriangle,
        color: '#44ff44'
    },
    SQUARE: {id: 'square', name: 'Quadrat', icon: FaSquare, color: '#4444ff'},
    PENTAGON: {
        id: 'pentagon',
        name: 'Fünfeck',
        icon: TbPentagon,
        color: '#ffaa00'
    },
    HEXAGON: {
        id: 'hexagon',
        name: 'Sechseck',
        icon: TbHexagon,
        color: '#ff44ff'
    },
    STAR: {id: 'star', name: 'Stern', icon: FaStar, color: '#ffff44'},
    HEART: {id: 'heart', name: 'Herz', icon: FaHeart, color: '#44ffff'}
};

export type Symbol = SymbolDefinition;

export interface Card {
    id: number;
    symbols: Symbol[];
}

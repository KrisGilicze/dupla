import type {SymbolDefinition} from '../types';
import {FaCircle} from 'react-icons/fa';

/**
 * Familie Grüber Symbole
 * 25 Familienmitglieder + 6 Emoticons = 31 Symbole für n=5
 */
export const FAMILY_SYMBOLS: Record<string, SymbolDefinition> = {
    // Familienmitglieder (25)
    INGRID: {
        id: 'ingrid',
        name: 'Ingrid',
        icon: FaCircle,
        color: '#FF6B6B'
    },
    JOERG: {id: 'joerg', name: 'Jörg', icon: FaCircle, color: '#4ECDC4'},
    NELE: {id: 'nele', name: 'Nele', icon: FaCircle, color: '#45B7D1'},
    PHILIPP: {
        id: 'philipp',
        name: 'Philipp',
        icon: FaCircle,
        color: '#FFA07A'
    },
    BRITTA: {id: 'britta', name: 'Britta', icon: FaCircle, color: '#98D8C8'},
    THOMAS: {id: 'thomas', name: 'Thomas', icon: FaCircle, color: '#F7DC6F'},
    MEIKE: {id: 'meike', name: 'Meike', icon: FaCircle, color: '#BB8FCE'},
    SOENKE: {id: 'soenke', name: 'Sönke', icon: FaCircle, color: '#85C1E2'},
    HENDRIK: {
        id: 'hendrik',
        name: 'Hendrik',
        icon: FaCircle,
        color: '#F8B739'
    },
    JOHANNA: {
        id: 'johanna',
        name: 'Johanna',
        icon: FaCircle,
        color: '#52B788'
    },
    KERSTIN: {
        id: 'kerstin',
        name: 'Kerstin',
        icon: FaCircle,
        color: '#E76F51'
    },
    KRISTOF: {
        id: 'kristof',
        name: 'Kristof',
        icon: FaCircle,
        color: '#2A9D8F'
    },
    LOTTE: {id: 'lotte', name: 'Lotte', icon: FaCircle, color: '#E9C46A'},
    MATTI: {id: 'matti', name: 'Matti', icon: FaCircle, color: '#F4A261'},
    FRIDO: {id: 'frido', name: 'Frido', icon: FaCircle, color: '#264653'},
    MIKA: {id: 'mika', name: 'Mika', icon: FaCircle, color: '#A8DADC'},
    EMMA: {id: 'emma', name: 'Emma', icon: FaCircle, color: '#457B9D'},
    HANNA: {id: 'hanna', name: 'Hanna', icon: FaCircle, color: '#F1FAEE'},
    JUNA: {id: 'juna', name: 'Juna', icon: FaCircle, color: '#E63946'},
    LASSE: {id: 'lasse', name: 'Lasse', icon: FaCircle, color: '#06FFA5'},
    LINA: {id: 'lina', name: 'Lina', icon: FaCircle, color: '#FFBE0B'},
    IDA: {id: 'ida', name: 'Ida', icon: FaCircle, color: '#FB5607'},
    BROESEL: {
        id: 'broesel',
        name: 'Brösel',
        icon: FaCircle,
        color: '#FF006E'
    },
    FIETE: {id: 'fiete', name: 'Fiete', icon: FaCircle, color: '#8338EC'},
    CLEO: {id: 'cleo', name: 'Cleo', icon: FaCircle, color: '#3A86FF'},

    // Emoticons zum Auffüllen (6)
    HEART_EMOJI: {
        id: 'heart',
        name: '❤️',
        icon: FaCircle,
        color: '#FF1744'
    },
    STAR_EMOJI: {id: 'star', name: '⭐', icon: FaCircle, color: '#FFD700'},
    SMILE_EMOJI: {
        id: 'smile',
        name: '😊',
        icon: FaCircle,
        color: '#FFC107'
    },
    PARTY_EMOJI: {
        id: 'party',
        name: '🎉',
        icon: FaCircle,
        color: '#FF5722'
    },
    TREE_EMOJI: {id: 'tree', name: '🌲', icon: FaCircle, color: '#4CAF50'},
    HOME_EMOJI: {id: 'home', name: '🏠', icon: FaCircle, color: '#795548'}
};

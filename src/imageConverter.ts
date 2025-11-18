import type {SymbolDefinition} from './types';
import type {IconType} from 'react-icons';
import type {UploadedImage} from './components/ImageUpload';

/**
 * Konvertiert hochgeladene Bilder in SymbolDefinition-Objekte
 */

/**
 * Generiert eine Farbe basierend auf einem Index
 * Verwendet ein Set von unterscheidbaren Farben
 */
function generateColor(index: number): string {
    const colors = [
        '#FF6B6B',
        '#4ECDC4',
        '#45B7D1',
        '#FFA07A',
        '#98D8C8',
        '#F7DC6F',
        '#BB8FCE',
        '#85C1E2',
        '#F8B739',
        '#52B788',
        '#E76F51',
        '#2A9D8F',
        '#E9C46A',
        '#F4A261',
        '#264653',
        '#A8DADC',
        '#457B9D',
        '#F1FAEE',
        '#E63946',
        '#06FFA5',
        '#FFBE0B',
        '#FB5607',
        '#FF006E',
        '#8338EC',
        '#3A86FF',
        '#FF1744',
        '#FFD700',
        '#FFC107',
        '#FF5722',
        '#4CAF50',
        '#795548'
    ];
    return colors[index % colors.length];
}

/**
 * Konvertiert ein UploadedImage in ein SymbolDefinition
 */
export function imageToSymbol(
    image: UploadedImage,
    index: number
): SymbolDefinition {
    // Generiere eine eindeutige ID aus Dateiname und Index
    const cleanName = image.name.replace(/\.[^/.]+$/, ''); // Entferne Extension
    const id = `img-${index}-${cleanName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')}`;

    // Dummy-Icon-Funktion - wird nicht verwendet wenn imageUrl gesetzt ist
    const dummyIcon = () => null;

    return {
        id,
        name: cleanName,
        icon: dummyIcon as unknown as IconType, // Type-cast da wir imageUrl verwenden
        color: generateColor(index),
        imageUrl: image.preview
    };
}

/**
 * Konvertiert ein Array von UploadedImages in ein Record von SymbolDefinitions
 * Kompatibel mit generateDobbleCards()
 */
export function imagesToSymbolSet(
    images: UploadedImage[]
): Record<string, SymbolDefinition> {
    const symbolSet: Record<string, SymbolDefinition> = {};

    images.forEach((image, index) => {
        const symbol = imageToSymbol(image, index);
        symbolSet[symbol.id.toUpperCase()] = symbol;
    });

    return symbolSet;
}

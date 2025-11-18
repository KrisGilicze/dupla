import type {Card, SymbolDefinition} from './types';
import type {IconType} from 'react-icons';

/**
 * Export-Format für Kartensätze
 */
export interface ExportedCardSet {
    version: string;
    createdAt: string;
    symbolCount: number;
    cardCount: number;
    symbolsPerCard: number;
    symbols: ExportedSymbol[];
    cards: ExportedCard[];
}

export interface ExportedSymbol {
    id: string;
    name: string;
    color: string;
    imageUrl?: string;
}

export interface ExportedCard {
    id: number;
    symbolIds: string[];
}

/**
 * Konvertiert Cards und Symbols in ein exportierbares JSON-Format
 */
export function prepareCardsForExport(
    cards: Card[],
    symbolsMap: Record<string, SymbolDefinition>
): ExportedCardSet {
    // Sammle alle verwendeten Symbole
    const usedSymbols = new Set<string>();
    cards.forEach((card) => {
        card.symbols.forEach((symbol) => {
            usedSymbols.add(symbol.id);
        });
    });

    // Konvertiere Symbole
    const symbols: ExportedSymbol[] = Array.from(usedSymbols).map((id) => {
        const symbol = symbolsMap[id.toUpperCase()] || symbolsMap[id];
        return {
            id: symbol.id,
            name: symbol.name,
            color: symbol.color,
            imageUrl: symbol.imageUrl
        };
    });

    // Konvertiere Karten
    const exportedCards: ExportedCard[] = cards.map((card) => ({
        id: card.id,
        symbolIds: card.symbols.map((s) => s.id)
    }));

    return {
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        symbolCount: symbols.length,
        cardCount: cards.length,
        symbolsPerCard: cards[0]?.symbols.length || 0,
        symbols,
        cards: exportedCards
    };
}

/**
 * Exportiert Kartensatz als JSON-Download
 */
export function exportAsJSON(
    cards: Card[],
    symbolsMap: Record<string, SymbolDefinition>,
    filename = 'dobble-cards.json'
): void {
    const exportData = prepareCardsForExport(cards, symbolsMap);
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

/**
 * Importiert Kartensatz aus JSON
 */
export function importFromJSON(jsonString: string): {
    cards: Card[];
    symbolsMap: Record<string, SymbolDefinition>;
} {
    const data: ExportedCardSet = JSON.parse(jsonString);

    // Validierung
    if (data.version !== '1.0.0') {
        throw new Error(`Unsupported version: ${data.version}`);
    }

    // Rekonstruiere Symbols Map
    const symbolsMap: Record<string, SymbolDefinition> = {};
    data.symbols.forEach((sym) => {
        // Dummy icon function - wird nicht verwendet wenn imageUrl vorhanden
        const dummyIcon = () => null;
        symbolsMap[sym.id.toUpperCase()] = {
            id: sym.id,
            name: sym.name,
            color: sym.color,
            icon: dummyIcon as unknown as IconType,
            imageUrl: sym.imageUrl
        };
    });

    // Rekonstruiere Cards
    const cards: Card[] = data.cards.map((cardData) => ({
        id: cardData.id,
        symbols: cardData.symbolIds.map((id) => {
            const symbol = symbolsMap[id.toUpperCase()];
            if (!symbol) {
                throw new Error(`Symbol not found: ${id}`);
            }
            return symbol;
        })
    }));

    return {cards, symbolsMap};
}

/**
 * Öffnet Druckvorschau für alle Karten
 */
export function openPrintPreview(cards: Card[]): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('Popup wurde blockiert! Bitte erlaube Popups für diese Seite.');
        return;
    }

    // HTML für Druckvorschau generieren
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Dobble Karten - Druckvorschau</title>
    <style>
        @page {
            size: A4;
            margin: 1cm;
        }
        
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        
        .card-page {
            page-break-after: always;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 2cm;
            box-sizing: border-box;
        }
        
        .card-page:last-child {
            page-break-after: auto;
        }
        
        .card {
            width: 15cm;
            height: 15cm;
            border-radius: 50%;
            border: 4px solid #000;
            background-color: #fff;
            position: relative;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        
        .symbol {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
            padding: 8px;
        }
        
        .symbol img {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 50%;
            border: 2px solid #000;
        }
        
        .card-info {
            text-align: center;
            margin-top: 1cm;
            font-size: 12px;
            color: #666;
        }
        
        @media print {
            .no-print {
                display: none;
            }
        }
        
        .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            background-color: #646cff;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            z-index: 1000;
        }
        
        .print-button:hover {
            background-color: #535bf2;
        }
    </style>
</head>
<body>
    <button class="print-button no-print" onclick="window.print()">🖨️ Drucken</button>
    
    ${cards
        .map(
            (card, index) => `
        <div class="card-page">
            <div>
                <div class="card">
                    ${card.symbols
                        .map((symbol, symIndex) => {
                            const angle =
                                (symIndex * 360) / card.symbols.length;
                            const radius = 250; // in px for 15cm card
                            const x =
                                Math.cos((angle * Math.PI) / 180) * radius;
                            const y =
                                Math.sin((angle * Math.PI) / 180) * radius;

                            return `
                        <div class="symbol" style="
                            left: calc(50% + ${x}px);
                            top: calc(50% + ${y}px);
                            transform: translate(-50%, -50%);
                            color: ${symbol.color};
                        ">
                            ${
                                symbol.imageUrl
                                    ? `<img src="${symbol.imageUrl}" alt="${symbol.name}" />`
                                    : `<span style="font-size: 48px;">●</span>`
                            }
                        </div>
                    `;
                        })
                        .join('')}
                </div>
                <div class="card-info">
                    Karte ${index + 1} von ${cards.length}
                </div>
            </div>
        </div>
    `
        )
        .join('')}
</body>
</html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
}

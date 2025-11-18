import {useRef} from 'react';
import type {Card, SymbolDefinition} from '../types';
import {exportAsJSON, openPrintPreview, importFromJSON} from '../exportCards';

interface CardExportProps {
    cards: Card[];
    symbolsMap: Record<string, SymbolDefinition>;
    onImport: (
        cards: Card[],
        symbolsMap: Record<string, SymbolDefinition>
    ) => void;
}

export function CardExport({cards, symbolsMap, onImport}: CardExportProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExportJSON = () => {
        const timestamp = new Date().toISOString().split('T')[0];
        exportAsJSON(cards, symbolsMap, `dobble-cards-${timestamp}.json`);
    };

    const handlePrintPreview = () => {
        openPrintPreview(cards);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const jsonString = event.target?.result as string;
                const {cards: importedCards, symbolsMap: importedSymbols} =
                    importFromJSON(jsonString);
                onImport(importedCards, importedSymbols);
                alert(
                    `✅ ${importedCards.length} Karten erfolgreich importiert!`
                );
            } catch (error) {
                console.error('Import error:', error);
                alert(
                    '❌ Fehler beim Importieren der Datei. Bitte überprüfe das Format.'
                );
            }
        };
        reader.readAsText(file);
    };

    if (cards.length === 0) {
        return null;
    }

    return (
        <div
            style={{
                marginTop: '24px',
                padding: '20px',
                backgroundColor: 'rgba(100, 108, 255, 0.1)',
                borderRadius: '12px',
                border: '2px solid rgba(100, 108, 255, 0.3)'
            }}
        >
            <h3
                style={{
                    margin: '0 0 16px 0',
                    fontSize: '18px',
                    textAlign: 'center'
                }}
            >
                📦 Export & Import
            </h3>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px'
                }}
            >
                <button
                    onClick={handlePrintPreview}
                    style={{
                        padding: '14px 20px',
                        fontSize: '16px',
                        backgroundColor: '#22c55e',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = '#16a34a')
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = '#22c55e')
                    }
                >
                    <span>🖨️</span>
                    <span>Druckvorschau</span>
                </button>

                <button
                    onClick={handleExportJSON}
                    style={{
                        padding: '14px 20px',
                        fontSize: '16px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = '#2563eb')
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = '#3b82f6')
                    }
                >
                    <span>💾</span>
                    <span>Als JSON speichern</span>
                </button>

                <button
                    onClick={handleImportClick}
                    style={{
                        padding: '14px 20px',
                        fontSize: '16px',
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = '#d97706')
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = '#f59e0b')
                    }
                >
                    <span>📂</span>
                    <span>JSON importieren</span>
                </button>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                style={{display: 'none'}}
                onChange={handleFileChange}
            />

            <div
                style={{
                    marginTop: '16px',
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    textAlign: 'center'
                }}
            >
                Die Druckvorschau zeigt alle {cards.length} Karten zum
                Ausdrucken.
                <br />
                JSON-Export speichert Karten inkl. Symbole für späteren Import.
            </div>
        </div>
    );
}

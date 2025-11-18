import {findBestN} from '../lib/projectivePlane';

interface SymbolCountFeedbackProps {
    count: number;
}

export function SymbolCountFeedback({count}: SymbolCountFeedbackProps) {
    if (count === 0) {
        return null;
    }

    const result = findBestN(count);

    if (result.exact) {
        const n = result.exact.order;
        const cardCount = n * n + n + 1;
        const symbolsPerCard = n + 1;

        return (
            <div
                style={{
                    padding: '16px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    border: '2px solid #22c55e',
                    marginTop: '16px',
                    textAlign: 'center'
                }}
            >
                <div style={{fontSize: '24px', marginBottom: '8px'}}>✅</div>
                <div style={{fontWeight: 'bold', color: '#22c55e'}}>
                    {count} Fotos - perfekt!
                </div>
                <div style={{fontSize: '14px', marginTop: '8px'}}>
                    Du kannst damit ein Dobble-Spiel mit{' '}
                    <strong>{cardCount} Karten</strong> erstellen.
                    <br />
                    Jede Karte hat <strong>{symbolsPerCard} Symbole</strong>.
                </div>
            </div>
        );
    }

    const suggestions: string[] = [];
    if (result.smaller) {
        suggestions.push(
            `${result.smaller.symbolCount} Fotos (${
                result.smaller.order * result.smaller.order +
                result.smaller.order +
                1
            } Karten)`
        );
    }
    if (result.larger) {
        suggestions.push(
            `${result.larger.symbolCount} Fotos (${
                result.larger.order * result.larger.order +
                result.larger.order +
                1
            } Karten)`
        );
    }

    return (
        <div
            style={{
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: 'rgba(251, 191, 36, 0.1)',
                border: '2px solid #fbbf24',
                marginTop: '16px',
                textAlign: 'center'
            }}
        >
            <div style={{fontSize: '24px', marginBottom: '8px'}}>⚠️</div>
            <div style={{fontWeight: 'bold', color: '#fbbf24'}}>
                {count} Fotos - diese Anzahl funktioniert leider nicht
            </div>
            <div style={{fontSize: '14px', marginTop: '8px'}}>
                Für ein gültiges Dobble-Spiel brauchst du eine dieser Anzahlen:
                <br />
                <strong>{suggestions.join(' oder ')}</strong>
            </div>
        </div>
    );
}

import './App.css';
import {SYMBOLS} from './types';
import {card1, card2} from './data';

function App() {
    const n = 2; // Projektionsebene
    const totalSymbols = n * n + n + 1; // 7
    const totalCards = n * n + n + 1; // 7
    const symbolsPerCard = n + 1; // 3

    return (
        <div style={{padding: '2rem'}}>
            <h1>Dupla (Dobble Klon)</h1>

            <section style={{backgroundColor: '#1a1a1a', padding: '1rem', borderRadius: '8px', marginBottom: '2rem'}}>
                <h2>Mathematische Grundlagen</h2>
                <p><strong>Projektionsebene:</strong> n = {n}</p>
                <p><strong>Formeln:</strong></p>
                <ul style={{listStyle: 'none', paddingLeft: '1rem'}}>
                    <li>Anzahl Symbole: n² + n + 1 = {n}² + {n} + 1 = <strong>{totalSymbols}</strong></li>
                    <li>Anzahl Karten: n² + n + 1 = {n}² + {n} + 1 = <strong>{totalCards}</strong></li>
                    <li>Symbole pro Karte: n + 1 = {n} + 1 = <strong>{symbolsPerCard}</strong></li>
                </ul>
                <p style={{fontSize: '0.9rem', fontStyle: 'italic', marginTop: '1rem'}}>
                    In einer Projektionsebene der Ordnung n haben je zwei Karten genau ein gemeinsames Symbol.
                </p>
            </section>

            <section>
                <h2>Verfügbare Symbole</h2>
                <ul>
                    {Object.values(SYMBOLS).map((symbol) => (
                        <li key={symbol}>{symbol}</li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>Beispielkarten</h2>

                <div style={{display: 'flex', gap: '2rem', marginTop: '1rem'}}>
                    <div
                        style={{
                            border: '2px solid #646cff',
                            borderRadius: '8px',
                            padding: '1rem'
                        }}
                    >
                        <h3>Karte {card1.id}</h3>
                        <ul>
                            {card1.symbols.map((symbol) => (
                                <li key={symbol}>{symbol}</li>
                            ))}
                        </ul>
                    </div>

                    <div
                        style={{
                            border: '2px solid #646cff',
                            borderRadius: '8px',
                            padding: '1rem'
                        }}
                    >
                        <h3>Karte {card2.id}</h3>
                        <ul>
                            {card2.symbols.map((symbol) => (
                                <li key={symbol}>{symbol}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <p style={{marginTop: '1rem', fontStyle: 'italic'}}>
                    Gemeinsames Symbol:{' '}
                    <strong>
                        {card1.symbols.find((s) => card2.symbols.includes(s))}
                    </strong>
                </p>
            </section>
        </div>
    );
}

export default App;

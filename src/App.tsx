import './App.css';
import {useState, useEffect} from 'react';
import type {Symbol, Card as CardType} from './types';
import {allCards} from './data';
import {Card} from './components/Card';
import {getRandomCardPair, getRandomCardExcept} from './utils';
import {soundEffects} from './sounds';

interface LeaderboardEntry {
    name: string;
    score: number;
    date: string;
}

function App() {
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [playerName, setPlayerName] = useState('Guest');
    const [timeLeft, setTimeLeft] = useState(20);
    const [ownCard, setOwnCard] = useState<CardType>(() => allCards[0]);
    const [targetCard, setTargetCard] = useState<CardType>(() =>
        getRandomCardExcept(allCards, allCards[0])
    );
    const [flashColor, setFlashColor] = useState<'green' | 'red' | null>(null);
    const [shake, setShake] = useState(false);
    const [flip, setFlip] = useState(false);
    const [scoreAnimation, setScoreAnimation] = useState<'+1' | '-2' | null>(
        null
    );
    const [isGameOver, setIsGameOver] = useState(false);
    const [guessCount, setGuessCount] = useState(0);
    const [timerStarted, setTimerStarted] = useState(false);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
        {name: 'Krischi', score: 42, date: '2024-01-15'},
        {name: 'Krischi', score: 35, date: '2024-01-14'}
    ]);

    // Finde das gemeinsame Symbol zwischen den beiden Karten
    const commonSymbol = ownCard.symbols.find((s) =>
        targetCard.symbols.some((s2) => s2.id === s.id)
    );

    // Countdown Timer
    useEffect(() => {
        if (isGameOver || timeLeft <= 0 || !timerStarted) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setIsGameOver(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isGameOver, timeLeft, timerStarted]);

    const handleSymbolClick = (symbol: Symbol, isTargetCard: boolean) => {
        if (!isTargetCard || isGameOver) {
            // Klick auf eigene Karte oder Game Over - nichts tun
            return;
        }

        // Timer starten beim ersten Klick
        if (!timerStarted) {
            setTimerStarted(true);
        }

        // Prüfe, ob es das gemeinsame Symbol ist
        if (commonSymbol && symbol.id === commonSymbol.id) {
            // Richtig! Score erhöhen und neue Zielkarte
            setScore((prev) => {
                const newScore = prev + 1;
                if (newScore > highScore) {
                    setHighScore(newScore);
                }
                return newScore;
            });
            setGuessCount((prev) => prev + 1);

            // Zeit erhöhen (+1s)
            setTimeLeft((prev) => prev + 1);

            // Score-Animation
            setScoreAnimation('+1');
            setTimeout(() => setScoreAnimation(null), 1000);

            // Visuelles Feedback: Grün
            setFlashColor('green');
            setTimeout(() => setFlashColor(null), 300);

            // Sound abspielen
            if (soundEnabled) {
                soundEffects.playSuccess();
            }

            // Flip-Animation starten
            setFlip(true);

            // Neue Zielkarte nach Flip-Animation
            setTimeout(() => {
                setTargetCard(getRandomCardExcept(allCards, ownCard));
                setFlip(false);
            }, 600);
        } else {
            // Falsch!
            setScore((prev) => {
                // Beim ersten Guess kann Score nicht unter 0 fallen
                const penalty = guessCount === 0 ? 0 : 2;
                const newScore = Math.max(0, prev - penalty);

                // Game Over wenn Score unter 0 fallen würde (nach erstem Guess)
                if (guessCount > 0 && prev - penalty < 0) {
                    setIsGameOver(true);
                }

                return newScore;
            });
            setGuessCount((prev) => prev + 1);

            // Score-Animation (nur wenn nicht erster Guess)
            if (guessCount > 0) {
                setScoreAnimation('-2');
                setTimeout(() => setScoreAnimation(null), 1000);
            }

            // Visuelles Feedback: Rot + Shake
            setFlashColor('red');
            setShake(true);
            setTimeout(() => {
                setFlashColor(null);
                setShake(false);
            }, 500);

            // Sound abspielen
            if (soundEnabled) {
                soundEffects.playFail();
            }

            // Flip-Animation starten (auch bei falschem Guess)
            setFlip(true);

            // Neue Zielkarte nach Flip-Animation
            setTimeout(() => {
                setTargetCard(getRandomCardExcept(allCards, ownCard));
                setFlip(false);
            }, 600);
        }
    };

    const handleRestart = () => {
        // Add to leaderboard if game was over
        if (isGameOver) {
            const newEntry: LeaderboardEntry = {
                name: playerName,
                score: score,
                date: new Date().toISOString().split('T')[0]
            };
            setLeaderboard((prev) =>
                [...prev, newEntry]
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 10)
            );
        }

        setScore(0);
        setGuessCount(0);
        setTimeLeft(20);
        setTimerStarted(false);
        setIsGameOver(false);
        const [newOwn, newTarget] = getRandomCardPair(allCards);
        setOwnCard(newOwn);
        setTargetCard(newTarget);
        setFlashColor(null);
        setShake(false);
        setFlip(false);
        setScoreAnimation(null);
    };

    return (
        <div
            style={{
                padding: '2rem',
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                position: 'relative'
            }}
        >
            <header style={{textAlign: 'center'}}>
                <h1>Dupla (Dobble Klon)</h1>
            </header>

            {/* Settings - direkt unter Titel */}
            <div
                style={{
                    backgroundColor: '#1a1a1a',
                    padding: '1rem',
                    borderRadius: '8px',
                    width: '100%',
                    maxWidth: '600px',
                    margin: '0 auto'
                }}
            >
                <h3
                    style={{
                        margin: '0 0 1rem 0',
                        fontWeight: 'bold',
                        fontSize: '1rem'
                    }}
                >
                    ⚙️ Einstellungen
                </h3>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}
                >
                    <label
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem'
                        }}
                    >
                        <span style={{fontSize: '0.9rem', color: '#888'}}>
                            Spielername:
                        </span>
                        <input
                            type="text"
                            value={playerName}
                            onChange={(e) =>
                                setPlayerName(e.target.value || 'Guest')
                            }
                            placeholder="Guest"
                            style={{
                                padding: '0.5rem',
                                fontSize: '1rem',
                                backgroundColor: '#2a2a2a',
                                color: 'white',
                                border: '1px solid #444',
                                borderRadius: '4px'
                            }}
                        />
                    </label>
                    <label
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer'
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={soundEnabled}
                            onChange={(e) => setSoundEnabled(e.target.checked)}
                            style={{
                                width: '20px',
                                height: '20px',
                                cursor: 'pointer'
                            }}
                        />
                        <span>Sound-Effekte aktivieren</span>
                    </label>
                </div>
            </div>

            {/* Game Over Overlay */}
            {isGameOver && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2rem',
                        zIndex: 1000,
                        animation: 'fadeIn 0.3s',
                        overflowY: 'auto',
                        padding: '2rem'
                    }}
                >
                    <h1
                        style={{
                            fontSize: '4rem',
                            color: '#f44336',
                            margin: 0,
                            textShadow: '0 0 20px rgba(244, 67, 54, 0.5)'
                        }}
                    >
                        GAME OVER
                    </h1>
                    <div style={{fontSize: '1.5rem', color: '#888'}}>
                        Finaler Score:{' '}
                        <strong style={{color: '#fff'}}>{score}</strong>
                    </div>
                    {highScore > 0 && (
                        <div style={{fontSize: '1.2rem', color: '#646cff'}}>
                            🏆 High Score: {highScore}
                        </div>
                    )}

                    {/* Glückwunsch bei Platz 1 */}
                    {score > 0 &&
                        leaderboard.length > 0 &&
                        score >= leaderboard[0].score && (
                            <div
                                style={{
                                    fontSize: '1.3rem',
                                    color: '#ffaa00',
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    padding: '1rem',
                                    backgroundColor: 'rgba(255, 170, 0, 0.1)',
                                    borderRadius: '8px',
                                    border: '2px solid #ffaa00',
                                    animation: 'fadeIn 0.5s'
                                }}
                            >
                                🎉 Glückwunsch! Du hast den Architekten
                                geschlagen! 🎉
                            </div>
                        )}

                    {/* Leaderboard */}
                    <div
                        style={{
                            backgroundColor: '#1a1a1a',
                            border: '2px solid #646cff',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            minWidth: '400px',
                            maxWidth: '500px'
                        }}
                    >
                        <h2
                            style={{
                                margin: '0 0 1rem 0',
                                textAlign: 'center',
                                color: '#646cff'
                            }}
                        >
                            🏆 Bestenliste
                        </h2>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem'
                            }}
                        >
                            {leaderboard.map((entry, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        padding: '0.75rem',
                                        backgroundColor:
                                            entry.name === playerName &&
                                            entry.score === score
                                                ? 'rgba(100, 108, 255, 0.2)'
                                                : '#2a2a2a',
                                        borderRadius: '6px',
                                        border:
                                            entry.name === playerName &&
                                            entry.score === score
                                                ? '2px solid #646cff'
                                                : 'none'
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            gap: '1rem',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: '1.2rem',
                                                fontWeight: 'bold',
                                                color: '#888',
                                                minWidth: '30px'
                                            }}
                                        >
                                            {index + 1}.
                                        </span>
                                        <span style={{fontWeight: 'bold'}}>
                                            {entry.name}
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            gap: '1rem',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: '#888',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            {entry.date}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: '1.3rem',
                                                fontWeight: 'bold',
                                                color: '#22c55e',
                                                minWidth: '50px',
                                                textAlign: 'right'
                                            }}
                                        >
                                            {entry.score}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleRestart}
                        style={{
                            padding: '1.5rem 3rem',
                            fontSize: '1.5rem',
                            backgroundColor: '#646cff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 16px rgba(100, 108, 255, 0.4)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#535bf2';
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#646cff';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        🔄 Nochmal spielen
                    </button>
                    <style>{`
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                    `}</style>
                </div>
            )}

            {/* Score Display - Responsive Position */}
            <div
                className="score-display"
                style={{
                    backgroundColor: '#1a1a1a',
                    border: '3px solid #646cff',
                    borderRadius: '16px',
                    padding: '1.5rem 2rem',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                    zIndex: 100,
                    minWidth: '150px',
                    textAlign: 'center'
                }}
            >
                {/* Countdown Timer */}
                <div
                    style={{
                        fontSize: '0.9rem',
                        color: '#888',
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}
                >
                    Zeit
                </div>
                <div
                    style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color:
                            timeLeft <= 5
                                ? '#f44336'
                                : timeLeft <= 10
                                ? '#ffaa00'
                                : '#22c55e',
                        marginBottom: '1rem',
                        transition: 'color 0.3s'
                    }}
                >
                    {timeLeft}s
                </div>

                <div
                    style={{
                        borderTop: '2px solid #333',
                        paddingTop: '1rem',
                        marginTop: '1rem'
                    }}
                >
                    <div
                        style={{
                            fontSize: '0.9rem',
                            color: '#888',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}
                    >
                        Score
                    </div>
                    <div
                        style={{
                            fontSize: '3rem',
                            fontWeight: 'bold',
                            color:
                                score < 5
                                    ? '#f44336'
                                    : score < 10
                                    ? '#ffaa00'
                                    : '#22c55e',
                            position: 'relative',
                            transition: 'color 0.3s'
                        }}
                    >
                        {score}
                        {scoreAnimation && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '-20px',
                                    right: '-30px',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    color:
                                        scoreAnimation === '+1'
                                            ? '#22c55e'
                                            : '#f44336',
                                    animation: 'scoreFloat 1s ease-out'
                                }}
                            >
                                {scoreAnimation}
                            </div>
                        )}
                    </div>
                    {highScore > 0 && (
                        <div
                            style={{
                                fontSize: '0.8rem',
                                color: '#646cff',
                                marginTop: '0.5rem'
                            }}
                        >
                            🏆 Best: {highScore}
                        </div>
                    )}
                </div>
                <style>{`
                    @keyframes scoreFloat {
                        0% { opacity: 1; transform: translateY(0); }
                        100% { opacity: 0; transform: translateY(-30px); }
                    }
                `}</style>
            </div>

            <main
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '3rem',
                    alignItems: 'center',
                    opacity: isGameOver ? 0.3 : 1,
                    transition: 'opacity 0.3s',
                    pointerEvents: isGameOver ? 'none' : 'auto'
                }}
            >
                {/* Eigene Karte (oben) */}
                <section style={{textAlign: 'center'}}>
                    <h2 style={{marginBottom: '1rem'}}>Deine Karte</h2>
                    <Card card={ownCard} />
                </section>

                {/* Zielkarte (unten) */}
                <section style={{textAlign: 'center'}}>
                    <h2 style={{marginBottom: '1rem'}}>Zielkarte</h2>
                    <p
                        style={{
                            fontSize: '0.9rem',
                            color: '#888',
                            marginBottom: '1rem'
                        }}
                    >
                        Klicke auf das gemeinsame Symbol!
                    </p>
                    <Card
                        card={targetCard}
                        onSymbolClick={(symbol) =>
                            handleSymbolClick(symbol, true)
                        }
                        flashColor={flashColor}
                        shake={shake}
                        flip={flip}
                    />
                </section>
            </main>

            <footer
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    alignItems: 'center',
                    marginTop: '2rem'
                }}
            >
                {/* Anleitung */}
                <details
                    style={{
                        backgroundColor: '#1a1a1a',
                        padding: '1rem',
                        borderRadius: '8px',
                        width: '100%',
                        maxWidth: '600px',
                        marginBottom: '1rem'
                    }}
                >
                    <summary
                        style={{
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            marginBottom: '1rem'
                        }}
                    >
                        📖 Spielanleitung
                    </summary>
                    <div style={{fontSize: '0.95rem', lineHeight: '1.6'}}>
                        <h3 style={{marginTop: '0.5rem', color: '#646cff'}}>
                            Ziel des Spiels
                        </h3>
                        <p>
                            Finde das gemeinsame Symbol zwischen deiner Karte
                            (oben) und der Zielkarte (unten) und klicke es auf
                            der Zielkarte an.
                        </p>

                        <h3 style={{marginTop: '1rem', color: '#646cff'}}>
                            Punktesystem
                        </h3>
                        <ul style={{paddingLeft: '1.5rem'}}>
                            <li>
                                <strong style={{color: '#22c55e'}}>
                                    Richtig:
                                </strong>{' '}
                                +1 Punkt, +1 Sekunde Zeit, neue Zielkarte
                                erscheint
                            </li>
                            <li>
                                <strong style={{color: '#f44336'}}>
                                    Falsch:
                                </strong>{' '}
                                -2 Punkte (außer beim ersten Versuch)
                            </li>
                            <li>
                                <strong style={{color: '#f44336'}}>
                                    Game Over:
                                </strong>{' '}
                                Wenn der Score unter 0 fällt oder die Zeit
                                abläuft
                            </li>
                        </ul>

                        <h3 style={{marginTop: '1rem', color: '#646cff'}}>
                            Wichtig
                        </h3>
                        <p>
                            Jede Kartenpaarung hat <strong>genau ein</strong>{' '}
                            gemeinsames Symbol - nicht mehr, nicht weniger!
                        </p>
                    </div>
                </details>

                <button
                    onClick={handleRestart}
                    style={{
                        padding: '1rem 2rem',
                        fontSize: '1.1rem',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        transition: 'background-color 0.2s',
                        width: '200px'
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = '#d32f2f')
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = '#f44336')
                    }
                >
                    🔄 Neustart
                </button>

                <details
                    style={{
                        backgroundColor: '#1a1a1a',
                        padding: '1rem',
                        borderRadius: '8px',
                        width: '100%',
                        maxWidth: '600px'
                    }}
                >
                    <summary
                        style={{
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            marginBottom: '1rem'
                        }}
                    >
                        ℹ️ Mathematische Grundlagen
                    </summary>
                    <div>
                        <p>
                            <strong>Projektionsebene:</strong> n = 2
                        </p>
                        <ul style={{listStyle: 'none', paddingLeft: '1rem'}}>
                            <li>
                                Anzahl Symbole: n² + n + 1 = 2² + 2 + 1 ={' '}
                                <strong>7</strong>
                            </li>
                            <li>
                                Anzahl Karten: n² + n + 1 = 2² + 2 + 1 ={' '}
                                <strong>7</strong>
                            </li>
                            <li>
                                Symbole pro Karte: n + 1 = 2 + 1 ={' '}
                                <strong>3</strong>
                            </li>
                        </ul>
                        <p
                            style={{
                                fontSize: '0.9rem',
                                fontStyle: 'italic',
                                marginTop: '1rem'
                            }}
                        >
                            In einer Projektionsebene der Ordnung n haben je
                            zwei Karten genau ein gemeinsames Symbol.
                        </p>
                    </div>
                </details>
            </footer>
        </div>
    );
}

export default App;

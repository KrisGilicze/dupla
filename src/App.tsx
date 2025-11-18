import './App.css';
import {useState, useEffect} from 'react';
import type {Symbol, Card as CardType, SymbolDefinition} from './types';
import {allCards} from './data';
import {Card} from './components/Card';
import {ImageUpload} from './components/ImageUpload';
import type {UploadedImage} from './components/ImageUpload';
import {SymbolCountFeedback} from './components/SymbolCountFeedback';
import {CardGallery} from './components/CardGallery';
import {CardExport} from './components/CardExport';
import {GameOverScreen} from './components/GameOverScreen';
import {
    getRandomCardPair,
    getRandomCardExcept,
    generateDobbleCards
} from './utils';
import {imagesToSymbolSet} from './imageConverter';
import {findBestN} from './projectivePlane';
import {soundEffects} from './sounds';

interface LeaderboardEntry {
    name: string;
    score: number;
    date: string;
    isCurrent?: boolean;
}

function App() {
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [playerName, setPlayerName] = useState('Guest');
    const [timeLeft, setTimeLeft] = useState(20);
    const [activeTab, setActiveTab] = useState<'custom' | 'demo'>('custom');

    // Custom cards state
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const [customCards, setCustomCards] = useState<CardType[]>([]);
    const [customSymbolsMap, setCustomSymbolsMap] = useState<
        Record<string, SymbolDefinition>
    >({});
    const [isPlayingCustom, setIsPlayingCustom] = useState(false);

    // Active card deck (standard or custom)
    const activeCards =
        isPlayingCustom && customCards.length > 0 ? customCards : allCards;

    const [ownCard, setOwnCard] = useState<CardType>(() => activeCards[0]);
    const [targetCard, setTargetCard] = useState<CardType>(() =>
        getRandomCardExcept(activeCards, activeCards[0])
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
                setTargetCard(getRandomCardExcept(activeCards, ownCard));
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
                setTargetCard(getRandomCardExcept(activeCards, ownCard));
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
        const [newOwn, newTarget] = getRandomCardPair(activeCards);
        setOwnCard(newOwn);
        setTargetCard(newTarget);
        setFlashColor(null);
        setShake(false);
        setFlip(false);
        setScoreAnimation(null);
    };

    const handleImagesChange = (images: UploadedImage[]) => {
        setUploadedImages(images);
        // Clear custom cards when images change
        setCustomCards([]);
        setCustomSymbolsMap({});
    };

    const handleGenerateCards = () => {
        const result = findBestN(uploadedImages.length);
        if (!result.exact) {
            alert(
                'Ungültige Symbolanzahl! Bitte verwende eine gültige Anzahl.'
            );
            return;
        }

        // Convert images to symbols
        const symbolSet = imagesToSymbolSet(uploadedImages);
        setCustomSymbolsMap(symbolSet);

        // Generate cards
        const cards = generateDobbleCards(symbolSet);
        setCustomCards(cards);
    };

    const handleImportCards = (
        importedCards: CardType[],
        importedSymbols: Record<string, SymbolDefinition>
    ) => {
        setCustomCards(importedCards);
        setCustomSymbolsMap(importedSymbols);
        // Clear uploaded images since we're using imported data
        setUploadedImages([]);
    };

    const handlePlayWithCustomCards = () => {
        if (customCards.length === 0) {
            alert('Bitte generiere zuerst Karten!');
            return;
        }
        setIsPlayingCustom(true);
        setActiveTab('demo'); // Switch to demo tab
        // Restart game with custom cards
        setScore(0);
        setGuessCount(0);
        setTimeLeft(20);
        setTimerStarted(false);
        setIsGameOver(false);
        const [newOwn, newTarget] = getRandomCardPair(customCards);
        setOwnCard(newOwn);
        setTargetCard(newTarget);
        setFlashColor(null);
        setShake(false);
        setFlip(false);
        setScoreAnimation(null);

        // Scroll to game content
        setTimeout(() => {
            const gameContent = document.querySelector('.game-cards-container');
            if (gameContent) {
                gameContent.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }, 100);
    };

    const handlePlayWithStandardCards = () => {
        setIsPlayingCustom(false);
        // Restart game with standard cards
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

                {/* Current Deck Indicator */}
                {isPlayingCustom && (
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 20px',
                            backgroundColor: 'rgba(139, 92, 246, 0.2)',
                            border: '2px solid #8b5cf6',
                            borderRadius: '12px',
                            marginTop: '16px'
                        }}
                    >
                        <span style={{fontSize: '20px'}}>🎴</span>
                        <div>
                            <div style={{fontWeight: 'bold', color: '#8b5cf6'}}>
                                Custom Karten aktiv
                            </div>
                            <div
                                style={{
                                    fontSize: '13px',
                                    color: 'rgba(255, 255, 255, 0.6)'
                                }}
                            >
                                {customCards.length} Karten mit{' '}
                                {customCards[0]?.symbols.length || 0} Symbolen
                            </div>
                        </div>
                        <button
                            onClick={handlePlayWithStandardCards}
                            style={{
                                padding: '8px 16px',
                                fontSize: '14px',
                                backgroundColor: '#64748b',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                    '#475569')
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                    '#64748b')
                            }
                        >
                            Zurück zu Standard
                        </button>
                    </div>
                )}
            </header>

            {/* Tab Navigation */}
            <div className="tab-navigation">
                <button
                    className={`tab-button ${
                        activeTab === 'custom' ? 'active' : ''
                    }`}
                    onClick={() => setActiveTab('custom')}
                >
                    🎴 Custom Cards
                </button>
                <button
                    className={`tab-button ${
                        activeTab === 'demo' ? 'active' : ''
                    }`}
                    onClick={() => setActiveTab('demo')}
                >
                    🎮 Simple Demo
                </button>
            </div>

            {/* Custom Cards Tab */}
            {activeTab === 'custom' && (
                <div
                    style={{
                        width: '100%',
                        maxWidth: '800px',
                        margin: '0 auto'
                    }}
                >
                    {/* Intro Explanation */}
                    <div className="intro-section">
                        <h2>🎯 Was ist Dobble?</h2>
                        <p>
                            <strong>Dobble</strong> (auch bekannt als Spot It!)
                            ist ein Kartenspiel, bei dem jede Karte mehrere
                            Symbole zeigt. Das Besondere:
                            <strong>
                                {' '}
                                Zwischen zwei beliebigen Karten gibt es immer
                                genau ein gemeinsames Symbol!
                            </strong>
                        </p>
                        <p>
                            🎮 <strong>Spielprinzip:</strong> Finde so schnell
                            wie möglich das Symbol, das auf deiner Karte und der
                            Zielkarte zu sehen ist.
                        </p>

                        <div className="symbol-requirements">
                            <strong>📊 Wichtig: Symbol-Anforderungen</strong>
                            <p
                                style={{
                                    fontSize: '0.9rem',
                                    margin: '0.5rem 0',
                                    color: '#aaa'
                                }}
                            >
                                Dobble basiert auf mathematischen Prinzipien. Du
                                kannst <strong>nicht beliebig viele</strong>{' '}
                                Symbole hochladen. Die Anzahl muss einer dieser
                                Formeln entsprechen:
                            </p>
                            <ul>
                                <li>
                                    <strong>3 Symbole</strong> → 3 Karten mit je
                                    2 Symbolen
                                </li>
                                <li>
                                    <strong>7 Symbole</strong> → 7 Karten mit je
                                    3 Symbolen
                                </li>
                                <li>
                                    <strong>13 Symbole</strong> → 13 Karten mit
                                    je 4 Symbolen
                                </li>
                                <li>
                                    <strong>21 Symbole</strong> → 21 Karten mit
                                    je 5 Symbolen
                                </li>
                                <li>
                                    <strong>31 Symbole</strong> → 31 Karten mit
                                    je 6 Symbolen
                                </li>
                                <li>
                                    <strong>57 Symbole</strong> → 57 Karten mit
                                    je 8 Symbolen
                                </li>
                            </ul>
                            <p
                                style={{
                                    fontSize: '0.85rem',
                                    marginTop: '0.75rem',
                                    color: '#888',
                                    fontStyle: 'italic'
                                }}
                            >
                                💡 Tipp: Für ein Familien-Spiel empfehlen wir{' '}
                                <strong>7 oder 13 Symbole</strong>
                                (z.B. Fotos von Familienmitgliedern, Haustieren,
                                Lieblingsorten).
                            </p>
                        </div>
                    </div>

                    <h2
                        style={{
                            textAlign: 'center',
                            marginBottom: '1rem',
                            marginTop: '2rem'
                        }}
                    >
                        📸 Eigenes Dobble-Spiel erstellen
                    </h2>

                    <ImageUpload onImagesChange={handleImagesChange} />

                    <SymbolCountFeedback count={uploadedImages.length} />

                    {uploadedImages.length > 0 &&
                        findBestN(uploadedImages.length).exact && (
                            <div
                                style={{textAlign: 'center', marginTop: '16px'}}
                            >
                                <button
                                    onClick={handleGenerateCards}
                                    style={{
                                        padding: '16px 32px',
                                        fontSize: '18px',
                                        backgroundColor: '#22c55e',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        transition: 'background-color 0.3s'
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.backgroundColor =
                                            '#16a34a')
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.backgroundColor =
                                            '#22c55e')
                                    }
                                >
                                    🎴 Karten generieren
                                </button>
                            </div>
                        )}

                    {customCards.length > 0 && (
                        <>
                            <CardExport
                                cards={customCards}
                                symbolsMap={customSymbolsMap}
                                onImport={handleImportCards}
                            />

                            <div
                                style={{textAlign: 'center', marginTop: '24px'}}
                            >
                                <button
                                    onClick={handlePlayWithCustomCards}
                                    style={{
                                        padding: '16px 40px',
                                        fontSize: '20px',
                                        backgroundColor: '#8b5cf6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        transition: 'all 0.3s',
                                        boxShadow:
                                            '0 4px 12px rgba(139, 92, 246, 0.4)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor =
                                            '#7c3aed';
                                        e.currentTarget.style.transform =
                                            'scale(1.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor =
                                            '#8b5cf6';
                                        e.currentTarget.style.transform =
                                            'scale(1)';
                                    }}
                                >
                                    🎮 Mit diesen Karten spielen!
                                </button>
                            </div>

                            <CardGallery cards={customCards} />
                        </>
                    )}
                </div>
            )}

            {/* Simple Demo Tab */}
            {activeTab === 'demo' && (
                <>
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
                                <span
                                    style={{fontSize: '0.9rem', color: '#888'}}
                                >
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
                                    onChange={(e) =>
                                        setSoundEnabled(e.target.checked)
                                    }
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
                        <GameOverScreen
                            score={score}
                            highScore={highScore}
                            playerName={playerName}
                            leaderboard={leaderboard}
                            onRestart={handleRestart}
                        />
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
                        className="game-cards-container"
                        style={{
                            opacity: isGameOver ? 0.3 : 1,
                            transition: 'opacity 0.3s',
                            pointerEvents: isGameOver ? 'none' : 'auto'
                        }}
                    >
                        {/* Eigene Karte */}
                        <section style={{textAlign: 'center'}}>
                            <div
                                style={{
                                    minHeight: '80px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    marginBottom: '1rem'
                                }}
                            >
                                <h3 style={{color: '#888', margin: 0}}>
                                    Deine Karte
                                </h3>
                            </div>
                            <Card card={ownCard} />
                        </section>

                        {/* Zielkarte */}
                        <section style={{textAlign: 'center'}}>
                            <div
                                style={{
                                    minHeight: '80px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    marginBottom: '1rem'
                                }}
                            >
                                <h3
                                    style={{
                                        color: '#888',
                                        margin: '0 0 0.5rem 0'
                                    }}
                                >
                                    Zielkarte
                                </h3>
                                <p
                                    style={{
                                        fontSize: '0.9rem',
                                        color: '#888',
                                        margin: 0
                                    }}
                                >
                                    Klicke auf das gemeinsame Symbol!
                                </p>
                            </div>
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
                            <div
                                style={{fontSize: '0.95rem', lineHeight: '1.6'}}
                            >
                                <h3
                                    style={{
                                        marginTop: '0.5rem',
                                        color: '#646cff'
                                    }}
                                >
                                    Ziel des Spiels
                                </h3>
                                <p>
                                    Finde das gemeinsame Symbol zwischen deiner
                                    Karte (oben) und der Zielkarte (unten) und
                                    klicke es auf der Zielkarte an.
                                </p>

                                <h3
                                    style={{
                                        marginTop: '1rem',
                                        color: '#646cff'
                                    }}
                                >
                                    Punktesystem
                                </h3>
                                <ul style={{paddingLeft: '1.5rem'}}>
                                    <li>
                                        <strong style={{color: '#22c55e'}}>
                                            Richtig:
                                        </strong>{' '}
                                        +1 Punkt, +1 Sekunde Zeit, neue
                                        Zielkarte erscheint
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
                                        Wenn der Score unter 0 fällt oder die
                                        Zeit abläuft
                                    </li>
                                </ul>

                                <h3
                                    style={{
                                        marginTop: '1rem',
                                        color: '#646cff'
                                    }}
                                >
                                    Wichtig
                                </h3>
                                <p>
                                    Jede Kartenpaarung hat{' '}
                                    <strong>genau ein</strong> gemeinsames
                                    Symbol - nicht mehr, nicht weniger!
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
                                (e.currentTarget.style.backgroundColor =
                                    '#d32f2f')
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                    '#f44336')
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
                                <ul
                                    style={{
                                        listStyle: 'none',
                                        paddingLeft: '1rem'
                                    }}
                                >
                                    <li>
                                        Anzahl Symbole: n² + n + 1 = 2² + 2 + 1
                                        = <strong>7</strong>
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
                                    In einer Projektionsebene der Ordnung n
                                    haben je zwei Karten genau ein gemeinsames
                                    Symbol.
                                </p>
                            </div>
                        </details>
                    </footer>
                </>
            )}
        </div>
    );
}

export default App;

/* Copyright (c) 2025 Kristof Gilicze */

/** Docs:
 * n=1: 3 Symbole (3 Karten, 2 Symbole/Karte)
 * n=2: 7 Symbole (7 Karten, 3 Symbole/Karte)
 * n=3: 13 Symbole (13 Karten, 4 Symbole/Karte)
 * n=4: 21 Symbole (21 Karten, 5 Symbole/Karte)
 * n=5: 31 Symbole (31 Karten, 6 Symbole/Karte)
 * n=7: 57 Symbole (57 Karten, 8 Symbole/Karte)
 */

/**
 * ##### Symbole Grüber
 * Ingrid, Jörg,         +1
 * Nele, Philipp,        +3
 * Britta, Thomas,       +5
 * Meike, Sönke,         +2
 * Hendrik, Johanna,     +1
 * Kerstin, Kristof,     +1
 * = 12     |           +13
 * === 25
 */

/**
 * Ingrid, Jörg, Nele, Philipp, Britta, Thomas, Meike, Sönke, Hendrik, Johanna, Kerstin, Kristof, Lotte, Matti, Frido, Mika, Emma, Hanna, Juna, Lasse, Lina, Ida, Brösel, Fiete, Cleo
 * Anker, Brezel, Bier, Baum, Fisch, Herz
 */

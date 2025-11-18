interface LeaderboardEntry {
    name: string;
    score: number;
    date: string;
}

interface GameOverScreenProps {
    score: number;
    highScore: number;
    playerName: string;
    leaderboard: LeaderboardEntry[];
    onRestart: () => void;
}

export function GameOverScreen({
    score,
    highScore,
    playerName,
    leaderboard,
    onRestart
}: GameOverScreenProps) {
    // Erstelle temporäre Leaderboard mit aktuellem Score
    const currentEntry = {
        name: playerName,
        score,
        date: new Date().toISOString().split('T')[0]
    };

    const displayLeaderboard = [currentEntry, ...leaderboard]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

    const isNewRecord =
        score > 0 &&
        (leaderboard.length === 0 ||
            score >= Math.max(...leaderboard.map((e) => e.score)));
    const currentRank = displayLeaderboard.findIndex(
        (e) =>
            e.name === currentEntry.name &&
            e.score === currentEntry.score &&
            e.date === currentEntry.date
    );

    return (
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
            {/* Close Button */}
            <button
                onClick={onRestart}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: '2px solid #888',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: '#fff',
                    fontSize: '24px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f44336';
                    e.currentTarget.style.borderColor = '#f44336';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                        'rgba(0, 0, 0, 0.5)';
                    e.currentTarget.style.borderColor = '#888';
                }}
                aria-label="Close"
            >
                ×
            </button>

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
                Finaler Score: <strong style={{color: '#fff'}}>{score}</strong>
            </div>
            {highScore > 0 && (
                <div style={{fontSize: '1.2rem', color: '#646cff'}}>
                    🏆 High Score: {highScore}
                </div>
            )}

            {/* Glückwunsch bei Platz 1 */}
            {isNewRecord && (
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
                        animation: 'pulse 1s infinite'
                    }}
                >
                    🎉 Glückwunsch! Neuer Rekord! 🎉
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
                    {displayLeaderboard.map((entry, index) => {
                        const isCurrent = index === currentRank;
                        return (
                            <div
                                key={`${entry.name}-${entry.score}-${index}`}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem',
                                    backgroundColor: isCurrent
                                        ? 'rgba(100, 108, 255, 0.3)'
                                        : '#2a2a2a',
                                    borderRadius: '6px',
                                    border: isCurrent
                                        ? '2px solid #646cff'
                                        : 'none',
                                    animation: isCurrent
                                        ? 'pulse 2s infinite'
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
                                            color:
                                                index === 0
                                                    ? '#ffaa00'
                                                    : '#888',
                                            minWidth: '30px'
                                        }}
                                    >
                                        {index === 0 ? '👑' : `${index + 1}.`}
                                    </span>
                                    <span style={{fontWeight: 'bold'}}>
                                        {entry.name}
                                        {isCurrent ? ' (Jetzt)' : ''}
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
                        );
                    })}
                </div>
            </div>

            <button
                onClick={onRestart}
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
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
            `}</style>
        </div>
    );
}

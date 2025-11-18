import {useState} from 'react';
import {Card} from './Card';
import type {Card as CardType} from '../types';

interface CardGalleryProps {
    cards: CardType[];
    randomizeLayout?: boolean;
}

export function CardGallery({
    cards,
    randomizeLayout = false
}: CardGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (cards.length === 0) {
        return null;
    }

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
    };

    return (
        <div
            style={{
                marginTop: '32px',
                padding: '24px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
        >
            <h2
                style={{
                    textAlign: 'center',
                    marginBottom: '24px',
                    fontSize: '24px'
                }}
            >
                Generierte Karten ({currentIndex + 1} von {cards.length})
            </h2>

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '32px'
                }}
            >
                <button
                    onClick={handlePrevious}
                    style={{
                        padding: '12px 24px',
                        fontSize: '16px',
                        backgroundColor: '#646cff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = '#535bf2')
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = '#646cff')
                    }
                >
                    ← Zurück
                </button>

                <Card
                    card={cards[currentIndex]}
                    randomizeLayout={randomizeLayout}
                />

                <button
                    onClick={handleNext}
                    style={{
                        padding: '12px 24px',
                        fontSize: '16px',
                        backgroundColor: '#646cff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = '#535bf2')
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = '#646cff')
                    }
                >
                    Weiter →
                </button>
            </div>

            <div
                style={{
                    marginTop: '24px',
                    textAlign: 'center',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.6)'
                }}
            >
                Verwende die Pfeiltasten oder klicke auf die Buttons zum
                Blättern
            </div>
        </div>
    );
}

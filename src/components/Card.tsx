import {useState} from 'react';
import type {Card as CardType, Symbol} from '../types';

interface CardProps {
    card: CardType;
    onSymbolClick?: (symbol: Symbol) => void;
    flashColor?: 'green' | 'red' | null;
    shake?: boolean;
    flip?: boolean;
}

export function Card({
    card,
    onSymbolClick,
    flashColor,
    shake,
    flip
}: CardProps) {
    const [hoveredSymbol, setHoveredSymbol] = useState<string | null>(null);

    const getBackgroundColor = () => {
        if (flashColor === 'green') return 'rgba(34, 197, 94, 0.5)';
        if (flashColor === 'red') return 'rgba(239, 68, 68, 0.5)';
        return '#1a1a1a';
    };

    return (
        <div
            style={{
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                border: '4px solid #646cff',
                backgroundColor: getBackgroundColor(),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                transition: 'background-color 0.3s ease',
                animation: shake
                    ? 'shake 0.5s'
                    : flip
                    ? 'flip 0.6s ease-in-out'
                    : 'none'
            }}
        >
            {card.symbols.map((symbol, index) => {
                const Icon = symbol.icon;
                const angle = (index * 360) / card.symbols.length;
                const radius = 80;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;
                const isHovered = hoveredSymbol === `${card.id}-${symbol.id}`;

                return (
                    <button
                        key={`${card.id}-${symbol.id}-${index}`}
                        onClick={() => onSymbolClick?.(symbol)}
                        onMouseEnter={() =>
                            setHoveredSymbol(`${card.id}-${symbol.id}`)
                        }
                        onMouseLeave={() => setHoveredSymbol(null)}
                        style={{
                            position: 'absolute',
                            left: `calc(50% + ${x}px)`,
                            top: `calc(50% + ${y}px)`,
                            transform: isHovered
                                ? 'translate(-50%, -50%) scale(1.2)'
                                : 'translate(-50%, -50%)',
                            background: isHovered
                                ? 'rgba(100, 108, 255, 0.2)'
                                : 'none',
                            border: 'none',
                            outline: 'none',
                            cursor: onSymbolClick ? 'pointer' : 'default',
                            padding: '8px',
                            borderRadius: '8px',
                            transition: 'all 0.2s',
                            color: symbol.color
                        }}
                    >
                        {symbol.imageUrl ? (
                            <img
                                src={symbol.imageUrl}
                                alt={symbol.name}
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    objectFit: 'cover',
                                    borderRadius: '50%'
                                }}
                            />
                        ) : (
                            <Icon size={48} />
                        )}
                    </button>
                );
            })}
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
                    20%, 40%, 60%, 80% { transform: translateX(10px); }
                }
                @keyframes flip {
                    0% { transform: rotateY(0deg); }
                    50% { transform: rotateY(90deg); }
                    100% { transform: rotateY(180deg); }
                }
            `}</style>
        </div>
    );
}

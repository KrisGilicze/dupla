import {
    BASE_SYMBOL_SIZE,
    SYMBOL_PADDING,
    CARD_RADIUS,
    USABLE_RADIUS,
    TARGET_COVERAGE,
    SIZE_VARIATIONS,
    MIN_DISTANCE,
    MAX_ITERATIONS,
    PUSH_STRENGTH,
    INITIAL_RADIUS_FACTOR
} from '../lib/constants';

// Seeded random number generator for consistent randomness per card
export function seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

interface SymbolLayout {
    x: number;
    y: number;
    scale: number;
    rotation: number;
}

// Generate random layout with collision detection and balanced sizing
export function generateRandomLayout(
    symbolCount: number,
    cardId: number
): SymbolLayout[] {
    const cardArea = Math.PI * CARD_RADIUS * CARD_RADIUS;
    const targetTotalArea = cardArea * TARGET_COVERAGE;
    const avgSymbolArea = targetTotalArea / symbolCount;

    const baseSymbolArea =
        Math.PI * Math.pow((BASE_SYMBOL_SIZE + SYMBOL_PADDING * 2) / 2, 2);
    const baseScale = Math.sqrt(avgSymbolArea / baseSymbolArea);

    // Initial placement - random positions
    const layouts: SymbolLayout[] = [];

    for (let i = 0; i < symbolCount; i++) {
        const scale = baseScale * SIZE_VARIATIONS[i % SIZE_VARIATIONS.length];
        const rotation = seededRandom(cardId * 1000 + i + 100) * 360; // Full 360° rotation

        // Initial random position
        const angle = seededRandom(cardId * 1000 + i + 200) * 360;
        const radius =
            seededRandom(cardId * 1000 + i + 300) *
            (USABLE_RADIUS * INITIAL_RADIUS_FACTOR);
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        layouts.push({x, y, scale, rotation});
    }

    // Iterative collision resolution (force-directed)
    for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
        let hadCollision = false;

        for (let i = 0; i < layouts.length; i++) {
            for (let j = i + 1; j < layouts.length; j++) {
                const layout1 = layouts[i];
                const layout2 = layouts[j];

                const r1 =
                    ((BASE_SYMBOL_SIZE + SYMBOL_PADDING * 2) / 2) *
                    layout1.scale;
                const r2 =
                    ((BASE_SYMBOL_SIZE + SYMBOL_PADDING * 2) / 2) *
                    layout2.scale;

                const dx = layout2.x - layout1.x;
                const dy = layout2.y - layout1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minRequired = r1 + r2 + MIN_DISTANCE;

                if (distance < minRequired && distance > 0.1) {
                    hadCollision = true;

                    // Calculate push force
                    const overlap = minRequired - distance;
                    const pushForce = overlap * PUSH_STRENGTH;

                    // Normalize direction
                    const nx = dx / distance;
                    const ny = dy / distance;

                    // Push apart (heavier symbols push less)
                    const mass1 = layout1.scale;
                    const mass2 = layout2.scale;
                    const totalMass = mass1 + mass2;

                    const push1 = pushForce * (mass2 / totalMass);
                    const push2 = pushForce * (mass1 / totalMass);

                    layout1.x -= nx * push1;
                    layout1.y -= ny * push1;
                    layout2.x += nx * push2;
                    layout2.y += ny * push2;

                    // Keep within bounds
                    const maxDist1 = USABLE_RADIUS - r1;
                    const maxDist2 = USABLE_RADIUS - r2;
                    const dist1 = Math.sqrt(
                        layout1.x * layout1.x + layout1.y * layout1.y
                    );
                    const dist2 = Math.sqrt(
                        layout2.x * layout2.x + layout2.y * layout2.y
                    );

                    if (dist1 > maxDist1) {
                        const scale = maxDist1 / dist1;
                        layout1.x *= scale;
                        layout1.y *= scale;
                    }

                    if (dist2 > maxDist2) {
                        const scale = maxDist2 / dist2;
                        layout2.x *= scale;
                        layout2.y *= scale;
                    }
                }
            }
        }

        // Early exit if no collisions
        if (!hadCollision) {
            break;
        }
    }

    return layouts;
}

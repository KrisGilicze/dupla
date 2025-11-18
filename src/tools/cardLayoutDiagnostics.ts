// Test utilities for chaotic card layout collision detection
import {generateRandomLayout} from '../utils/layoutUtils';
import {BASE_SYMBOL_SIZE, SYMBOL_PADDING, MIN_DISTANCE} from '../lib/constants';

// Check if two circles overlap (with padding for minimum distance)
function checkCollision(
    x1: number,
    y1: number,
    r1: number,
    x2: number,
    y2: number,
    r2: number,
    minDistance: number = 10
): boolean {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < r1 + r2 + minDistance;
}

interface SymbolLayout {
    x: number;
    y: number;
    scale: number;
    rotation: number;
}

/**
 * Test 1: Check if a single card layout has any collisions
 * @param layouts - Array of symbol positions and sizes
 * @returns Object with collision info
 */
export function detectCollisions(layouts: SymbolLayout[]): {
    hasCollisions: boolean;
    collisionCount: number;
    collisionPairs: Array<{
        i: number;
        j: number;
        distance: number;
        minRequired: number;
    }>;
} {
    const collisionPairs: Array<{
        i: number;
        j: number;
        distance: number;
        minRequired: number;
    }> = [];

    for (let i = 0; i < layouts.length; i++) {
        for (let j = i + 1; j < layouts.length; j++) {
            const layout1 = layouts[i];
            const layout2 = layouts[j];

            const r1 =
                ((BASE_SYMBOL_SIZE + SYMBOL_PADDING * 2) / 2) * layout1.scale;
            const r2 =
                ((BASE_SYMBOL_SIZE + SYMBOL_PADDING * 2) / 2) * layout2.scale;

            if (
                checkCollision(
                    layout1.x,
                    layout1.y,
                    r1,
                    layout2.x,
                    layout2.y,
                    r2,
                    MIN_DISTANCE
                )
            ) {
                const dx = layout2.x - layout1.x;
                const dy = layout2.y - layout1.y;
                const actualDistance = Math.sqrt(dx * dx + dy * dy);
                const minRequired = r1 + r2 + MIN_DISTANCE;

                collisionPairs.push({
                    i,
                    j,
                    distance: actualDistance,
                    minRequired
                });
            }
        }
    }

    return {
        hasCollisions: collisionPairs.length > 0,
        collisionCount: collisionPairs.length,
        collisionPairs
    };
}

/**
 * Test 2: Generate multiple card layouts and check collision rate
 * @param numCards - Number of cards to generate
 * @param symbolsPerCard - Number of symbols per card
 * @returns Statistics about collision rate
 */
export function testMultipleCardLayouts(
    numCards: number = 100,
    symbolsPerCard: number = 6
): {
    totalCards: number;
    cardsWithCollisions: number;
    collisionRate: number;
    totalCollisions: number;
    avgCollisionsPerCard: number;
    details: Array<{
        cardId: number;
        hasCollisions: boolean;
        collisionCount: number;
    }>;
} {
    const results: Array<{
        cardId: number;
        hasCollisions: boolean;
        collisionCount: number;
    }> = [];
    let totalCollisions = 0;
    let cardsWithCollisions = 0;

    console.log(
        `\n🧪 Testing ${numCards} cards with ${symbolsPerCard} symbols each...\n`
    );

    for (let cardId = 0; cardId < numCards; cardId++) {
        const layout = generateRandomLayout(symbolsPerCard, cardId);
        const collisionResult = detectCollisions(layout);

        results.push({
            cardId,
            hasCollisions: collisionResult.hasCollisions,
            collisionCount: collisionResult.collisionCount
        });

        if (collisionResult.hasCollisions) {
            cardsWithCollisions++;
            totalCollisions += collisionResult.collisionCount;

            // Log details for first few problematic cards
            if (cardsWithCollisions <= 5) {
                console.log(
                    `❌ Card ${cardId}: ${collisionResult.collisionCount} collision(s)`
                );
                collisionResult.collisionPairs.forEach((pair) => {
                    console.log(
                        `   Symbol ${pair.i} ↔ Symbol ${
                            pair.j
                        }: distance=${pair.distance.toFixed(
                            2
                        )}px, required=${pair.minRequired.toFixed(
                            2
                        )}px, overlap=${(
                            pair.minRequired - pair.distance
                        ).toFixed(2)}px`
                    );
                });
            }
        }
    }

    const collisionRate = (cardsWithCollisions / numCards) * 100;
    const avgCollisionsPerCard = totalCollisions / numCards;

    console.log(`\n📊 Results:`);
    console.log(`   Total cards tested: ${numCards}`);
    console.log(`   Cards with collisions: ${cardsWithCollisions}`);
    console.log(`   Collision rate: ${collisionRate.toFixed(2)}%`);
    console.log(`   Total collisions: ${totalCollisions}`);
    console.log(
        `   Avg collisions per card: ${avgCollisionsPerCard.toFixed(2)}`
    );
    console.log(`   Success rate: ${(100 - collisionRate).toFixed(2)}%\n`);

    return {
        totalCards: numCards,
        cardsWithCollisions,
        collisionRate,
        totalCollisions,
        avgCollisionsPerCard,
        details: results
    };
}

/**
 * Run all tests
 */
export function runAllTests() {
    console.log('═══════════════════════════════════════════════════');
    console.log('🧪 Card Layout Collision Detection Tests');
    console.log('═══════════════════════════════════════════════════');

    // Test with different symbol counts
    console.log('\n📋 Test Set 1: 6 symbols per card (typical)');
    const test1 = testMultipleCardLayouts(100, 6);

    console.log('\n📋 Test Set 2: 3 symbols per card (easy)');
    const test2 = testMultipleCardLayouts(100, 3);

    console.log('\n📋 Test Set 3: 7 symbols per card (standard Dobble)');
    const test3 = testMultipleCardLayouts(100, 7);

    console.log('\n📋 Test Set 4: 4 symbols per card');
    const test4 = testMultipleCardLayouts(100, 4);

    console.log('\n═══════════════════════════════════════════════════');
    console.log('📈 Summary:');
    console.log(
        `   3 symbols: ${(100 - test2.collisionRate).toFixed(1)}% success`
    );
    console.log(
        `   4 symbols: ${(100 - test4.collisionRate).toFixed(1)}% success`
    );
    console.log(
        `   6 symbols: ${(100 - test1.collisionRate).toFixed(1)}% success`
    );
    console.log(
        `   7 symbols: ${(100 - test3.collisionRate).toFixed(1)}% success`
    );
    console.log('═══════════════════════════════════════════════════\n');

    return {test1, test2, test3, test4};
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
    // Node.js environment
    runAllTests();
}

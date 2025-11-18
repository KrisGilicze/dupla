#!/usr/bin/env tsx
/**
 * Script zum Anzeigen und Exportieren des Familie Grüber Kartensatzes
 *
 * Verwendung:
 *   npx tsx src/showFamilyCards.ts
 */

import {printFamilyCards, exportFamilyCardsAsJSON} from './familyCards';
import {writeFileSync} from 'fs';
import {join} from 'path';

// Zeige Kartensatz in der Konsole
printFamilyCards();

// Exportiere als JSON-Datei
const jsonOutput = exportFamilyCardsAsJSON();
const outputPath = join(process.cwd(), 'familie-grueber-dobble.json');

try {
    writeFileSync(outputPath, jsonOutput, 'utf-8');
    console.log(`\n✅ Kartensatz exportiert nach: ${outputPath}`);
} catch (error) {
    console.error('❌ Fehler beim Exportieren:', error);
}

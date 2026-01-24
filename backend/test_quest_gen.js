import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateProceduralQuests } from './src/services/geminiService.js';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

async function runTest() {
    try {
        console.log("🚀 Testing Quest Generation Logic...");

        // Mock Transactions
        const mockTransactions = [
            { category: 'Dining', amount: 50.00, description: 'Fancy Steak' },
            { category: 'Dining', amount: 15.00, description: 'Coffee Shop' },
            { category: 'Shopping', amount: 120.00, description: 'New Shoes' },
            { category: 'Utilities', amount: 80.00, description: 'Electric Bill' },
            { category: 'Dining', amount: 25.00, description: 'Pizza Night' },
        ];

        console.log("📊 Mock Transactions:", mockTransactions.length);

        const quests = await generateProceduralQuests(mockTransactions);

        console.log("\n✅ Generated Quests:", quests.length);

        quests.forEach((quest, i) => {
            console.log(`\nQuest ${i + 1}: ${quest.title} [${quest.type}]`);
            console.log(`Reason: ${quest.generated_reason}`);
            console.log(`Questions: ${quest.questions.length}`);
            quest.questions.forEach((q, j) => {
                console.log(`  Q${j + 1} (${q.context_source}): ${q.question.substring(0, 60)}...`);
            });

            if (quest.questions.length !== 4) {
                console.error(`  ❌ ERROR: Expected 4 questions, got ${quest.questions.length}`);
            } else {
                // Check mix
                const personal = quest.questions.filter(q => q.context_source === 'transaction' || q.context_source === 'user').length; // Gemini might label it variously, checking prompt instructions
                // Actually my prompt said "context_source": "transaction" for Q1-Q3 and "theory" for Q4.
                const theory = quest.questions.filter(q => q.context_source === 'theory').length;
                console.log(`  Structure: ${4 - theory} Personal / ${theory} General`);
            }
        });

    } catch (error) {
        console.error("❌ Test Failed:", error);
    }
}

runTest();

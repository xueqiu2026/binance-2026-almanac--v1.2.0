import { getEventContent } from '../data/staticEvents';

console.log(':: ALMANAC DATA INTEGRITY CHECK ::');

let errorCount = 0;
let totalDays = 0;

const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

for (let m = 0; m < 12; m++) {
    const daysInMonth = months[m];
    for (let d = 1; d <= daysInMonth; d++) {
        totalDays++;

        try {
            const event = getEventContent(m, d);

            if (!event) {
                console.error(`[MISSING] No data returned for Month ${m}, Day ${d}`);
                errorCount++;
                continue;
            }

            if (!event.mood) {
                console.error(`[INVALID] Missing Mood for ${m}-${d}`);
                errorCount++;
            }
            if (!event.title) {
                console.error(`[INVALID] Missing Title for ${m}-${d}`);
                errorCount++;
            }
            if (!event.description) {
                console.error(`[INVALID] Missing Description for ${m}-${d}`);
                errorCount++;
            }
        } catch (e) {
            console.error(`[EXCEPTION] Error fetching data for ${m}-${d}:`, e);
            errorCount++;
        }
    }
}

if (errorCount === 0) {
    console.log(`✅ SUCCESS: All ${totalDays} days verified. Data is intact.`);
    process.exit(0);
} else {
    console.error(`❌ FAILED: Found ${errorCount} errors.`);
    process.exit(1);
}

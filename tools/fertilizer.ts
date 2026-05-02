import { defineTool } from 'wa-agent/tools/types';
import { z } from 'zod';

export default defineTool({
  description: 'Give fertilizer recommendations for coffee plants based on growth stage and visible symptoms',
  inputSchema: z.object({
    stage: z.enum(['seedling', 'young', 'mature', 'post-harvest']),
    symptoms: z.string().describe('What does the plant look like — yellowing, pale, stunted, healthy, flowering, etc.'),
    organic_preferred: z.boolean().optional().describe('Does the farmer want organic options only?'),
    budget: z.enum(['very-low', 'low', 'medium']).optional().describe('Rough budget level'),
  }),
  execute: async ({ stage, symptoms, organic_preferred, budget }) => {
    const s = symptoms.toLowerCase();

    const deficiency = s.includes('yellow') || s.includes('pale')
      ? 'nitrogen'
      : s.includes('purple') || s.includes('dark')
      ? 'phosphorus'
      : s.includes('brown edge') || s.includes('leaf edge')
      ? 'potassium'
      : s.includes('stunt') || s.includes('small')
      ? 'general-nutrient'
      : 'none-detected';

    const deficiency_notes: Record<string, {english: string, luganda: string}> = {
      nitrogen: {
        english: 'Yellowing leaves = Nitrogen deficiency. Prioritize nitrogen-rich fertilizer (CAN, urea, or green manure). Apply immediately at start of next rain.',
        luganda: 'Amakka ag\'obuzeleze = Okuyabika kwa nitrogen. Teeka feteleza ey\'omuto wa nitrogen (CAN, urea, oba mboleo ey\'omubisi) mu ntandika y\'enkuba ey\'eduuse.'
      },
      phosphorus: {
        english: 'Purple/dark leaves = Phosphorus deficiency. Apply DAP or bone meal. Check if soil pH is too high — phosphorus locks up in alkaline soil.',
        luganda: 'Amakka g\'olukaaga = Okuyabika kwa phosphorus. Teeka DAP oba mfupa. Noonya pH y\'ettaka — phosphorus eyitirirwa mu ttaka erirumbuka.'
      },
      potassium: {
        english: 'Brown leaf edges = Potassium deficiency. Apply Muriate of Potash (MOP) or wood ash. Very common after heavy harvest.',
        luganda: 'Enkomerero z\'amakka ezibuudu = Okuyabika kwa potassium. Teeka MOP oba evu ery\'emiti. Ekigaziwa nnyo oluvannyuma lw\'okusola ebibala bingi.'
      },
      'general-nutrient': {
        english: 'Stunted growth = general nutrient deficiency. Start with balanced NPK fertilizer and add organic matter to improve soil structure.',
        luganda: 'Okukula kwa mpangu = okuyabika kwa nutirienti ezonna. Tandika ne feteleza e\'NPK n\'eteeka ebintu eby\'obutaka okwongera emikono y\'ettaka.'
      },
      'none-detected': {
        english: 'No specific deficiency detected from description. Follow standard fertilizer schedule below.',
        luganda: 'Okuyabika kungi tokurabika mu nsimbi y\'obukobbi. Goberera pulani ya feteleza ey\'ennono eno wansi.'
      }
    };

    const schedules: Record<string, {chemical: string, organic: string, timing: string, luganda: string}> = {
      seedling: {
        chemical: 'DAP: 5g (one teaspoon) per seedling mixed into planting hole soil. After 3 months: CAN 5g per seedling.',
        organic: 'Well-rotted cow or goat manure: 1 small cup (250ml) per seedling mixed with topsoil. Reapply every 2 months.',
        timing: 'Apply only when soil is moist (after rain). Never to dry soil. Do not touch fertilizer directly to roots or stem.',
        luganda: 'Teeka feteleza nga ttaka lirina amazzi. Togira ku ttaka erikalu. Togikwatako ku biizi oba ku muti.'
      },
      young: {
        chemical: 'CAN (27%N): 25g per plant at start of rains. NPK 17-17-17: 50g per plant at mid-season (July or January).',
        organic: 'Compost: 2kg per plant applied in ring 30cm from stem. Wood ash: 1 cup per plant for potassium. Mulch on top.',
        timing: 'Two times per year: March-April (long rains) and September-October (short rains).',
        luganda: 'Emirundi ebiri mu mwaka: Marisi-Apuli (enkuba ennene) ne Sebutembagye-Okitobba (enkuba entono). Teeka mu nzingoziingo (cm 30 okuva ku muti).'
      },
      mature: {
        chemical: 'NPK 17-17-17: 100-150g per plant at start of rains. CAN 50g top-dress at flowering stage.',
        organic: 'Compost 5kg per plant + 200g wood ash. Coffee pulp compost (from your own harvest) is excellent — rich in nutrients.',
        timing: 'March-April and September-October. Apply in ring 50cm from stem. Cover with soil. Water if no rain within 5 days.',
        luganda: 'Marisi-Apuli ne Sebutembagye-Okitobba. Teeka mu nzingoziingo cm 50 okuva ku muti. Bunikako ettaka. Nawula singa enkuba etejooka mu nnaku 5.'
      },
      'post-harvest': {
        chemical: 'Muriate of Potash (MOP) 60-0-60: 50g per plant for recovery. After 4 weeks add CAN 50g per plant.',
        organic: 'Coffee pulp compost: 3-5kg per plant immediately after harvest. This recycles nutrients back into soil.',
        timing: 'Apply immediately after all harvesting is complete. Do not wait — plant needs nutrients to recover and set fruit for next season.',
        luganda: 'Teeka amangu oluvannyuma lw\'okusola kwona. Tolindiriranga — omuti gutaaga nutirienti okwonka n\'okutegeka ebibala by\'omwaka omujja.'
      }
    };

    const schedule = schedules[stage];

    return {
      stage,
      deficiency_diagnosis: deficiency_notes[deficiency],
      recommendation: organic_preferred
        ? { type: 'Organic', details: schedule.organic }
        : budget === 'very-low'
        ? { type: 'Organic (budget)', details: schedule.organic }
        : { type: 'Both options', chemical: schedule.chemical, organic: schedule.organic },
      application_timing: schedule.timing,
      luganda_timing: schedule.luganda,
      important_reminders: [
        'Never apply fertilizer to dry soil — always wait for rain or water first',
        'Apply in a ring around the plant, not touching the stem',
        'Cover fertilizer with a thin layer of soil after applying',
        'Keep records of what you applied and when for best results'
      ]
    };
  },
});

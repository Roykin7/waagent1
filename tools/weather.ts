import { defineTool } from 'wa-agent/tools/types';
import { z } from 'zod';

export default defineTool({
  description: 'Get current weather for a Uganda district and give coffee-specific farming advice based on conditions',
  inputSchema: z.object({
    location: z.string().describe('District or town name in Uganda, e.g. Masaka, Mbale, Mbarara, Kasese'),
  }),
  execute: async ({ location }) => {
    try {
      const response = await fetch(
        `https://wttr.in/${encodeURIComponent(location + ', Uganda')}?format=j1`
      );
      const data = await response.json();
      const current = data.current_condition[0];

      const temp = parseFloat(current.temp_C);
      const humidity = parseFloat(current.humidity);
      const rainfall = parseFloat(current.precipMM);
      const conditions = current.weatherDesc[0].value;

      let advice = '';
      let advice_luganda = '';

      if (rainfall > 10) {
        advice = 'Heavy rain today. Do NOT spray pesticides or fungicides — rain will wash them away and waste money. Good time to apply fertilizer to moist soil. Watch for fungal diseases in coming days — inspect leaves carefully.';
        advice_luganda = 'Enkuba engi leero. TOGIRA dawu — enkuba egisamba, pesa ewangaala. Bbanga ery\'okuteeka feteleza ku ttaka eria mazzi. Laba obulwadde bwa bbufungisi mu nnaku ezijja — noonya amakka bulungi.';
      } else if (rainfall > 2) {
        advice = 'Light rain — good conditions for farming. Safe to apply fertilizer. Wait for leaves to dry before spraying fungicide or pesticide for best absorption.';
        advice_luganda = 'Enkuba entono — ebiseera ebirungi oku kulima. Kirungi okuteeka feteleza. Linda amakka gayume nga bw\'ogira omuti wa dawu, okusasirira bulungi.';
      } else if (humidity > 80) {
        advice = 'High humidity without rain — high risk of Coffee Leaf Rust and CBD. Spray copper fungicide today as prevention. Avoid overhead irrigation.';
        advice_luganda = 'Obukkuufu obungi nga nkuba teyatonyenga — obuyinza obungi bwa Omusujja ne CBD. Gira omuti gwa copper fungicide leero ng\'obirinda. Ggyamu okukozesa amazzi ag\'okugyaguza.';
      } else if (temp > 30) {
        advice = 'Very hot today. Coffee plants may stress. Ensure mulching (10-15cm layer) to retain moisture. Water seedlings and young plants in the evening. Avoid fertilizing in this heat — wait for cooler day.';
        advice_luganda = 'Ebbugumu ery\'ennyo leero. Emiti gy\'akawuufu giyinza okumalawo. Siiga lusaala (cm 10-15) okuwonyereza amazzi. Nawula ensigo n\'emiti emirungi eigulo. Togira feteleza mu buggumu — linda lunaku oluziba.';
      } else if (temp < 16) {
        advice = 'Cool temperatures — low disease pressure. Good day for pruning and manual pest control. Avoid planting seedlings on cold days.';
        advice_luganda = 'Empewo etezimbula — obuyinza obunono bw\'obulwadde. Lunaku olurungi okutema n\'okukubirira ensolo. Togimba ensigo mu nnaku ez\'empewo.';
      } else {
        advice = 'Good farming conditions today. Suitable for spraying, fertilizing, pruning, or planting. Inspect your farm carefully and check for early signs of disease.';
        advice_luganda = 'Ebiseera ebirungi eby\'okulima leero. Kirungi okugira, okuteeka feteleza, okutema oba okusima. Noonya ennimiro yo bulungi olabe ebimanyiso by\'obulwadde eby\'okusooka.';
      }

      return {
        location,
        temperature_celsius: temp,
        humidity_percent: humidity,
        rainfall_mm_today: rainfall,
        conditions,
        coffee_farming_advice: advice,
        coffee_farming_advice_luganda: advice_luganda,
        data_source: 'wttr.in real-time weather'
      };
    } catch {
      return {
        error: true,
        message: `Could not get weather for ${location}. Ask the farmer to describe current conditions — is it raining, sunny, cloudy, or humid?`
      };
    }
  },
});

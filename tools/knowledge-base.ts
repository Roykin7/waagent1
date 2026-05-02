import { defineTool } from 'wa-agent/tools/types';
import { z } from 'zod';

export default defineTool({
  description: 'Answer common coffee agronomy questions from a knowledge base built for Ugandan smallholder farmers',
  inputSchema: z.object({
    question: z.string().describe('The farmer question or topic — search for relevant knowledge base entry'),
    language: z.string().optional().describe('Language of response needed: english or luganda'),
  }),
  execute: async ({ question, language }) => {
    const q = question.toLowerCase();

    const entries = [
      {
        keywords: ['spacing', 'distance', 'apart', 'how far', 'plant plant'],
        topic: 'Planting Spacing',
        answer: 'Robusta coffee: plant 3 meters apart in all directions (gives about 1,100 plants per hectare). Arabica coffee: plant 2.5 meters apart. Always plant in straight rows using string lines — makes weeding and spraying much easier.',
        luganda: 'Robusta: sima emiti 3m-3m (emiti 1,100 ku hectare). Arabica: 2.5m-2.5m. Simanga mu mitsira egy\'ololevu kozesa ssiga — bikola okulima n\'okugira dawu obulungi.'
      },
      {
        keywords: ['seedling', 'nursery', 'germinate', 'seed', 'grow from', 'start'],
        topic: 'Seedling Production',
        answer: 'Use certified seeds from UCDA (Uganda Coffee Development Authority) registered nurseries only. Germination takes 4-6 weeks. Keep seedlings in partial shade with regular watering. Ready to transplant at 6-9 months when they have 4-6 pairs of leaves and are 30-40cm tall. Cost of UCDA certified seedlings: approximately UGX 500-1000 each.',
        luganda: 'Kozesa ensigo ezivaako ku nursery eyewandiisiddwa ku UCDA. Ensigo egyimuka mu wiiki 4-6. Ensigo zitegekera okusindikwa mu myezi 6-9 nga zirina amakka 4-6 n\'obuwanvu bwa cm 30-40. Omuwendo: UGX 500-1000 ku nsigo.'
      },
      {
        keywords: ['price', 'sell', 'market', 'money', 'how much', 'cooperative', 'ucda', 'value', 'grade'],
        topic: 'Coffee Prices and Marketing',
        answer: 'Coffee prices change daily. For today\'s price: call your nearest UCDA office or check with your local cooperative. Selling through farmer cooperatives usually gives 15-30% better prices than roadside dealers. Dry cherry (kiboko) fetches better prices than fresh cherry. Screen/grade your coffee — bigger beans get premium prices. Keep coffee dry and store in clean sacks — moisture destroys quality.',
        luganda: 'Emiwendo gya kawuufu gikyuka buli lunaku. Kuba telefoni UCDA oba cooperative yo. Okutunda mu cooperative kuleeta emiwendo gemisingawo eri ba dealer 15-30%. Kiboko (kawuufu ekiyumikirwa) ewaayo omuwendo omuwanvu. Gbagula kawuufu yo — ebibala ebinene bijjuza omuwendo.'
      },
      {
        keywords: ['shade', 'tree', 'shade tree', 'sun', 'light', 'banana', 'mango', 'intercrop'],
        topic: 'Shade Management and Intercropping',
        answer: 'Coffee grows best with 30-40% shade. Best shade trees: Grevillea (grows fast, does not compete much), Calliandra (nitrogen-fixer, good mulch), Sesbania, Musizi. Banana is excellent — extra income plus shade plus mulch material. Avoid heavy shade from mango and jackfruit — too dense. Intercrop with beans or groundnuts in the first 2 years while coffee establishes — good extra income.',
        luganda: 'Kawuufu emera bulungi mu kitiiti 30-40%. Emiti emirungi: Grevillea (emera mangu), Calliandra (egyongeramu nitrogen), ebitooke (emyanzi, enguudo z\'okusirika). Weewale eddungu ery\'emiyembe. Mu myaka 2 egy\'okusooka: sima ebijanjaalo n\'ekawuufu — etaasa ensimbi nga otegeereza.'
      },
      {
        keywords: ['water', 'irrigat', 'drought', 'dry spell', 'no rain', 'rain', 'moisture'],
        topic: 'Water Management',
        answer: 'Coffee needs 1,200-2,000mm of rainfall per year. Signs of water stress: leaves wilt in afternoon, pale color, berry drop. Solutions: (1) Mulch 10-15cm deep around each plant to hold moisture (2) Dig water retention trenches on slopes (3) Water seedlings every 2 days in dry spells. Overwatering also harmful — ensure good drainage. Waterlogged soil causes root rot.',
        luganda: 'Kawuufu etaaga enkuba mm 1200-2000 mu mwaka. Ebimanyiso by\'okuggwaamu amazzi: amakka gakakala eigulo, ga ntuufu, ebibala biyirika. Ebikuuma: (1) Siiga lusaala cm 10-15 (2) Timba emigga okusangira amazzi ku lusozi (3) Nawula ensigo buli ennaku 2. Amazzi amangi aga nnyo kabi — longoosa okuyiika.'
      },
      {
        keywords: ['organic', 'compost', 'manure', 'natural', 'chemical-free', 'organic farming'],
        topic: 'Organic Farming and Compost',
        answer: 'Excellent organic inputs available on most Ugandan farms: (1) Cow/goat manure — compost for 3 months before use (2) Coffee pulp from your own harvest — very rich in nutrients (3) Wood ash — good potassium source, use 1 cup per plant (4) Tithonia (Mexican sunflower/ekinyonyi) — chop and bury around plants, excellent nitrogen (5) Crop residues and kitchen waste. Organic farming can qualify for premium price certification through UCDA or private buyers.',
        luganda: 'Ebintu eby\'obutaka ebirungi: (1) Mboleo ya nte/embuzi — igumise myezi 3 edda (2) Amakungula g\'akawuufu — egyongeramu nutirienti ennene (3) Evu ery\'emiti — potassium — kozesa kikopo 1 ku muti (4) Tithonia (ekinyonyi) — menya n\'oyimike wakati w\'omuti (5) Emisisa n\'ebisirimu. Okulima eby\'obutaka kuyinza okuwa omuwendo ogw\'amaanyi.'
      },
      {
        keywords: ['coffee variety', 'robusta', 'arabica', 'which variety', 'type of coffee'],
        topic: 'Coffee Varieties in Uganda',
        answer: 'Uganda grows mainly two types: (1) ROBUSTA — native to Uganda (Lake Victoria region), grows 0-1500m altitude, more resistant to disease, easier to grow, matures at 2-3 years. (2) ARABICA — grown in highlands (Mt Elgon, Rwenzori, Kisoro), needs 1200m+ altitude, premium price but more disease-prone, matures at 3-4 years. Choose based on your altitude and district. Ask your nearest UCDA office which variety is recommended for your area.',
        luganda: 'Uganda esima ebyobulungi bibiri: (1) ROBUSTA — evudde mu Uganda (enfuuzi za Lake Victoria), eyimera altitude 0-1500m, edda obulwadde obungi, emala emyaka 2-3. (2) ARABICA — eyimera ku lusozi (Mt Elgon, Rwenzori), yetaaga altitude 1200m+, omuwendo omuwanvu naye yewalaganira obulwadde, emala emyaka 3-4. Buuza UCDA eky\'omuwendo ky\'ennimiro yo.'
      },
      {
        keywords: ['yield', 'production', 'how much', 'per tree', 'per acre', 'per hectare', 'harvest much'],
        topic: 'Expected Yields',
        answer: 'A healthy mature Robusta tree yields 1-3kg of fresh cherry per year (1kg fresh cherry = approximately 200g dry coffee). With good management: 2,000-4,000kg fresh cherry per hectare. Poor management: below 500kg per hectare. First harvest comes at 2-3 years. Full production at 4-5 years. Trees can produce for 30-50 years with proper pruning.',
        luganda: 'Omuti omutuukiridde gwa Robusta gutunda kg 1-3 z\'ebibala ebiragala mu mwaka (kg 1 z\'ebibala ebiragala = kg 0.2 y\'akawuufu akayumikirwa). Okulima obutuukiridde: kg 2000-4000 ku hectare. Okusola kw\'okusooka emyaka 2-3. Okusola okukubbiririzamu emyaka 4-5. Emiti giyinza okusola emyaka 30-50 nga gitemebwa bulungi.'
      },
      {
        keywords: ['ucda', 'extension', 'government', 'subsidy', 'support', 'training', 'help'],
        topic: 'Government Support and UCDA',
        answer: 'Uganda Coffee Development Authority (UCDA) provides: free extension officer visits to farms, certified seedling sources, training on good agronomy practices, market price information, organic certification support. Contact UCDA: +256 414 256 996 | ucda.co.ug. Your district agriculture office also has free extension workers — request a farm visit.',
        luganda: 'UCDA (Uganda Coffee Development Authority) ewaayo: okukyalira nnimiro ofuba, ensigo ezituukiridde, okuyigiriza okulima oburungi, emiwendo gya olusozi, obuyambi bw\'okufuna sitifikeeti y\'okulima eby\'obutaka. Kuba telefoni UCDA: +256 414 256 996.'
      }
    ];

    for (const entry of entries) {
      if (entry.keywords.some(kw => q.includes(kw))) {
        return {
          found: true,
          topic: entry.topic,
          answer_english: entry.answer,
          answer_luganda: entry.luganda
        };
      }
    }

    return {
      found: false,
      searched_for: question,
      message: 'No specific entry found in knowledge base. Use your general agronomy expertise to answer. If unsure, tell the farmer you will find out and use the web-search tool to look it up.',
      suggestion: 'Consider adding this question to the knowledge base for future farmers.'
    };
  },
});

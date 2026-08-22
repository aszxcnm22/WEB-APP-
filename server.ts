import express, { Request, Response } from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { PREBUILT_VOCABULARY } from './src/data/hskData';

dotenv.config({ path: ['.env.local', '.env'] });

const app = express();
const PORT = 3000;

// Body parser with size limits for handwriting images
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured. Add it to .env.local to use Gemini features.');
  }

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function getOfflineVocabulary(system: 'traditional' | 'new', level: string, existingWords: string[]) {
  const levelWords = PREBUILT_VOCABULARY[system][level] || [];
  const availableWords = levelWords.filter((word) => !existingWords.includes(word.character));
  const fallbackWords = Object.values(PREBUILT_VOCABULARY[system])
    .flat()
    .filter((word) => !existingWords.includes(word.character));
  const sourceWords = availableWords.length >= 5 ? availableWords : fallbackWords;

  return sourceWords.slice(0, 5).map((word, index) => ({
    ...word,
    id: `offline_${system}_${level}_${Date.now()}_${index}`,
  }));
}

// Helper to call generateContent with retry and fallback
async function generateContentWithRetry(params: {
  model: string;
  contents: any;
  config?: any;
}) {
  const maxRetries = 3;
  let delay = 1000;
  let lastError: any = null;
  const ai = getGeminiClient();

  // Attempt the requested model first, then fallback to gemini-3.5-flash
  const modelsToTry = [params.model];
  if (params.model !== 'gemini-3.5-flash') {
    modelsToTry.push('gemini-3.5-flash');
  }

  for (const model of modelsToTry) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Sending request to ${model} (attempt ${attempt}/${maxRetries})...`);
        const response = await ai.models.generateContent({
          ...params,
          model,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        console.error(`Attempt ${attempt} failed for model ${model}:`, err);

        const isTransient = 
          err.status === 503 || 
          err.statusCode === 503 || 
          err.status === 429 || 
          err.statusCode === 429 ||
          (err.message && (
            err.message.includes('503') || 
            err.message.includes('429') || 
            err.message.includes('high demand') || 
            err.message.includes('UNAVAILABLE') ||
            err.message.includes('unavailable')
          ));

        if (isTransient && attempt < maxRetries) {
          const jitter = Math.random() * 200;
          const waitTime = delay * attempt + jitter;
          console.log(`Waiting ${waitTime.toFixed(0)}ms before retrying transient error...`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        } else {
          // Break to try fallback model
          break;
        }
      }
    }
  }

  throw lastError;
}

// API Routes
// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 2. Generate dynamic vocabulary words using Gemini
app.post('/api/generate-vocab', async (req: Request, res: Response) => {
  try {
    const { system, level, existingWords = [] } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        offline: true,
        words: getOfflineVocabulary(system, level, existingWords),
      });
    }

    const systemLabel = system === 'traditional' ? 'Traditional HSK (6 Levels)' : 'New HSK (3 Stages 9 Levels)';
    const prompt = `You are a professional Chinese language teacher teaching Thai students.
Generate a list of 5 new, useful, and high-frequency Chinese vocabulary words for Level ${level} of the ${systemLabel} system.
Do NOT include any of the following already listed words: ${existingWords.join(', ')}.

Ensure that the words represent authentic Chinese usage appropriate for Level ${level}:
- Level 1-3 should be fundamental daily words.
- Level 4-6 should be more complex or formal terms for general work/studies.
- Level 7-9 (if New HSK) should be advanced vocabulary, idioms (成语), or specialized professional terms.

Explain meanings in both Thai and English. Provide an interesting, natural daily life example sentence for each word.`;

    const response = await generateContentWithRetry({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an elite Chinese teacher specializing in bilingual education (Thai and English) for HSK preparation.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          description: 'A list of 5 vocabulary items.',
          items: {
            type: Type.OBJECT,
            properties: {
              character: { type: Type.STRING, description: 'The Chinese character(s) (Simplified Chinese).' },
              pinyin: { type: Type.STRING, description: 'The standard Pinyin with tone marks.' },
              thaiMeaning: { type: Type.STRING, description: 'Clear Thai translation/meaning.' },
              englishMeaning: { type: Type.STRING, description: 'Clear English translation/meaning.' },
              pos: { type: Type.STRING, description: 'Part of speech, in English, e.g., Noun, Verb, Adjective, Adverb, Idiom.' },
              exampleSentence: { type: Type.STRING, description: 'An example sentence using the word (in Simplified Chinese).' },
              examplePinyin: { type: Type.STRING, description: 'Standard Pinyin for the example sentence.' },
              exampleThai: { type: Type.STRING, description: 'A natural Thai translation of the example sentence.' },
              exampleEnglish: { type: Type.STRING, description: 'A natural English translation of the example sentence.' }
            },
            required: [
              'character',
              'pinyin',
              'thaiMeaning',
              'englishMeaning',
              'pos',
              'exampleSentence',
              'examplePinyin',
              'exampleThai',
              'exampleEnglish'
            ]
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('No content returned from Gemini.');
    }

    const data = JSON.parse(text);
    // Generate unique client IDs for the returned list
    const enrichedData = data.map((item: any, index: number) => ({
      id: `ai_gen_${system}_${level}_${Date.now()}_${index}`,
      ...item
    }));

    res.json({ success: true, words: enrichedData });
  } catch (error: any) {
    console.error('Error in generate-vocab API:', error);
    const { system, level, existingWords = [] } = req.body;
    const errorText = error.message || '';
    const normalizedError = errorText.toLowerCase();
    const isTemporaryError =
      error.status === 429 ||
      error.statusCode === 429 ||
      error.status === 503 ||
      error.statusCode === 503 ||
      errorText.includes('429') ||
      errorText.includes('503') ||
      normalizedError.includes('quota') ||
      normalizedError.includes('unavailable') ||
      normalizedError.includes('high demand');

    if (isTemporaryError) {
      return res.json({
        success: true,
        offline: true,
        words: getOfflineVocabulary(system, level, existingWords),
      });
    }

    res.status(500).json({ success: false, error: error.message || 'Failed to generate vocabulary.' });
  }
});

// 3. Verify character handwriting
app.post('/api/verify-character', async (req: Request, res: Response) => {
  try {
    const { expectedCharacter, expectedPinyin, image } = req.body;

    if (!expectedCharacter || !image) {
      return res.status(400).json({ success: false, error: 'Character and image data are required.' });
    }

    // Extract base64 payload
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ success: false, error: 'Invalid image format.' });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    const imagePart = {
      inlineData: {
        mimeType,
        data: base64Data,
      },
    };

    const prompt = `You are an expert Chinese calligrapher and character writing teacher.
Analyze the user's handdrawn stroke artwork on the provided grid canvas, which is an attempt to write the character: "${expectedCharacter}" (Pinyin: ${expectedPinyin}).

Review the handwriting thoroughly and provide structured feedback.
Consider:
1. General legibility and correctness (is it the correct character? are there any strokes missing or added incorrectly?).
2. Stroke formation, length, direction, and placement on the Chinese "Mi Zi Ge" (米字格) square grid.
3. Aesthetic balance, proportions, spacing, and calligraphic alignment.

All explanations and feedback MUST be written in Thai.
Rate the quality and accuracy, assigning an overall score out of 100.
Be encouraging yet constructively helpful in pointing out where they can adjust the stroke size or alignment.`;

    const response = await generateContentWithRetry({
      model: 'gemini-3.7-flash',
      contents: [imagePart, { text: prompt }],
      config: {
        systemInstruction: 'You are an encouraging and expert Chinese calligraphy tutor providing detailed written feedback in Thai.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: 'Overall score from 0 (completely wrong) to 100 (perfect calligraphy).' },
            accuracy: { type: Type.STRING, description: 'Overall accuracy rating: "excellent", "good", "fair", or "poor".' },
            strokesFeedback: { type: Type.STRING, description: 'Detailed feedback in Thai on stroke shapes, directions, count, and alignment.' },
            proportionsFeedback: { type: Type.STRING, description: 'Detailed feedback in Thai on grid layout, balance, spacing, and size proportions.' },
            generalAdvice: { type: Type.STRING, description: 'A final encouraging, actionable advice block in Thai for mastering this character.' }
          },
          required: ['score', 'accuracy', 'strokesFeedback', 'proportionsFeedback', 'generalAdvice']
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('No feedback returned from Gemini.');
    }

    const feedback = JSON.parse(text);
    res.json({ success: true, feedback });
  } catch (error: any) {
    console.error('Error in verify-character API:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to analyze character.' });
  }
});

// Setup development server or production assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();

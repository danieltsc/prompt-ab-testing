import { Router } from 'express';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat';

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

/**
 * POST /abtest
 * Body: {
 *   testCases: Array<{ id: number; text: string }>;
 *   variants: Array<{ id: string; template: string }>;
 *   selectedVariant?: string;
 * }
 * Response: Record<number, string>
 */
router.post('/', async (req, res) => {
  const { testCases, variants, selectedVariant } = req.body as {
    testCases: Array<{ id: number; text: string }>;
    variants: Array<{ id: string; template: string }>;
    selectedVariant?: string;
  };

  // Validate payload
  if (!Array.isArray(testCases) || !Array.isArray(variants)) {
    res.status(400).json({ error: 'Both testCases and variants arrays are required.' });
    return
  }

  // Select the active variant by ID or default to first
  const activeVariant = variants.find(v => v.id === selectedVariant) || variants[0];
  if (!activeVariant) {
    res.status(400).json({ error: 'No variant provided.' });
    return
  }

  const results: Record<number, string> = {};

  try {
    for (const tc of testCases) {
      const prompt = `${activeVariant.template} ${tc.text}`;
      const messages: ChatCompletionMessageParam[] = [
        { role: 'system', content: 'You are a helpful assistant specialized in A/B prompt testing.' },
        { role: 'user', content: prompt },
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages,
      });

      const content = completion.choices?.[0]?.message?.content?.trim() ?? '';
      results[tc.id] = content;
    }

    res.status(200).json(results);
    return;
  } catch (err: any) {
    console.error('A/B test route error:', err);
    res.status(500).json({ error: 'Failed to run A/B test.', details: err.message });
    return;
  }
});

export default router;

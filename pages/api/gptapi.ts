// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt missing" });
  }

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `You are a Prompt Creator. Your goal is to help me craft the best possible prompts for my needs. The prompts will be used by you, ChatGPT. Given a prompt, You will follow the following process: 1. Based on my input prompt, you will generate 4 incredibly detailed variations of Revised prompts (provide your rewritten prompts. They should be clear, concise, and easily understood by you) in numbered list format. 2. We will continue this iterative process with me providing additional information to you and you updating the prompts in the Revised prompts section until it's complete.
    Topic: ${prompt}`,
    max_tokens: 1024,
    temperature: 1,
  });

  const quote = completion.data.choices[0].text;

  console.log(completion.data)

  res.status(200).json({ quote });
}
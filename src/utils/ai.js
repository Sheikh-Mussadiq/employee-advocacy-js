import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateAICaption(
  platform,
  title,
  content
) {
  const customPrompt = localStorage.getItem('customPrompt') || '';
  
  const prompt = `Create an engaging ${platform} post about this article. Title: "${title}"\n\nArticle content: "${content}"\n\nAdditional instructions: ${customPrompt}\n\nProvide the response in this JSON format:\n{"caption": "your caption here", "hashtags": ["tag1", "tag2"]}\n\nMake it professional, engaging, and platform-appropriate. For LinkedIn, be more formal. For Twitter, be concise. For Facebook, be conversational.`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const response = completion.choices[0]?.message?.content;
    if (response) {
      return JSON.parse(response);
    }
    throw new Error('No response from AI');
  } catch (error) {
    console.error('Failed to generate caption:', error);
    throw error;
  }
}
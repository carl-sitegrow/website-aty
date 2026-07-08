/**
 * Principaux crawlers IA / moteurs génératifs (GEO).
 * Utilisés par robots.txt.ts pour émettre une politique explicite.
 */
export type AiCrawler = {
  agent: string;
  vendor: string;
  usage: 'search' | 'training' | 'user';
};

export const AI_CRAWLERS: AiCrawler[] = [
  { agent: 'GPTBot', vendor: 'OpenAI', usage: 'training' },
  { agent: 'OAI-SearchBot', vendor: 'OpenAI', usage: 'search' },
  { agent: 'ChatGPT-User', vendor: 'OpenAI', usage: 'user' },
  { agent: 'ClaudeBot', vendor: 'Anthropic', usage: 'training' },
  { agent: 'Claude-SearchBot', vendor: 'Anthropic', usage: 'search' },
  { agent: 'Claude-User', vendor: 'Anthropic', usage: 'user' },
  { agent: 'anthropic-ai', vendor: 'Anthropic', usage: 'training' },
  { agent: 'PerplexityBot', vendor: 'Perplexity', usage: 'search' },
  { agent: 'Perplexity-User', vendor: 'Perplexity', usage: 'user' },
  { agent: 'Google-Extended', vendor: 'Google (Gemini)', usage: 'training' },
  { agent: 'Applebot-Extended', vendor: 'Apple Intelligence', usage: 'training' },
  { agent: 'Meta-ExternalAgent', vendor: 'Meta AI', usage: 'training' },
  { agent: 'MistralAI-User', vendor: 'Mistral', usage: 'user' },
  { agent: 'DuckAssistBot', vendor: 'DuckDuckGo', usage: 'search' },
  { agent: 'CCBot', vendor: 'Common Crawl', usage: 'training' },
  { agent: 'Amazonbot', vendor: 'Amazon', usage: 'training' },
  { agent: 'Bytespider', vendor: 'ByteDance', usage: 'training' },
  { agent: 'cohere-ai', vendor: 'Cohere', usage: 'training' },
];

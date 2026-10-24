/**
 * =============================================================================
 * Module: src/ai/providers.ts
 * Description: Provider registry, metadata, ordered numbering (1~9), and
 *              scrupulously benchmarked recommended models for email triage.
 * =============================================================================
 */

import type { AIProviderId, ProviderMetadata } from './types';

export const SUPPORTED_PROVIDERS: ProviderMetadata[] = [
  {
    id: 'workers-ai',
    index: 1,
    name: 'Cloudflare Workers AI',
    badge: '⭐ 免Key·完全免费·边缘原生',
    isFreeOrNoKey: true,
    defaultModel: '@cf/meta/llama-3.1-8b-instruct',
    models: [
      {
        id: '@cf/meta/llama-3.1-8b-instruct',
        name: 'Llama 3.1 8B Instruct',
        isRecommended: true,
        descriptionZh: '官方推荐：边缘轻量低延迟，严格遵守 JSON 模式，分类与提取极稳',
        descriptionEn: 'Recommended: Low edge latency, robust JSON compliance, fast OTP extraction',
      },
      {
        id: '@cf/qwen/qwen2.5-7b-instruct',
        name: 'Qwen 2.5 7B Instruct',
        descriptionZh: '通义千问：中英双语极佳，理解复杂邮件语义精准',
        descriptionEn: 'Qwen: Excellent multilingual understanding for complex emails',
      },
      {
        id: '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b',
        name: 'DeepSeek R1 Distill Qwen 32B',
        descriptionZh: '高质量蒸馏模型：推理能力强，适合长邮件综合研判',
        descriptionEn: 'High quality distilled model for complex long email reasoning',
      },
    ],
    descriptionZh: 'Cloudflare 边缘机房就地计算，零出网握手开销，完全免费且无需任何 API Key',
    descriptionEn: 'Runs natively at Cloudflare edge with zero external network hops and no API keys required',
  },
  {
    id: 'deepseek',
    index: 2,
    name: 'DeepSeek (深度求索)',
    badge: '⭐ 强烈推荐·极低消耗·极高智能',
    defaultModel: 'deepseek-chat',
    defaultBaseUrl: 'https://api.deepseek.com',
    models: [
      {
        id: 'deepseek-chat',
        name: 'DeepSeek-V3 (deepseek-chat)',
        isRecommended: true,
        descriptionZh: '官方推荐：延迟仅 ~400ms，每万封邮件仅需约 ¥0.3 元，意图识别极为敏锐',
        descriptionEn: 'Recommended: ~400ms latency, unbeatable pricing (~$0.04/10k emails), sharp triage',
      },
      {
        id: 'deepseek-reasoner',
        name: 'DeepSeek-R1 (deepseek-reasoner)',
        descriptionZh: '深度思考推理模型：耗时略长，适合深度商业邮件研判',
        descriptionEn: 'Deep reasoning model: Higher latency, suited for in-depth email analysis',
      },
    ],
    descriptionZh: '百万 Token 仅需 ¥1~2 元，严格支持 json_object，中文营销信与验证码识别极其精准',
    descriptionEn: 'Extremely cost-effective, native JSON object support, top-tier multilingual intent recognition',
  },
  {
    id: 'groq',
    index: 3,
    name: 'Groq (极速推理)',
    badge: '⚡ 毫秒级极速提取验证码',
    defaultModel: 'llama-3.3-70b-versatile',
    defaultBaseUrl: 'https://api.groq.com/openai/v1',
    models: [
      {
        id: 'llama-3.3-70b-versatile',
        name: 'Llama 3.3 70B Versatile',
        isRecommended: true,
        descriptionZh: '官方推荐：延迟低至 150~250ms，验证码秒提秒达，极速推送',
        descriptionEn: 'Recommended: Blazing 150-250ms latency, near-instantaneous OTP extraction',
      },
      {
        id: 'llama-3.1-8b-instant',
        name: 'Llama 3.1 8B Instant',
        descriptionZh: '极致轻量版本：推理极快，极低成本',
        descriptionEn: 'Ultra-lightweight and fastest inference at minimal cost',
      },
    ],
    descriptionZh: 'LPU 算力芯片驱动，业内最快端到端延迟，适合对验证码推送速度有极致要求的场景',
    descriptionEn: 'Powered by LPU chips for industry-leading response times, ideal for real-time OTP delivery',
  },
  {
    id: 'openai',
    index: 4,
    name: 'OpenAI (ChatGPT)',
    badge: '🌐 工业级高可用基石',
    defaultModel: 'gpt-4o-mini',
    defaultBaseUrl: 'https://api.openai.com/v1',
    models: [
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o-mini',
        isRecommended: true,
        descriptionZh: '官方推荐：速度快、成本仅 GPT-4o 的 1/15，原生 JSON 模式容错率 100%',
        descriptionEn: 'Recommended: Fast, 1/15th cost of GPT-4o, bulletproof native JSON mode',
      },
      {
        id: 'gpt-4o',
        name: 'GPT-4o (Omni)',
        descriptionZh: '全能旗舰模型：顶级综合能力，适合高价值商务信函',
        descriptionEn: 'Flagship model: Top-tier comprehension for high-value business communications',
      },
    ],
    descriptionZh: '全球最广泛应用的行业基石，API 响应稳定，高并发保障',
    descriptionEn: 'Global standard for AI APIs with maximum uptime and reliability',
  },
  {
    id: 'gemini',
    index: 5,
    name: 'Google Gemini',
    badge: '✨ 高吞吐·免费配额丰厚',
    defaultModel: 'gemini-2.0-flash',
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    models: [
      {
        id: 'gemini-2.0-flash',
        name: 'Gemini 2.0 Flash',
        isRecommended: true,
        descriptionZh: '官方推荐：最新一代极速模型，极低延迟，多语言处理能力顶尖',
        descriptionEn: 'Recommended: Next-gen speed, ultra-low latency, world-class multilingual parsing',
      },
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        descriptionZh: '稳定版本：高并发大容量，日常免费配额充足',
        descriptionEn: 'Stable edition: Generous free quota on Google AI Studio',
      },
    ],
    descriptionZh: 'Google AI Studio 提供慷慨的免费配额，采用标准兼容协议直接调用',
    descriptionEn: 'Generous free daily tier from Google AI Studio, accessible via standard OpenAI format',
  },
  {
    id: 'claude',
    index: 6,
    name: 'Anthropic Claude',
    badge: '🛡️ 顶级防注入防御',
    defaultModel: 'claude-3-5-haiku-20241022',
    defaultBaseUrl: 'https://api.anthropic.com/v1',
    models: [
      {
        id: 'claude-3-5-haiku-20241022',
        name: 'Claude 3.5 Haiku',
        isRecommended: true,
        descriptionZh: '官方推荐：毫秒级响应，最强抵抗恶意邮件伪造指令（Prompt Injection）',
        descriptionEn: 'Recommended: Sub-second response, industry-leading prompt injection resistance',
      },
      {
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet',
        descriptionZh: '深度分析：复杂邮件辨析、极高逻辑精确度',
        descriptionEn: 'Deep analysis: Supreme reasoning accuracy for nuanced communications',
      },
    ],
    descriptionZh: '安全防线与指令遵循能力极强，彻底防御诱导型恶意钓鱼邮件',
    descriptionEn: 'Exceptional safety guardrails against deceptive phishing and prompt injection attacks',
  },
  {
    id: 'openrouter',
    index: 7,
    name: 'OpenRouter',
    badge: '🔀 全模型聚合路由网关',
    defaultModel: 'deepseek/deepseek-chat',
    defaultBaseUrl: 'https://openrouter.ai/api/v1',
    models: [
      {
        id: 'deepseek/deepseek-chat',
        name: 'DeepSeek-V3 (OpenRouter)',
        isRecommended: true,
        descriptionZh: '官方推荐：通过 OpenRouter 自动负载均衡与跨节点容灾',
        descriptionEn: 'Recommended: Automated load balancing and multi-node fallback',
      },
      {
        id: 'meta-llama/llama-3.3-70b-instruct',
        name: 'Llama 3.3 70B (OpenRouter)',
        descriptionZh: '开源旗舰：高质量多厂商算力池冗余保障',
        descriptionEn: 'Open weights flagship backed by multiple redundant providers',
      },
      {
        id: 'openrouter/auto',
        name: 'OpenRouter Auto Router',
        descriptionZh: '全自动智能路由：自动根据价格与延迟动态选择最优模型',
        descriptionEn: 'Intelligent auto-routing: Dynamically routes based on cost and latency',
      },
    ],
    descriptionZh: '一个 API Key 即可任意调度全球主流模型，自带故障自愈与自动切换',
    descriptionEn: 'Single unified API key accessing hundreds of models with automated failover',
  },
  {
    id: 'minimax',
    index: 8,
    name: 'MiniMax (稀宇科技)',
    badge: '📦 存量历史兼容',
    defaultModel: 'MiniMax-Text-01',
    defaultBaseUrl: 'https://api.minimax.chat/v1/text/chatcompletion_v2',
    models: [
      {
        id: 'MiniMax-Text-01',
        name: 'MiniMax-Text-01',
        isRecommended: true,
        descriptionZh: '原有内置主力模型，保证已有配置无需修改无缝运行',
        descriptionEn: 'Original baseline model ensuring complete seamless backward compatibility',
      },
      {
        id: 'abab6.5s-chat',
        name: 'ABAB 6.5s Chat',
        descriptionZh: 'MiniMax 快速推理系列模型',
        descriptionEn: 'MiniMax high-speed chat completion model',
      },
    ],
    descriptionZh: '平滑保持原版本调用机制与兼容，支持自定义 Group-Id',
    descriptionEn: 'Smoothly preserves original integration flow with optional Group-Id support',
  },
  {
    id: 'custom',
    index: 9,
    name: 'Custom / 自定义',
    badge: '🛠️ 自建反代·Ollama·OneAPI',
    defaultModel: 'custom-model',
    models: [
      {
        id: 'custom-model',
        name: 'Custom Model ID',
        isRecommended: true,
        descriptionZh: '用户自由指定的任意模型标识符（如 qwen2.5:7b、llama3 等）',
        descriptionEn: 'User-specified model identifier (e.g. qwen2.5:7b, llama3, etc.)',
      },
    ],
    descriptionZh: '兼容任何符合 OpenAI /chat/completions 规范的自建或第三方反向代理',
    descriptionEn: 'Compatible with any custom reverse proxy, Ollama, vLLM, or OneAPI endpoint',
  },
];

/**
 * Find provider by ID, index (1-9), or case-insensitive name
 */
export function findProvider(query: string | number): ProviderMetadata | undefined {
  if (query === undefined || query === null) return undefined;
  const num = typeof query === 'number' ? query : parseInt(String(query).trim(), 10);
  if (!isNaN(num)) {
    const byIndex = SUPPORTED_PROVIDERS.find((p) => p.index === num);
    if (byIndex) return byIndex;
  }

  const norm = String(query).toLowerCase().trim();
  return SUPPORTED_PROVIDERS.find(
    (p) =>
      p.id.toLowerCase() === norm ||
      p.name.toLowerCase() === norm ||
      p.name.toLowerCase().includes(norm)
  );
}

/**
 * Validate whether a string is a valid AIProviderId
 */
export function isValidProviderId(id: string): id is AIProviderId {
  return SUPPORTED_PROVIDERS.some((p) => p.id === id);
}

/**
 * Get the recommended model for a provider
 */
export function getRecommendedModel(providerId: AIProviderId): string {
  const provider = findProvider(providerId);
  return provider?.defaultModel || 'gpt-4o-mini';
}

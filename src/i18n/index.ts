/**
 * =============================================================================
 * Module: src/i18n/index.ts
 * Description: Lightweight, zero-dependency internationalization engine
 * for Cloudflare Workers & Telegram Bot.
 * Supports 10 mainstream languages: zh-CN, en-US, zh-TW, ja-JP, ko-KR, pt-BR, ru-RU, es-ES, fr-FR, de-DE.
 * =============================================================================
 */

import type { SupportedLang, TranslationDict } from './types';
import { SUPPORTED_LANGUAGES } from './types';
import { zhCN } from './locales/zh-CN';
import { enUS } from './locales/en-US';
import { zhTW } from './locales/zh-TW';
import { jaJP } from './locales/ja-JP';
import { koKR } from './locales/ko-KR';
import { ptBR } from './locales/pt-BR';
import { ruRU } from './locales/ru-RU';
import { esES } from './locales/es-ES';
import { frFR } from './locales/fr-FR';
import { deDE } from './locales/de-DE';
import { getDynamicConfig } from '../router';

export * from './types';
export { zhCN, enUS, zhTW, jaJP, koKR, ptBR, ruRU, esES, frFR, deDE };

export const LOCALES: Record<SupportedLang, TranslationDict> = {
  'zh-CN': zhCN,
  'en-US': enUS,
  'zh-TW': zhTW,
  'ja-JP': jaJP,
  'ko-KR': koKR,
  'pt-BR': ptBR,
  'ru-RU': ruRU,
  'es-ES': esES,
  'fr-FR': frFR,
  'de-DE': deDE,
};

export const DEFAULT_LANGUAGE: SupportedLang = 'en-US';

/**
 * Normalize and match incoming language string against supported 10 languages.
 */
export function normalizeLanguage(input?: string | null): SupportedLang | null {
  if (!input) return null;
  const clean = input.trim().toLowerCase().replace(/_/g, '-');

  // Exact matching
  if (clean === 'zh-cn' || clean === 'zh-hans' || clean === 'zh' || clean === 'cn') return 'zh-CN';
  if (clean === 'zh-tw' || clean === 'zh-hant' || clean === 'zh-hk' || clean === 'tw' || clean === 'hk') return 'zh-TW';
  if (clean === 'en' || clean === 'en-us' || clean === 'en-gb' || clean === 'us') return 'en-US';
  if (clean === 'ja' || clean === 'ja-jp' || clean === 'jp') return 'ja-JP';
  if (clean === 'ko' || clean === 'ko-kr' || clean === 'kr' || clean === 'kor') return 'ko-KR';
  if (clean === 'pt' || clean === 'pt-br' || clean === 'pt-pt' || clean === 'br') return 'pt-BR';
  if (clean === 'ru' || clean === 'ru-ru') return 'ru-RU';
  if (clean === 'es' || clean === 'es-es') return 'es-ES';
  if (clean === 'fr' || clean === 'fr-fr') return 'fr-FR';
  if (clean === 'de' || clean === 'de-de') return 'de-DE';

  // Prefix matching
  if (clean.startsWith('zh-tw') || clean.startsWith('zh-hk') || clean.startsWith('zh-hant')) return 'zh-TW';
  if (clean.startsWith('zh')) return 'zh-CN';
  if (clean.startsWith('en')) return 'en-US';
  if (clean.startsWith('ja')) return 'ja-JP';
  if (clean.startsWith('ko')) return 'ko-KR';
  if (clean.startsWith('pt')) return 'pt-BR';
  if (clean.startsWith('ru')) return 'ru-RU';
  if (clean.startsWith('es')) return 'es-ES';
  if (clean.startsWith('fr')) return 'fr-FR';
  if (clean.startsWith('de')) return 'de-DE';

  return null;
}

/**
 * Retrieve translation dictionary with safe fallback to zh-CN.
 */
export function getTranslation(lang?: string | null): TranslationDict {
  const normalized = normalizeLanguage(lang);
  if (normalized && LOCALES[normalized]) {
    return LOCALES[normalized];
  }
  return LOCALES[DEFAULT_LANGUAGE];
}

/**
 * Resolve effective system language by checking:
 * 1. KV database override (config:sys:system_language)
 * 2. Environment variable DEFAULT_LANGUAGE
 * 3. Telegram user language code (e.g. from message)
 * 4. Fallback default (zh-CN)
 */
export async function resolveLanguage(
  kv?: any,
  envLang?: string,
  userTgLang?: string
): Promise<SupportedLang> {
  // 1. KV database override
  if (kv) {
    const saved = await getDynamicConfig(kv, 'system_language');
    if (saved) {
      const normalized = normalizeLanguage(saved);
      if (normalized) return normalized;
    }
  }

  // 2. Env variable
  if (envLang) {
    const normalized = normalizeLanguage(envLang);
    if (normalized) return normalized;
  }

  // 3. User's Telegram language_code
  if (userTgLang) {
    const normalized = normalizeLanguage(userTgLang);
    if (normalized) return normalized;
  }

  return DEFAULT_LANGUAGE;
}

/**
 * Build 5x2 Telegram inline keyboard for language switching.
 */
export function getLanguageKeyboard(
  activeLang?: string | null,
  includeBackToMain?: boolean,
  backText = '🔙 Back / 返回'
): Array<Array<{ text: string; callback_data: string }>> {
  const norm = activeLang ? normalizeLanguage(activeLang) : null;
  const rows = [
    [
      { text: `🇨🇳 简体中文${norm === 'zh-CN' ? ' ✓' : ''}`, callback_data: 'lang:zh-CN' },
      { text: `🇺🇸 English${norm === 'en-US' ? ' ✓' : ''}`, callback_data: 'lang:en-US' },
    ],
    [
      { text: `🇭🇰 繁體中文${norm === 'zh-TW' ? ' ✓' : ''}`, callback_data: 'lang:zh-TW' },
      { text: `🇯🇵 日本語${norm === 'ja-JP' ? ' ✓' : ''}`, callback_data: 'lang:ja-JP' },
    ],
    [
      { text: `🇰🇷 한국어${norm === 'ko-KR' ? ' ✓' : ''}`, callback_data: 'lang:ko-KR' },
      { text: `🇧🇷 Português${norm === 'pt-BR' ? ' ✓' : ''}`, callback_data: 'lang:pt-BR' },
    ],
    [
      { text: `🇷🇺 Русский${norm === 'ru-RU' ? ' ✓' : ''}`, callback_data: 'lang:ru-RU' },
      { text: `🇪🇸 Español${norm === 'es-ES' ? ' ✓' : ''}`, callback_data: 'lang:es-ES' },
    ],
    [
      { text: `🇫🇷 Français${norm === 'fr-FR' ? ' ✓' : ''}`, callback_data: 'lang:fr-FR' },
      { text: `🇩🇪 Deutsch${norm === 'de-DE' ? ' ✓' : ''}`, callback_data: 'lang:de-DE' },
    ],
  ];

  if (includeBackToMain) {
    rows.push([{ text: backText, callback_data: 'm:main' }]);
  }

  return rows;
}

/**
 * Mapping of ISO 639-1 language codes to SupportedLang for Telegram setMyCommands multi-language registration.
 */
export const TELEGRAM_I18N_COMMAND_MAP: Array<{ code: string; lang: SupportedLang }> = [
  { code: 'en', lang: 'en-US' },
  { code: 'zh', lang: 'zh-CN' },
  { code: 'ja', lang: 'ja-JP' },
  { code: 'ko', lang: 'ko-KR' },
  { code: 'pt', lang: 'pt-BR' },
  { code: 'ru', lang: 'ru-RU' },
  { code: 'es', lang: 'es-ES' },
  { code: 'fr', lang: 'fr-FR' },
  { code: 'de', lang: 'de-DE' },
];

/**
 * Build commands payload for Telegram setMyCommands.
 * Supports optional two-letter ISO 639-1 language_code for Telegram multi-language command menus.
 */
export function getCommandsPayload(
  lang: SupportedLang,
  languageCode?: string
): { commands: Array<{ command: string; description: string }>; language_code?: string } {
  const dict = getTranslation(lang);
  const payload: { commands: Array<{ command: string; description: string }>; language_code?: string } = {
    commands: [
      { command: 'start', description: dict.commandDesc.start },
      { command: 'menu', description: dict.commandDesc.menu },
      { command: 'guide', description: dict.commandDesc.guide },
      { command: 'setup', description: dict.commandDesc.setup },
      { command: 'lang', description: dict.commandDesc.lang },
      { command: 'config', description: dict.commandDesc.config },
      { command: 'provider', description: dict.commandDesc.provider },
      { command: 'model', description: dict.commandDesc.model },
      { command: 'routes', description: dict.commandDesc.routes },
      { command: 'keywords', description: dict.commandDesc.keywords },
      { command: 'addkeywords', description: dict.commandDesc.addkeywords },
      { command: 'resetkeywords', description: dict.commandDesc.resetkeywords },
      { command: 'add', description: dict.commandDesc.add },
      { command: 'del', description: dict.commandDesc.del },
      { command: 'setkey', description: dict.commandDesc.setkey },
      { command: 'resetkey', description: dict.commandDesc.resetkey },
      { command: 'cancel', description: dict.commandDesc.cancel },
      { command: 'help', description: dict.commandDesc.help },
    ],
  };
  if (languageCode) {
    payload.language_code = languageCode;
  }
  return payload;
}

/**
 * Register command definitions across all supported languages into Telegram Bot API.
 * Sets the default fallback commands first, followed by language-specific command sets.
 */
export async function syncAllTelegramCommands(
  botToken: string,
  defaultLang: SupportedLang = DEFAULT_LANGUAGE
): Promise<{ ok: boolean; results: Record<string, any> }> {
  const results: Record<string, any> = {};

  // 1. Default fallback commands (without language_code)
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/setMyCommands`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(getCommandsPayload(defaultLang)),
    });
    results.default = await res.json().catch(() => ({}));
  } catch (err: any) {
    results.default = { ok: false, error: err?.message };
  }

  // 2. Language-specific command sets for all supported languages
  for (const item of TELEGRAM_I18N_COMMAND_MAP) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/setMyCommands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getCommandsPayload(item.lang, item.code)),
      });
      results[item.code] = await res.json().catch(() => ({}));
    } catch (err: any) {
      results[item.code] = { ok: false, error: err?.message };
    }
  }

  return { ok: true, results };
}

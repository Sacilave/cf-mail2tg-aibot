/**
 * =============================================================================
 * Module: src/i18n/index.ts
 * Description: Lightweight, zero-dependency internationalization engine
 * for Cloudflare Workers & Telegram Bot.
 * Supports 8 mainstream languages: zh-CN, en-US, zh-TW, ja-JP, ru-RU, es-ES, fr-FR, de-DE.
 * =============================================================================
 */

import type { SupportedLang, TranslationDict } from './types';
import { SUPPORTED_LANGUAGES } from './types';
import { zhCN } from './locales/zh-CN';
import { enUS } from './locales/en-US';
import { zhTW } from './locales/zh-TW';
import { jaJP } from './locales/ja-JP';
import { ruRU } from './locales/ru-RU';
import { esES } from './locales/es-ES';
import { frFR } from './locales/fr-FR';
import { deDE } from './locales/de-DE';
import { getDynamicConfig } from '../router';

export * from './types';
export { zhCN, enUS, zhTW, jaJP, ruRU, esES, frFR, deDE };

export const LOCALES: Record<SupportedLang, TranslationDict> = {
  'zh-CN': zhCN,
  'en-US': enUS,
  'zh-TW': zhTW,
  'ja-JP': jaJP,
  'ru-RU': ruRU,
  'es-ES': esES,
  'fr-FR': frFR,
  'de-DE': deDE,
};

export const DEFAULT_LANGUAGE: SupportedLang = 'zh-CN';

/**
 * Normalize and match incoming language string against supported 8 languages.
 */
export function normalizeLanguage(input?: string | null): SupportedLang | null {
  if (!input) return null;
  const clean = input.trim().toLowerCase().replace(/_/g, '-');

  // Exact matching
  if (clean === 'zh-cn' || clean === 'zh-hans' || clean === 'zh' || clean === 'cn') return 'zh-CN';
  if (clean === 'zh-tw' || clean === 'zh-hant' || clean === 'zh-hk' || clean === 'tw' || clean === 'hk') return 'zh-TW';
  if (clean === 'en' || clean === 'en-us' || clean === 'en-gb' || clean === 'us') return 'en-US';
  if (clean === 'ja' || clean === 'ja-jp' || clean === 'jp') return 'ja-JP';
  if (clean === 'ru' || clean === 'ru-ru') return 'ru-RU';
  if (clean === 'es' || clean === 'es-es') return 'es-ES';
  if (clean === 'fr' || clean === 'fr-fr') return 'fr-FR';
  if (clean === 'de' || clean === 'de-de') return 'de-DE';

  // Prefix matching
  if (clean.startsWith('zh-tw') || clean.startsWith('zh-hk') || clean.startsWith('zh-hant')) return 'zh-TW';
  if (clean.startsWith('zh')) return 'zh-CN';
  if (clean.startsWith('en')) return 'en-US';
  if (clean.startsWith('ja')) return 'ja-JP';
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
 * Build 4x2 Telegram inline keyboard for language switching.
 */
export function getLanguageKeyboard(activeLang?: string | null): Array<Array<{ text: string; callback_data: string }>> {
  const norm = activeLang ? normalizeLanguage(activeLang) : null;
  return [
    [
      { text: `🇨🇳 简体中文${norm === 'zh-CN' ? ' ✓' : ''}`, callback_data: 'lang:zh-CN' },
      { text: `🇺🇸 English${norm === 'en-US' ? ' ✓' : ''}`, callback_data: 'lang:en-US' },
    ],
    [
      { text: `🇭🇰 繁體中文${norm === 'zh-TW' ? ' ✓' : ''}`, callback_data: 'lang:zh-TW' },
      { text: `🇯🇵 日本語${norm === 'ja-JP' ? ' ✓' : ''}`, callback_data: 'lang:ja-JP' },
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
}

/**
 * Build commands payload for Telegram setMyCommands.
 */
export function getCommandsPayload(lang: SupportedLang): { commands: Array<{ command: string; description: string }> } {
  const dict = getTranslation(lang);
  return {
    commands: [
      { command: 'lang', description: dict.commandDesc.lang },
      { command: 'setup', description: dict.commandDesc.setup },
      { command: 'config', description: dict.commandDesc.config },
      { command: 'setkey', description: dict.commandDesc.setkey },
      { command: 'resetkey', description: dict.commandDesc.resetkey },
      { command: 'cancel', description: dict.commandDesc.cancel },
      { command: 'keywords', description: dict.commandDesc.keywords },
      { command: 'addkeywords', description: dict.commandDesc.addkeywords },
      { command: 'resetkeywords', description: dict.commandDesc.resetkeywords },
      { command: 'routes', description: dict.commandDesc.routes },
      { command: 'add', description: dict.commandDesc.add },
      { command: 'del', description: dict.commandDesc.del },
      { command: 'help', description: dict.commandDesc.help },
    ],
  };
}

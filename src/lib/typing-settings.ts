export interface TypingSettings {
  autoScroll: boolean;
  scrollSpeed: "slow" | "normal" | "fast";
  focusMode: boolean;
  highContrast: boolean;
  largeText: boolean;
}

const DEFAULTS: TypingSettings = {
  autoScroll: true,
  scrollSpeed: "normal",
  focusMode: false,
  highContrast: false,
  largeText: false,
};

const KEY = "jktm_typing_settings";

export function loadTypingSettings(): TypingSettings {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    return { ...DEFAULTS, ...saved };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveTypingSettings(s: TypingSettings): void {
  localStorage.setItem(KEY, JSON.stringify(s));
}

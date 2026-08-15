/**
 * Shared color-contrast helpers for picking readable text over an
 * arbitrary (often user-chosen) background color, e.g. character
 * nameplates and their color-swatch inputs.
 */

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: string): Rgb | null {
  const normalized = hex.replace('#', '').trim();
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((ch) => ch + ch)
          .join('')
      : normalized;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;

  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

/** WCAG relative luminance, 0 (black) to 1 (white). */
export function relativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** True when a background is bright enough that white text loses contrast. */
export function isBrightColor(hex: string, threshold = 0.5): boolean {
  return relativeLuminance(hex) > threshold;
}

/**
 * Picks a readable text color for a given background.
 * Pass in your theme's light/dark tokens (e.g. 'var(--paper)' / 'var(--ink)')
 * or leave the defaults for plain white/black.
 */
export function readableTextColor(
  hex: string,
  onBright = 'var(--paper)',
  onDark = '#FFFFFF',
): string {
  return isBrightColor(hex) ? onBright : onDark;
}

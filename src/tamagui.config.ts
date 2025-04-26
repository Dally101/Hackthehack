import { createTamagui, createTokens } from 'tamagui';
import { createInterFont } from '@tamagui/font-inter';
import { shorthands } from '@tamagui/shorthands';
import { themes as defaultThemes } from '@tamagui/themes';
import { tokens } from '@tamagui/theme-base';

const headingFont = createInterFont({
  family: 'Inter',
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 22,
    6: 26,
    7: 32,
    8: 40,
    9: 48,
    10: 56,
    11: 64,
    12: 72,
  },
  weight: {
    4: '400',
    5: '500',
    6: '600',
    7: '700',
  },
  letterSpacing: {
    4: 0,
    5: -0.01,
    6: -0.02,
    7: -0.03,
  },
  face: {
    400: { normal: 'InterRegular' },
    500: { normal: 'InterMedium' },
    600: { normal: 'InterSemiBold' },
    700: { normal: 'InterBold' },
  },
});

const bodyFont = createInterFont(
  {
    family: 'Inter',
    size: {
      1: 12,
      2: 14,
      3: 16,
      4: 18,
      5: 20,
      6: 22,
    },
    weight: {
      1: '400',
      2: '500',
      3: '600',
      4: '700',
    },
    face: {
      400: { normal: 'InterRegular' },
      500: { normal: 'InterMedium' },
      600: { normal: 'InterSemiBold' },
      700: { normal: 'InterBold' },
    },
  },
  {
    sizeLineHeight: (size) => Math.round(size * 1.4),
  }
);

const config = createTamagui({
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
  tokens,
  themes: defaultThemes,
  shorthands,
});

export type AppConfig = typeof config;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config; 
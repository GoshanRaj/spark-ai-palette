
export type ColorFormat = 'hex' | 'rgb' | 'hsl';
export type HarmonyType = 'analogous' | 'complementary' | 'triadic' | 'tetradic' | 'monochromatic' | 'random';

export interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  name?: string;
}

// Convert hex to RGB
export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
};

// Convert RGB to hex
export const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
};

// Convert RGB to HSL
export const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    
    h /= 6;
  }

  return { 
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

// Convert HSL to RGB
export const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
  h /= 360;
  s /= 100;
  l /= 100;
  
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};

// Create a Color object from a hex string
export const createColor = (hex: string): Color => {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return { hex, rgb, hsl };
};

// Generate a random hex color
export const getRandomColor = (): Color => {
  const hex = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
  return createColor(hex);
};

// Generate a color palette based on harmony rules
export const generateHarmony = (baseColor: Color, type: HarmonyType, count = 5): Color[] => {
  const palette: Color[] = [baseColor];
  const { h, s, l } = baseColor.hsl;

  switch (type) {
    case 'complementary':
      palette.push(createColorFromHSL((h + 180) % 360, s, l));
      // Add variations to complete palette
      if (count > 2) {
        palette.push(createColorFromHSL((h + 180) % 360, s, Math.max(l - 20, 10)));
        palette.push(createColorFromHSL(h, s, Math.max(l - 20, 10)));
        palette.push(createColorFromHSL(h, Math.max(s - 15, 10), l));
      }
      break;
      
    case 'analogous':
      const analogousStep = 30;
      for (let i = 1; i < count; i++) {
        palette.push(createColorFromHSL((h + i * analogousStep) % 360, s, l));
      }
      break;
      
    case 'triadic':
      palette.push(createColorFromHSL((h + 120) % 360, s, l));
      palette.push(createColorFromHSL((h + 240) % 360, s, l));
      // Add variations to complete palette
      if (count > 3) {
        palette.push(createColorFromHSL(h, Math.min(s + 10, 100), Math.max(l - 15, 10)));
        palette.push(createColorFromHSL((h + 60) % 360, s, l));
      }
      break;
      
    case 'tetradic':
      palette.push(createColorFromHSL((h + 90) % 360, s, l));
      palette.push(createColorFromHSL((h + 180) % 360, s, l));
      palette.push(createColorFromHSL((h + 270) % 360, s, l));
      // Add a variation to complete palette
      if (count > 4) {
        palette.push(createColorFromHSL(h, Math.min(s + 15, 100), Math.max(l - 10, 10)));
      }
      break;
      
    case 'monochromatic':
      const lightnessStep = 10;
      for (let i = 1; i < count; i++) {
        palette.push(createColorFromHSL(h, s, Math.min(Math.max(l - 20 + i * lightnessStep, 10), 90)));
      }
      break;
      
    case 'random':
      for (let i = 1; i < count; i++) {
        palette.push(getRandomColor());
      }
      break;
      
    default:
      for (let i = 1; i < count; i++) {
        palette.push(getRandomColor());
      }
  }

  // Ensure we have exactly the requested number of colors
  while (palette.length < count) {
    palette.push(getRandomColor());
  }

  return palette.slice(0, count);
};

// Create a Color from HSL values
export const createColorFromHSL = (h: number, s: number, l: number): Color => {
  const rgb = hslToRgb(h, s, l);
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  return { hex, rgb, hsl: { h, s, l } };
};

// Get a lighter or darker version of a color
export const adjustBrightness = (color: Color, amount: number): Color => {
  const { h, s, l } = color.hsl;
  const newL = Math.min(Math.max(l + amount, 0), 100);
  return createColorFromHSL(h, s, newL);
};

// Check if a color is light or dark
export const isColorLight = (color: Color): boolean => {
  const { r, g, b } = color.rgb;
  // Calculate perceived brightness using YIQ formula
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq >= 128;
};

// Format color value based on the specified format
export const formatColorValue = (color: Color, format: ColorFormat): string => {
  switch (format) {
    case 'hex':
      return color.hex;
    case 'rgb':
      const { r, g, b } = color.rgb;
      return `rgb(${r}, ${g}, ${b})`;
    case 'hsl':
      const { h, s, l } = color.hsl;
      return `hsl(${h}, ${s}%, ${l}%)`;
    default:
      return color.hex;
  }
};

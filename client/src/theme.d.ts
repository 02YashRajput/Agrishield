// src/theme/theme.d.ts
import { PaletteColor, PaletteColorOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    yellow?: PaletteColor; 
    blue?: PaletteColor;  
  }
  interface PaletteOptions {
    yellow?: PaletteColorOptions; 
    blue?: PaletteColorOptions;
  }
}

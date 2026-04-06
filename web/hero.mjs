import { heroui } from "@heroui/theme";

export default heroui({
  themes: {
    light: {
      colors: {
        background: '#FFFFFF',
        foreground: '#000000',
        divider: '#F0F0F0',
        focus: '#84D347',
        primary: {
          50: '#F5F5F5',
          100: '#EBEBEB',
          200: '#D6D6D6',
          300: '#BDBDBD',
          400: '#9E9E9E',
          500: '#757575',
          600: '#424242',
          700: '#212121',
          800: '#141414',
          900: '#000000',
          DEFAULT: '#000000',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#84D347',
          foreground: '#000000',
        },
        success: {
          DEFAULT: '#84D347',
          foreground: '#000000',
        },
        warning: {
          DEFAULT: '#FFB800',
          foreground: '#000000',
        },
        danger: {
          DEFAULT: '#FF4A4A',
          foreground: '#FFFFFF',
        },
      },
      layout: {
        radius: {
          small: '8px',
          medium: '12px',
          large: '16px',
        },
        borderWidth: {
          small: '1px',
          medium: '1px',
          large: '1.5px',
        },
        boxShadow: {
          small: '0 2px 8px rgba(26,26,24,0.06)',
          medium: '0 4px 16px rgba(26,26,24,0.08)',
          large: '0 8px 32px rgba(26,26,24,0.10)',
        },
      },
    },
  },
});

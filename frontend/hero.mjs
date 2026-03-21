import { heroui } from "@heroui/theme";

export default heroui({
  themes: {
    light: {
      colors: {
        background: '#F8F8F6',
        foreground: '#1A1A18',
        divider: '#E8E8E4',
        focus: '#1A1A18',
        primary: {
          50: '#F0F0EE',
          100: '#D8D8D4',
          200: '#C0C0BA',
          300: '#A8A8A0',
          400: '#909086',
          500: '#787870',
          600: '#5A5A54',
          700: '#3C3C38',
          800: '#2A2A26',
          900: '#1A1A18',
          DEFAULT: '#1A1A18',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#5A5A54',
          foreground: '#FFFFFF',
        },
        success: {
          DEFAULT: '#4CAF82',
          foreground: '#FFFFFF',
        },
        warning: {
          DEFAULT: '#F5A623',
          foreground: '#FFFFFF',
        },
        danger: {
          DEFAULT: '#E05C5C',
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

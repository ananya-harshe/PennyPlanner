// Duolingo Brand Identity Theme
export const theme = {
  colors: {
    primary: {
      light: 'from-emerald-50 to-slate-50',
      main: 'emerald-500',
      dark: 'emerald-600',
      bg: 'bg-emerald-500',
      hover: 'hover:bg-emerald-600',
      text: 'text-emerald-500',
      border: 'border-emerald-700',
      hex: '#58CC02', // Duo Green
    },
    secondary: {
      main: 'sky-500',
      text: 'text-sky-500',
      bg: 'bg-sky-500',
      border: 'border-sky-700',
      hex: '#1CB0F6', // Duo Blue
    },
    success: {
      bg: 'bg-emerald-500',
      light: 'from-emerald-50',
      text: 'text-emerald-500',
      border: 'border-emerald-700',
      hex: '#58CC02',
    },
    warning: {
      bg: 'bg-orange-500',
      light: 'from-orange-50',
      text: 'text-orange-500',
      border: 'border-orange-700',
      hex: '#FF9600', // Duo Orange
    },
    danger: {
      bg: 'bg-red-500',
      light: 'from-red-50',
      text: 'text-red-500',
      border: 'border-red-700',
      hex: '#FF4B4B', // Duo Red
    },
    info: {
      bg: 'bg-sky-500',
      light: 'from-sky-50',
      text: 'text-sky-500',
      border: 'border-sky-700',
      hex: '#1CB0F6',
    },
    dark: {
      bg: 'bg-slate-900',
      text: 'text-slate-900',
    },
    light: {
      bg: 'bg-white',
      border: 'border-gray-300',
      hex: '#FFFFFF',
    },
    gray: {
      text: 'text-gray-600',
      border: 'border-gray-400',
      hex: '#AFAFAF',
    },
    background: 'bg-gray-100', // #F7F7F7
  },
  spacing: {
    section: 'py-20',
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  },
  shadows: {
    sm: 'shadow-sm',
    md: 'shadow-lg',
    lg: 'shadow-xl',
    '3d': 'shadow-[0_8px_0_rgba(0,0,0,0.1)]',
  },
  borderRadius: {
    button: 'rounded-2xl',
    card: 'rounded-[32px]',
    sm: 'rounded-lg',
  },
}

// Color palette for charts and visualizations
export const chartColors = {
  bars: ['#58CC02', '#1CB0F6', '#FF9600', '#FF4B4B', '#8b5cf6', '#06b6d4'],
  text: '#1e293b',
  grid: '#e2e8f0',
}

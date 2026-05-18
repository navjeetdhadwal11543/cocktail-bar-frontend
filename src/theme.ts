import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#ff7e5f' },
    secondary: { main: '#feb47b' },
    background: { default: '#f5f5f5' },
  },
  shape: { borderRadius: 8 },
  typography: {
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 25 },
      },
    },
  },
});

export const gradients = {
  primary: 'linear-gradient(90deg, #ff7e5f, #feb47b)',
  primaryHover: 'linear-gradient(90deg, #feb47b, #ff7e5f)',
  primaryDiag: 'linear-gradient(135deg, #ff7e5f, #feb47b)',
  warm: 'linear-gradient(135deg, #ffab91 0%, #ff7043 100%)',
  warmHover: 'linear-gradient(135deg, #ff8a65 0%, #f4511e 100%)',
  cards: [
    'linear-gradient(135deg, #ff7e5f, #feb47b)',
    'linear-gradient(135deg, #a855f7, #ec4899)',
    'linear-gradient(135deg, #22c55e, #14b8a6)',
    'linear-gradient(135deg, #f97316, #fb7185)',
    'linear-gradient(135deg, #3b82f6, #06b6d4)',
  ],
};

import { SxProps, Theme } from '@mui/material';
import { gradients } from '../theme';

export const gradientButton: SxProps<Theme> = {
  bgcolor: '#ff7e5f',
  background: gradients.primary,
  color: '#fff',
  '&:hover': { background: gradients.primaryHover },
  px: 4,
  py: 1.2,
  borderRadius: '25px',
  fontWeight: 'bold',
  textTransform: 'none',
};

export const gradientButtonLarge: SxProps<Theme> = {
  ...gradientButton,
  px: 5,
  py: 1.8,
};

export const gradientCircleButton: SxProps<Theme> = {
  background: gradients.warm,
  color: '#fff',
  boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
  '&:hover': {
    background: gradients.warmHover,
    transform: 'scale(1.05)',
  },
  borderRadius: '50%',
  minWidth: '40px',
  minHeight: '40px',
  transition: 'all 0.2s ease-in-out',
};

export const gradientMainButton: SxProps<Theme> = {
  px: 4,
  py: 1.2,
  borderRadius: '25px',
  fontWeight: 'bold',
  textTransform: 'none',
  background: gradients.warm,
  color: '#fff',
  boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
  '&:hover': {
    background: gradients.warmHover,
    transform: 'scale(1.03)',
  },
  transition: 'all 0.2s ease-in-out',
};

export const pageContainer: SxProps<Theme> = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  bgcolor: 'background.default',
};

export const darkHeader: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  px: 4,
  py: 2,
  bgcolor: 'rgba(0,0,0,0.65)',
};

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchToken, getDrinks } from '../Services/cocktailService';
import { gradientButtonLarge } from '../styles/sx';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMenuClick = async () => {
    setLoading(true);
    try {
      try {
        await fetchToken();
      } catch {
        setError('Failed to fetch token. Please check backend authentication.');
        return;
      }
      try {
        const drinks = await getDrinks();
        navigate('/menu', { state: { drinks } });
      } catch {
        setError('Failed to fetch drinks. Please check backend drinks API.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundImage:
          "url('https://images.unsplash.com/photo-1605270012917-bf157c5a9541?fm=jpg&q=60&w=3000')",
        backgroundSize: 'cover',
        backgroundPosition: 'center 70%',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        color: 'white',
        px: 3,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1,
        }}
      />
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Typography
          variant='h2'
          sx={{ mb: 2, fontWeight: 'bold', color: '#ff6f61' }}
        >
          🍹 Cocktail Bar
        </Typography>
        <Typography
          variant='h6'
          sx={{ mb: 4, maxWidth: 600, fontWeight: 'bold', mx: 'auto' }}
        >
          Benvenuti al Cocktail Bar, il luogo ideale per gustare cocktail unici
          e drink creativi preparati con cura. Nel cuore di Messina, siamo
          pronti ad accoglierti con i migliori sapori.
        </Typography>

        <Button
          variant='contained'
          startIcon={
            loading ? (
              <CircularProgress size={20} color='inherit' />
            ) : (
              <MenuIcon />
            )
          }
          sx={gradientButtonLarge}
          onClick={handleMenuClick}
          disabled={loading}
        >
          {loading ? 'Fetching Menu...' : 'Consulta il Menu'}
        </Button>
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity='error'
          variant='filled'
          onClose={() => setError(null)}
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomePage;

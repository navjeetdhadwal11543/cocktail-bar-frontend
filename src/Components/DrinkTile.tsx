import React from 'react';
import { Avatar, Box, Button, Typography } from '@mui/material';
import { DrinkWithSelections } from '../interfaces/Drink';
import { getDrinkImage } from '../utils/getDrinkImage';
import { gradients } from '../theme';

interface DrinkTileProps {
  drink: DrinkWithSelections;
  onOpen: () => void;
  onRemove: () => void;
}

const DrinkTile: React.FC<DrinkTileProps> = ({ drink, onOpen, onRemove }) => {
  const qty = drink.quantity ?? 0;
  const description =
    (drink as { short_description?: string }).short_description ||
    drink.shortDescription ||
    '';

  return (
    <Box
      onClick={onOpen}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 2,
        borderRadius: 3,
        bgcolor: qty > 0 ? 'rgba(255,223,186,0.9)' : 'rgba(255,255,255,0.95)',
        boxShadow:
          qty > 0 ? '0 6px 16px rgba(0,0,0,0.25)' : '0 1px 4px rgba(0,0,0,0.1)',
        border: qty > 0 ? '2px solid #ff9800' : '1px solid #ccc',
        cursor: 'pointer',
        transition: 'all 0.4s ease',
        '&:hover': {
          transform: 'translateY(-5px) scale(1.05)',
          boxShadow: '0 12px 28px rgba(0,0,0,0.35)',
          bgcolor: 'rgba(255,255,255,1)',
        },
      }}
    >
      <Avatar
        src={drink.image ? drink.image : getDrinkImage(drink.name)}
        sx={{
          width: 140,
          height: 140,
          border: '2px solid #ff9800',
          mb: 1,
        }}
      />
      <Typography
        sx={{ fontWeight: 'bold', textAlign: 'center', mb: 1, fontSize: '1.1rem' }}
      >
        {drink.name}
      </Typography>
      {description && (
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{ textAlign: 'center', mb: 1 }}
        >
          {description}
        </Typography>
      )}
      <Box
        sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          sx={{
            fontWeight: 'bold',
            px: 3,
            py: 0.8,
            borderRadius: '25px',
            textTransform: 'none',
            background: gradients.primary,
            color: '#fff',
            '&:hover': { background: gradients.primaryHover },
          }}
        >
          Qty: {qty}
        </Button>
        {qty > 0 && (
          <Button
            onClick={onRemove}
            sx={{
              minWidth: '40px',
              px: 1,
              py: 0.8,
              borderRadius: '25px',
              textTransform: 'none',
              background: gradients.primary,
              color: '#fff',
              '&:hover': { background: gradients.primaryHover },
            }}
          >
            X
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default DrinkTile;

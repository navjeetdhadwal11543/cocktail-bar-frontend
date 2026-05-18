// DashboardCard.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';

interface DashboardCardProps {
  title: string;
  value: number | string;
  bg?: string; // gradient background
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, bg }) => (
  <Box
    sx={{
      flex: 1,
      minWidth: 200,
      background: bg || '#402f2b', // use 'background' instead of bgcolor for gradients
      color: '#fff',
      borderRadius: 3,
      p: 3,
      boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
      textAlign: 'center',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
      },
    }}
  >
    <Typography variant='subtitle2'>{title}</Typography>
    <Typography variant='h4' sx={{ fontWeight: 'bold', mt: 1 }}>
      {value}
    </Typography>
  </Box>
);

export default DashboardCard;

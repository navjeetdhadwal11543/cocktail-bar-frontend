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
      minWidth: 0,
      background: bg || '#402f2b',
      color: '#fff',
      borderRadius: 3,
      p: { xs: 1.5, sm: 2, md: 3 },
      boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
      textAlign: 'center',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
      },
    }}
  >
    <Typography
      variant='subtitle2'
      sx={{
        fontSize: { xs: '0.75rem', sm: '0.85rem' },
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {title}
    </Typography>
    <Typography
      variant='h4'
      sx={{
        fontWeight: 'bold',
        mt: 1,
        fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' },
      }}
    >
      {value}
    </Typography>
  </Box>
);

export default DashboardCard;

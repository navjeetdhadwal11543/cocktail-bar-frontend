import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonIcon from '@mui/icons-material/Person';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import InventoryIcon from '@mui/icons-material/Inventory';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export type DashboardTab =
  | 'dashboard'
  | 'operators'
  | 'barmen'
  | 'waiter'
  | 'menu'
  | 'warehouse';

const ITEMS: { tab: DashboardTab; label: string; icon: React.ReactNode }[] = [
  { tab: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { tab: 'operators', label: 'Operators', icon: <PersonIcon /> },
  { tab: 'barmen', label: 'Barmen', icon: <PersonIcon /> },
  { tab: 'waiter', label: 'Waiters', icon: <PersonIcon /> },
  { tab: 'menu', label: 'Menu', icon: <MenuBookIcon /> },
  { tab: 'warehouse', label: 'Warehouse', icon: <InventoryIcon /> },
];

interface Props {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  open: boolean;
  onToggle: () => void;
  onRefresh: () => void;
}

const DashboardSidebar: React.FC<Props> = ({
  activeTab,
  onTabChange,
  open,
  onToggle,
  onRefresh,
}) => (
  <Box
    sx={{
      position: 'fixed',
      top: 64,
      left: 0,
      width: '100%',
      maxWidth: 240,
      height: open ? 'calc(100vh - 64px)' : 70,
      bgcolor: 'rgba(20, 20, 20, 0.95)',
      color: 'white',
      borderTopRightRadius: 10,
      transition: 'height 0.4s ease',
      overflow: 'hidden',
      zIndex: 1000,
      backdropFilter: 'blur(4px)',
      boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
    }}
  >
    <Box
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
          🍹 Backoffice
        </Typography>
        <IconButton
          sx={{
            color: '#fff',
            transition: 'transform 0.3s ease',
            transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
          }}
          onClick={onToggle}
        >
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Box sx={{ flex: 1 }}>
        {ITEMS.map((item) => (
          <Box
            key={item.tab}
            onClick={() => onTabChange(item.tab)}
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: activeTab === item.tab ? '#ff7e5f' : 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': {
                bgcolor: '#ff7e5faa',
                transform: 'scale(1.03)',
              },
              transition: 'all 0.3s ease-in-out',
              mb: 1,
            }}
          >
            {item.icon} {open && item.label}
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 'auto', textAlign: 'center' }}>
        <IconButton
          sx={{ color: '#fff' }}
          onClick={onRefresh}
          title='Refresh Data'
        >
          <RefreshIcon />
        </IconButton>
      </Box>
    </Box>
  </Box>
);

export default DashboardSidebar;

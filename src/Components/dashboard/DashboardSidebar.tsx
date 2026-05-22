import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonIcon from '@mui/icons-material/Person';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import InventoryIcon from '@mui/icons-material/Inventory';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CloseIcon from '@mui/icons-material/Close';
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
  isMobile?: boolean;
}

const DashboardSidebar: React.FC<Props> = ({
  activeTab,
  onTabChange,
  open,
  onToggle,
  onRefresh,
  isMobile = false,
}) => {
  const desktopWidth = '100%';
  const mobileWidth = open ? 260 : 0;
  const sidebarWidth = isMobile ? mobileWidth : desktopWidth;

  const expandedHeight = 'calc(100vh - 64px)';
  const desktopHeight = open ? expandedHeight : 70;
  const sidebarHeight = isMobile ? expandedHeight : desktopHeight;

  const renderToggleIcon = () => {
    if (isMobile) return <CloseIcon />;
    if (open) return <ExpandLessIcon />;
    return <ExpandMoreIcon />;
  };

  return (
    <>
      {isMobile && open && (
        <Box
          onClick={onToggle}
          sx={{
            position: 'fixed',
            top: 64,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.5)',
            zIndex: 999,
          }}
        />
      )}
      <Box
        sx={{
          position: 'fixed',
          top: 64,
          left: 0,
          width: sidebarWidth,
          maxWidth: 240,
          height: sidebarHeight,
          bgcolor: 'rgba(20, 20, 20, 0.95)',
          color: 'white',
          borderTopRightRadius: 10,
          transition: isMobile ? 'width 0.3s ease' : 'height 0.4s ease',
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
                transform: !isMobile && !open ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
              onClick={onToggle}
            >
              {renderToggleIcon()}
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto' }}>
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
                {item.icon} {(isMobile || open) && item.label}
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
    </>
  );
};

export default DashboardSidebar;

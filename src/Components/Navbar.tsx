import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { gradients } from '../theme';

interface NavbarProps {
  showMenu?: boolean;
  showSignout?: boolean;
  onToggleSidebar?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  showMenu,
  showSignout,
  onToggleSidebar,
}) => {
  const navigate = useNavigate();

  return (
    <AppBar
      position='fixed'
      sx={{ background: gradients.primaryDiag, zIndex: 1200 }}
    >
      <Toolbar>
        {showMenu && (
          <IconButton color='inherit' onClick={onToggleSidebar} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          variant='h6'
          sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold' }}
        >
          🍹 Cocktail Bar
        </Typography>

        {showSignout && (
          <Button
            variant='contained'
            onClick={() => navigate('/')}
            sx={{
              background: gradients.primaryDiag,
              textTransform: 'none',
              color: 'white',
              fontWeight: 'bold',
              '&:hover': { background: gradients.primaryHover },
            }}
          >
            Esci
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  Container,
  Avatar,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/Context';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import FlightIcon from '@mui/icons-material/Flight';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

const NavBar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, userFullName, userInitials, isAdmin } = useUser();
  // Debug: log user and isAdmin
  console.log('NavBar user:', user);
  console.log('NavBar isAdmin:', isAdmin);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          {/* Left side - Navigation Links */}
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/"
              startIcon={<HomeIcon />}
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/about"
              startIcon={<InfoIcon />}
            >
              About
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/vacations"
              startIcon={<FlightIcon />}
            >
              Vacations
            </Button>
            {isAdmin && (
              <>
                <Button
                  component={RouterLink}
                  to="/add-vacation"
                  variant="contained"
                  sx={{
                    ml: 2,
                    backgroundColor: 'white',
                    color: 'primary.main',
                    fontWeight: 700,
                    borderRadius: 2,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.92)',
                      boxShadow: 'none'
                    },
                  }}
                >
                  Add Vacation
                </Button>
                <Button
                  component={RouterLink}
                  to="/edit-vacation/1" // Example link, should be dynamic in real app
                  variant="contained"
                  sx={{
                    ml: 1,
                    backgroundColor: 'white',
                    color: 'primary.main',
                    fontWeight: 700,
                    borderRadius: 2,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.92)',
                      boxShadow: 'none'
                    },
                  }}
                >
                  Edit Vacation
                </Button>
              </>
            )}
          </Box>

          {/* Right side - Auth Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isAuthenticated ? (
              <>
                {/* User Menu */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="inherit" sx={{ mr: 1 }}>
                    Welcome, {userFullName}
                  </Typography>
                  <IconButton
                    onClick={handleMenuOpen}
                    color="inherit"
                    sx={{ p: 0.5 }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        bgcolor: 'secondary.main',
                        fontSize: '0.875rem'
                      }}
                    >
                      {userInitials}
                    </Avatar>
                  </IconButton>
                </Box>
                
                {/* User Dropdown Menu */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={handleMenuClose}>
                    <AccountCircleIcon sx={{ mr: 1 }} />
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                {/* Login Button */}
                <Button
                  color="inherit"
                  variant="outlined"
                  onClick={handleLoginClick}
                  sx={{ 
                    borderColor: 'white', 
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Login
                </Button>
                
                {/* Register Button */}
                <Button
                  color="primary"
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  sx={{ 
                    backgroundColor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)'
                    }
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
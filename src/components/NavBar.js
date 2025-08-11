import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

function NavBar() {
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Button color="inherit" component={RouterLink} to="/">
            FTC Grants Tracker
          </Button>
        </Typography>
        
        <Button color="inherit" component={RouterLink} to="/grants">
          Browse Grants
        </Button>
        
        {currentUser ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/my-applications"
              sx={{ mr: 2 }}
            >
              My Applications
            </Button>
            
            <Avatar 
              sx={{ width: 32, height: 32, mr: 1 }}
              src={currentUser.photoURL || undefined}
              alt={currentUser.displayName || 'User'}
            />
            
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Button color="inherit" component={RouterLink} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
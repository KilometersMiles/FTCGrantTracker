import { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Link, Alert } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/my-applications');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/my-applications');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        mt: 8, 
        p: 4, 
        boxShadow: 3, 
        borderRadius: 2 
      }}>
        <Typography variant="h4" align="center" gutterBottom>
          Sign In
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
          
          <Button
            fullWidth
            variant="outlined"
            onClick={handleGoogleSignIn}
            disabled={loading}
            sx={{ mb: 2 }}
            startIcon={<img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" width="20" />}
          >
            Sign in with Google
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link component={RouterLink} to="/" variant="body2">
              Back to home
            </Link>
          </Box>
        </Box>
      </Box>
      
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="body2">
          Don't have an account?{' '}
          <Link component={RouterLink} to="/signup" variant="body2">
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default LoginPage;
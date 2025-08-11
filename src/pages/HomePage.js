import { Container, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function HomePage() {
  const { currentUser } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        textAlign: 'center', 
        py: 8,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9))',
        borderRadius: 2,
        mt: 4
      }}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          FTC Grants Tracker
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
          Find and track grants for your FIRST Tech Challenge team
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button 
            component={Link} 
            to="/grants" 
            variant="contained" 
            size="large"
          >
            Browse Grants
          </Button>
          
          {!currentUser && (
            <Button 
              component={Link} 
              to="/login" 
              variant="outlined" 
              size="large"
            >
              Sign In
            </Button>
          )}
          
          {currentUser && (
            <Button 
              component={Link} 
              to="/my-applications" 
              variant="outlined" 
              size="large"
            >
              My Applications
            </Button>
          )}
        </Box>
      </Box>

      <Box sx={{ mt: 8, display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        <FeatureCard 
          title="Discover Grants"
          description="Find funding opportunities specifically for FTC teams"
        />
        <FeatureCard 
          title="Track Applications"
          description="Keep track of all your grant applications in one place"
        />
        <FeatureCard 
          title="Community Driven"
          description="Contribute grants you find to help other teams"
        />
      </Box>
    </Container>
  );
}

function FeatureCard({ title, description }) {
  return (
    <Box sx={{ 
      maxWidth: 300, 
      p: 3, 
      m: 2, 
      border: '1px solid #eee', 
      borderRadius: 2,
      textAlign: 'center'
    }}>
      <Typography variant="h5" gutterBottom>{title}</Typography>
      <Typography variant="body1">{description}</Typography>
    </Box>
  );
}

export default HomePage;
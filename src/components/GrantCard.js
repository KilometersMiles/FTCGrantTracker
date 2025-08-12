import { Card, CardContent, Typography, Button, Chip, Link, Box, ButtonGroup } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { applyForGrant, getUserApplicationsForGrant } from '../services/applicationService';
import { format, isValid } from 'date-fns';
import { useState, useEffect } from 'react';
import { updateDoc, doc, Timestamp, FieldValue } from 'firebase/firestore';
import { db } from '../firebase';

function GrantCard({ grant = {} }) {  // Default to empty object if grant is undefined
  const { currentUser } = useAuth();
  const [isApplying, setIsApplying] = useState(false);
  const [isInterested, setIsInterested] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const userAppIds = await getUserApplicationsForGrant(currentUser.uid, grant.id);
        console.log(userAppIds);

        //if an application is interested, set isInterested
        userAppIds.forEach(function(application) {
          if (application.status === "interested") {
            setIsInterested(true);
          }
          if (application.status === "pending") {
            setIsApplying(true);
            setIsInterested(true);
          }

        });    
      } catch (error) {
          console.error("Error loading data:", error);
      }
    }
    loadData();
  }, [currentUser]); // Add currentUser to dependencies

  const handleInterest = async () => {
    if (!id) return;  // Don't proceed if no grant ID
    
    setIsInterested(true);
    try {
      await applyForGrant(currentUser.uid, id, "interested",`Applied via FTC Grants Tracker`);
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error marking interest', error);
      alert('Failed to mark interest, oof');
    } 
  };

  const handleApply = async () => {
    if (!id) return;  // Don't proceed if no grant ID
    
    setIsApplying(true);
    setIsInterested(true);
    try {
      await applyForGrant(currentUser.uid, id, "pending",`Applied via FTC Grants Tracker`);
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying for grant:', error);
      alert('Failed to submit application');
    }
  };

  // Safe access to grant properties with defaults
  const {
    id = '',
    name = 'Unnamed Grant',
    description = 'No description available',
    startDate = null,
    endDate = null,
    latitude = null,
    longitude = null,
    radius = null,
    eligibility = '',
    amount = '',
    website = '',
    verified = null,
  } = grant;


  // Safe date formatting
  const formatDateSafe = (date) => {
    if (!date || !isValid(new Date(date))) return 'Date not specified';
    return format(new Date(date), 'MMM d, yyyy');
  };

  // Check if grant is expired
  const isExpired = () => {
    if (!endDate) return false;
    const endDateObj = new Date(endDate);
    return isValid(endDateObj) && new Date() > endDateObj;
  };

  // Get coordinates if available
  const coords = latitude != null
    ? `Lat: ${latitude?.toFixed(4) || 'N/A'}, Lng: ${longitude?.toFixed(4) || "N/A"}, Rad: ${radius || "N/A"}`
    : 'Location not specified';
  
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {description}
        </Typography>
        
        <Box sx={{ my: 1 }}>
          <Chip 
            label={`Starts: ${formatDateSafe(startDate)}`} 
            size="small" 
            sx={{ mr: 1, mb: 1 }}
          />
          <Chip 
            label={`Ends: ${formatDateSafe(endDate)}`} 
            size="small" 
            sx={{ mr: 1, mb: 1 }}
            color={isExpired() ? 'error' : 'default'}
          />
        </Box>
        
        <Box sx={{ my: 1 }}>
          <Chip 
            label={coords}
            size="small"
            sx={{ mr: 1, mb: 1 }}
          />
          {latitude && longitude && (
            <Link 
              href={`https://www.google.com/maps?q=${latitude},${longitude}`}
              target="_blank"
              rel="noopener"
            >
              <Chip 
                label="View on Map"
                size="small"
                clickable
                sx={{ mb: 1 }}
              />
            </Link>
          )}
        </Box>
        
        {eligibility && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>Eligibility:</strong> {eligibility}
          </Typography>
        )}
        
        {amount && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>Amount:</strong> {amount}
          </Typography>
        )}
        
        {website && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>Website:</strong> <Link href={website} target="_blank" rel="noopener">{website}</Link>
          </Typography>
        )}
      </CardContent>
      
      <CardContent>
        {currentUser && id && (
            <ButtonGroup fullWidth>
                <Button 
                variant={isInterested ? "contained" : "outlined"}
                onClick={handleInterest}
                disabled={isApplying}
                >
                {isInterested ? "Interested ✓" : "I'm Interested"}
                </Button>
                <Button 
                variant={isApplying ? "contained" : "outlined"} 
                color={isApplying ? "success" : "primary"}
                onClick={handleApply}
                >
                {isApplying ? "Applied ✓" : "Mark as Applied"}
                </Button>
            </ButtonGroup>

        )}
      </CardContent>
    </Card>
  );
}

export default GrantCard;
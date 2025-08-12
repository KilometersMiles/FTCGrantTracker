import { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Stack,
  Typography,
  Alert
} from '@mui/material';
import { isValid } from 'date-fns'; // Add this import

function AddGrantDialog({ open, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    latitude: '',
    longitude: '',
    radius: '',
    eligibility: '',
    amount: '',
    website: '',
    contactEmail: '',
    verified: false,
  });
  const [error, setError] = useState(''); // Add error state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setError(''); // Reset error state
    
    // Validate required fields
    if (!formData.name || !formData.description) {
      setError('Name and description are required');
      return;
    }

    // Validate dates
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (!formData.startDate || !isValid(startDate)) {
      setError('Please enter a valid start date');
      return;
    }
    
    if (!formData.endDate || !isValid(endDate)) {
      setError('Please enter a valid end date');
      return;
    }
    
    if (endDate < startDate) {
      setError('End date must be after start date');
      return;
    }
    
    // Validate coordinates
    const latitude = parseFloat(formData.latitude);
    const longitude = parseFloat(formData.longitude);
    
    if (isNaN(latitude) || isNaN(longitude)) {
      setError('Please enter valid latitude and longitude coordinates');
      return;
    }
    
    if (latitude < -90 || latitude > 90) {
      setError('Latitude must be between -90 and 90');
      return;
    }
    
    if (longitude < -180 || longitude > 180) {
      setError('Longitude must be between -180 and 180');
      return;
    }
    
    // If all validations pass, submit the form
    onSubmit({
      ...formData,
      latitude,
      longitude
    });
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      latitude: '',
      longitude: '',
      eligibility: '',
      amount: '',
      website: '',
      contactEmail: '',
      verified: false
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Grant To List (Must be approved by admin)</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            name="name"
            label="Grant Name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
          
          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            required
          />
          
          <Stack direction="row" spacing={2}>
            <TextField
              name="startDate"
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            
            <TextField
              name="endDate"
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Stack>
          
          <Typography variant="subtitle1">Location Coordinates (If applicable)</Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              name="latitude"
              label="Latitude"
              type="number"
              value={formData.latitude}
              onChange={handleChange}
              fullWidth
              inputProps={{ 
                step: "0.000001",
                min: "-90",
                max: "90"
              }}
            />
            
            <TextField
              name="longitude"
              label="Longitude"
              type="number"
              value={formData.longitude}
              onChange={handleChange}
              fullWidth
              inputProps={{ 
                step: "0.000001",
                min: "-180",
                max: "180"
              }}
            />
            <TextField
              name="radius"
              label="Radius (Miles)"
              type="number"
              value={formData.radius}
              onChange={handleChange}
              fullWidth
              inputProps={{ 
                step: ".1",
                min: "0",
                max: "1000"
              }}
            />
          </Stack>
          
          <TextField
            name="eligibility"
            label="Eligibility"
            value={formData.eligibility}
            onChange={handleChange}
            fullWidth
          />
          
          <TextField
            name="amount"
            label="Funding Amount"
            value={formData.amount}
            onChange={handleChange}
            fullWidth
          />
          
          <TextField
            name="website"
            label="Website URL"
            value={formData.website}
            onChange={handleChange}
            fullWidth
          />
          
          <TextField
            name="contactEmail"
            label="Contact Email"
            type="email"
            value={formData.contactEmail}
            onChange={handleChange}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Submit</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddGrantDialog;
import { useEffect, useState } from 'react';
import { Container, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import { getAllGrants, addGrant } from '../services/grantService';
import GrantCard from '../components/GrantCard';
import AddGrantDialog from '../components/AddGrantDialog';
import { useAuth } from '../context/AuthContext';
import { getUserApplications } from '../services/applicationService';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function GrantsPage() {
  const [grants, setGrants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const { currentUser } = useAuth();

useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      const [allGrants, userAppIds] = await Promise.all([
        getAllGrants(),
        currentUser ? fetchUserApplications(currentUser.uid) : []
      ]);
      
      // Filter out applied grants
      const availableGrants = allGrants.filter(
        grant => !userAppIds.includes(grant.id)
      );
      
      setGrants(availableGrants);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };
  loadData();
}, [currentUser]); // Add currentUser to dependencies

const handleAddGrant = async (newGrant) => {
  try {
    await addGrant({
      ...newGrant,
      createdBy: currentUser.uid // Add creator ID
    });
    const updatedGrants = await getAllGrants();
    setGrants(updatedGrants);
    setOpenAddDialog(false);
    alert('Grant added successfully!'); // Add success feedback
  } catch (error) {
    console.error("Error adding grant:", error);
    alert(`Failed to add grant: ${error.message}`); // Show error message
  }
};
const fetchUserApplications = async (userId) => {
  const applicationsCol = collection(db, 'userApplications');
  const q = query(applicationsCol, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data().grantId);
};

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Available Grants
      </Typography>
      
      {currentUser && (
        <Button 
          variant="contained" 
          onClick={() => setOpenAddDialog(true)}
          sx={{ mb: 3 }}
        >
          Add New Grant
        </Button>
      )}

      <Grid container spacing={3}>
        {grants.map(grant => (
          <Grid item xs={12} sm={6} md={4} key={grant.id}>
            <GrantCard grant={grant} />
          </Grid>
        ))}
      </Grid>

      <AddGrantDialog 
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSubmit={handleAddGrant}
      />
    </Container>
  );
}

export default GrantsPage;
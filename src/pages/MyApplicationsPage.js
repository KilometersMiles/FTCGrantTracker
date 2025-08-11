import { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, List, ListItem } from '@mui/material';
import { getUserApplications } from '../services/applicationService';
import { getGrantById } from '../services/grantService';
import { useAuth } from '../context/AuthContext';

function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadApplications = async () => {
      if (currentUser) {
        const userApps = await getUserApplications(currentUser.uid);
        
        // Fetch grant details for each application
        const appsWithGrants = await Promise.all(
          userApps.map(async (app) => {
            const grant = await getGrantById(app.grantId);
            return { ...app, grant };
          })
        );
        
        setApplications(appsWithGrants);
      }
    };
    loadApplications();
  }, [currentUser]);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        My Grant Applications
      </Typography>
      
      {applications.length === 0 ? (
        <Typography>You haven't applied to any grants yet.</Typography>
      ) : (
        <List>
          {applications.map((app) => (
            <ListItem key={app.id}>
              <Card sx={{ width: '100%' }}>
                <CardContent>
                  <Typography variant="h6">{app.grant?.name}</Typography>
                  <Typography>Status: {app.status}</Typography>
                  <Typography>Applied on: {app.appliedAt?.toDate().toLocaleDateString()}</Typography>
                  {app.notes && <Typography>Notes: {app.notes}</Typography>}
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
}

export default MyApplicationsPage;
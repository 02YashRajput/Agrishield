import React from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { Box, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import ErrorPage from './Error';

// Fetcher function to handle API requests
const fetcher = (url: string) =>
  axios
    .get(url, { withCredentials: true })
    .then((res) => res.data);

const serverUrl = import.meta.env.VITE_SERVER_URL;

const AdminDashboard: React.FC = () => {
  // Use SWR to fetch data from the API
  const { data, error } = useSWR(`${serverUrl}/api/admin/dashboard`, fetcher);

  // If there’s an error, render the ErrorPage component
  if (error) return <ErrorPage />;

  // While data is loading, show a loading spinner
  if (!data) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <CircularProgress />
    </Box>
  );

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Grid container to organize content */}
      <Grid container spacing={4}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ padding: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="secondary">
              Farmers
            </Typography>
            <Typography variant="h4">{data.farmersCount}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper sx={{ padding: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="secondary">
              Buyers
            </Typography>
            <Typography variant="h4">{data.buyersCount}</Typography>
          </Paper>
        </Grid>

       
      </Grid>
    </Box>
  );
};

export default AdminDashboard;

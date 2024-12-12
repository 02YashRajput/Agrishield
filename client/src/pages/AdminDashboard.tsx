import React, { useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { Box, Typography, Grid, Paper, CircularProgress, Button } from '@mui/material';
import { Link } from 'react-router-dom';

import NotFound from './NotFound';
import toast from 'react-hot-toast';

const fetcher = (url: string) =>
  axios.get(url, { withCredentials: true,headers: {
    'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
  }, }).then((res) => res.data);

interface User {
  _id: number;
  userId: number;
  userName: string;
  email: string;
  phone: string;
  userType: string;
  profileImage: string;
  provider: string;
  isVerified: boolean;
}

interface Contract {
  contractId: number;
  contractStatus: 'Requested' | 'Ongoing' | 'Completed';
  farmerName: string;
  buyerName: string;
  initialpaymentStatus: 'Pending' | 'Paid' | 'Received';
  finalpaymentStatus: 'Pending' | 'Paid' | 'Received';
  deliveryStatus: 'Pending' | 'Delivered' | 'Received';
  deadline: Date;
  initialPaymentAmount: string;
  finalPaymentAmount: string;
  productName: string;
  productImage: string;
  buyerProfileImage: string;
  buyerProfileLink: string;
  farmerProfileImage: string;
  farmerProfileLink: string;
  productQuantity: string;
  transactions: {
    transactionId: number;
    details: string;
    amount: number;
    date: Date;
  }[];
}

interface DashboardData {
  farmers: User[];
  buyers: User[];
  contracts: Contract[];
}

const AdminDashboard: React.FC = () => {
  const { data, error } = useSWR<DashboardData>(`/api/admin/dashboard`, fetcher);

  const [viewingUsers, setViewingUsers] = useState<'farmers' | 'buyers' | null>(null);
  const [viewingContracts, setViewingContracts] = useState(false);

  if (error) return <NotFound />;
  if (!data)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );

  const handleViewUsers = (userType: 'farmers' | 'buyers') => {
    setViewingUsers(userType);
    setViewingContracts(false);
  };

  const handleViewContracts = () => {
    setViewingUsers(null);
    setViewingContracts(true);
  };

  const handleBack = () => {
    setViewingUsers(null);
    setViewingContracts(false);
  };
  const deleteUser = async (userId: number) => {
    try {
       await axios.delete(`/api/admin/dashboard/user/${userId}`, {
        withCredentials: true,
        headers: {
          'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
        },
      });

      toast.success("user deleted successfully")
    } catch (error:any) {
      toast.error(error.message)
     
    }
  };
  const deleteContract = async (contractId: number) => {
    try {
      await axios.delete(`/api/admin/dashboard/${contractId}`, {
        withCredentials: true,
        headers: {
          'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
        },
      });
     toast.success('contract deleted successfullt')
    } catch (error:any) {
      toast.error(error.message)
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      {viewingUsers ? (
        <Box>
          <Button variant="contained" onClick={handleBack} sx={{ marginBottom: 2 }}>
            Back to Dashboard
          </Button>
          <Typography variant="h5" gutterBottom>
            {viewingUsers === 'farmers' ? 'Farmers' : 'Buyers'} List
          </Typography>
          {data[viewingUsers].map((user) => (
            <Paper
              key={user._id}
              sx={{ padding: 2, marginBottom: 1, textDecoration: 'none' }}
              
            >
              <Typography variant="body1" component={Link}
              to={`/profile/${user.userId}`}>
                <strong>Name:</strong> {user.userName}
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong> {user.email}
              </Typography>
              <Typography variant="body2">
                <strong>Phone:</strong> {user.phone}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={() => deleteUser(user._id)}
                sx={{ marginTop: 1 }}
              >
                Delete User
              </Button>
            </Paper>
          ))}
        </Box>
      ) : viewingContracts ? (
        <Box>
          <Button variant="contained" onClick={handleBack} sx={{ marginBottom: 2 }}>
            Back to Dashboard
          </Button>
          <Typography variant="h5" gutterBottom>
            Contracts List
          </Typography>
          {data.contracts.map((contract) => (
            <Paper
              key={contract.contractId}
              sx={{ padding: 2, marginBottom: 1, textDecoration: 'none' }}
              
            >
              <Typography variant="body1" component={Link}
              to={`/contract/${contract.contractId}`}>
                <strong>Product:</strong> {contract.productName}
              </Typography>
              <Typography variant="body2">
                <strong>Farmer:</strong> {contract.farmerName}
              </Typography>
              <Typography variant="body2">
                <strong>Buyer:</strong> {contract.buyerName}
              </Typography>
              <Typography variant="body2">
                <strong>Status:</strong> {contract.contractStatus}
              </Typography>
              <Typography variant="body2">
                <strong>Deadline:</strong> {new Date(contract.deadline).toLocaleDateString()}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={() => deleteContract(contract.contractId)}
                sx={{ marginTop: 1 }}
              >
                Delete Contract
              </Button>
            </Paper>
          ))}
        </Box>
      ) : (
        <Box>
          <Typography variant="h4" gutterBottom>
            Admin Dashboard
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Paper
                sx={{ padding: 2, textAlign: 'center', cursor: 'pointer' }}
                onClick={() => handleViewUsers('farmers')}
              >
                <Typography variant="h6" color="secondary">
                  Farmers
                </Typography>
                <Typography variant="h4">{data.farmers.length}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper
                sx={{ padding: 2, textAlign: 'center', cursor: 'pointer' }}
                onClick={() => handleViewUsers('buyers')}
              >
                <Typography variant="h6" color="secondary">
                  Buyers
                </Typography>
                <Typography variant="h4">{data.buyers.length}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper
                sx={{ padding: 2, textAlign: 'center', cursor: 'pointer' }}
                onClick={handleViewContracts}
              >
                <Typography variant="h6" color="secondary">
                  Contracts
                </Typography>
                <Typography variant="h4">{data.contracts.length}</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default AdminDashboard;

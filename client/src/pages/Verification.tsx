import { Paper, Typography } from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import ErrorPage from './Error';
import Logo from '../assets/AgriShieldTransparent.png';
import axios from 'axios';

// Axios fetcher with credentials
const fetcher = (url: string) =>
  axios
    .get(url, { withCredentials: true,headers: {
      'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
    }, })
    .then((res) => res.data);

const Verification: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get('token');

  if (!token) {
    return <ErrorPage />;
  }

  const { data, error } = useSWR(`/api/verify-email?token=${token}`, fetcher);

  if (error) {
    return <ErrorPage />;
  }

  if (data) {
    toast.success('Email verified successfully!');
    navigate(`/profile/${data.userId}?isEditable=true`);
  }

  return (
    <div>
      <Paper elevation={3} style={{ padding: '1.5rem', textAlign: 'center' }}>
        {data ? (
          <Typography>Redirecting...</Typography>
        ) : (
          <>
            <img src={Logo} alt="Logo" />
            <Typography>Verifying your email...</Typography>
          </>
        )}
      </Paper>
    </div>
  );
};

export default Verification;

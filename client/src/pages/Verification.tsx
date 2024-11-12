import { Paper, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import ErrorPage from './Error';
import Logo from '../assets/AgriShieldTransparent.png';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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

  if(data){
    toast.success('Email verified successfully! You can now login.');
    navigate('/profile');
   
  }

  return (
    <div>
      <Paper elevation={3} style={{ padding: '1.5rem', textAlign: 'center' }}>
        {data ? (
          <Typography>Redirecting...</Typography>
        ) : (
          <>
            <img src={Logo} alt="Logo" /> {/* Use img tag for image */}
            <Typography>Verifying your email...</Typography>
          </>
        )}
      </Paper>
    </div>
  );
};

export default Verification;

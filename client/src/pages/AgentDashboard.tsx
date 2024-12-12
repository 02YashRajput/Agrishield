import axios from 'axios';
import React from 'react'
import useSWR from 'swr';
import NotFound from './NotFound';
import { Paper } from '@mui/material';
import UserForm from '../components/agent/UserForm';

const fetcher = (url: string) =>
  axios.get(url, { withCredentials: true,headers: {
    'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
  }, }).then((res) => res.data);

interface Data{
  success: boolean;
  message:string
}
const AgentDashboard:React.FC = () => {

  const { error } = useSWR<Data>(`/api/agent`, fetcher);

  if(error){
    return <NotFound/>
  }
  return (
      <Paper  className="min-h-screen">
        <UserForm/>
      </Paper>
  )
}

export default AgentDashboard
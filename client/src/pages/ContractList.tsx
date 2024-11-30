import React from 'react'
import { ProductName } from '../utils/cropsName';
import axios from 'axios';
import useSWR from 'swr';
import ErrorPage from './Error';
import Header from '../components/Header';
import { Card, CardContent, Paper, Typography } from '@mui/material';
import TableComponent from '../components/ContractList/TableComponent';
import { Link } from 'react-router-dom';
interface Data {
  success: boolean;
  message: string;
  user?: {
    name: string;
    profileImage: string;
    id: Number;
    userType: string;
  };
  data :{
    contractId:number,
    contractStatus : "Requested"| "Ongoing"| "Completed"
    farmerName:string,
    buyerName:string,
    initialpaymentStatus: "Pending" | "Paid" | "Received";
    finalpaymentStatus:"Pending" | "Paid" | "Received";
    deliveryStatus : "Pending"| "Delivered"| "Received";
    deadline : Date;
    initialPaymentAmount :string;
    finalPaymentAmount :string;
    productName: string;
    productImage: string;
    buyerProfileImage: string;
    buyerProfileLink: string;
    farmerProfileImage:string;
    farmerProfileLink:string;
    productQuantity:string;
    transactions:{
      transactionId:number
      details:string
      amount:string;
      date:Date;
    }[]}[]
}

const fetcher = (url: string) =>
  axios
    .get(url, {
      withCredentials: true,
    })
    .then((res) => res.data);
    
const ContractList :React.FC = () => {
  const { data, error, isLoading } = useSWR<Data>(
    `/api/contracts`,
    fetcher
  );
  const isLoggedIn = data?.user ? true : false;
  const groupedContracts = data?.data.reduce((acc, contract) => {
    if (!acc[contract.contractStatus]) {
      acc[contract.contractStatus] = [];
    }
    acc[contract.contractStatus].push(contract);
    return acc;
  }, {} as Record<string, typeof data['data']>);

   
  const statusOrder: ("Requested" | "Ongoing" | "Completed")[] = ["Requested", "Ongoing", "Completed"];
  const sortedStatuses = statusOrder.filter(status => groupedContracts?.hasOwnProperty(status));

  if (error) {
    return <ErrorPage />;
  }

  return (
    <div>
      <Header
        name={data?.user?.name}
        profileImage={data?.user?.profileImage}
        isLoggedIn={isLoggedIn}
        id={data?.user?.id}
      />

      <Paper  sx={{ backgroundColor: "#f7f7f7" }} className="min-h-screen p-8 ">
      { !isLoading &&  groupedContracts && (
          <>
            {!isLoading && sortedStatuses.map((status) => (
              <Card sx={{ borderRadius: 5 }}
              className="max-w-4xl mx-auto bg-white p-8 mb-6" key={status}>
                <CardContent>
                <Typography variant='h4' sx={{fontWeight:800}}>{status} Contracts</Typography>
                <TableComponent contracts={groupedContracts[status]} />
                </CardContent>
              </Card>
            ))}
{!isLoading && sortedStatuses.length === 0 && (
        <Card sx={{ borderRadius: 5 }} className="max-w-4xl mx-auto bg-white p-8 mb-6">
          <CardContent>
            <Typography variant='h4' sx={{ fontWeight: 800 }}>No Contracts Available</Typography>
            <Typography variant='body1'>There are no contracts under the selected statuses.</Typography>
            <Link to="/marketplace?page=1" className='text-blue-500 underline'> Go To Market Place</Link>
          </CardContent>
        </Card>
      )}
          </>
        )}

      </Paper>
    </div>
  )
}

export default ContractList
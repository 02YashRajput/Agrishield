import axios from 'axios';
import React from 'react'
import useSWR from 'swr';
import ErrorPage from './Error';
import { Card, CardContent, CircularProgress, Paper } from '@mui/material';
import Header from '../components/Header';
import TransactionsTable from '../components/TransactionsTable';
import Footer from "../components/Footer";
interface User {
  name: string;
  id: number;
  profileImage: string;
  userType: "Farmer" | "Buyer";
}

interface Transaction {
  transactionId: string;
  details: string;
  amount: number;
  date: string; // ISO string format
}

export interface ContractTransaction {
  contractId: number;
  transactions: Transaction[];
}

type TransactionsResponse = {
  success: boolean;
  transactions: ContractTransaction[];
  user: User;
};
const fetcher = (url: string) =>
  axios
    .get(url, {
      withCredentials: true,
      headers: {
        'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
      },
    })
    .then((res) => res.data);
const TransactionList :React.FC= () => {

  const { data, error, isLoading } = useSWR<TransactionsResponse>(
    `/api/transactions`,
    fetcher
  );
  const isLoggedIn = data?.user ? true : false;
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
      {
        isLoading  ? <CircularProgress/> :
        <Card sx={{ borderRadius: 5 }}
              className="max-w-4xl mx-auto bg-white p-8 mb-6" >
               <CardContent>
              {data?.transactions.map((transaction) => (
                <TransactionsTable
                  key={transaction.contractId}
                  contractId={transaction.contractId}
                  transactions={transaction.transactions}
                />
              ))}
            </CardContent>
                </Card>
      }
</Paper>
<Footer/>
    </div>
  )
}

export default TransactionList
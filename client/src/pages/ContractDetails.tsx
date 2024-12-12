import React from 'react'

import axios from 'axios';
import useSWR from 'swr';
import ErrorPage from './Error';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { Card, CardContent, Paper } from '@mui/material';
import RequestedDetails from '../components/contractDetails/RequestedDetails';
import OngoingDetails from '../components/contractDetails/OngoingDetails';
import Footer from "../components/Footer";

interface Data {
  success: boolean;
  message: string;
  user?: {
    name: string;
    profileImage: string;
    id: Number;
    userType: string;
    email: string;
    phone:string;
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
    productVariety: string;
    qualityCheck:boolean;
    quality:string;
    deliveryPreference:string;
    createdAt:Date;
    transactions :{
      transactionId: number;
      details: string;
      amount: number;
      date: Date;
    }[]
  }
}
const fetcher = (url: string) =>
  axios
    .get(url, {
      withCredentials: true,
      headers: {
        'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
      },
    })
    .then((res) => res.data);
const ContractDetails :React.FC= () => {
  const location = useLocation();
  
  const { data, error, isLoading } = useSWR<Data>(
    `/api${location.pathname}`,
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

       {!isLoading && <Card sx={{ borderRadius: 5 }}
              className="max-w-4xl mx-auto bg-white p-8 mb-6" >
                <CardContent>
                  {
                    data?.data.contractStatus === "Requested" && <RequestedDetails data = {data?.data}  userType={data?.user?.userType}/>
                  }
                 
                  {
                    (data?.data.contractStatus === "Ongoing" ||data?.data.contractStatus === "Completed")  && <OngoingDetails data={data?.data} userType={data?.user?.userType} email={data?.user?.email} phone={data?.user?.phone} name={data?.user?.name}/>
                  }
                </CardContent>
              </Card> }

      </Paper>
      <Footer />
    </div>
  )
}

export default ContractDetails
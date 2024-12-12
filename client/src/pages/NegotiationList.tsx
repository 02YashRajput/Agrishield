import React, { useEffect, useState } from "react";

import axios from "axios";
import useSWR from "swr";
import ErrorPage from "./Error";
import Header from "../components/Header";
import { Card, CardContent, Paper, Typography } from "@mui/material";
import NegoTable from "../components/Negotiations/NegoTable";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
export interface NegoData {
  success: boolean;
  message: string;
  user?: {
    name: string;
    profileImage: string;
    id: Number;
    userType: string;
  };
  data: Negotiation[];
}
export interface Negotiation {
    negotiationsId: number;
    farmerName: string;
    buyerName: string;
    deadlineBuyer: Date;
    deadlineFarmer: Date;
    initialPaymentAmountBuyer: string;
    finalPaymentAmountBuyer: string;
    initialPaymentAmountFarmer: string;
    finalPaymentAmountFarmer: string;
    productQuantityFarmer: string;
    lastUpdated: "Farmer" | "Buyer";
    productName: string;
    productImage: string;
    buyerProfileImage: string;
    buyerProfileLink: string;
    farmerProfileImage: string;
    farmerProfileLink: string;
    productQuantityBuyer: string;
    productVariety: string;
    deliveryPreferenceFarmer: string;
    deliveryPreferenceBuyer: string;
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
const NegotiationList: React.FC = () => {
  const { t } = useTranslation(["negotiationlist", "crops"]);
  const { data, error, isLoading } = useSWR<NegoData>(`/api/negotiations`, fetcher);
  const isLoggedIn = data?.user ? true : false;
  const [tableData,setTableDate] = useState<Negotiation[]>([]);
  if (error) {
    return <ErrorPage />;
  }
  useEffect(()=>{
    if(!isLoading && data) {
      setTableDate(data.data)
    }
  },[isLoading])
  return (
    <div>
      <Header
        name={data?.user?.name}
        profileImage={data?.user?.profileImage}
        isLoggedIn={isLoggedIn}
        id={data?.user?.id}
      />
      <Paper sx={{ backgroundColor: "#f7f7f7" }} className="min-h-screen p-8 ">
      {tableData &&  (
  tableData.length > 0 ? (
    <Card sx={{ borderRadius: 5 }} className="max-w-4xl mx-auto bg-white p-8 mb-6" key={status}>
      <CardContent>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          {t('Ongoing Negotiations')}
        </Typography>
        <Typography variant="body1">
          {t('View the status of your active negotiations.')}
        </Typography>
        <NegoTable data={tableData} setData = {setTableDate} userType={data?.user?.userType} />
      </CardContent>
    </Card>
  ) : (
    <Card sx={{ borderRadius: 5 }} className="max-w-4xl mx-auto bg-white p-8 mb-6">
      <CardContent>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          {t('nonego')}
        </Typography>
        <Typography variant="body1">
          {t('There are no negotiations under the selected statuses.')}
        </Typography>
        <Link to="/marketplace?page=1" className="text-blue-500 underline">
          {t('Go To Market Place')}
        </Link>
      </CardContent>
    </Card>
  )
)}
      </Paper>
      <Footer/>
    </div>
  );
};

export default NegotiationList;

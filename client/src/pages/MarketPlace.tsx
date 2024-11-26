import axios from "axios";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { ProductName } from "../utils/cropsName";
import ErrorPage from "./Error";
import Header from "../components/Header";
import BuyerMarketPlace from "../components/marketPlace/BuyerMarketPlace";
import { Paper } from "@mui/material";
import FarmerMarketPlace from "../components/marketPlace/FarmerMarketPlace";

interface Data {
  success: boolean;
  message: string;
  user?: {
    name: string;
    profileImage: string;
    id: Number;
    userType: string;
  };
  distance?: string;
  crops?: string[];
  results: {
    marketPlaceId: number;
    buyerName: string;
    buyerProfileImage: string;
    buyerProfileLink: string;
    productName: ProductName;
    additionalInstructions: string;
    productQuantity: string;
    deadline: Date;
    initialPaymentAmount: string;
    finalPaymentAmount: string;
    productImage: string;
  }[];
}
const fetcher = (url: string) =>
  axios
    .get(url, {
      withCredentials: true,
    })
    .then((res) => res.data);

const MarketPlace: React.FC = () => {
  const [page, setPage] = useState(1);

  const [distance,setDistance] = useState<number>(0);
  const [crop,setCrop] = useState<string>("");
  const { data, error, isLoading } = useSWR<Data>(
    `/api/marketplace?page=${page}&distance=${distance}&crop=${crop}`,
    fetcher
  );
  const isLoggedIn = data?.user ? true : false;

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));


 

  useEffect(() => { 
    const newUrl = `/marketplace?page=${page}`;
    window.history.pushState({}, "", newUrl);
  }, [page]);
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
      <Paper sx={{ backgroundColor: "#f7f7f7" }} className="min-h-screen p-8">
      {!isLoading && data && data.user && (
   data.user.userType === "Buyer" ? (
    <BuyerMarketPlace
    isLoading={isLoading}
      results={data?.results}
      userType={data?.user?.userType}
      handleNextPage={handleNextPage}
      handlePrevPage={handlePrevPage}
      page={page}
    />
  ) : (
    <FarmerMarketPlace
      results={data?.results}
      userType={data?.user?.userType}
      handleNextPage={handleNextPage}
      handlePrevPage={handlePrevPage}
      distance={distance}
      setDistance={setDistance}
      crop={crop}
      setCrop={setCrop}
      page={page}
      isLoading={isLoading}
     
    />
  )
)}

      </Paper>
    </div>
  );
};

export default MarketPlace;

import axios from "axios";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import ErrorPage from "./Error";
import Header from "../components/Header";
import BuyerMarketPlace from "../components/marketPlace/BuyerMarketPlace";
import { Paper } from "@mui/material";
import FarmerMarketPlace from "../components/marketPlace/FarmerMarketPlace";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import toast from "react-hot-toast";

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
    productName: string;
    additionalInstructions: string;
    productQuantity: string;
    deadline: Date;
    initialPaymentAmount: string;
    finalPaymentAmount: string;
    productImage: string;
    productVariety : string;
    deliveryPreference: string;
  }[];
  productQuantities?: { 
    [productName: string]: number;
  };
  districtQuantities?:{
    [productName: string]: number;
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

const MarketPlace: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const Page = params.get("page") || null;
  const [page, setPage] = useState<number>(Page ? parseInt(Page,10) : 1);

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
    if (error.status === 401) {
        navigate("/profile");
        toast.error("Please complete you profile first");
    } else {
      return <ErrorPage />;
    }
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
      productQuantities={data?.productQuantities}
      districtQuantities={data?.districtQuantities}
      crop={crop}
      setCrop={setCrop}
      page={page}
      isLoading={isLoading}
     
    />
  )
)}

      </Paper>
      <Footer/>
    </div>
  );
};

export default MarketPlace;

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Paper,
  Rating,
  Typography,
} from "@mui/material";
import { MdVerifiedUser } from "react-icons/md";
import { crops } from "../utils/cropsName";
import useSWR from "swr";
import axios from "axios";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ErrorPage from "./Error";
import { FaEdit } from "react-icons/fa";
import ProfileAvatar from "../components/profile/ProfileAvatar";
import NotFound from "./NotFound";
import ProfileContentUser from "../components/profile/ProfileContentUser";
import ReviewsAndRatings from "../components/profile/ReviewsAndRatings";
import { useLanguage } from "../context/LanguageContext";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";

export interface Data {
  success: boolean;
  message: string;
  user?: {
    name: string;
    profileImage: string;
    id: Number;
  };
  profileData?: {
    userName: string;
    email?: string;
    phone?: string;
    profileImage: string;
    userType: string;
    address: {
      name: string;
      district: string;
      state: string;
      pincode: string;
    };
    paymentInformation?: {
      bankDetails: {
        accountNumber: string;
        accountHolderName: string;
        bankName: string;
        IFSCCode: string;
      };
      upiDetails?: {
        upiId: string;
        upiName: string;
      };
    };
    farmDetails?: {
      cropsGrown: crops;
      farmAddress: string;
      sizeUnit: string;
      farmSize: string;
    };
    notificationPreferences: {
      message: boolean;
      email: boolean;
    };
    reviews: 
      {
        rating: number;
        message: string;
        createdAt:Date
      }[]
  ;
    rating: number;
      adhaar:string;
  };
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

const Profile: React.FC = () => {
  const {setIsChatOpen} = useLanguage();
  const {t} = useTranslation('profilee');
  
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, error, isLoading } = useSWR<Data>(
    `/api/profile/${id}`,
    fetcher
  );

  const [isEditable, setIsEditable] = useState<boolean>(false);

  const [profileData, setProfileData] = useState<Data["profileData"] | null>(
    null
  );

  const location = useLocation();
  const isLoggedIn = data?.user ? true : false;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const isEditableParam = params.get("isEditable");
    setIsEditable(isEditableParam === "true");
  }, [location.search]);

  useEffect(() => {
    if (!isLoading) {
      setProfileData(data?.profileData);
    }
  }, [isLoading]);

  if (error?.response?.status === 401) {
    toast.error(t("please login first"));
    navigate("/login");
  }
  if (error?.response?.status === 500) {
    return <ErrorPage />;
  }
  if (error?.response?.status === 404) {
    return <NotFound />;
  }

  return (
    <div>
      <Header
        name={data?.user?.name}
        profileImage={data?.user?.profileImage}
        isLoggedIn={isLoggedIn}
        id={data?.user?.id}
      />
      {!isLoading && profileData?.userName ? (
        <Paper
          className="bg-[#f7f7f7] min-h-screen p-8 "
          sx={{ backgroundColor: "#f7f7f7" }}
        >
          <Card sx={{borderRadius:5}} className="max-w-4xl mx-auto bg-white p-6 ">
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" }, // flex-column for small screens, flex-row for md and up
                gap: 2, // Adds spacing between children
                alignItems: { xs: "center", md: "center" }, // Center on small screens
              }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <ProfileAvatar
                  src={profileData?.profileImage}
                  isEditable={isEditable}
                />
                <Box>
                <Typography
  variant="body1"
  align="left"
  sx={{ color: "gray", display: "flex", alignItems: "center" }}
>
  Name: {profileData?.userName} { profileData?.adhaar && <MdVerifiedUser />}
</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Rating value={profileData?.rating} precision={0.1} readOnly />


                    <Typography variant="body1">
                      {profileData?.reviews?.length} reviews
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box>
                {
                  !profileData?.email && <Button variant="contained" onClick={async()=>{
try{
  const response = await axios.post(`/api/profile/start-chat/${id}`,{}, {
    withCredentials: true, 
    headers: {
      'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
    },
  });
  if(response.data.success) {
    toast.success(t("Chat started successfully"));
    setIsChatOpen(true);
  }
}catch (err:any) {
  if (err.response?.data?.message === 'Chat already exists') {
    toast.error(t("Chat already exists"));
  } else {
    toast.error(t("Failed to initiate chat"));
  }
}
                  }}>Chat with {profileData?.userName}</Button>
                }
                {profileData?.email && !isEditable && (
                  <Button
                    sx={{
                      backgroundColor: "black",
                      color: "white",
                      padding: "10px",
                      fontSize: "12px",
                      marginRight: 2,
                    }}
                    startIcon={<FaEdit />}
                    onClick={() => setIsEditable(!isEditable)}
                  >
                    {t("Edit")}
                  </Button>
                )}
              </Box>
            </Box>

            <CardContent>
              <ProfileContentUser
                isEditable={isEditable}
                profileData={profileData}
                setIsEditable={setIsEditable}
                setProfileData={setProfileData}
              />
            </CardContent>
          </Card>

          <Card sx={{borderRadius:5}}  className="max-w-4xl mx-auto bg-white p-6 mt-5">
            <CardContent>
              <ReviewsAndRatings
                profileData={profileData}
                setProfileData={setProfileData}
              />
            </CardContent>
          </Card>
        </Paper>
      ) : (
        <CircularProgress />
      )}
      <Footer />
    </div>
  );
};

export default Profile;

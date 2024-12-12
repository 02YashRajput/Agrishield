import React from "react";
import { Card, Grid, Typography, Avatar, Link, Button, CardContent } from "@mui/material";

import { FaCheck, FaRupeeSign, FaTimes, FaTrash } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface RequestedDetailsProps {
  data: {
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
    deliveryPreference:string;
    transactions :{
      transactionId: number;
      details: string;
      amount: number;
      date: Date;
    }[]
  }
  userType?: string;
}

const RequestedDetails: React.FC<RequestedDetailsProps> = ({ data,userType }) => {
  const { t } = useTranslation(["requesteddetails", "crops"]);
  const navigate = useNavigate()
  return (
    <div>
      <Typography variant="h4" sx={{ mb: 4 }}>
        {t('Requested Contract Details')}
      </Typography>

      <Typography variant="h5" sx={{ mb: 4 }}>
        {t(`crops:cropsObject.${data.productName}.name`)} - {data.productVariety.toUpperCase()}
      </Typography>

      <Grid container spacing={4}>
        {/* Farmer Profile */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ padding: 2, boxShadow: "none" }}>
            <Typography variant="h6">{t('Farmer')}</Typography>
            <Grid container alignItems="center">
              <Grid item>
                <Avatar
                  src={
                    data.farmerProfileImage || "/assets/img/defaultProfile.jpg"
                  }
                  alt={data.farmerName}
                />
              </Grid>
              <Grid item sx={{ ml: 2 }}>
                <Typography variant="body1">{data.farmerName}</Typography>
                <Link
                  href={data.farmerProfileLink}
                  color="secondary"
                 
                  rel="noopener"
                >
                  {t('View Profile')}
                </Link>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Buyer Profile */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ padding: 2, boxShadow: "none" }}>
            <Typography variant="h6">{t('Buyer')}</Typography>
            <Grid container alignItems="center">
              <Grid item>
                <Avatar
                  src={
                    data.buyerProfileImage || "/assets/img/defaultProfile.jpg"
                  }
                  alt={data.buyerName}
                />
              </Grid>
              <Grid item sx={{ ml: 2 }}>
                <Typography variant="body1">{data.buyerName}</Typography>
                <Link
                  href={data.buyerProfileLink}
                  color="secondary"
                 
                  rel="noopener"
                >
                  {t('View Profile')}
                </Link>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ padding: 2, boxShadow: "none" }}>
            <Typography variant="h6">{t('Product Details')}</Typography>
            <CardContent >

            <Typography variant="body1">
              <strong>{t('Initial Payment:')}</strong> {parseInt(data.initialPaymentAmount) * parseInt(data.finalPaymentAmount) /100}
            </Typography>
            
            <Typography variant="body1">
              <strong>{t('Total Amount:')}</strong>{" "}
              {
                parseInt(data.finalPaymentAmount)}
            </Typography>
            <Typography
              variant="body1"
              sx={{ display: "flex", alignItems: "center" }}
            >
              
              <strong>{t("Rate")}: {" "}</strong>{" "}
              {(
                
                  parseInt(data.finalPaymentAmount) /
                parseInt(data.productQuantity)
              ).toFixed(2)}
              <FaRupeeSign className="text-sm ml-2" /> / {t('quintal')}
            </Typography>
            <Typography variant="body1">
              <strong>{t("Deadline")}: </strong>{" "}
              {new Date(data.deadline).toLocaleDateString()}
            </Typography>
            <Typography variant="body1">
              <strong>{t("Delivery Preference")}: </strong>{" "}
              {data.deliveryPreference}
            </Typography>
            </CardContent>

          </Card>
        </Grid>
      </Grid>
      {userType === "Buyer" ? (
        <div className="flex gap-2 mt-2 flex-wrap">
          <Button
            variant="contained"
            color="success"
            sx={{ mr: 2, display: "flex", alignItems: "center" }}
            startIcon={<FaCheck />}
            onClick={async()=>{
              try{
                const response = await axios.post(`/api/contracts/accept/${data.contractId}`,{},{withCredentials: true,headers: {
                  'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
                },});
                if(response.data.success){
                  toast.success(t("Contract accepted successfully"));
                  navigate("/contracts")
                }
              }catch(err){
                console.log(err);
                toast.error(t("An error occurred while accepting contract"));
              }
            }}
          >
            {t('Accept')}
          </Button>
          <Button
            variant="outlined"
            color="error"
            sx={{ display: "flex", alignItems: "center" }}
            startIcon={<FaTimes />}
            onClick={async()=>{
              try{
                const response = await axios.delete(`/api/contracts/delete/${data.contractId}`,{withCredentials: true,headers: {
                  'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
                },});
                if(response.data.success){
                  toast.success(t("Contract accepted successfully"));
                  navigate("/contracts")
                }
              }catch(err){
                toast.error(t("An error occurred while accepting contract"));
              }
            }}
          >
            {t('Reject')}
          </Button>
        </div>
      ) : (
        <>
          <Button
            variant="outlined"
            color="error"
            sx={{ display: "flex", alignItems: "center" }}
            startIcon={<FaTrash />}
            onClick={async()=>{
              try{
                const response = await axios.delete(`/api/contracts/delete/${data.contractId}`,{withCredentials: true,headers: {
                  'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
                },});
                if(response.data.success){
                  toast.success(t("Contract accepted successfully"));
                  navigate("/contracts")
                }
              }catch(err){
                toast.error(t("An error occurred while accepting contract"));
              }
            }}
          >
            {t('Delete')}
          </Button>
        </>
      )}
    </div>
  );
};

export default RequestedDetails;

import React from "react";
import { Card, Grid, Typography, Avatar, Link, Button, CardContent } from "@mui/material";

import { ProductName } from "../../utils/cropsName";
import { FaCheck, FaRupeeSign, FaTimes, FaTrash } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
    productName: ProductName;
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
    }[];
  }
  userType?: string;
}

const RequestedDetails: React.FC<RequestedDetailsProps> = ({ data,userType }) => {
  const navigate = useNavigate()
  return (
    <div>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Requested Contract Details
      </Typography>

      <Typography variant="h5" sx={{ mb: 4 }}>
        {data.productName.toUpperCase()}
      </Typography>

      <Grid container spacing={4}>
        {/* Farmer Profile */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ padding: 2, boxShadow: "none" }}>
            <Typography variant="h6">Farmer</Typography>
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
                  target="_blank"
                  rel="noopener"
                >
                  View Profile
                </Link>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Buyer Profile */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ padding: 2, boxShadow: "none" }}>
            <Typography variant="h6">Buyer</Typography>
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
                  target="_blank"
                  rel="noopener"
                >
                  View Profile
                </Link>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ padding: 2, boxShadow: "none" }}>
            <Typography variant="h6">Product Details</Typography>
            <CardContent >

            <Typography variant="body1">
              <strong>Initial Payment:</strong> {data.initialPaymentAmount}
            </Typography>
            <Typography variant="body1">
              <strong>Final Payment:</strong> {data.finalPaymentAmount}
            </Typography>
            <Typography variant="body1">
              <strong>Total Amount:</strong>{" "}
              {parseInt(data.initialPaymentAmount) +
                parseInt(data.finalPaymentAmount)}
            </Typography>
            <Typography
              variant="body1"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <strong>Rate:</strong>{" "}
              {(
                (parseInt(data.initialPaymentAmount) +
                  parseInt(data.finalPaymentAmount)) /
                parseInt(data.productQuantity)
              ).toFixed(2)}
              <FaRupeeSign className="text-sm ml-2" /> / quintal
            </Typography>
            <Typography variant="body1">
              <strong>Deadline:</strong>{" "}
              {new Date(data.deadline).toLocaleDateString()}
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
                const response = await axios.post(`/api/contracts/accept/${data.contractId}`,{withCredentials: true});
                if(response.data.success){
                  toast.success("Contract accepted successfully");
                  navigate("/contracts")
                }
              }catch(err){
                console.log(err);
                toast.error("An error occurred while accepting contract");
              }
            }}
          >
            Accept
          </Button>
          <Button
            variant="outlined"
            color="error"
            sx={{ display: "flex", alignItems: "center" }}
            startIcon={<FaTimes />}
            onClick={async()=>{
              try{
                const response = await axios.delete(`/api/contracts/delete/${data.contractId}`,{withCredentials: true});
                if(response.data.success){
                  toast.success("Contract accepted successfully");
                  navigate("/contracts")
                }
              }catch(err){
                console.log(err);
                toast.error("An error occurred while accepting contract");
              }
            }}
          >
            Reject
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
                const response = await axios.delete(`/api/contracts/delete/${data.contractId}`,{withCredentials: true});
                if(response.data.success){
                  toast.success("Contract accepted successfully");
                  navigate("/contracts")
                }
              }catch(err){
                console.log(err);
                toast.error("An error occurred while accepting contract");
              }
            }}
          >
            Delete
          </Button>
        </>
      )}
    </div>
  );
};

export default RequestedDetails;

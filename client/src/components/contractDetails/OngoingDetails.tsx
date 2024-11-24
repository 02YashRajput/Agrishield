import React, { useEffect, useState } from "react";
import { ProductName } from "../../utils/cropsName";
import {
  Card,
  Grid,
  Typography,
  Avatar,
  Link,
  Button,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Box,
  useMediaQuery,
  Theme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { FaRupeeSign } from "react-icons/fa";
import theme from "../../theme/Theme";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface OngoingDetailaProps {
  data: {
    contractId: number;
    contractStatus: "Requested" | "Ongoing" | "Completed";
    farmerName: string;
    buyerName: string;
    initialpaymentStatus: "Pending" | "Paid" | "Received";
    finalpaymentStatus: "Pending" | "Paid" | "Received";
    deliveryStatus: "Pending" | "Delivered" | "Received";
    deadline: Date;
    initialPaymentAmount: string;
    finalPaymentAmount: string;
    productName: ProductName;
    productImage: string;
    buyerProfileImage: string;
    buyerProfileLink: string;
    farmerProfileImage: string;
    farmerProfileLink: string;
    productQuantity: string;
    transactions: {
      transactionId: number;
      details: string;
      amount: string;
      date: Date;
    }[];
  };
  userType: string | undefined;
}

const statusArray = [
  ["Initial Payment Pending", "Buyer"],
  ["Initial Payment Paid", "Farmer"],
  ["Initial Payment Received", "Default"],
  ["Product Delivery Pending", "Farmer"],
  ["Product Delivery Delivered", "Buyer"],
  ["Product Delivery Received", "Default"],
  ["Final Payment Pending", "Buyer"],
  ["Final Payment Paid", "Farmer"],
  ["Final Payment Received", "Default"],
];
const getStatusFromNumber = (activeStep:number) => {
  let statusField = '';
  let statusValue = '';

  switch (activeStep) {
    case 0:
      statusField = 'initialpaymentStatus';
      statusValue = 'Pending';
      break;
    case 1:
      statusField = 'initialpaymentStatus';
      statusValue = 'Paid';
      break;
    case 2:
      statusField = 'initialpaymentStatus';
      statusValue = 'Received';
      break;
    
    case 3:
      statusField = 'deliveryStatus';
      statusValue = 'Pending';
      break;
    case 4:
      statusField = 'deliveryStatus';
      statusValue = 'Delivered';
      break;
    case 5:
      statusField = 'deliveryStatus';
      statusValue = 'Received';
      break;

    case 6:
      statusField = 'finalpaymentStatus';
      statusValue = 'Pending';
      break;
    case 7:
      statusField = 'finalpaymentStatus';
      statusValue = 'Paid';
      break;
    case 8:
      statusField = 'finalpaymentStatus';
      statusValue = 'Received';
      break;

    default:
      return null; 
  }

  return [statusField, statusValue];
};


const OngoingDetails: React.FC<OngoingDetailaProps> = ({ data, userType }) => {
  const [contractStatus,setContractStatus] = useState(data.contractStatus);
  const isVertical = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const [loading,setLoading] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  

  const handleStatusUpdate = async () => {
    setLoading(true);
    try{
      const status = getStatusFromNumber(activeStep+1);
      const response = await axios.post(`/api/contracts/update-status/${data.contractId}`,{status},{withCredentials:true});
      if(response.data.success){
        toast.success("Status updated successfully");
        handleCloseModal();
        if(activeStep === 1 ||activeStep === 4  ){
          setActiveStep(activeStep + 2);
        }else if(activeStep === 7){
          setActiveStep(activeStep + 1);
          setContractStatus("Completed")
        }
        else{
          setActiveStep(activeStep + 1);
          
        }
      }
    }catch(err){
      toast.error("Error updating")
    }finally{
      setLoading(false)
    }
  };

  const [activeStep, setActiveStep] = useState(0);
  useEffect(() => {
    const getStatus = () => {
      if (data.finalpaymentStatus === "Received") return 8;
      if (data.finalpaymentStatus === "Paid") return 7;
      if (data.deliveryStatus === "Received") return 5;
      if (data.deliveryStatus === "Delivered") return 4;
      if (data.initialpaymentStatus === "Received") return 2;
      if (data.initialpaymentStatus === "Paid") return 1;

      if (data.initialpaymentStatus === "Pending") return 0;

      if (data.deliveryStatus === "Pending") return 3;

      if (data.finalpaymentStatus === "Pending") return 6;

      return 0;
    };
    setActiveStep(getStatus());
  }, []);

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 4 }}>
        {contractStatus} Contract Details
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
        <Grid item xs={12} sm={12}>
          <Card sx={{ padding: 2, boxShadow: "none" }}>
            <Typography variant="h6">Product Details</Typography>
            <CardContent>
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

      <Box
        sx={{
          position: "relative",
          width: "100%",
          marginTop: 4,
          marginBottom: isVertical ? 4: 14,
        }}
      >
        {/* Line Connecting Steps */}

        <Stepper
          activeStep={activeStep}
          connector={null} // Remove the default MUI connectors
          orientation={isVertical ? "vertical" : "horizontal"} // Switch orientation dynamically
          sx={{
            display: "flex",
            flexDirection: isVertical ? "column" : "row", // Vertical for small screens
            alignItems: isVertical ? "flex-start" : "center", // Left-align for vertical
            justifyContent: isVertical ? "flex-start" : "space-between",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: isVertical ? "5%" : "50%", // Align horizontally or vertically
              left: isVertical ? "30px" : "5%", // Align with the circles for vertical
              right: "0",
              bottom: isVertical ? "0" : "auto",
              height: isVertical ? "90%" : "2px", // Vertical or horizontal line
              width: isVertical ? "2px" : "90%", // Adjust width/height
              backgroundColor: "gray",
              zIndex: 0,
            }}
          ></Box>
          {statusArray.map(([status], index) => (
            <Step key={index} sx={{ position: "relative" }}>
              {/* Step Circle with Number */}
              <Box
                sx={{
                  width: "32px",
                  height: "32px",
                  backgroundColor: index <= activeStep ? "green" : "gray",
                  borderRadius: "50%",
                  zIndex: 1,
                  margin: isVertical ? "8px 16px" : "auto",
                  display: "flex", // Flexbox to center the number
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                <Typography variant="body2">{index + 1}</Typography>{" "}
                {/* Step Number */}
              </Box>

              {/* Labels */}
              <Box
                sx={{
                  textAlign: isVertical ? "left" : "center", // Align left for vertical
                  marginLeft: isVertical ? "50px" : "0",
                  position: "absolute",
                  top: isVertical ? "15px" : index % 2 === 0 ? "-60px" : "40px",
                  left: isVertical ? "2px" : "50%",
                  transform: isVertical ? "none" : "translateX(-50%)",
                }}
              >
                <Typography
                  variant="body2"
                  color={index <= activeStep ? "green" : "gray"}
                  sx={{
                    whiteSpace: isVertical ? "nowrap" : "normal", // Prevent text wrap only when vertical
                  }}
                >
                  {status}
                </Typography>
                
              </Box>
            </Step>
          ))}
        </Stepper>
      </Box>

      {userType === statusArray[activeStep][1] && (
  activeStep === 0 || activeStep === 3 ? (
    <Button variant="contained" sx={{ backgroundColor: theme.palette.blue?.main, color: "white" }}>
      Pay Now
    </Button>
  ) : (
    <Button
        variant="contained"
        sx={{ backgroundColor: theme.palette.blue?.main, color: "white" }}
        onClick={handleOpenModal}
      >
        Update Status
      </Button>
  )
)}

<Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Update Status</DialogTitle>
        <DialogContent>
    <Typography variant="body1">
      Are You sure you want to make {activeStep!==8 && statusArray[activeStep+1][0]}
      </Typography>        
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button
      variant="contained"
      onClick={handleStatusUpdate}
      color="primary"
      disabled={loading} // Disable button while loading
      startIcon={loading && <CircularProgress size={24} color="inherit" />} // Show loading spinner
    >
      {loading ? 'Updating...' : 'Update'}
      </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OngoingDetails;

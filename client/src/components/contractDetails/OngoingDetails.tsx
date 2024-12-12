import React, { useEffect, useState } from "react";
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
  Box,
  useMediaQuery,
  Theme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  MenuItem,
  Menu,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { pdf } from "@react-pdf/renderer";
type Transaction = {
  transactionId: number;
  details: string;
  amount: number;
  date: Date;
};
import { FaRupeeSign } from "react-icons/fa";
import theme from "../../theme/Theme";
import toast from "react-hot-toast";
import axios from "axios";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import TransactionTable from "./TransactionTable";
import { useTranslation } from "react-i18next";
import ContractPdf from "./ContractPdf";
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
    productName: string;
    productImage: string;
    buyerProfileImage: string;
    buyerProfileLink: string;
    farmerProfileImage: string;
    farmerProfileLink: string;
    productQuantity: string;
    productVariety: string;
    qualityCheck:boolean;
    deliveryPreference: string;
    quality: string;
    createdAt: Date;
    transactions :{
      transactionId: number;
      details: string;
      amount: number;
      date: Date;
    }[]
  };
  userType: string | undefined;
  email: string | undefined;
  phone: string | undefined;
  name: string | undefined;
}

const statusArray = [
  ["Initial Payment Pending", "Buyer"],
  ["Initial Payment Paid", "Farmer"],
  ["Initial Payment Received", "Buyer"],
  ["Product Delivery Pending", "Farmer"],
  ["Product Delivery Delivered", "Buyer"],
  ["Product Delivery Received", "Default"],
  ["Final Payment Pending", "Buyer"],
  ["Final Payment Paid", "Farmer"],
  ["Final Payment Received", "Default"],
];
const getStatusFromNumber = (activeStep: number) => {
  let statusField = "";
  let statusValue = "";

  switch (activeStep) {
    case 0:
      statusField = "initialpaymentStatus";
      statusValue = "Pending";
      break;
    case 1:
      statusField = "initialpaymentStatus";
      statusValue = "Paid";
      break;
    case 2:
      statusField = "initialpaymentStatus";
      statusValue = "Received";
      break;

    case 3:
      statusField = "deliveryStatus";
      statusValue = "Pending";
      break;
    case 4:
      statusField = "deliveryStatus";
      statusValue = "Delivered";
      break;
    case 5:
      statusField = "deliveryStatus";
      statusValue = "Received";
      break;

    case 6:
      statusField = "finalpaymentStatus";
      statusValue = "Pending";
      break;
    case 7:
      statusField = "finalpaymentStatus";
      statusValue = "Paid";
      break;
    case 8:
      statusField = "finalpaymentStatus";
      statusValue = "Received";
      break;

    default:
      return null;
  }

  return [statusField, statusValue];
};

const OngoingDetails: React.FC<OngoingDetailaProps> = ({
  data,
  userType,
  email,
  phone,
  name,
}) => {
  const { t } = useTranslation(["ongoingdetails", "crops"]);
  const [contractStatus, setContractStatus] = useState(data.contractStatus);
  const [activeStep, setActiveStep] = useState(0);
  const [pdfLoading, setPDFLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [quality, setQuality] = useState('');
  const { Razorpay } = useRazorpay();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // For the dropdown

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget); // Open the menu when the button is clicked
  };

  const handleClose = () => {
    setAnchorEl(null); // Close the menu when an option is selected or clicked outside
  };

  const handleSelect = (url: string) => {
    window.open(url, "_blank"); // Open the selected link in a new tab
    handleClose(); // Close the dropdown after selection
  };
  const isVertical = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getStatus = () => {
      if (data.finalpaymentStatus === "Received") return 8;
      if (data.finalpaymentStatus === "Paid") return 7;
      if (data.deliveryStatus === "Delivered") return 4;
      if (data.initialpaymentStatus === "Paid") return 1;

      if (data.initialpaymentStatus === "Pending") return 0;

      if (data.deliveryStatus === "Pending") return 3;

      if (data.finalpaymentStatus === "Pending") return 6;
      if (data.deliveryStatus === "Received") return 5;
      if (data.initialpaymentStatus === "Received") return 2;



      return 0;
    };
    let status = getStatus();
    if(data.qualityCheck === false && status === 3){
      status -=1;
    }
    setActiveStep(status);
    
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleStatusUpdate = async (transaction?: Transaction) => {
    setLoading(true);
    try {
      const status = getStatusFromNumber(activeStep + 1);
      const response = await axios.post(
        `/api/contracts/update-status/${data.contractId}`,
        { status, transaction },
        { withCredentials: true,headers: {
          'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
        }, }
      );
      if (response.data.success) {
        toast.success(t('Status updated successfully'));
        handleCloseModal();
        if (activeStep === 1 || activeStep === 4) {
          setActiveStep(activeStep + 1);
        } else if (activeStep === 7) {
          setActiveStep(activeStep + 1);
          setContractStatus("Completed");
        } else {
          setActiveStep(activeStep + 1);
        }
      }
    } catch (err) {
      toast.error(t("Error updating"));
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  const handlePayNow = async () => {
    setLoading(true);
    let amount =
      activeStep === 0
        ? (parseInt(data.initialPaymentAmount) * parseInt(data.finalPaymentAmount) /100)
        : (parseInt(data.finalPaymentAmount) - (parseInt(data.initialPaymentAmount) * parseInt(data.finalPaymentAmount) /100) );
        let si ;
        if (new Date() > new Date(data.deadline)) {
          // Calculate the number of months late
          const currentDate = new Date().getTime(); // Convert to milliseconds
          const deadlineDate = new Date(data.deadline).getTime(); // Convert to milliseconds
          const monthsLate = Math.floor((currentDate - deadlineDate) / (1000 * 60 * 60 * 24 * 30)); // Calculate months
          si = amount * 8 * monthsLate /100; 
        }

      if(activeStep>0 ){
        if(quality === "Average"){
          amount = amount * 0.9;
        }
        else if(quality === "Bad"){
          amount = amount * 0.7;
        }
      }
      if(si){
        amount = amount + si;
      }
      const gst = amount * 0.12;
      amount +=gst
      


    try {
      const response = await axios.post(
        `/api/create-order`,
        { amount },
        { withCredentials: true,headers: {
          'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
        }, }
      );
      if (response.data.success) {
        const options: RazorpayOrderOptions = {
          order_id: response.data.orderId,
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: amount,
          currency: "INR",
          name: "AgriShield Transaction",
          description: "This is a  payment",
          handler: function (response: any) {
            toast.success(t(`Payment successful!`));
            const transaction = {
              transactionId: response.razorpay_payment_id,
              details: activeStep === 0 ? "Initial Payment" : "Final Payment",
              amount: amount,
              date: new Date(),
            };
            handleStatusUpdate(transaction);
          },
          prefill: {
            name: name,
            email: email,
            contact: phone,
          },
          theme: {
            color: "#a7f3d0",
          },
        };

        const rzp = new Razorpay(options);
        rzp.on("payment.failed", function (response) {
          console.log(response.error);
          toast.error(response.error.code);
          toast.error(response.error.description);
          toast.error(response.error.source);
          toast.error(response.error.step);
          toast.error(response.error.reason);
        });
        rzp.open();
      }
    } catch (err) {
      toast.error(t("Error Occured: "));
    } finally {
      setLoading(false);
    }
  };
  const handleReport = async()=>{
    try{
      setPDFLoading(true);
      const pdfBlob =await  pdf(<ContractPdf data={data}/>).toBlob();
      const blobURL = URL.createObjectURL(pdfBlob);
      window.open(blobURL, "_blank");

    }catch (err) {
      toast.error("Error Occured while opening pdf");
    }
    finally{
      setPDFLoading(false);
    }
  }
  const handleSubmit = async()=>{
    try{

    
    const response = await axios.post(
      `/api/contract/quality-check/${data.contractId}`,{quality},{withCredentials:true,headers: {
        'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
      },})

      if (response.data.success) {
        toast.success(t('Status updated successfully'));
        setActiveStep(activeStep + 1);

      }
    }catch(err){
      toast.error("Error Occured while updating contract status");
    }finally{
      setOpen(false);
    }
  }

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 4 }}>
        {t(contractStatus)} {t('Contract Details')}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center',mb:4,justifyContent:'space-between' }}>

      
      <Typography variant="h5" >
      {t(`crops:cropsObject.${data.productName}.name`)} - {data.productVariety.toUpperCase()}
      </Typography>
      <Button variant="contained" sx={{backgroundColor : theme.palette.blue?.main, color:"white"}} onClick={handleReport} disabled={pdfLoading} startIcon = {pdfLoading && <CircularProgress size={24} color="inherit"/>}>
        {t("Download Report")}
      </Button>
      </Box>
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
        <Grid item xs={12} sm={12}>
          <Card sx={{ padding: 2, boxShadow: "none" }}>
            <Typography variant="h6">{t('Product Details')}</Typography>
            <CardContent>
              <Typography variant="body1">
                <strong>{t('Initial Payment:')}</strong> {parseInt(data.initialPaymentAmount) * parseInt(data.finalPaymentAmount) / 100}
              </Typography>
              <Typography variant="body1">
                <strong>{t('Total Amount:')}</strong> {data.finalPaymentAmount}
              </Typography>
              <Typography variant="body1">
                <strong>{t("Product Quantity")}:</strong> {data.productQuantity}
              </Typography>
             
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <strong>{t("Rate")}: </strong>{" "}
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
              {
                activeStep >2 && <Typography variant="body1">
                <strong>{t("Quality")}: </strong>{" "}
                {t(data.quality)}
              </Typography>
              }
              <Typography variant="body1">
                            <strong>{t("Delivery Preference")}: </strong>{" "}
                            {data.deliveryPreference}
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
          marginBottom: isVertical ? 4 : 14,
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
                  {t(status)}
                </Typography>
              </Box>
            </Step>
          ))}
        </Stepper>
      </Box>
      
         

      {userType === statusArray[activeStep][1] &&
        (activeStep === 0 || activeStep === 6 ? (
          <Button
            variant="contained"
            sx={{ backgroundColor: theme.palette.blue?.main, color: "white" }}
            disabled={loading}
            startIcon={
              loading && <CircularProgress size={24} color="inherit" />
            }
            onClick={handlePayNow}
          >
            {t('Pay Now')}
          </Button>
        ) : 
        activeStep === 2 ? <Button variant="contained"
        sx={{ backgroundColor: theme.palette.blue?.main, color: "white" }}
        onClick={()=>setOpen(true)}>
          Quality Check 
        </Button>:
          <Button
            variant="contained"
            sx={{ backgroundColor: theme.palette.blue?.main, color: "white" }}
            onClick={handleOpenModal}
          >
            {t('Update Status')}
          </Button>
        )}
         {
            userType === statusArray[activeStep][1] && activeStep === 3
            && <Button sx= {{color:theme.palette.blue?.main}} onClick={handleClick}>
              {t("Need Help with Delivery")}?
            </Button>

            

           }
                 <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "delivery-help-button",
        }}
      >
        <MenuItem onClick={() => handleSelect("https://www.delhivery.com/")}>
          {t("Delhivery")}
        </MenuItem>
        <MenuItem onClick={() => handleSelect("https://www.bluedart.com/")}>
          {t("Blue Dart")}
        </MenuItem>
        <MenuItem onClick={() => handleSelect("http://www.ekartlogistics.com/")}>
          {t("Ekart Logistics")}
        </MenuItem>
        <MenuItem onClick={() => handleSelect("https://www.ecomexpress.in")}>
          {t("Ecom Express")}
        </MenuItem>
      </Menu>


          <div className="mt-4">

        <TransactionTable transactions={data.transactions} />
          </div>

      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>{t('Update Status')}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
          {t('Are You sure you want to make')}{" "}
            {activeStep !== 8 && statusArray[activeStep + 1][0]}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleCloseModal}
            color="primary"
          >
            {t('Cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={() => handleStatusUpdate()}
            color="primary"
            disabled={loading} // Disable button while loading
            startIcon={
              loading && <CircularProgress size={24} color="inherit" />
            }
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Quality Check</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <FormLabel component="legend" color="secondary">Rate the Quality</FormLabel>
            <RadioGroup
              aria-label="quality"
              value={quality}
              onChange={(event) => {
                setQuality(event.target.value);
              }}
            >
              <FormControlLabel value="Excellent" control={<Radio />} label="Excellent" />
              <FormControlLabel value="Average" control={<Radio />} label="Average" />
              <FormControlLabel value="Bad" control={<Radio />} label="Bad" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpen(false)} color="primary" variant="contained">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained" disabled={!quality}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OngoingDetails;

import React, { useEffect, useState } from "react";
import { ProductName } from "../../utils/cropsName";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Modal,
  Button,
  TextField,
  Popover,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { FaRupeeSign } from "react-icons/fa";
import theme from "../../theme/Theme";
import { FaPen } from "react-icons/fa";
import { IoTrashBin } from "react-icons/io5";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { listContractSchema } from "./listContractSchema";
import Calendar from "react-calendar";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import toast from "react-hot-toast";


interface ListedContractsProps {
  contracts: {
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
  userType: string;
  setContracts:React.Dispatch<React.SetStateAction<{
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
}[]>>

}

const ListedContracts: React.FC<ListedContractsProps> = ({
  contracts,
  userType,
  setContracts
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const isPopoverOpen = Boolean(anchorEl);
  const [selectedContract, setSelectedContract] = useState<
    (typeof contracts)[0] | null
  >(null);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const handleCloseModal = () => {
    setSelectedContract(null);
    setIsEditable(false);
  };
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(listContractSchema),
    defaultValues: {
  productName: selectedContract?.productName,
  initialPaymentAmount: selectedContract?.initialPaymentAmount,
  finalPaymentAmount: selectedContract?.finalPaymentAmount,
  deadline: selectedContract?.deadline, 
  additionalInstructions: selectedContract?.additionalInstructions,
  productQuantity: selectedContract?.productQuantity,
},
  });

  useEffect(()=>{
    if(selectedContract && isEditable){
      setValue("productName",selectedContract.productName)
      setValue("initialPaymentAmount",selectedContract.initialPaymentAmount)
      setValue("finalPaymentAmount",selectedContract.finalPaymentAmount)
      setValue("deadline",selectedContract.deadline)
      setValue("additionalInstructions",selectedContract.additionalInstructions)
      setValue("productQuantity",selectedContract.productQuantity)
    }
  },[isEditable,selectedContract])


  const handleFormSubmit = async(data:any) => {
    try{
      data.marketPlaceId = selectedContract?.marketPlaceId
      console.log(data)
      const response = await axios.put( "/api/marketplace/list-contract",data,{withCredentials:true})
      if (response.data.success) {
        toast.success("Contract listed successfully!");
        setContracts((prev) => {
          const updatedContractIndex = prev.findIndex(contract => contract.marketPlaceId === selectedContract?.marketPlaceId);
          console.log(updatedContractIndex)
        if   (updatedContractIndex !== -1) {
            
            const updatedContracts = [...prev];
            
            updatedContracts[updatedContractIndex] = {
              ...updatedContracts[updatedContractIndex], 
              initialPaymentAmount: data.initialPaymentAmount, 
              finalPaymentAmount: data.finalPaymentAmount,
              deadline: data.deadline,
              additionalInstructions: data.additionalInstructions,
              productQuantity: data.productQuantity,
            };
            
            return updatedContracts;
          }
  
        
          return prev;
        });
      }
    handleCloseModal()
    }
    catch(error){

      console.log(error)
      toast.error("Error updating contract")
    }finally{
      setIsEditable(false)
  }

  }

  return (
    <>
      <Grid container spacing={2}>
        {contracts.map((contract) => (
          <Grid
            item
            xs={12}
            sm={6}
            key={contract.marketPlaceId}
            onClick={() => setSelectedContract(contract)} // Open modal on card click
          >
            <Card sx={{ cursor: "pointer" }}>
              <CardContent sx={{ padding: 1, height: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: {
                      xs: "column",
                      sm: "row",
                    },
                    gap: 1,
                    height: "100%",
                  }}
                >
                  {/* Image Section */}
                  <Box
                    sx={{
                      width: {
                        xs: "100%",
                        sm: "50%",
                      },
                      height: "100%",
                    }}
                  >
                    <img
                      src={contract.productImage}
                      alt={contract.productName}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                  {/* Content Section */}
                  <Box
                    sx={{
                      width: {
                        xs: "100%",
                        sm: "50%",
                      },
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Link
                      to={contract.buyerProfileLink}
                      className="hover:bg-[#f7f7f7] rounded-sm pl-2"
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Avatar
                          src={
                            contract.buyerProfileImage ||
                            "/assets/img/defaultProfile.jpg"
                          }
                          alt={contract.buyerName}
                        />
                        <Typography variant="h6" sx={{ fontWeight: "500" }}>
                          {contract.buyerName}
                        </Typography>
                      </Box>
                    </Link>
                    <Box>
                      <Typography variant="body1">
                        <strong>Buyer Name:</strong> {contract.buyerName}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Product Name:</strong> {contract.productName}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Quantity:</strong> {contract.productQuantity}
                      </Typography>
                      <Typography variant="body1" className="flex items-center">
                        <strong>Total Amount:</strong>
                        <FaRupeeSign />{" "}
                        {parseInt(contract.initialPaymentAmount) +
                          parseInt(contract.finalPaymentAmount)}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Deadline:</strong>{" "}
                        {new Date(contract.deadline).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal */}
      <Modal
        open={!!selectedContract}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        className="overflow-auto"
      > 
      <form onSubmit={handleSubmit(handleFormSubmit)}>

        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%", // Responsive width
            maxWidth: "768px", // Equivalent to 3xl
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            overflow: "hidden", // Ensures content doesn't overflow
          }}
        >
          {selectedContract && (
            <>
              {/* Image Section */}
              <Box sx={{ width: "100%", height: 200 }}>
                <img
                  src={selectedContract.productImage}
                  alt={selectedContract.productName}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>

              {/* Details Section */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 4 }}>
                <Typography
                  id="modal-title"
                  variant="h5"
                  component="h2"
                  sx={{ fontWeight: "bold", mb: 2 }}
                >
                  {selectedContract.productName}
                </Typography>
                <Typography id="modal-description" variant="body1">
                  <strong>Buyer Name:</strong> {selectedContract.buyerName}
                </Typography>
                {isEditable ? (
                  <Controller
                    name="productQuantity"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        required
                        type="number"
                        color="secondary"
                        {...field}
                        error={!!errors.productQuantity}
                        helperText={errors.productQuantity?.message}
                        label="Product Quantity in Quintal (q)"
                        fullWidth
                      />
                    )}
                  />
                ) : (
                  <Typography variant="body1">
                    <strong>Quantity:</strong>{" "}
                    {selectedContract.productQuantity}
                  </Typography>
                )}
                {isEditable ? (
                  <Controller
                    name="initialPaymentAmount"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        required
                        color="secondary"
                        type="number"
                        {...field}
                        error={!!errors.initialPaymentAmount}
                        helperText={errors.initialPaymentAmount?.message}
                        label="Initial Payment Amount"
                        fullWidth
                      />
                    )}
                  />
                ) : (
                  <Typography variant="body1" className="flex items-center">
                    <strong>Initial Payment Amount:</strong> <FaRupeeSign />{" "}
                    {selectedContract.initialPaymentAmount}
                  </Typography>
                )}
                {isEditable ? (
                  <Controller
                    name="finalPaymentAmount"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        required
                        color="secondary"
                        type="number"
                        {...field}
                        error={!!errors.finalPaymentAmount}
                        helperText={errors.finalPaymentAmount?.message}
                        label="Final Payment Amount"
                        fullWidth
                      />
                    )}
                  />
                ) : (
                  <Typography variant="body1" className="flex items-center">
                    <strong>Final Payment Amount:</strong> <FaRupeeSign />{" "}
                    {selectedContract.finalPaymentAmount}
                  </Typography>
                )}

                {isEditable ? (
                  <TextField
                    color="secondary"
                    value={
                      Number(watch("initialPaymentAmount") || 0) +
                      Number(watch("finalPaymentAmount") || 0)
                    }
                    label="Total Amount"
                    fullWidth
                    disabled
                  />
                ) : (
                  <Typography variant="body1" className="flex items-center">
                    <strong>Total Payment Amount:</strong> <FaRupeeSign />{" "}
                    {parseInt(selectedContract.initialPaymentAmount) +
                      parseInt(selectedContract.finalPaymentAmount)}
                  </Typography>
                )}

                {isEditable ? (
                  <TextField
                    color="secondary"
                    value={
                      (Number(watch("initialPaymentAmount") || 0) +
                        Number(watch("finalPaymentAmount") || 0)) /
                      Number(watch("productQuantity") || 1)
                    }
                    label="Rate per q"
                    fullWidth
                    disabled
                  />
                ) : (
                  <Typography variant="body1" className="flex items-center">
                    <strong>Rate:</strong> <FaRupeeSign />{" "}
                    {(parseInt(selectedContract.initialPaymentAmount) +
                      parseInt(selectedContract.finalPaymentAmount)) /
                      parseInt(selectedContract.productQuantity)}
                  </Typography>
                )}
                {
                  isEditable  ? <Controller
                  name="deadline"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Button
                        variant="outlined"
                        color="secondary"
                        sx={{ height: "100%" }}
                        onClick={handleOpenPopover}
                        fullWidth
                      >
                        {field.value
                          ? new Date(field.value).toLocaleDateString()
                          : "Select Deadline *"}
                      </Button>
                      <Popover
                        open={isPopoverOpen}
                        anchorEl={anchorEl}
                        onClose={handleClosePopover}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                      >
                        <Calendar
                          onChange={(date) => {
                            field.onChange(date);
                            handleClosePopover();
                          }}
                          value={field.value ? new Date(field.value) : null}
                          minDate={new Date()}
                        />
                      </Popover>
                      {errors.deadline && (
                        <Typography color="error" variant="caption">
                          {errors.deadline.message}
                        </Typography>
                      )}
                    </>
                  )}
                />:<Typography variant="body1">
                <strong>Deadline:</strong>{" "}
                {new Date(selectedContract.deadline).toLocaleDateString()}
              </Typography>
                }
               
                {
                  isEditable ? <Controller
                  name="additionalInstructions"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      color="secondary"
                      {...field}
                      error={!!errors.additionalInstructions}
                      helperText={errors.additionalInstructions?.message}
                      label="Additional Instructions"
                      fullWidth
                    />
                  )}
                />:<Typography variant="body1">
                <strong>Instructions:</strong>{" "}
                {selectedContract.additionalInstructions}
              </Typography>

                }
                
                {/* Buyer Profile Link */}
                <Box
                  sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Avatar
                    src={
                      selectedContract.buyerProfileImage ||
                      "/assets/img/defaultProfile.jpg"
                    }
                    alt={selectedContract.buyerName}
                  />
                  <Link
                    to={selectedContract.buyerProfileLink}
                    style={{ textDecoration: "none" }}
                  >
                    <Typography variant="body1" color="secondary">
                      View Buyer Profile
                    </Typography>
                  </Link>
                </Box>

                {userType === "Farmer" ? (
                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ mr: 1 }}
                      onClick={async() => {
                        try{
                          const response =await axios.post(`/api/marketplace/request-contract/${selectedContract?.marketPlaceId}`,{withCredentials: true});
                          if(response.data.success){
                            toast.success("Request sent successfully");
                            navigate("/contracts")
                          }
                        }catch(e) {
                          toast.error("An error occurred while requesting the contract");
                         
                        }
                      }}
                    >
                      Request to Activate
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      onClick={() => {}}
                    >
                      Negotiate
                    </Button>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  > 
                    {
                      isEditable ?<Button
                      type="submit"
                      endIcon={<SaveIcon className="text-white" />}
                      variant="contained"
                      sx={{
                        backgroundColor: theme.palette.blue?.main,
                        mr: 1,
                        color: "white",
                      }}
                      fullWidth
                      

                    >
                      Save
                    </Button> :<Button
                    type="button"
                      endIcon={<FaPen className="text-white" />}
                      variant="contained"
                      sx={{
                        backgroundColor: theme.palette.blue?.main,
                        mr: 1,
                        color: "white",
                      }}
                      fullWidth
                      onClick={() => {
                        
                        setIsEditable(true)
                      }}

                    >
                      Edit
                    </Button>
                    }
                    {!isEditable &&<Button
                    type="button"
                      
                      endIcon={<IoTrashBin />}
                      variant="contained"
                      color="error"
                      fullWidth
                      onClick={async() => {
                        try{
                          console.log(selectedContract?.marketPlaceId)
                          console.log(`/api/marketplace/list-contract/${selectedContract?.marketPlaceId}`)
                          const response = await axios.delete(`/api/marketplace/list-contract/${selectedContract?.marketPlaceId}`,{withCredentials:true})
                          if(response.data.success) {
                            setContracts(prevContracts => 
                              prevContracts.filter(contract => contract.marketPlaceId !== selectedContract?.marketPlaceId)
                            );
                            toast.success("Contract deleted successfully!");
                            handleCloseModal();
                          }
                        }catch(err){
                          console.error(err)
                          toast.error("failed to delete contract")
                        }
                      }}
                    >
                      Delete
                    </Button>}
                    
                  </Box>
                )}
              </Box>
            </>
          )}
        </Box>
      </form>

      </Modal>
    </>
  );
};

export default ListedContracts;

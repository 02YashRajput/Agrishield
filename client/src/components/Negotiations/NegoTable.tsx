import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Paper,
  Typography,
  Box,
  Modal,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  TextField,
  Popover,
  MenuItem,
} from "@mui/material";
import { FaRupeeSign } from "react-icons/fa";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { listContractSchema } from "../marketPlace/listContractSchema";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Calendar from "react-calendar";
import toast from "react-hot-toast";
import { Negotiation } from "../../pages/NegotiationList";
import axios from "axios"
import { useTranslation } from "react-i18next";

interface NegoTableProps {
  data:Negotiation[]
  setData :React.Dispatch<React.SetStateAction<Negotiation[]>>
  userType: string | undefined;
}
const NegoTable: React.FC<NegoTableProps> = ({ data,setData, userType }) => {
  const isFarmer = userType === "Farmer";
  
  if(!data){
    return null;
  }
  const { t } = useTranslation(["negoTable", "crops"]);
  const [selectedRow, setSelectedRow] = useState< Negotiation | null>(null);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handleRowClick = (row: (typeof data)[0]) => {
    setSelectedRow(row);
  };
  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClosePopover = () => {
    setAnchorEl(null);
  };
  const isPopoverOpen = Boolean(anchorEl);
  const handleCloseModal = () => {
    setSelectedRow(null);
    setIsEditable(false);
  };

  
  const {
    control,
    getValues,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(listContractSchema),
    defaultValues: {
      initialPaymentAmount: "",
      finalPaymentAmount: "",
      deadline: null,
      productQuantity: "",
      deliveryPreference:"",
    },
  });

  

 const handleEdit = async()=>{
  const values = getValues();
  console.log(values);
  try{

    const response = await axios.put(`/api/negotiations/update/${selectedRow?.negotiationsId}`,values,{withCredentials:true,headers: {
      'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
    },});
    if(response.data.success){
      setData((prevData) =>
        prevData.map((negotiation) =>
          negotiation.negotiationsId === selectedRow?.negotiationsId
            ? {
                ...negotiation,
                ...(userType === "Farmer"
                  ? {
                      initialPaymentAmountFarmer: values.initialPaymentAmount,
                      finalPaymentAmountFarmer: values.finalPaymentAmount,
                      deadlineFarmer: new Date(values.deadline || Date.now()),
                      productQuantityFarmer: values.productQuantity,
                      deliveryPrefernceFarmer: values.deliveryPreference,
                      lastUpdated: "Farmer",
                    }
                  : {
                      initialPaymentAmountBuyer: values.initialPaymentAmount,
                      finalPaymentAmountBuyer: values.finalPaymentAmount,
                      deadlineBuyer:new Date(values.deadline || Date.now()),
                      productQuantityBuyer: values.productQuantity,
                      deliveryPrefernceBuyer : values.deliveryPreference,
                      lastUpdated: "Buyer",
                    }),
              }
            : negotiation
        )
      );

      setSelectedRow((prev) => {
        if (prev) {
          return {
            ...prev,
            ...(userType === "Farmer"
              ? {
                  initialPaymentAmountFarmer: values.initialPaymentAmount,
                  finalPaymentAmountFarmer: values.finalPaymentAmount,
                  deadlineFarmer: new Date(values.deadline || Date.now()),
                  productQuantityFarmer: values.productQuantity,
                  deliveryPrefernceFarmer: values.deliveryPreference,
                  lastUpdated: "Farmer",
                }
              : {
                  initialPaymentAmountBuyer: values.initialPaymentAmount,
                  finalPaymentAmountBuyer: values.finalPaymentAmount,
                  deadlineBuyer: new Date(values.deadline || Date.now()),
                  deliveryPrefernceBuyer : values.deliveryPreference,
                  productQuantityBuyer: values.productQuantity,
                  lastUpdated: "Buyer",
                }),
          };
        }
        return prev;
      });
      toast.success(t("Successfully updated"))
    }
    reset();
  }catch(e){
    toast.error(t("Error Updating"));

  }
  finally{
    
    setIsEditable(false);
  }

}


  return (
    <>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: 500, overflow: "auto", mt: 2 }}
      >
        <Table stickyHeader aria-label="contract table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6" sx={{ fontSize: 15, fontWeight: 600 }}>
                {t('buyername')}
                </Typography>
              </TableCell>
              <TableCell>
                {" "}
                <Typography variant="h6" sx={{ fontSize: 15, fontWeight: 600 }}>
                {t('farmername')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" sx={{ fontSize: 15, fontWeight: 600 }}>
                {t('productname')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" sx={{ fontSize: 15, fontWeight: 600 }}>
                {t('initialpaymentamount')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" sx={{ fontSize: 15, fontWeight: 600 }}>
                {t('finalpaymentamount')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" sx={{ fontSize: 15, fontWeight: 600 }}>
                {t('productquantity(q)')}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => {
              return (
                <TableRow
                  key={row.negotiationsId}
                  onClick={() => handleRowClick(row)}
                >
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        justifyContent: "center",
                      }}
                    >
                      <a
                        href={row.buyerProfileLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Avatar
                          src={
                            row.buyerProfileImage ||
                            "/assets/img/defaultProfile.jpg"
                          }
                          alt={row.buyerName}
                        />
                        {row.buyerName}
                      </a>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        justifyContent: "center",
                      }}
                    >
                      <a
                        href={row.farmerProfileLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Avatar
                          src={
                            row.farmerProfileImage ||
                            "/assets/img/defaultProfile.jpg"
                          }
                          alt={row.farmerName}
                        />
                        {row.farmerName}
                      </a>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        justifyContent: "center",
                      }}
                    >
                      <Avatar
                        src={row.productImage}
                        alt={row.productName}
                        sx={{ marginRight: 1 }}
                      />
                      {row.productName}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                    
                      {isFarmer
                        ? row.initialPaymentAmountBuyer
                        : row.initialPaymentAmountFarmer}
                        %
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <FaRupeeSign className="mr-1/2 text-sm" />
                      {isFarmer
                        ? row.finalPaymentAmountBuyer
                        : row.finalPaymentAmountFarmer}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {isFarmer
                      ? row.productQuantityBuyer
                      : row.productQuantityFarmer}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={!!selectedRow}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "768px",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            overflow: "hidden",
            transition: "transform 0.3s ease-in-out", // smooth transition
          }}
        >
          <img
            src={selectedRow?.productImage}
            alt={selectedRow?.productName}
            style={{
              width: "100%",
              height: "200px", // Adjust the height as needed
              objectFit: "cover", // Ensures the image covers the container without distortion
            }}
          />
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 600, ml: 4 }}>
            {selectedRow?.productName.toUpperCase()} - {selectedRow?.productVariety.toUpperCase()}
          </Typography>

          <Box>
            <Grid container spacing={2} sx={{ p: 2 }}>
              {/* Left side (Farmer's Info) */}
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">
                    {t('farmer')}: {selectedRow?.farmerName}
                    </Typography>
                    <Typography>
                    {t('deadline')}:{" "}
                      {selectedRow?.deadlineFarmer
                        ? new Date(
                            selectedRow.deadlineFarmer
                          ).toLocaleDateString()
                        : "N/A"}
                    </Typography>
                    <Typography>
                    {t('initialpayment')}: {selectedRow?.initialPaymentAmountFarmer}%
                    </Typography>
                    <Typography>
                    {t('finalpayment')}: {selectedRow?.finalPaymentAmountFarmer}
                    </Typography>
                    <Typography>
                    {t('productquantity')}: {selectedRow?.productQuantityFarmer}
                    </Typography>
                    <Typography>
                      <a
                        href={selectedRow?.farmerProfileLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t('viewprofile')}
                      </a>
                    </Typography>
                    <Typography>
                      Delivery Preference: {selectedRow?.deliveryPreferenceFarmer}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Right side (Buyer's Info) */}
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">
                    {t('buyer')}: {selectedRow?.buyerName}
                    </Typography>
                    <Typography>
                    {t('deadline')}:{" "}
                      {selectedRow?.deadlineBuyer
                        ? new Date(
                            selectedRow.deadlineBuyer
                          ).toLocaleDateString()
                        : "N/A"}
                    </Typography>
                    <Typography>
                    {t('initialpayment')}: {selectedRow?.initialPaymentAmountBuyer}%
                    </Typography>
                    <Typography>
                    {t('finalpayment')}: {selectedRow?.finalPaymentAmountBuyer}
                    </Typography>
                    <Typography>
                    {t('productquantity')}: {selectedRow?.productQuantityBuyer}
                    </Typography>
                    <Typography>
                      <a
                        href={selectedRow?.buyerProfileLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t('viewprofile')}
                      </a>
                    </Typography>
                    <Typography>
                      Delivery Preference: {selectedRow?.deliveryPreferenceFarmer}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
              {/* Edit Button */}
              <Button
                variant="contained"
                sx={{ mr: 2 }}
                onClick={() => setIsEditable(true)}
              >
                {t('edit')}
              </Button>

              
              {selectedRow?.lastUpdated !== userType && (
                <Button
                  variant="contained"
                  onClick={async() => {
                    try{
                      const response = await axios.post(`/api/negotiations/accept/${selectedRow?.negotiationsId}`,{},{withCredentials: true,headers: {
                        'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
                      },});
                      if(response.data.success){
                        setData((prev) => prev.filter((negotiation) => negotiation.negotiationsId !== selectedRow?.negotiationsId));
                        handleCloseModal();
                      }
                    }catch(e){
                      toast.error(t("Error activating Contract"))
                    }
                  }}
                >
                   {t('accept')}
                </Button>
              )}
            </Box>
          </Box>

          {/* Sliding Box */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: isFarmer ? 0 : undefined, // Only apply 'left' for Farmer
              right: !isFarmer ? 0 : undefined, // Only apply 'right' for Buyer
              width: "50%",
              height: "100%",
              bgcolor: "background.paper",
              transition: "transform 0.5s ease-out",
              transform: isEditable
                ? "translateX(0)"
                : isFarmer
                ? "translateX(-100%)"
                : "translateX(100%)",
              boxShadow: 24,
              borderRadius: 2,
              zIndex: 2,
            }}
          >
            {userType === "Farmer" && (
              <IconButton
                sx={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  zIndex: 3,
                }}
                onClick={() => setIsEditable(false)}
              >
                <FaChevronLeft />
              </IconButton>
            )}

            {/* Right icon for Buyer */}
            {userType === "Buyer" && (
              <IconButton
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  zIndex: 3,
                }}
                onClick={() => setIsEditable(false)}
              >
                <FaChevronRight />
              </IconButton>
            )}
            <form
              className="mt-14 p-10 flex flex-col gap-2"
               onSubmit={(e)=>{ 
                e.preventDefault();
                handleEdit()}}
            >
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
                      label={t("Product Quantity in Quintal (q)")}
                      fullWidth
                    />
                  )}
                />
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
                      label={t("initialpaymentamount")}
                      fullWidth
                    />
                  )}
                />
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
                      label={t("finalpaymentamount")}
                      fullWidth
                    />
                  )}
                />
                <Controller
    name="deliveryPreference"
    control={control}
    render={({ field }) => (
      <TextField
        {...field}
        select
        label="Delivery Preference"
        fullWidth
        variant="outlined"
        color="secondary"
      >
        <MenuItem value="Farmer">Farmer</MenuItem>
        <MenuItem value="Buyer">Buyer</MenuItem>
      </TextField>
    )}
  />
                  <Controller
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
                          : t("Select Deadline *")}
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
                />
                <Button type="submit" variant="contained" color="primary">
                  {t('submit')}
                </Button>
          </form>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default NegoTable;

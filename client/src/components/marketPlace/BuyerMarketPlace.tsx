import React, { useState } from "react";
import { cropsArray, ProductName } from "../../utils/cropsName";
import axios from "axios";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { listContractSchema } from "./listContractSchema";
import { MdPlaylistAdd } from "react-icons/md";
import Calendar from "react-calendar"; // React Calendar library
import "react-calendar/dist/Calendar.css";
import ListedContracts from "./ListedContracts";
import toast from "react-hot-toast";
interface BuyerMarketPlaceProps {
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
  userType: string;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  page: number;
}

const BuyerMarketPlace: React.FC<BuyerMarketPlaceProps> = ({
  results,
  userType,
  handleNextPage,
  handlePrevPage,
  page,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const isPopoverOpen = Boolean(anchorEl);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(listContractSchema),
    defaultValues: {
      productName: "",
      initialPaymentAmount: "",
      finalPaymentAmount: "",
      deadline: null,
      additionalInstructions: "",
      productQuantity: "",
    },
  });

  const handleFormSubmit = async (data: any) => {
    try {
      // Make the API call using axios
      const response = await axios.post(
        "/api/marketplace/list-contract",
        data,
        { withCredentials: true } // Ensure the request includes credentials (cookies/sessions)
      );
      // Handle success response
      if (response.data.success) {
        toast.success("Contract listed successfully!");
        // Optionally, you can reset the form here
      }
    } catch (error) {
      toast.error("Failed to list contract. Please try again.");
    }
  };

  return (
    <div className="space-y-9">
      <Card
        sx={{ borderRadius: 5 }}
        className="max-w-4xl mx-auto bg-white p-8 "
      >
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          List Your Contract
        </Typography>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-8">
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="productName"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={cropsArray}
                      color="secondary"
                      renderInput={(params) => (
                        <TextField
                          required
                          color="secondary"
                          {...params}
                          label="Product Name"
                          error={!!errors.productName}
                          helperText={errors.productName?.message}
                        />
                      )}
                      onChange={(_, data) => field.onChange(data)}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
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
              </Grid>
              <Grid item xs={12} sm={6}>
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
              </Grid>
              <Grid item xs={12} sm={6}>
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
              </Grid>

              <Grid item xs={12} sm={6}>
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
              </Grid>

              {/* New Rate */}
              <Grid item xs={12} sm={6}>
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
              </Grid>
              <Grid item xs={12} sm={6}>
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
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
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
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "black",
                    color: "white",
                    width: "80%",
                  }}
                  startIcon={<MdPlaylistAdd />}
                >
                  List Contract
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Card
        sx={{ borderRadius: 5 }}
        className="max-w-4xl mx-auto bg-white p-8 "
      >
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Listed Contracts
        </Typography>
        <CardContent>
          {
            results.length > 0 ? 
            <ListedContracts results={results} userType={userType} /> : (<Typography variant="h5" >No Data Available</Typography>)
          }

          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePrevPage}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextPage}
              disabled={results.length <= 0}
            >
              Next
            </Button>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyerMarketPlace;

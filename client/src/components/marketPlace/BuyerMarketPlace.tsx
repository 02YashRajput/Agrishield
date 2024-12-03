import React, { useEffect, useState } from "react";
import { cropsArray } from "../../utils/cropsName";
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
import { useTranslation } from "react-i18next";

interface BuyerMarketPlaceProps {
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
  }[];
  userType: string;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  page: number;
  isLoading: boolean;
}

const BuyerMarketPlace: React.FC<BuyerMarketPlaceProps> = ({
  results,
  userType,
  isLoading,
  handleNextPage,
  handlePrevPage,
  page,
}) => {
  const { t } = useTranslation(["buyermarketplace", "crops"]);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [contracts, setContracts] = useState<BuyerMarketPlaceProps["results"]>(
    []
  );
  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const cropsObject = t("crops:cropsObject", { returnObjects: true });

  console.log(cropsObject);
  const cropsArray = Object.entries(cropsObject).map(([key, value]) => ({
    key,
    value,
  }));

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
        setContracts((prev) => [...prev, response.data.newContract]);
      }
    } catch (error) {
      toast.error("Failed to list contract. Please try again.");
    } finally {
      window.location.reload();
    }
  };

  useEffect(() => {
    if (!isLoading) {
      setContracts(results);
      console.log("loading");
    }
  }, [isLoading, page]);

  return (
    <div className="space-y-9">
      <Card
        sx={{ borderRadius: 5 }}
        className="max-w-4xl mx-auto bg-white p-8 "
      >
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {t("buyermarketplace:listYourContract")}
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
                      getOptionLabel={(option) => option.value} // Show the crop name
                      isOptionEqualToValue={(option, value) =>
                        option.key === value?.key
                      } // Match by key
                      value={
                        cropsArray.find((crop) => crop.key === field.value) ||
                        null
                      } // Convert `field.value` to an object
                      onChange={(_, data) => field.onChange(data?.key || "")} // Store the key in the form state
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          color="secondary"
                          label={t("buyermarketplace:productName")}
                          error={!!errors.productName}
                          helperText={errors.productName?.message}
                        />
                      )}
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
                      label={t("buyermarketplace:productQuantity")}
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
                      label={t("buyermarketplace:initialPaymentAmount")}
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
                      label={t("buyermarketplace:finalPaymentAmount")}
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
                  label={t("buyermarketplace:totalAmount")}
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
                  label={t("buyermarketplace:ratePerQuintal")}
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
                          : t("buyermarketplace:selectDeadline")}
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
                      label={t("buyermarketplace:additionalInstructions")}
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
                  {t("buyermarketplace:listContract")}
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
          {t("buyermarketplace:listedContracts")}
        </Typography>
        <CardContent>
          {results.length > 0 ? (
            <ListedContracts
              setContracts={setContracts}
              contracts={contracts}
              userType={userType}
            />
          ) : (
            <Typography variant="h5">
              {t("buyermarketplace:noDataAvailable")}
            </Typography>
          )}

          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePrevPage}
              disabled={page === 1}
            >
              {t("buyermarketplace:previous")}
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleNextPage}
              disabled={results.length < 20}
            >
              {t("buyermarketplace:next")}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyerMarketPlace;

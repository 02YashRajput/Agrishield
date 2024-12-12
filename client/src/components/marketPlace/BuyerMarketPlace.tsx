import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
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
const productRates: {
  [key: string]: number;
} = {
  Banana: 4500,
  Maize: 2500,
  Apple: 8500,
  Wheat: 3000,
  "Black Gram (Urd Beans)(Whole)": 7200,
  "Bengal Gram(Gram)(Whole)": 5000,
  "Paddy(Dhan)(Common)": 3000,
  "Ginger(Green)": 6000,
  "Green Chilli": 8000,
  Pomegranate: 7000,
  Tomato: 4000,
  Onion: 2500,
  Potato: 1800,
  Mustard: 5300,
  "Masur Dal": 5500,
  Garlic: 8000,
  Rice: 3500,
  "Arhar (Tur/Red Gram)(Whole)": 4500,
  "Lentil (Masur)(Whole)": 5500,
  Groundnut: 6200,
  Capsicum: 7000,
  Spinach: 4000,
  Papaya: 3000,
  "Water Melon": 3200,
  Carrot: 4800,
  Cauliflower: 4500,
  Orange: 5000,
  "Peas Wet": 4200,
  Pineapple: 5200,
  "Green Peas": 7000,
  "Amla(Nelli Kai)": 5500,
  "Chikoos(Sapota)": 4800,
  "Bajra(Pearl Millet/Cumbu)": 2100,
  "Jowar(Sorghum)": 2400,
  Turmeric: 9500,
  Soyabean: 6200,
  Cotton: 6200,
  "Moath Dal": 5000,
  Peach: 8500,
  Turnip: 3200,
  "Cummin Seed(Jeera)": 9000,
  "Mint(Pudina)": 7000,
  "Guar Seed(Cluster Beans Seed)": 4700,
  "Kodo Millet(Varagu)": 3900,
};

interface CropData {
  name: string;
  variety: Record<string, string>;
}

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
    productVariety: string;
    deliveryPreference: string;
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
      productVariety: "",
      deliveryPreference: "",
    },
  });


  const cropsObject = t("crops:cropsObject", { returnObjects: true }) as Record<
    string,
    CropData
  >;

  const cropsArray = Object.entries(cropsObject).map(([key, value]) => ({
    key,
    value: value.name,
  }));

  const selectedCrop = watch("productName");

  console.log(selectedCrop);


  const varietyOptions = selectedCrop
    ? Object.entries(cropsObject[selectedCrop]?.variety || {}).map(
        ([key, value]) => ({ key, value })
      )
    : [];


  const handleFormSubmit = async (data: any) => {
    try {
      const productName = data.productName;
      const value =
        Number(watch("productQuantity")) === 0
          ? 0
          : (Number(watch("initialPaymentAmount") || 0) +
              Number(watch("finalPaymentAmount") || 0)) /
            Number(watch("productQuantity"));
      const min =
        productRates[productName as keyof typeof productRates] ||
        "Rate not available";

      if (isNaN(Number(min))) {
        toast.error("Invalid minimum rate");
        return;
      }

      if (!isNaN(value) && value < Number(min)) {
        toast.error("Rate must be greater than the minimum rate");
        return;
      }

      for (let i = 0; i < results.length; i++) {
        if (results[i].productName === productName) {
          toast.error("You have already listed a contract for this product");
          return;
        }
      }

      // Make the API call using axios
      const response = await axios.post(
        `/api/marketplace/list-contract`,
        data,
        { withCredentials: true,headers: {
          'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
        }, } // Ensure the request includes credentials (cookies/sessions)
      );
      // Handle success response
      if (response.data.success) {
        toast.success(t("contractListedSuccess"));
        setContracts((prev) => [...prev, response.data.newContract]);
        window.location.reload();
      }
    } catch (error) {
      toast.error(t("contractListedFailure"));
    }
  };

  useEffect(() => {
    if (!isLoading) {
      setContracts(results);
    }
  }, [isLoading, page]);

  return (
    <div className="space-y-9">
      <Card
        sx={{ borderRadius: 5 }}
        className="max-w-4xl mx-auto bg-white p-8 "
      >
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {t("listYourContract")}
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
                          label={t("productName")}
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
                  name="productVariety"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      disabled={!selectedCrop}
                      options={varietyOptions}
                      getOptionLabel={(option) => option.value} // Show the crop name
                      isOptionEqualToValue={(option, value) =>
                        option.key === value?.key
                      }
                      value={
                        varietyOptions.find(
                          (crop) => crop.key === field.value
                        ) || null
                      }
                      onChange={(_, data) => field.onChange(data?.key || "")} // Store the key in the form state
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          color="secondary"
                          label="Product Variety"
                          error={!!errors.productVariety}
                          helperText={errors.productVariety?.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
                      label={t("productQuantity")}
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
                      label={t("initialPaymentAmount")}
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
                      label={t("totalAmount")}
                      fullWidth
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  color="secondary"
                  value={
                    (Number(watch("initialPaymentAmount") || 0) *
                      Number(watch("finalPaymentAmount") || 0)) /
                    100
                  }
                  label="Initial Payment Amount"
                  fullWidth
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  color="secondary"
                  value={
                    productRates[
                      watch("productName") as keyof typeof productRates
                    ] || ""
                  }
                  label="Minimum Rate"
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  color="secondary"
                  value={
                    Number(watch("productQuantity")) === 0
                      ? 0
                      : Number(watch("finalPaymentAmount") || 0) /
                        Number(watch("productQuantity"))
                  }
                  label={t("ratePerQuintal")}
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
                          : t("selectDeadline")}
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
                      label={t("additionalInstructions")}
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
                  {t("listContract")}
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
          {t("listedContracts")}
        </Typography>
        <CardContent>
          {results.length > 0 ? (
            <ListedContracts
              setContracts={setContracts}
              contracts={contracts}
              userType={userType}
            />
          ) : (
            <Typography variant="h5">{t("noDataAvailable")}</Typography>
          )}

          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePrevPage}
              disabled={page === 1}
            >
              {t("previous")}
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleNextPage}
              disabled={results.length < 20}
            >
              {t("next")}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyerMarketPlace;

import React, { useEffect, useState } from "react";
import {
  Card,
  Stack,
  Chip,
  Typography,
  CardContent,
  Box,
  Button,
  Autocomplete,
  TextField,
} from "@mui/material";
import ListedContracts from "./ListedContracts";
import { useTranslation } from "react-i18next";
interface FarmerMarketPlaceProps {
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
    deliveryPreference:string;
  }[];
  productQuantities?: {
    // Added productQuantities field
    [productName: string]: number;
  };
  districtQuantities?: {
    [productName: string]: number;
  };
  userType: string;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  page: number;
  distance: number;
  setDistance: React.Dispatch<React.SetStateAction<number>>;
  crop: string;
  setCrop: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
}

const FarmerMarketPlace: React.FC<FarmerMarketPlaceProps> = ({
  crop,
  setCrop,
  distance,
  setDistance,
  results,
  handleNextPage,
  handlePrevPage,
  page,
  userType,
  isLoading,
  productQuantities,
  districtQuantities,
}) => {
  const { t } = useTranslation(["farmermarketplace", "crops"]);
  const [contracts, setContracts] = useState<FarmerMarketPlaceProps["results"]>(
    []
  );
 
  const handleDistanceChange = (newDistance: number) => {
    setDistance(newDistance);
  };
  useEffect(() => {
    if (!isLoading) {
      setContracts(results);
    }
  }, [isLoading, page]);

  if (!productQuantities || !districtQuantities) {
    return null;
  }
  const cropsObject = t("crops:cropsObject", { returnObjects: true });

  const cropsArray = Object.entries(cropsObject).map(([key, value]) => ({
    key,
    value : value.name,
  }));



  return (
    <div className="space-y-9">
      <Card sx={{ borderRadius: 5 }} className="max-w-4xl mx-auto bg-white p-8">
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 4 }}>
          {t("Available Crops")}
        </Typography>

        {/* District Quantities Section */}
        {/* District Quantities Section */}
        <Typography variant="h5" sx={{ fontWeight: 500, mb: 2 }}>
          {t("District-Specific Crops")}
        </Typography>
        <Box component="ul" sx={{ paddingLeft: 2 }}>
          {Object.entries(districtQuantities).sort(([, aQuantity], [, bQuantity]) => bQuantity - aQuantity) .map(([crop, quantity]) => (
            <Box
              key={crop}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
                p: 1,
                borderRadius: 2,
                backgroundColor: "#f9f9f9",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography
                component="span"
                variant="body1"
                sx={{ fontWeight: 600, color: "#2c3e50", mr: 1 }}
              >
                🌾 {t(`crops:cropsObject.${crop}.name`)}
              </Typography>
              <Typography
                component="span"
                variant="body1"
                sx={{ color: "#7f8c8d" }}
              >
                {quantity} {t("Quintal")}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Product Quantities Section */}
        <Typography variant="h5" sx={{ fontWeight: 500, mt: 4, mb: 2 }}>
          {t("Other crops")}
        </Typography>
        <Box component="ul" sx={{ paddingLeft: 2 }}>
          {Object.entries(productQuantities).sort(([, aQuantity], [, bQuantity]) => bQuantity - aQuantity).map(([product, quantity]) => (
            <Box
              key={product}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
                p: 1,
                borderRadius: 2,
                backgroundColor: "#f9f9f9",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography
                component="span"
                variant="body1"
                sx={{ fontWeight: 600, color: "#2c3e50", mr: 1 }}
              >
                🌾 {t(`crops:cropsObject.${product}.name`)}
              </Typography>
              <Typography
                component="span"
                variant="body1"
                sx={{ color: "#7f8c8d" }}
              >
                {quantity} {t("Quintal")}
              </Typography>
            </Box>
          ))}
        </Box>
      </Card>

      <Card sx={{ borderRadius: 5 }} className="max-w-4xl mx-auto bg-white p-8">
        {/* Distance Label */}
        <Typography variant="h6" color="textSecondary" mb={1}>
          {t("selectdistance")}
        </Typography>

        {/* Chips for Distance */}
        <Stack direction="row" spacing={2} mb={2}>
          <Chip
            label={t("all")}
            clickable
            color={distance === 0 ? "primary" : "default"}
            onClick={() => handleDistanceChange(0)}
          />
          <Chip
            label="<10"
            clickable
            color={distance === 10 ? "primary" : "default"}
            onClick={() => handleDistanceChange(10)}
          />
          <Chip
            label="<50"
            clickable
            color={distance === 50 ? "primary" : "default"}
            onClick={() => handleDistanceChange(50)}
          />
          <Chip
            label="<100"
            clickable
            color={distance === 100 ? "primary" : "default"}
            onClick={() => handleDistanceChange(100)}
          />
        </Stack>

        <Typography variant="h6" color="textSecondary" mb={1}>
          {t("selectcrop")}
        </Typography>

        <Autocomplete
          options={cropsArray}
          getOptionLabel={(option) => option.value} // Show the crop name
          isOptionEqualToValue={(option, value) => option.key === value?.key} // Match by key
          value={cropsArray.find((item) => item.key === crop) || null} // Match selected crop
          onChange={(_, data) => setCrop(data?.key || "")} // Update state with the selected crop's key
          renderInput={(params) => (
            <TextField
              {...params}
              color="secondary"
              label={t("crop")}
            />
          )}
        />
      </Card>

      <Card
        sx={{ borderRadius: 5 }}
        className="max-w-4xl mx-auto bg-white p-8 "
      >
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {t("listedcontract")}
        </Typography>
        <CardContent>
          {results.length > 0 ? (
            <ListedContracts
              contracts={contracts}
              userType={userType}
              setContracts={setContracts}
            />
          ) : (
            <Typography variant="h5">{t("nodata")}</Typography>
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

export default FarmerMarketPlace;

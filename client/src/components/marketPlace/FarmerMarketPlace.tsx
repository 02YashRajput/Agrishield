import React, { useEffect, useState } from "react";
import { Card, Stack, Chip, Typography, CardContent, Box, Button, Autocomplete, TextField } from "@mui/material";
import { cropsArray, ProductName } from "../../utils/cropsName";
import ListedContracts from "./ListedContracts";

interface FarmerMarketPlaceProps {
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
  distance: number;
  setDistance: React.Dispatch<React.SetStateAction<number>>;
  crop: string;
  setCrop: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean
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
isLoading
}) => {
  const [contracts,setContracts] = useState<FarmerMarketPlaceProps['results']>([])
  const handleCropChange = (value : string) => {
    setCrop(value);
  };

  const handleDistanceChange = (newDistance: number) => {
    setDistance(newDistance);
  };
  useEffect(()=>{
    if(!isLoading){
      setContracts(results);
    }
  },[isLoading])
  return (
    <div className="space-y-9">
      <Card sx={{ borderRadius: 5 }} className="max-w-4xl mx-auto bg-white p-8">

        {/* Distance Label */}
        <Typography variant="h6" color="textSecondary" mb={1}>
          Select Distance
        </Typography>

        {/* Chips for Distance */}
        <Stack direction="row" spacing={2} mb={2}>
        <Chip
            label="All"
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
          Select Crop
        </Typography>

        <Autocomplete
  id="crop-autocomplete"
  value={crop}
  onChange={(event, newValue) => {
    handleCropChange(newValue ?? ""); 
  }}
  options={cropsArray.map((cropName) =>
    cropName.charAt(0).toUpperCase() + cropName.slice(1)
  )}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Select Crop"
      color="secondary"
      fullWidth
    />
  )}
  ListboxProps={{
    style: {
      maxHeight: 300, // Limit the dropdown height
    },
  }}
  isOptionEqualToValue={(option, value) => option === value}
/>
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
            <ListedContracts contracts={contracts} userType={userType} setContracts={setContracts} /> : (<Typography variant="h5" >No Data Available</Typography>)
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

export default FarmerMarketPlace;

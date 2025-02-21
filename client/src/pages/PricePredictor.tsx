import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useSWR from "swr";
import ErrorPage from "./Error";
import Header from "../components/Header";
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
interface StateData {
  name: string;
  districts: Record<string, string>;
}
interface Data {
  success: boolean;
  message: string;
  user?: {
    name: string;
    profileImage: string;
    id: Number;
    userType: string;
  };
  data?: {
    state: string;
    district: string;
    crops: {
      name: string;
      imgLink:string
    }[];
  };
}
const fetcher = (url: string) =>
  axios
    .get(url, {
      withCredentials: true,
      headers: {
        'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
      },
    })
    .then((res) => res.data);
const PricePredictor: React.FC = () => {
  const schema = z.object({
    districtSelect: z.string().min(1, { message: "District is required." }),
    stateSelect: z.string().min(1, { message: "State is required." }),
  });
  const navigate = useNavigate();
  const { t } = useTranslation(["crops", "stateanddistricts"]);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const State = params.get("state");
  const District = params.get("district");
  const [state, setState] = useState(State ? State : "");
  const [district, setDistrict] = useState(District ? District : "");
  const [updating, setUpdating] = useState(false);
  const [filter, setFilter] = useState("");
  
  const { data, error, isLoading } = useSWR<Data>(
    `/api/price-predictor?state=${state}&district=${district}`,
    fetcher
  );

  
  const filteredCrops = data?.data?.crops.filter((crop) =>
    crop.name.toLowerCase().includes(filter.toLowerCase())
  );
  const isLoggedIn = data?.user ? true : false;

  useEffect(() => {
    if (data?.data) {
      setState(data.data.state);
      setDistrict(data.data.district);
      setUpdating(false);
    }
  }, [isLoading]);
  useEffect(() => {
    const newUrl = `/price-predictor?state=${state}&district=${district}`;
    window.history.pushState({}, "", newUrl);
  }, [state, district]);



  useEffect(() => {
      const params = new URLSearchParams(location.search);
        const newState = params.get("state");
        const newDistrict = params.get("district");
       
       if (newState !== state || newDistrict !== district) {
          setState(newState || "");
          setDistrict(newDistrict || "");
        }
      }, [location.search]);
    
     

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      stateSelect: state.split("-").join(" "),
      districtSelect: district.split("-").join(" "),
    },
  });
  useEffect(() => {
    reset({
      stateSelect: state.split("-").join(" "),
      districtSelect: district.split("-").join(" "),
    });
  }, [state, district, reset]);

  const statesObject = t("stateanddistricts:States", {
    returnObjects: true,
  }) as Record<string, StateData>;

  const stateOptions = Object.entries(statesObject).map(([key, value]) => ({
    key,
    value: value.name,
  }));

  const selectedState = watch("stateSelect");
  const districtsOptions = selectedState
    ? Object.entries(statesObject[selectedState]?.districts || {}).map(
        ([key, value]) => ({ key, value })
      )
    : [];

  const handleFormSubmit = async (value : any) => {
    

    setUpdating(true);
    setState(value.stateSelect.split(" ").join("-"));
    setDistrict(value.districtSelect.split(" ").join("-"));
    
  };
  
  if (error) {
    if(error.status === 401){
      navigate('/profile');
      toast.error("Please complete your profile first");
    }
    return <ErrorPage />;
  }


  return (
    <div>
      <Header
        name={data?.user?.name}
        profileImage={data?.user?.profileImage}
        isLoggedIn={isLoggedIn}
        id={data?.user?.id}
      />
      <Paper sx={{ backgroundColor: "#f7f7f7" }} className="min-h-screen p-8">
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
          <Card
            sx={{ borderRadius: 5 }}
            className="max-w-4xl mx-auto bg-white p-8 "
          >
            <Typography variant="h5" sx={{fontWeight:"bold"}}>
              Select State and District
            </Typography>

            <CardContent>
              <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-3">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="stateSelect"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={stateOptions}
                          getOptionLabel={(option) => option.value} // Show the crop name
                          isOptionEqualToValue={(option, value) =>
                            option.key === value?.key
                          }
                          value={
                            stateOptions.find(
                              (state) => state.key === field.value
                            ) || null
                          }
                          onChange={(_, data) =>
                            field.onChange(data?.key || "")
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              color="secondary"
                              label={t("State")}
                              error={!!errors.stateSelect}
                              helperText={errors.stateSelect?.message}
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="districtSelect"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          disabled={!selectedState}
                          options={districtsOptions}
                          getOptionLabel={(option) => option.value} // Show the crop name
                          isOptionEqualToValue={(option, value) =>
                            option.key === value?.key
                          }
                          value={
                            districtsOptions.find(
                              (district) => district.key === field.value
                            ) || null
                          }
                          onChange={(_, data) =>
                            field.onChange(data?.key || "")
                          } // Store the key in the form state
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              color="secondary"
                              label={t("District")}
                              error={!!errors.districtSelect}
                              helperText={errors.districtSelect?.message}
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Button type="submit" variant="contained" startIcon={
              updating && <CircularProgress size={24} color="inherit" />
            }>
                    Submit
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card
            sx={{ borderRadius: 5 }}
            className="max-w-4xl mx-auto bg-white p-8 mt-5 "
          >
             <Typography variant="h5" sx={{fontWeight:"bold"}}>
              Crops
            </Typography>
            <TextField
        fullWidth
        label="Filter Crops"
        variant="outlined"
        value={filter}
        color="secondary"
        onChange={(e) => setFilter(e.target.value)}
        sx={{ marginTop:4, marginBottom:2}}
      />
            <CardContent>
            {filteredCrops && filteredCrops.length > 0 ? (
          <Grid container spacing={2}>
            {filteredCrops.map((crop, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <Link to = {`/price-predictor/${encodeURIComponent(crop.name)}?state=${state}&district=${district}`}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={crop.imgLink}
                    alt={crop.name}
                    loading="lazy"
                  />
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {crop.name}
                    </Typography>
                  </CardContent>
                </Card>
                </Link>

              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h5">No Crops Found</Typography>
        )}
              </CardContent>
            </Card>
          </>
          
        )}
      </Paper>
    </div>
  );
};

export default PricePredictor;

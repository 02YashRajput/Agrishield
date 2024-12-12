import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Data } from "../../pages/Profile";
import { IoPersonOutline } from "react-icons/io5";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CiLocationOn } from "react-icons/ci";
import { MdOutlinePayment } from "react-icons/md";
import { CiBank } from "react-icons/ci";
import theme from "../../theme/Theme";
import SaveIcon from "@mui/icons-material/Save";
import toast from "react-hot-toast";
import { cropsArray } from "../../utils/cropsName";
import { FaTractor } from "react-icons/fa";
import { FaRegBell } from "react-icons/fa6";
import { baseProfileDataSchema, farmerProfileDataSchema } from "./schemas";
import StarIcon from "@mui/icons-material/Star";

import axios from "axios";
import { useTranslation } from "react-i18next";
interface StateData {
  name: string;
  districts: Record<string, string>; 
}

interface ProfileContentUserProps {
  profileData: Data["profileData"];
  isEditable: boolean;
  setIsEditable: React.Dispatch<React.SetStateAction<boolean>>;
  setProfileData: React.Dispatch<
    React.SetStateAction<Data["profileData"] | null>
  >;
}

const ProfileContentUser: React.FC<ProfileContentUserProps> = ({
  profileData,
  isEditable,
  setIsEditable,
  setProfileData,
}) => {
  const { t } = useTranslation(["profile", "crops", "stateanddistricts"]);
  if (!profileData) {
    return null;
  }
  const [updating, setUpdating] = useState<boolean>(false);

  const schema =
    profileData.userType === "Farmer"
      ? farmerProfileDataSchema
      : baseProfileDataSchema;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: profileData?.email,
      phone: profileData?.phone,
      address: profileData.address,
      paymentInformation: profileData.paymentInformation,
      notificationPreferences: profileData.notificationPreferences,
      ...(profileData.userType === "Farmer" && {
        farmDetails: profileData.farmDetails,
      }),
      adhaar: profileData.adhaar,
    },
  });

  

  const handleFormSubmit = async (data: any) => {
    setUpdating(true); // Indicate the updating process has started

    try {
      // Make the API call to update the profile
      const response = await axios.post(`/api/profile/upload-profile`, data, {
        withCredentials: true, // Include credentials for authentication
      });

      if (response.status === 200) {
        setProfileData((prev) => ({
          ...prev,
          ...data, // Merge the new data into the previous profileData
        }));

        // If the profile was updated successfully
        toast.success(t("Profile updated successfully"));
        setIsEditable(false); // Disable the edit mode
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.delete("isEditable");
        window.history.replaceState({}, "", currentUrl.toString());
      } else {
        // Handle unexpected response status
        toast.error(t("Unexpected response from the server."));
      }
    } catch (err) {
      // Handle errors during the API call
      console.error("Error updating profile:", err); // Log the error for debugging
      toast.error(t("Error updating profile"));
    } finally {
      // Ensure `setUpdating` is reset regardless of success or error
      setUpdating(false);
    }
  };

  const cropsGrown = watch("farmDetails.cropsGrown");
  


  const handleCropsSelection = (crop: string) => {
    const currentCrops = cropsGrown;
    if (currentCrops.includes(crop)) {
      setValue(
        "farmDetails.cropsGrown",
        currentCrops.filter((item: string) => item !== crop)
      );
    } else {
      setValue("farmDetails.cropsGrown", [...currentCrops, crop]);
    }
  };

  const statesObject = t("stateanddistricts:States", { returnObjects: true }) as Record<string, StateData>;

  const stateOptions = Object.entries(statesObject).map(([key, value]) => ({
    key,
    value: value.name,
  }));

  const selectedState = watch("address.state");
  const districtsOptions = selectedState ? Object.entries(statesObject[selectedState]?.districts || {}).map(
    ([key, value]) => ({ key, value })
      )
    : [];

  

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex  flex-col">
      {profileData?.email && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,

            paddingTop: 2,
          }}
        >
          <Typography
            variant="h6"
            className="flex items-center gap-2"
            sx={{ fontWeight: "bold" }}
          >
            <IoPersonOutline />
            {t("basicinformation")}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="body1" sx={{ fontWeight: "600" }}>
                {t("email")}
                {isEditable && (
                  <sup>
                    <StarIcon sx={{ color: "red", fontSize: 8 }} />
                  </sup>
                )}
                :
              </Typography>
              {isEditable ? (
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="email"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      color="secondary"
                    />
                  )}
                />
              ) : (
                <Typography variant="body1">{profileData?.email}</Typography>
              )}
            </Box>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: "600" }}>
                {t("phone")}
                {isEditable && (
                  <sup>
                    <StarIcon sx={{ color: "red", fontSize: 8 }} />
                  </sup>
                )}
                :
              </Typography>
              {isEditable ? (
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="nummber"
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      color="secondary"
                    />
                  )}
                />
              ) : (
                <Typography variant="body1">{profileData?.phone}</Typography>
              )}
            </Box>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: "600" }}>
                {t("aadhaar")}
                {isEditable && (
                  <sup>
                    <StarIcon sx={{ color: "red", fontSize: 8 }} />
                  </sup>
                )}
                :
              </Typography>
              {isEditable ? (
                <Controller
                  name="adhaar"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="text"
                      error={!!errors.adhaar}
                      helperText={errors.adhaar?.message}
                      color="secondary"
                    />
                  )}
                />
              ) : (
                <Typography variant="body1">
                  {profileData?.adhaar === ""
                    ? t("Not Provided")
                    : profileData?.adhaar}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,

          paddingTop: 2,
        }}
      >
        <Typography
          variant="h6"
          className="flex items-center gap-2"
          sx={{ fontWeight: "bold" }}
        >
          <CiLocationOn />
          {t("address")}
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="body1" sx={{ fontWeight: "600" }}>
              {t("Name of City/Village")}
              {isEditable && (
                <sup>
                  <StarIcon sx={{ color: "red", fontSize: 8 }} />
                </sup>
              )}
              :
            </Typography>
            {isEditable ? (
              <Controller
                name="address.name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="text"
                    error={!!errors.address?.name}
                    helperText={errors.address?.name?.message}
                    color="secondary"
                  />
                )}
              />
            ) : (
              <Typography variant="body1">
                {profileData?.address.name === ""
                  ? t("Not Provided")
                  : profileData?.address.name}
              </Typography>
            )}
          </Box>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: "600" }}>
              {t("Name of State")}
              {isEditable && (
                <sup>
                  <StarIcon sx={{ color: "red", fontSize: 8 }} />
                </sup>
              )}
              :
            </Typography>
            {isEditable ? (
              <Controller
                name="address.state"
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
                      stateOptions.find((state) => state.key === field.value) ||
                      null
                    } 
                    onChange={(_, data) => field.onChange(data?.key || "")} // Store the key in the form state
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        
                        color="secondary"
                        label={t("State")}
                        error={!!errors.address?.state}
                        helperText={errors.address?.state?.message}
                      />
                    )}
                  />
                )}
              />
            ) : (
              <Typography variant="body1">
                {profileData?.address.state === ""
                  ? t("Not Provided")
                  : t(`stateanddistricts:States.${profileData?.address.state}.name`)}
              </Typography>
            )}
          </Box>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: "600" }}>
              {t("Name of District")}
              {isEditable && (
                <sup>
                  <StarIcon sx={{ color: "red", fontSize: 8 }} />
                </sup>
              )}
              :
            </Typography>
            {isEditable ? (
              <Controller
                name="address.district"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                  {...field}
                  disabled = {!selectedState}
                  options={districtsOptions}
                  getOptionLabel={(option) => option.value} 
                  isOptionEqualToValue={(option, value) =>
                    option.key === value?.key
                  }
                  value={
                    districtsOptions.find((district) => district.key === field.value) ||
                    null
                  } 
                  onChange={(_, data) => field.onChange(data?.key || "")} 
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      
                      color="secondary"
                      label={t("district")}
                      error={!!errors.address?.district}
                      helperText={errors.address?.district?.message}
                    />
                  )}
                />
                )}
              />
            ) : (
              <Typography variant="body1">
                {profileData?.address.district === ""
                  ? t("Not Provided")
                  : t(`stateanddistricts:States.${profileData?.address.state}.districts.${profileData.address.district}`)}
              </Typography>
            )}
          </Box>

          <Box>
            <Typography variant="body1" sx={{ fontWeight: "600" }}>
              {t("pincode")}
              {isEditable && (
                <sup>
                  <StarIcon sx={{ color: "red", fontSize: 8 }} />
                </sup>
              )}
              :
            </Typography>
            {isEditable ? (
              <Controller
                name="address.pincode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    error={!!errors.address?.pincode}
                    helperText={errors.address?.pincode?.message}
                    color="secondary"
                  />
                )}
              />
            ) : (
              <Typography variant="body1">
                {profileData?.address.pincode === ""
                  ? t("Not Provided")
                  : profileData?.address.pincode}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {profileData.email && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,

            paddingTop: 2,
          }}
        >
          <Typography
            variant="h6"
            className="flex items-center gap-2"
            sx={{ fontWeight: "bold" }}
          >
            <MdOutlinePayment />
            {t("Payment Information")}
          </Typography>
          <Box
            className="pl-5"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography
              variant="h6"
              className="flex items-center gap-2"
              sx={{ fontWeight: "400" }}
            >
              <CiBank />
              {t("bankdetails")}
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="body1" sx={{ fontWeight: "600" }}>
                  {t("accnumber")}
                  {isEditable && (
                    <sup>
                      <StarIcon sx={{ color: "red", fontSize: 8 }} />
                    </sup>
                  )}
                  :
                </Typography>
                {isEditable ? (
                  <Controller
                    name="paymentInformation.bankDetails.accountNumber"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="number"
                        error={
                          !!errors.paymentInformation?.bankDetails
                            ?.accountNumber
                        }
                        helperText={
                          errors.paymentInformation?.bankDetails?.accountNumber
                            ?.message
                        }
                        color="secondary"
                      />
                    )}
                  />
                ) : (
                  <Typography variant="body1">
                    {profileData?.paymentInformation?.bankDetails
                      ?.accountNumber === ""
                      ? t("Not Provided")
                      : profileData?.paymentInformation?.bankDetails
                          ?.accountNumber}
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography variant="body1" sx={{ fontWeight: "600" }}>
                  {t("Account Holder Name")}
                  {isEditable && (
                    <sup>
                      <StarIcon sx={{ color: "red", fontSize: 8 }} />
                    </sup>
                  )}
                  :
                </Typography>
                {isEditable ? (
                  <Controller
                    name="paymentInformation.bankDetails.accountHolderName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="text"
                        error={
                          !!errors.paymentInformation?.bankDetails
                            ?.accountHolderName
                        }
                        helperText={
                          errors.paymentInformation?.bankDetails
                            ?.accountHolderName?.message
                        }
                        color="secondary"
                      />
                    )}
                  />
                ) : (
                  <Typography variant="body1">
                    {profileData?.paymentInformation?.bankDetails
                      ?.accountHolderName === ""
                      ? t("Not Provided")
                      : profileData?.paymentInformation?.bankDetails
                          ?.accountHolderName}
                  </Typography>
                )}
              </Box>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: "600" }}>
                  {t("bankname")}
                  {isEditable && (
                    <sup>
                      <StarIcon sx={{ color: "red", fontSize: 8 }} />
                    </sup>
                  )}
                  :
                </Typography>
                {isEditable ? (
                  <Controller
                    name="paymentInformation.bankDetails.bankName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="text"
                        error={
                          !!errors.paymentInformation?.bankDetails?.bankName
                        }
                        helperText={
                          errors.paymentInformation?.bankDetails?.bankName
                            ?.message
                        }
                        color="secondary"
                      />
                    )}
                  />
                ) : (
                  <Typography variant="body1">
                    {profileData?.paymentInformation?.bankDetails?.bankName ===
                    ""
                      ? t("Not Provided")
                      : profileData?.paymentInformation?.bankDetails?.bankName}
                  </Typography>
                )}
              </Box>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: "600" }}>
                  {t("ifsc code")}
                  {isEditable && (
                    <sup>
                      <StarIcon sx={{ color: "red", fontSize: 8 }} />
                    </sup>
                  )}
                  :
                </Typography>
                {isEditable ? (
                  <Controller
                    name="paymentInformation.bankDetails.IFSCCode"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="text"
                        error={
                          !!errors.paymentInformation?.bankDetails?.IFSCCode
                        }
                        helperText={
                          errors.paymentInformation?.bankDetails?.IFSCCode
                            ?.message
                        }
                        color="secondary"
                      />
                    )}
                  />
                ) : (
                  <Typography variant="body1">
                    {profileData?.paymentInformation?.bankDetails?.IFSCCode ===
                    ""
                      ? t("Not Provided")
                      : profileData?.paymentInformation?.bankDetails?.IFSCCode}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
          <Box
            className="pl-5"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography
              variant="h6"
              className="flex items-center gap-2"
              sx={{ fontWeight: "400" }}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg"
                alt="UPI Logo"
                width={30}
                height={30}
              />
              {t("upi details")}
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="body1" sx={{ fontWeight: "600" }}>
                  {t("upi id")}:
                </Typography>
                {isEditable ? (
                  <Controller
                    name="paymentInformation.upiDetails.upiId"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="email"
                        error={!!errors.paymentInformation?.upiDetails?.upiId}
                        helperText={
                          errors.paymentInformation?.upiDetails?.upiId?.message
                        }
                        color="secondary"
                      />
                    )}
                  />
                ) : (
                  <Typography variant="body1">
                    {profileData?.paymentInformation?.upiDetails?.upiId === ""
                      ? t("Not Provided")
                      : profileData?.paymentInformation?.upiDetails?.upiId}
                  </Typography>
                )}
              </Box>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: "600" }}>
                  {t("upi holder name")}:
                </Typography>
                {isEditable ? (
                  <Controller
                    name="paymentInformation.upiDetails.upiName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="text"
                        error={!!errors.paymentInformation?.upiDetails?.upiName}
                        helperText={
                          errors.paymentInformation?.upiDetails?.upiName
                            ?.message
                        }
                        color="secondary"
                      />
                    )}
                  />
                ) : (
                  <Typography variant="body1">
                    {profileData?.paymentInformation?.upiDetails?.upiName === ""
                      ? t("Not Provided")
                      : profileData?.paymentInformation?.upiDetails?.upiName}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {profileData.userType === "Farmer" && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,

            paddingTop: 2,
          }}
        >
          <Typography
            variant="h6"
            className="flex items-center gap-2"
            sx={{ fontWeight: "bold" }}
          >
            <FaTractor />
            {t("farm details")}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="body1" sx={{ fontWeight: "600" }}>
                {t("farm address")}
                {isEditable && (
                  <sup>
                    <StarIcon sx={{ color: "red", fontSize: 8 }} />
                  </sup>
                )}
                :
              </Typography>
              {isEditable ? (
                <Controller
                  name="farmDetails.farmAddress"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="text"
                      error={!!errors.farmDetails?.farmAddress}
                      helperText={errors.farmDetails?.farmAddress?.message}
                      color="secondary"
                    />
                  )}
                />
              ) : (
                <Typography variant="body1">
                  {profileData?.farmDetails?.farmAddress === ""
                    ? t("Not Provided")
                    : profileData?.farmDetails?.farmAddress}
                </Typography>
              )}
            </Box>

            <Box>
              <Typography variant="body1" sx={{ fontWeight: "600" }}>
                {t("farm size")}
                {isEditable && (
                  <sup>
                    <StarIcon sx={{ color: "red", fontSize: 8 }} />
                  </sup>
                )}
                :
              </Typography>
              {isEditable ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Controller
                    name="farmDetails.farmSize"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="number"
                        error={!!errors.farmDetails?.farmSize}
                        helperText={errors.farmDetails?.farmSize?.message}
                        color="secondary"
                        sx={{ flex: 1 }}
                      />
                    )}
                  />
                  {/* Dropdown for size unit */}
                  <FormControl
                    sx={{ minWidth: 120, marginLeft: 1 }}
                    error={!!errors.farmDetails?.sizeUnit}
                  >
                    <InputLabel color="secondary">{t("unit")}</InputLabel>
                    <Controller
                      name="farmDetails.sizeUnit"
                      control={control}
                      defaultValue="Acres"
                      render={({ field }) => (
                        <Select {...field} label="Unit" color="secondary">
                          <MenuItem value="Bigha">{t("bigha")}</MenuItem>
                          <MenuItem value="Acres">{t("acres")}</MenuItem>
                          <MenuItem value="Hectares">{t("hectares")}</MenuItem>
                          <MenuItem value="Gunta">{t("gunta")}</MenuItem>
                        </Select>
                      )}
                    />
                    {errors.farmDetails?.sizeUnit && (
                      <Typography variant="body2" color="error">
                        {errors.farmDetails.sizeUnit.message}
                      </Typography>
                    )}
                  </FormControl>
                </Box>
              ) : (
                <Typography variant="body1">
                  {profileData?.farmDetails?.farmSize === ""
                    ? t("Not Provided")
                    : `${profileData?.farmDetails?.farmSize} ${profileData?.farmDetails &&  t(profileData?.farmDetails?.sizeUnit.toLowerCase())}`}
                </Typography>
              )}
            </Box>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: "600" }}>
                {t("Cropsgrown")}
                {isEditable && (
                  <sup>
                    <StarIcon sx={{ color: "red", fontSize: 8 }} />
                  </sup>
                )}
                :
              </Typography>

              {/* Show chips */}
              <Box
                sx={{ display: "flex", flexWrap: "wrap", gap: 1, marginTop: 1 }}
              >
                {isEditable
                  ? cropsArray.map((crop) => (
                      <Chip
                        key={crop}
                        label={t(`crops:cropsObject.${crop}.name`)}
                        sx={{ cursor: "pointer" }}
                        variant={
                          cropsGrown.includes(crop) ? "filled" : "outlined"
                        }
                        color={
                          cropsGrown.includes(crop) ? "primary" : "default"
                        }
                        onClick={() => handleCropsSelection(crop)}
                      />
                    ))
                  : cropsGrown.map((crop: string) => (
                      <Chip
                        key={crop}
                        label={t(`crops:cropsObject.${crop}.name`)}
                        color="primary"
                        variant="filled"
                      />
                    ))}
              </Box>

              {/* Show error message if cropsGrown is not selected */}
              {errors?.farmDetails?.cropsGrown && (
                <FormHelperText error>
                  {errors.farmDetails.cropsGrown.message}
                </FormHelperText>
              )}
            </Box>
          </Box>
        </Box>
      )}
      {profileData.email && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            paddingTop: 2,
          }}
        >
          <Typography
            variant="h6"
            className="flex items-center gap-2"
            sx={{ fontWeight: "bold" }}
          >
            <FaRegBell />
            {t("Notification Preferences")}
          </Typography>

          <Box sx={{ display: "inline-block" }}>
            <Controller
              name="notificationPreferences.message"
              control={control}
              defaultValue={false} // default value
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      {...field}
                      checked={field.value}
                      disabled={!isEditable}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "blue.main", // Change checked color to blue.main
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: "blue.main", // Change the track color
                          },
                      }}
                    />
                  }
                  label={t("messagenotification")}
                  labelPlacement="start"
                />
              )}
            />
            <br />
            {/* Email Notification Preference */}
            <Controller
              name="notificationPreferences.email"
              control={control}
              defaultValue={false} // default value
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      {...field}
                      disabled={!isEditable}
                      checked={field.value}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "blue.main", // Change checked color to blue.main
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: "blue.main", // Change the track color
                          },
                      }}
                    />
                  }
                  label={t("emailnotification")}
                  labelPlacement="start"
                />
              )}
            />
          </Box>
        </Box>
      )}
      {isEditable && (
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: theme.palette.blue?.main,
            color: "white",
            marginTop: 5,
          }}
          startIcon={updating ? <CircularProgress /> : <SaveIcon />}
        >
          {t("save")}
        </Button>
      )}
    </form>
  );
};

export default ProfileContentUser;

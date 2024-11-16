import {
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
import { Data } from "../pages/Profile";
import { IoPersonOutline } from "react-icons/io5";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CiLocationOn } from "react-icons/ci";
import { MdOutlinePayment } from "react-icons/md";
import { CiBank } from "react-icons/ci";
import theme from "../theme/Theme";
import SaveIcon from "@mui/icons-material/Save";
import toast from "react-hot-toast";
import { cropsArray } from "../utils/cropsName";
import { FaTractor } from "react-icons/fa";
import { FaRegBell } from "react-icons/fa6";

interface ProfileContentUserProps {
  profileData: Data["profileData"];
  isEditable: boolean;
  setIsEditable: React.Dispatch<React.SetStateAction<boolean>>;
}

const addressSchema = z.object({
  name: z.string().min(1, { message: "Address name is required." }),
  district: z.string().min(1, { message: "District is required." }),
  state: z.string().min(1, { message: "State is required." }),
  pincode: z
    .string()
    .regex(/^\d{6}$/, { message: "Pincode must be a valid 6-digit number." }),
});

const bankDetailsSchema = z.object({
  accountNumber: z
    .string({ message: "Account number is required." })
    .min(9, { message: "Account Number is required." })
    .max(18, { message: "Account Number must be less that or equal to 18" }),

  accountHolderName: z
    .string()
    .min(1, { message: "Account holder name is required." }),
  bankName: z.string().min(1, { message: "Bank name is required." }),
  IFSCCode: z
    .string()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, { message: "Invalid IFSC code format." }),
});

const upiDetailsSchema = z
  .object({
    upiId: z.string().optional(),
    upiName: z.string().optional(),
  })
  .optional();

const notificationPreferencesSchema = z.object({
  message: z.boolean(),
  email: z.boolean(),
});

const baseProfileDataSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  phone: z
    .string()
    .min(10, { message: "phone number mst be 10 integers" })
    .max(10, { message: "phone number must b 10 integers" }),
  address: addressSchema,
  paymentInformation: z.object({
    bankDetails: bankDetailsSchema,
    upiDetails: upiDetailsSchema,
  }),
  notificationPreferences: notificationPreferencesSchema,
});

const farmerProfileDataSchema = baseProfileDataSchema.extend({
  farmDetails: z.object({
    cropsGrown: z
      .array(z.string()) // Ensure it's an array of strings
      .min(1, { message: "At least one crop must be selected." }),
    farmAddress: z.string().min(1, { message: "Farm address is required." }),
    sizeUnit: z.string().min(1, { message: "Size unit is required." }),
    farmSize: z.string().min(1, { message: "Farm size is required." }),
  }),
});

const ProfileContentUser: React.FC<ProfileContentUserProps> = ({
  profileData,
  isEditable,
}) => {
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
    getValues,
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
    },
  });

  const handleFormSubmit = () => {
    setUpdating(true);
    const data = getValues();
    console.log(data);
    setTimeout(() => {
      setUpdating(false);
      toast.success("Profile updated successfully!");
    }, 2000);
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
            Basic Information
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
                Email:
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
                Phone:
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
          Address
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
              Name of City/Village:
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
                  ? "Not Provided"
                  : profileData?.address.name}
              </Typography>
            )}
          </Box>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: "600" }}>
              Name of District:
            </Typography>
            {isEditable ? (
              <Controller
                name="address.district"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="text"
                    error={!!errors.address?.district}
                    helperText={errors.address?.district?.message}
                    color="secondary"
                  />
                )}
              />
            ) : (
              <Typography variant="body1">
                {profileData?.address.district === ""
                  ? "Not Provided"
                  : profileData?.address.district}
              </Typography>
            )}
          </Box>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: "600" }}>
              Name of State:
            </Typography>
            {isEditable ? (
              <Controller
                name="address.state"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="text"
                    error={!!errors.address?.state}
                    helperText={errors.address?.state?.message}
                    color="secondary"
                  />
                )}
              />
            ) : (
              <Typography variant="body1">
                {profileData?.address.state === ""
                  ? "Not Provided"
                  : profileData?.address.state}
              </Typography>
            )}
          </Box>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: "600" }}>
              Pincode:
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
                  ? "Not Provided"
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
            Payment Information
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
              Bank Details
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
                  Account Number:
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
                      ? "Not Available"
                      : profileData?.paymentInformation?.bankDetails
                          ?.accountNumber}
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography variant="body1" sx={{ fontWeight: "600" }}>
                  Account Holder Name:
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
                      ? "Not Available"
                      : profileData?.paymentInformation?.bankDetails
                          ?.accountHolderName}
                  </Typography>
                )}
              </Box>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: "600" }}>
                  Bank Name:
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
                      ? "Not Available"
                      : profileData?.paymentInformation?.bankDetails?.bankName}
                  </Typography>
                )}
              </Box>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: "600" }}>
                  IFSC Code:
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
                      ? "Not Available"
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
              Upi Details
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
                  Upi Id:
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
                      ? "Not Available"
                      : profileData?.paymentInformation?.upiDetails?.upiId}
                  </Typography>
                )}
              </Box>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: "600" }}>
                  Upi Holder Name:
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
                      ? "Not Available"
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
            Farm Details
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
                Farm Address:
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
                    ? "Not Available"
                    : profileData?.farmDetails?.farmAddress}
                </Typography>
              )}
            </Box>

            <Box>
              <Typography variant="body1" sx={{ fontWeight: "600" }}>
                Farm Size:
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
                    <InputLabel color="secondary">Unit</InputLabel>
                    <Controller
                      name="farmDetails.sizeUnit"
                      control={control}
                      defaultValue="Acres"
                      render={({ field }) => (
                        <Select {...field} label="Unit" color="secondary">
                          <MenuItem value="Bigha">Bigha</MenuItem>
                          <MenuItem value="Acres">Acres</MenuItem>
                          <MenuItem value="Hectares">Hectares</MenuItem>
                          <MenuItem value="Gunta">Gunta</MenuItem>
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
                    ? "Not Available"
                    : `${profileData?.farmDetails?.farmSize} ${profileData?.farmDetails?.sizeUnit}`}
                </Typography>
              )}
            </Box>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: "600" }}>
                Crops Grown:
              </Typography>

              {/* Show chips */}
              <Box
                sx={{ display: "flex", flexWrap: "wrap", gap: 1, marginTop: 1 }}
              >
                {isEditable
                  ? cropsArray.map((crop) => (
                      <Chip
                        key={crop}
                        label={crop}
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
                        label={crop}
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
          Notification Preferences
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
                label="Message Notifications"
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
                label="Email Notifications"
                labelPlacement="start"
              />
            )}
          />
        </Box>
      </Box>

          
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
          Save
        </Button>
      )}
    </form>
  );
};

export default ProfileContentUser;

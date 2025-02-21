import React, { useEffect, useState } from "react";
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
  MenuItem,
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
import { useTranslation } from "react-i18next";
const productRates: {
  [key: string]: number;
} = {
  "Banana": 4500,
  "Maize": 2500,
  "Apple": 8500,
  "Wheat": 3000,
  "Black Gram (Urd Beans)(Whole)": 7200,
  "Bengal Gram(Gram)(Whole)": 5000,
  "Paddy(Dhan)(Common)": 3000,
  "Ginger(Green)": 6000,
  "Green Chilli": 8000,
  "Pomegranate": 7000,
  "Tomato": 4000,
  "Onion": 2500,
  "Potato": 1800,
  "Mustard": 5300,
  "Masur Dal": 5500,
  "Garlic": 8000,
  "Rice": 3500,
  "Arhar (Tur/Red Gram)(Whole)": 4500,
  "Lentil (Masur)(Whole)": 5500,
  "Groundnut": 6200,
  "Capsicum": 7000,
  "Spinach": 4000,
  "Papaya": 3000,
  "Water Melon": 3200,
  "Carrot": 4800,
  "Cauliflower": 4500,
  "Orange": 5000,
  "Peas Wet": 4200,
  "Pineapple": 5200,
  "Green Peas": 7000,
  "Amla(Nelli Kai)": 5500,
  "Chikoos(Sapota)": 4800,
  "Bajra(Pearl Millet/Cumbu)": 2100,
  "Jowar(Sorghum)": 2400,
  "Turmeric": 9500,
  "Soyabean": 6200,
  "Cotton": 6200,
  "Moath Dal": 5000,
  "Peach": 8500,
  "Turnip": 3200,
  "Cummin Seed(Jeera)": 9000,
  "Mint(Pudina)": 7000,
  "Guar Seed(Cluster Beans Seed)": 4700,
  "Kodo Millet(Varagu)": 3900
};

interface ListedContractsProps {
  contracts: {
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
  setContracts: React.Dispatch<
    React.SetStateAction<
      {
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
        deliveryPreference:string
      }[]
    >
  >;
}

const ListedContracts: React.FC<ListedContractsProps> = ({
  contracts,
  userType,
  setContracts,
}) => {
  const { t } = useTranslation(["listedcontracts", "crops"]);
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
    
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(listContractSchema),
    defaultValues: {
      productName: selectedContract?.productName,
      productVariety:selectedContract?.productVariety,
      initialPaymentAmount: selectedContract?.initialPaymentAmount,
      finalPaymentAmount: selectedContract?.finalPaymentAmount,
      deadline: selectedContract?.deadline,
      additionalInstructions: selectedContract?.additionalInstructions,
      productQuantity: selectedContract?.productQuantity,
      deliveryPreference:selectedContract?.deliveryPreference
    },
  });

  useEffect(() => {
    if (selectedContract && isEditable) {
      setValue("productName", selectedContract.productName);
      setValue("initialPaymentAmount", selectedContract.initialPaymentAmount);
      setValue("finalPaymentAmount", selectedContract.finalPaymentAmount);
      setValue("deadline", selectedContract.deadline);
      setValue(
        "additionalInstructions",
        selectedContract.additionalInstructions
      );
      setValue("productQuantity", selectedContract.productQuantity);
      setValue("deliveryPreference", selectedContract.deliveryPreference);
      setValue("productVariety", selectedContract.productVariety);
    }
  }, [isEditable, selectedContract]);

  const handleFormSubmit = async (data: any) => {
    try {
      data.marketPlaceId = selectedContract?.marketPlaceId;
      if (userType === "Farmer") {
        const response = await axios.post(
          `/api/marketplace/start-negotiations/${
            selectedContract?.marketPlaceId
          }`,
          data,
          { withCredentials: true,headers: {
            'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
          }, }
        );
        if (response.status === 200) {
          toast.success(t("Negotiation started successfully!"));
          navigate("/negotiations");
        }
      } else {
        const productName = data.productName;
        const value =
          Number(watch("productQuantity")) === 0
            ? 0
            : 
                Number(watch("finalPaymentAmount") || 0) /
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

        const response = await axios.put(
          `/api/marketplace/list-contract`,
          data,
          { withCredentials: true,headers: {
            'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
          }, }
        );
        if (response.data.success) {
          toast.success(t("Contract listed successfully!"));
          setContracts((prev) => {
            const updatedContractIndex = prev.findIndex(
              (contract) =>
                contract.marketPlaceId === selectedContract?.marketPlaceId
            );

            if (updatedContractIndex !== -1) {
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
      }
      setIsEditable(false);
      handleCloseModal();
      window.location.reload();
    } catch (error) {
      toast.error(t("Error updating contract"));
    }
  };

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
                        <strong>{t("buyer_name")}</strong> {contract.buyerName}
                      </Typography>
                      <Typography variant="body1">
                        <strong>{t("product_name")}</strong>{" "}
                        {t(`crops:cropsObject.${contract.productName}.name`)} - {contract.productVariety}
                      </Typography>
                      <Typography variant="body1">
                        <strong>{t("quantity")}</strong>{" "}
                        {contract.productQuantity}
                      </Typography>
                      <Typography variant="body1" className="flex items-center">
                        <strong>{t("total_amount")}</strong>
                        <FaRupeeSign />{" "}
                        {parseInt(contract.finalPaymentAmount)}
                      </Typography>
                      <Typography variant="body1">
                        <strong>{t("deadline")}</strong>{" "}
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
        <form onSubmit={(e)=>{
          e.preventDefault();
          const data = getValues()
          console.log(data)
          handleFormSubmit(data)
          console.log("hello")
        }}>
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
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    p: 4,
                  }}
                >
                  <Typography
                    id="modal-title"
                    variant="h5"
                    component="h2"
                    sx={{ fontWeight: "bold", mb: 2 }}
                  >
                    {t(`crops:cropsObject.${selectedContract.productName}.name`)}-{selectedContract.productVariety}
                  </Typography>
                  <Typography id="modal-description" variant="body1">
                    <strong>{t("buyer_name")}</strong>{" "}
                    {selectedContract.buyerName}
                  </Typography>
                  {isEditable ? (
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
                  ) : (
                    <Typography variant="body1">
                      <strong>Delivery Prefernce: </strong>{" "}
                      {selectedContract.deliveryPreference}
                    </Typography>
                  )}
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
                          label={t("Product Quantity in Quintal (q)")}
                          fullWidth
                        />
                      )}
                    />
                  ) : (
                    <Typography variant="body1">
                      <strong>{t("quantity")}</strong>{" "}
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
                          label={t("Initial Payment Amount in %")}
                          fullWidth
                        />
                      )}
                    />
                  ) : (
                    <Typography variant="body1" className="flex items-center">
                      <strong>{t("initial_payment_amount")}</strong>{" "}
                      <FaRupeeSign /> {parseInt(selectedContract.initialPaymentAmount) * parseInt(selectedContract.finalPaymentAmount)/100}
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
                          label={t("Final Payment Amount")}
                          fullWidth
                        />
                      )}
                    />
                  ) : (
                    <Typography variant="body1" className="flex items-center">
                      <strong>{t("total_amount")}</strong> <FaRupeeSign />{" "}
                      {selectedContract.finalPaymentAmount}
                    </Typography>
                  )}

                  {isEditable ? (
                    <Typography variant="body1" className="flex items-center">
                      <strong>{t("rate")}</strong> <FaRupeeSign />{" "}
                      {
                        Number(watch("finalPaymentAmount")) /Number(watch("productQuantity"))
                        }
                    </Typography>
                  ) : (
                    <Typography variant="body1" className="flex items-center">
                      <strong>{t("rate")}</strong> <FaRupeeSign />{" "}
                      {
                        parseInt(selectedContract.finalPaymentAmount) /
                        parseInt(selectedContract.productQuantity)}
                    </Typography>
                  )}

                  {
                    <Typography variant="body1" className="flex items-center">
                      <strong>
                        {t("Min Rate")}: </strong>
                      {productRates[
                        selectedContract.productName as keyof typeof productRates
                      ] || ""}
                    </Typography>
                  }
                  {isEditable ? (
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
                  ) : (
                    <Typography variant="body1">
                      <strong>{t("deadline")}</strong>{" "}
                      {new Date(selectedContract.deadline).toLocaleDateString()}
                    </Typography>
                  )}

                  {isEditable ? (
                    <Controller
                      name="additionalInstructions"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          color="secondary"
                          {...field}
                          error={!!errors.additionalInstructions}
                          helperText={errors.additionalInstructions?.message}
                          label={t("Additional Instructions")}
                          fullWidth
                        />
                      )}
                    />
                  ) : (
                    <Typography variant="body1">
                      <strong>{t("instructions")}</strong>{" "}
                      {selectedContract.additionalInstructions}
                    </Typography>
                  )}

                  {/* Buyer Profile Link */}
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
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
                        {t("view_buyer_profile")}
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
                      {isEditable ? (
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          type="submit"
                          endIcon={<SaveIcon className="text-white" />}
                        >
                          {t("send")}
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mr: 1 }}
                            onClick={async () => {
                              try {
                                const response = await axios.post(
                                  `/api/marketplace/request-contract/${
                                    selectedContract?.marketPlaceId
                                  }`,
                                  {},
                                  { withCredentials: true,headers: {
                                    'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
                                  }, }
                                );
                                if (response.data.success) {
                                  toast.success(t("Request sent successfully"));
                                  navigate("/contracts");
                                }
                              } catch (e) {
                                console.log(e);
                                toast.error(
                                  t(
                                    "An error occurred while requesting the contract"
                                  )
                                );
                              }
                            }}
                          >
                            {t("request")}
                          </Button>
                          <Button
                            variant="contained"
                            color="secondary"
                            fullWidth
                            onClick={() => {
                              setIsEditable(true);
                            }}
                          >
                            {t("negotiate")}
                          </Button>
                        </>
                      )}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        mt: 3,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      {isEditable ? (
                        <Button
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
                          {t("save")}
                        </Button>
                      ) : (
                        <Button
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
                            setIsEditable(true);
                          }}
                        >
                          {t("edit")}
                        </Button>
                      )}
                      {!isEditable && (
                        <Button
                          type="button"
                          endIcon={<IoTrashBin />}
                          variant="contained"
                          color="error"
                          fullWidth
                          onClick={async () => {
                            try {
                              const response = await axios.delete(
                                `/api/marketplace/list-contract/${
                                  selectedContract?.marketPlaceId
                                }`,
                                { withCredentials: true,headers: {
        'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
      }, }
                              );
                              if (response.data.success) {
                                setContracts((prevContracts) =>
                                  prevContracts.filter(
                                    (contract) =>
                                      contract.marketPlaceId !==
                                      selectedContract?.marketPlaceId
                                  )
                                );
                                toast.success(
                                  t("Contract deleted successfully!")
                                );
                                handleCloseModal();
                              }
                            } catch (err) {
                              console.error(err);
                              toast.error(t("Failed to delete contract"));
                            }
                          }}
                        >
                          {t("delete")}
                        </Button>
                      )}
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

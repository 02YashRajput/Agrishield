import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import theme from "../theme/Theme";
import logo from "../assets/AgriShieldTransparent.png";
import Background from "../components/Background";
import Button from "@mui/material/Button";
import { IoIosArrowBack } from "react-icons/io";
import { useMediaQuery } from '@mui/material';
import axios from "axios";
import {
  Card,
  CardContent,
  CardMedia,
  Divider,
  IconButton,
  Paper,
  Typography,
  TextField,
} from "@mui/material";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useTranslation } from "react-i18next";

type UserType = "Farmer" | "Buyer" | "";

const SignUp: React.FC = () => {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>("");
  const [showUserTypeInput, setShowUserTypeInput] = useState(true);
  const {t}= useTranslation("signup");
  const signUpFormSchema = z
    .object({
      userName: z.string().min(1, { message:t('form.name.messages.0') }),
      phone: z
        .string()
        .min(10, { message: t('form.phone.messages.0') })
        .max(10, { message: t('form.phone.messages.1') }),
      email: z
        .string()
        .min(1, { message: t('form.email.messages.0')})
        .email({ message:t('form.email.messages.1')  }),
      password: z
        .string()
        .min(8, { message: t('form.password.messages.0')})
        .regex(/[a-z]/, {
          message: t('form.password.messages.1'),
        })
        .regex(/[A-Z]/, {
          message: t('form.password.messages.2'),
        })
        .regex(/[0-9]/, {
          message: t('form.password.messages.3'),
        })
        .regex(/[@!#$%^&*(),.?":{}|<>]/, {
          message:
          t('form.password.messages.4'),
        }),
      confirmPassword: z.string().min(1, { message: t('form.confirmPassword.messages.0')}),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('form.confirmPassword.messages.1'),
      path: ["confirmPassword"],
    });

  type SignUpFormSchema = z.infer<typeof signUpFormSchema>;

  const getColor = (type: UserType) => {
    if (userType === type) return theme.palette.yellow?.dark;
    return theme.palette.yellow?.main;
  };

  const form = useForm<SignUpFormSchema>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      userName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleFormSubmit = async (data: SignUpFormSchema) => {
    try {
      const signUpData = { ...data, userType };

      await axios.post(`/api/local/sign-up`, signUpData, {
        withCredentials: true,
        headers: {
          'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
        },
      });

      toast.success("Sign up successful");
      toast(
        "Please verify your email using the link we've sent to your inbox."
      );

      navigate("/login");
    } catch (error: any) {
      toast.error(error.response.data.message || "An error occurred");
      console.error(error);
    }
  };

  return (
    <div className="relative bg:[#bbf7d0] flex justify-center items-center min-h-screen min-w-screen">
      <Background />
      <Paper
        sx={{ backgroundColor: "rgba(255,255,255,0.5)" }}
        className="z-50 flex flex-col md:flex-row"
      >
         {!isSmallScreen && showUserTypeInput && (
        <Card
          sx={{ backgroundColor: "transparent" }}
          className="flex flex-col items-center justify-center"
        >
          <CardMedia
            component="img"
            alt="AgriShield Logo"
            image={logo}
            sx={{ height: "18rem" }}
          />
          <CardContent className="flex items-center justify-center">
            <Typography variant="h5" className="text-black text-center">
              {t('slogan.0')}
              <br />
              {t('slogan.1')}
            </Typography>
          </CardContent>
        </Card>
      )}
        <Divider />
        <Card
          sx={{ backgroundColor: "transparent" }}
          className="flex flex-col gap-5 p-5 items-center justify-center"
        >
          {showUserTypeInput ? (
            <div className="flex flex-col gap-10">
              <div className="flex gap-5 ">
                <Button
                  variant="contained"
                  sx={{ backgroundColor: getColor("Farmer") }}
                  onClick={() => setUserType("Farmer")}
                  className="w-full sm:w-auto"
                >
                  {t('Farmer')}
                </Button>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: getColor("Buyer") }}
                  onClick={() => setUserType("Buyer")}
                  className="w-full sm:w-auto mt-4"
                >
                 {t('Buyer')}
                </Button>
              </div>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: (theme) => theme.palette.yellow?.main,
                }}
                onClick={() => {
                  userType === ""
                    ? toast.error("Please select a user type")
                    : setShowUserTypeInput(false);
                }}
                className="w-full sm:w-auto mt-4"
              >
                {t('Next')}
              </Button>
            </div>
          ) : (
            <div>
              <Card sx={{ backgroundColor: "transparent" }} className="p-5">
                <IconButton
                  sx={{ color: "black", borderRadius: "50%" }}
                  onClick={() => setShowUserTypeInput(true)}
                >
                  <IoIosArrowBack size="30" />
                </IconButton>
                <form
                  onSubmit={form.handleSubmit(handleFormSubmit)}
                  className="w-80 flex flex-col gap-5 mt-5"
                >
                  <TextField
                    label={t('Name')}
                    fullWidth
                    type="text"
                    {...form.register("userName")}
                    error={!!form.formState.errors.userName}
                    helperText={form.formState.errors.userName?.message}
                    color="secondary"
                  />
                  <TextField
                    label={t('Phone')}
                    fullWidth
                    type="text"
                    {...form.register("phone")}
                    error={!!form.formState.errors.phone}
                    helperText={form.formState.errors.phone?.message}
                    color="secondary"
                  />
                  <TextField
                    label={t('Email')}
                    fullWidth
                    type="email"
                    {...form.register("email")}
                    error={!!form.formState.errors.email}
                    helperText={form.formState.errors.email?.message}
                    color="secondary"
                  />
                  <TextField
                    label={t('Password')}
                    fullWidth
                    type="password"
                    {...form.register("password")}
                    error={!!form.formState.errors.password}
                    helperText={form.formState.errors.password?.message}
                    color="secondary"
                  />
                  <TextField
                    label={t('ConfirmPassword')}
                    fullWidth
                    type="confirmPassword"
                    {...form.register("confirmPassword")}
                    error={!!form.formState.errors.confirmPassword}
                    helperText={form.formState.errors.confirmPassword?.message}
                    color="secondary"
                  />
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{
                      backgroundColor: (theme) => theme.palette.yellow?.main,
                    }}
                  >
                    {t('Submit')}
                  </Button>
                </form>
                <Typography
                  variant="h6"
                  sx={{ marginTop: "1rem", marginBottom: "1rem" }}
                  className="text-black text-center"
                >
                  {t('Or')}
                </Typography>
                <GoogleLoginButton userType={userType} />
              </Card>
            </div>
          )}

          <Typography variant="body1" className="text-black">
            {t('User')}{" "}
            <Link to="/login" className="text-red-600">
              {t('Login')}
            </Link>
          </Typography>
        </Card>
      </Paper>
    </div>
  );
};

export default SignUp;

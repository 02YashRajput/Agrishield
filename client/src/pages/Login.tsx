import {
  Card,
  CardContent,
  CardMedia,
  Divider,
  Paper,
  Typography,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Background from "../components/Background";
import logo from "../assets/AgriShieldTransparent.png";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import theme from "../theme/Theme";





const Login:React.FC = () => {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const {t} = useTranslation('login');
  
  const loginSchema = z.object({
    identifier: z
      .string()
      .min(1, { message: t("Email or Phone no is required" )}),
      
    password: z.string().min(1, { message: t("Password is required" )}),
  });
  
  
  type LoginFormSchema = z.infer<typeof loginSchema>;

  const handleFormSubmit = async(values: LoginFormSchema) => {

    try{
     const response = await axios.post(`/api/local/login`, values,{
      withCredentials: true, 
      headers: {
        'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
      },
    })
      
    
      toast.success(t("Login successful"));
      if(response.data.userType === "Admin"){
        navigate("/admin/dashboard")
      }
      
      else if(response.data.userType === "Agent"){
        navigate("/agent/dashboard")
      }
      else{

      
      navigate("/");
      }
    }catch(error:any){
      toast.error(error.response.data.message || t("An error occurred"));
      console.error(error);
    }

    
  };

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  return (
    <div className="relative flex justify-center items-center overflow-hidden min-h-screen min-w-screen">
      <Background />
      <Paper
        sx={{ backgroundColor: "rgba(255,255,255,0.5)" }}
        className="z-50 flex flex-col md:flex-row"
      >
        {
!isSmallScreen &&
        <Card
          sx={{ backgroundColor: "transparent" }}
          className="flex flex-col items-center justify-center "
        >
          <CardMedia
            component="img"
            alt="AgriShield Logo"
            image={logo}
            sx={{ height: "18rem" }}
          />
          <CardContent className="flex items-center justify-center">
            <Typography variant="h5" className="text-black  text-center">
              {t("Farm with Confidence")}
              <br /> {t("Market with Ease.")}
            </Typography>
          </CardContent>
        </Card>
        }

        <Divider />
        <Card
          sx={{ backgroundColor: "transparent" }}
          className="flex flex-col gap-5 p-5 items-center justify-center"
        >
          <Card sx={{ backgroundColor: "transparent" }} className="p-5">
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="w-80 flex flex-col gap-5 mt-5"
            >
              <TextField
                label={t("Email or Phone Number")}
                fullWidth
                type="text"
                {...form.register("identifier")}
                error={!!form.formState.errors.identifier}
                helperText={form.formState.errors.identifier?.message}
                color="secondary"
              />
              <TextField
                label={t("Password")}
                fullWidth
                type="password"
                {...form.register("password")}
                error={!!form.formState.errors.password}
                helperText={form.formState.errors.password?.message}
                color="secondary"
              />
              <Button
                variant="contained"
                type="submit"
                sx={{
                  backgroundColor: (theme) => theme.palette.yellow?.main,
                }}
              >
                {t("Submit")}
              </Button>
            </form>
            <Typography
              variant="h6"
              sx={{ marginTop: "1rem", marginBottom: "1rem" }}
              className="text-black text-center"
            >
              {t("Or")}
            </Typography>
            <GoogleLoginButton userType={null} />
          </Card>
          <Typography variant="body1" className="text-black">
            {t("New User")}?{" "}
            <Link to="/sign-up" className="text-red-600">
              {t("SignUp")}
            </Link>
          </Typography>
        </Card>
      </Paper>
    </div>
  );
};

export default Login;

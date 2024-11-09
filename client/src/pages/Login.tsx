import {
  Card,
  CardContent,
  CardMedia,
  Divider,
  Paper,
  Typography,
  TextField,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Background from "../components/Background";
import logo from "../assets/AgriShieldLogoTransparent.png";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});
const serverUrl = import.meta.env.VITE_SERVER_URL;

type LoginFormSchema = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const handleFormSubmit = async(values: LoginFormSchema) => {

    try{
     await axios.post(`${serverUrl}/api/local/login`, values)
      
      toast.success("Login successful");
      navigate("/");
    }catch(error:any){
      toast.error(error.response.data.message || "An error occurred");
      console.error(error);
    }

    
  };

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div className="relative flex justify-center items-center overflow-hidden min-h-screen min-w-screen">
      <Background />
      <Paper
        sx={{ backgroundColor: "rgba(255,255,255,0.5)" }}
        className="z-50 flex"
      >
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
            <Typography variant="h5" className="text-black  text-center">
              Farm with Confidence
              <br /> Market with Ease.
            </Typography>
          </CardContent>
        </Card>
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
                label="Email"
                fullWidth
                type="email"
                {...form.register("email")}
                error={!!form.formState.errors.email}
                helperText={form.formState.errors.email?.message}
                color="secondary"
              />
              <TextField
                label="Password"
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
                Submit
              </Button>
            </form>
            <Typography
              variant="h6"
              sx={{ marginTop: "1rem", marginBottom: "1rem" }}
              className="text-black text-center"
            >
              Or
            </Typography>
            <GoogleLoginButton userType={null} />
          </Card>
          <Typography variant="body1" className="text-black">
            New User?{" "}
            <Link to="/sign-up" className="text-red-600">
              SignUp
            </Link>
          </Typography>
        </Card>
      </Paper>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { z } from "zod";
import useSWR from "swr";
import ErrorPage from "./Error";
import Header from "../components/Header";
import toast from "react-hot-toast";
import { sendContactUsEmail } from "../utils/sendEmail.ts";
import Footer from "../components/Footer.tsx";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number should be 10 digits")
    .max(10, "Phone number should be 10 digits"),
  message: z.string().min(10, "Message should be at least 10 characters"),
});
type formInputSchema = z.infer<typeof contactSchema>;

interface Data {
  success: boolean;
  message: string;
  user?: {
    name: string;
    profileImage: string;
    id: number;
  };
}

const fetcher = (url: string) =>
  axios
    .get(url, {
      withCredentials: true,
    })
    .then((res) => res.data);

const ContactUsForm: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { data, error } = useSWR<Data>(`/api/`, fetcher);

  // Fallback to 'Guest' if user name is not available or in case of error


  const isLoggedIn = data?.user  ? true : false;
  // Handle error state
  // Handle error state
  if (error) {
    return <ErrorPage />; // Show error page if there's an error
  }

  const form = useForm<formInputSchema>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: formInputSchema) => {
    setLoading(true);
    const emailData = {
      to_name: "Agrishield",
      to_email: import.meta.env.VITE_AGRISHIELD_EMAIL,
      from_email: data.email,
      from_name: data.name,
      message: `Message from ${data.name} Phone Number: ${data.phone} Email: ${data.email}:\n ${data.message}`,
    };
    try {
      await sendContactUsEmail(emailData);
    
      toast.success("Form submitted successfully");
      setLoading(false);
      form.reset();
    } catch (error) {
      console.error(error);
      // Show error message to user
      toast.error(
        "An error occurred while submitting the form. Please try again later."
      );
      setLoading(false);
    }
  };

  return (
    <div>
      <Header name={data?.user?.name} profileImage={data?.user?.profileImage} isLoggedIn = {isLoggedIn} id = {data?.user?.id} />

      <Paper
        sx={{
          margin: "auto",
          padding: 4,
          boxShadow: 3,
          marginTop: 5,
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}
        className="w-full md:w-[70%] lg:w-[50%] "
      >
        <Typography variant="h4" className="text-center">
          GET IN TOUCH
        </Typography>
        <Divider
          sx={{
            backgroundColor: (theme) => theme.palette.blue?.main,
            height: 2,
            width: "70%",
            mx: "auto",
          }}
        />
        <form
          className="flex flex-col items-center gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <TextField
            className="w-[80%]"
            label="Name"
            type="text"
            {...form.register("name")}
            error={!!form.formState.errors.name}
            helperText={form.formState.errors.name?.message}
            color="secondary"
          />
          <TextField
            className="w-[80%]"
            label="Email"
            type="text"
            {...form.register("email")}
            error={!!form.formState.errors.email}
            helperText={form.formState.errors.email?.message}
            color="secondary"
          />
          <TextField
            className="w-[80%]"
            label="Phone Number"
            type="text"
            {...form.register("phone")}
            error={!!form.formState.errors.phone}
            helperText={form.formState.errors.phone?.message}
            color="secondary"
          />
          <TextField
            className="w-[80%]"
            label="Message"
            type="text"
            {...form.register("message")}
            error={!!form.formState.errors.message}
            helperText={form.formState.errors.message?.message}
            color="secondary"
          />
          <Button variant="contained" type="submit" disabled={loading}>
            {loading ? <CircularProgress /> : "Submit"}
          </Button>
        </form>
      </Paper>
      <Footer/>
    </div>
  );
};

export default ContactUsForm;

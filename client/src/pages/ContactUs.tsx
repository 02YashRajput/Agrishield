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
import { useTranslation } from "react-i18next";

const contactSchema = z.object({
  name: z.string().min(1, { message: "requiredname" }),
  email: z.string().email({ message: "invalidemail" }),
  phone: z
    .string()
    .min(10, { message: "phonelength" })
    .max(10, { message: "phonelength" }),
  message: z.string().min(10, { message: "messagelength" }),
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
      headers: {
        'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
      },
    })
    .then((res) => res.data);

const ContactUsForm: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { data, error } = useSWR<Data>(`/api/`, fetcher);
  const { t } = useTranslation("contactus");

  const isLoggedIn = data?.user ? true : false;

  if (error) {
    return <ErrorPage />;
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

      toast.success(t("formsubmittedsuccessfully"));
      setLoading(false);
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error(t("formsubmiterror"));
      setLoading(false);
    }
  };

  return (
    <div>
      <Header
        name={data?.user?.name}
        profileImage={data?.user?.profileImage}
        isLoggedIn={isLoggedIn}
        id={data?.user?.id}
      />

      <Paper
        sx={{
          margin: "auto",
          padding: 4,
          boxShadow: 3,
          marginTop: 5,
          marginBottom: 5,
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}
        className="w-full md:w-[70%] lg:w-[50%] "
      >
        <Typography variant="h4" className="text-center">
          {t("getintouch")}
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
            label={t("name")}
            type="text"
            {...form.register("name")}
            error={!!form.formState.errors.name}
            helperText={form.formState.errors.name && t(form.formState.errors.name.message!)}
            color="secondary"
          />
          <TextField
            className="w-[80%]"
            label={t("email")}
            type="text"
            {...form.register("email")}
            error={!!form.formState.errors.email}
            helperText={form.formState.errors.email && t(form.formState.errors.email.message!)}
            color="secondary"
          />
          <TextField
            className="w-[80%]"
            label={t("phone")}
            type="text"
            {...form.register("phone")}
            error={!!form.formState.errors.phone}
            helperText={form.formState.errors.phone && t(form.formState.errors.phone.message!)}
            color="secondary"
          />
          <TextField
            className="w-[80%]"
            label={t("message")}
            type="text"
            {...form.register("message")}
            error={!!form.formState.errors.message}
            helperText={form.formState.errors.message && t(form.formState.errors.message.message!)}
            color="secondary"
          />
          <Button variant="contained" type="submit" disabled={loading}>
            {loading ? <CircularProgress /> : t("submit")}
          </Button>
        </form>
      </Paper>
      <Footer />
    </div>
  );
};

export default ContactUsForm;

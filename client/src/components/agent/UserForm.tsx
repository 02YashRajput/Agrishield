import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextField, MenuItem, Button, Typography, Grid } from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";

// Define the schema using Zod
const userSchema = z.object({
  userName: z
    .string()
    .min(3, {message : "Name must be at least 3 characters long"})
    .max(50, {message : "Name cannot exceed 50 characters"})
    .nonempty({message :"Name cannot be empty"}),
  email: z
    .string()
    .email({message :"Please enter a valid email address"})
    .nonempty({message :"Email cannot be empty"}),
  phone: z
    .string()
    .regex(/^\d{10}$/, {message :"Phone number must be 10 digits long"}),
    
  password: z.string().nonempty({message :"Password cannot be empty"}),
  userType: z.enum(["Farmer", "Buyer"], {message :"User type is required"}),
});

type UserFormValues = z.infer<typeof userSchema>;

const UserForm :React.FC= () => {
  const {
    control,
    handleSubmit,
    
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues:{
      userName:"",
      email:"",
      phone:"",
      password:"",
      userType:undefined,
    }
  });

  const onSubmit = async(data: UserFormValues) => {
    try{
      const response = await axios.post(`/api/agent/user`,data,{withCredentials:true,headers: {
        'ngrok-skip-browser-warning': 'any-value',  
      },});
      if(response.data.success){
        toast.success("User created successfully!");
        reset({ userName: "", email: "", phone: "", password: "", userType:undefined});
      }
    }catch(err){
      console.error(err);
      toast.error("User already exists")
    }
    
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "20px" }}>
    <Typography variant="h4" gutterBottom align="center">
      User Registration Form
    </Typography>
    <Grid container spacing={3}>
      {/* Name Field */}
      <Grid item xs={12} sm={6} md={3}>
        <Controller
          name="userName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Name"
              variant="outlined"
              fullWidth
              error={!!errors.userName}
              helperText={errors.userName?.message}
            />
          )}
        />
      </Grid>
      {/* Email Field */}
      <Grid item xs={12} sm={6} md={3}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              variant="outlined"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          )}
        />
      </Grid>
      {/* Phone Field */}
      <Grid item xs={12} sm={6} md={3}>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Phone"
              variant="outlined"
              fullWidth
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          )}
        />
      </Grid>
      
      {/* Password Field */}
      <Grid item xs={12} sm={6} md={3}>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          )}
        />
      </Grid>
      {/* User Type Field */}
      <Grid item xs={12} sm={6} md={3}>
        <Controller
          name="userType"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="User Type"
              select
              variant="outlined"
              fullWidth
              error={!!errors.userType}
              helperText={errors.userType?.message}
            >
              <MenuItem value="Farmer">Farmer</MenuItem>
              <MenuItem value="Buyer">Buyer</MenuItem>
            </TextField>
          )}
        />
      </Grid>
    </Grid>
    {/* Submit Button */}
    <Grid container justifyContent="center" marginTop={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit
        </Button>
      </Grid>
    </Grid>
  </form>
  );
};

export default UserForm;

import React from "react";
import {
  Grid,
  Box,
  Typography,
  Link,
  IconButton,
} from "@mui/material";
import logo from "../assets/AgriShieldTransparent.png";
import { Facebook, Twitter, Instagram } from "@mui/icons-material";

const Footer: React.FC = () => {
  return (
    <Box sx={{ padding: 4, backgroundColor: "#f5f5f5" }}>
      <Grid container spacing={4} justifyContent="space-between">
        {/* Logo and Info Section */}
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img src={logo} alt="AgriShield Logo" className="w-40" />
            <Typography variant="body2" sx={{ ml: 2 }}>
              A platform connecting farmers with guaranteed buyers through secure
              contracts, ensuring stable market access and reliable income.
            </Typography>
          </Box>
        </Grid>

        {/* Navigation Section */}
        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Navigation
          </Typography>
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <Link href="/" color="inherit" variant="body2">
                Home
              </Link>
            </Grid>
            <Grid item>
              <Link href="/about" color="inherit" variant="body2">
                About Us
              </Link>
            </Grid>
            <Grid item>
              <Link href="/contact-us" color="inherit" variant="body2">
                Contact
              </Link>
            </Grid>
            <Grid item>
              <Link href="/marketplace" color="inherit" variant="body2">
                Market Place
              </Link>
            </Grid>
          </Grid>
        </Grid>

        {/* Address Section */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6">Address</Typography>
          <Typography variant="body2" sx={{ marginTop: 2 }}>
            Noida Intitute of Engineering & Technology,
            <br />
            Greater Noida, Gautam Buddha Nagar,
            <br />
            Uttar Pradesh, 201301, India
          </Typography>
        </Grid>

        {/* Social Media Section */}
        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="h6">Follow Us</Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <IconButton
              onClick={() => {
                window.open(
                  "https://www.facebook.com/profile.php?id=61564286236744",
                  "_blank"
                );
              }}
              color="inherit"
            >
              <Facebook />
            </IconButton>
            <IconButton
              onClick={() => {
                window.open("https://www.twitter.com/agri_shield", "_blank");
              }}
              color="inherit"
            >
              <Twitter />
            </IconButton>
            <IconButton
              onClick={() => {
                window.open("https://www.instagram.com/agri_shield", "_blank");
              }}
              color="inherit"
            >
              <Instagram />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;

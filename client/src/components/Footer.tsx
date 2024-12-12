import React from "react";
import axios from "axios";
import {
  Grid,
  Box,
  Typography,
  Link,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import logo from "../assets/AgriShieldTransparent.png";
import { Facebook, Twitter, Instagram } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/LanguageContext";
import { Language } from "../context/LanguageContext";
import toast from "react-hot-toast";

const Footer: React.FC = () => {
  const { t, i18n } = useTranslation("footer");
  const { setLanguage } = useLanguage();
  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिंदी" },
    { code: "as", name: "অসমীয়া" },
    { code: "bn", name: "বাংলা" },
    { code: "gu", name: "ગુજરાતી" },
    { code: "kn", name: "ಕನ್ನಡ" },
    { code: "mai", name: "मैथिली" },
    { code: "ml", name: "മലയാളം" },
    { code: "mr", name: "मराठी" },
    { code: "or", name: "ଓଡ଼ିଆ" },
    { code: "pa", name: "ਪੰਜਾਬੀ" },
    { code: "ta", name: "தமிழ்" },
    { code: "te", name: "తెలుగు" },
    { code: "ur", name: "اردو" },
  ];

  const handleLanguageChange = async (newLanguage: Language) => {
    try {
      const response = await axios.post(
        `/api/get-language`,
        { language: newLanguage },
        {
          withCredentials: true,
          headers: {
            'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
          },
        }
      );
      if (response.data.success) {
        toast.success(t("language_update_success"));
        i18n.changeLanguage(newLanguage);
        setLanguage(newLanguage);
      }
    } catch (err) {
      toast.error(t("login_first"));
    }
  };

  return (
    <Box sx={{ padding: 4,paddingBottom:0, backgroundColor: "#E2E8F0" }}>
      <Grid container spacing={4} justifyContent="space-between">
        {/* Logo and Info Section */}
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img src={logo} alt={t("logo_alt")} className="w-40" />
            <Typography variant="body2" sx={{ ml: 2 }}>
              {t("platform_description")}
            </Typography>
          </Box>
        </Grid>

        {/* Navigation Section */}
        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            {t("navigation_title")}
          </Typography>
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <Link href="/" color="inherit" variant="body2">
                {t("home")}
              </Link>
            </Grid>
            {/* <Grid item>
              <Link href="/about" color="inherit" variant="body2">
                {t("about_us")}
              </Link>
            </Grid> */}
            <Grid item>
              <Link href="/contact-us" color="inherit" variant="body2">
                {t("contact")}
              </Link>
            </Grid>
            <Grid item>
              <Link href="/marketplace" color="inherit" variant="body2">
                {t("marketplace")}
              </Link>
            </Grid>
          </Grid>
        </Grid>

        {/* Address Section */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6">{t("address_title")}</Typography>
          <Typography variant="body2" sx={{ marginTop: 2 }}>
            {t("address_line1")}
          </Typography>
        </Grid>

        {/* Social Media Section */}
        <Grid item xs={12} sm={6} md={2}>
          <Box>
            <Typography variant="h6" sx={{ marginBottom: 1 }}>
              {t("select_language")}
            </Typography>
            <Select
              value={i18n.language}
              onChange={(e) => {
                const newLanguage = e.target.value as Language;
                handleLanguageChange(newLanguage);
              }}
              displayEmpty
              sx={{ width: "100%", marginBottom: 2 }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 150, // Set the max height for the dropdown
                    overflowY: "auto", // Enable vertical scrolling
                  },
                },
              }}
            >
              {languages.map((language) => (
                <MenuItem key={language.code} value={language.code}>
                  {language.name}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box>
            <Typography variant="h6">{t("follow_us")}</Typography>
            <Box sx={{ display: "flex", justifyContent: "start" }}>
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
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;

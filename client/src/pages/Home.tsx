import useSWR from "swr";
import axios from "axios";
import Header from "../components/Header";
import ErrorPage from "./Error";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText, // Import Grid from MUI
} from "@mui/material";

import { MdEditDocument } from "react-icons/md";
import { FaHandshake } from "react-icons/fa6";
import { GrSecure } from "react-icons/gr";
import { IoLogoWechat } from "react-icons/io5";
import { FaBoltLightning } from "react-icons/fa6";
import { FaRobot } from "react-icons/fa";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";

interface Data {
  success: boolean;
  message: string;
  user?: {
    name: string;
    profileImage: string;
    id: Number;
  };
}
interface Feature {
  icon: string;
  title: string;
  content: string;
}

const iconComponents: { [key: string]: JSX.Element } = {
  MdEditDocument: <MdEditDocument />,
  FaHandshake: <FaHandshake />,
  GrSecure: <GrSecure />,
  IoLogoWechat: <IoLogoWechat />,
  FaBoltLightning: <FaBoltLightning />,
  FaRobot: <FaRobot />,
};

const fetcher = (url: string) =>
  axios
    .get(url, {
      withCredentials: true,
      headers: {
        'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
      },
    })
    .then((res) => res.data);

const Home: React.FC = () => {
  const { data, error } = useSWR<Data>(
    `/api/`,
    fetcher
  );
  const { t } = useTranslation("home");
  const isLoggedIn = data?.user ? true : false;

  const features = t("features.contents", { returnObjects: true }) as Feature[];
  const steps = t("howItWorks.steps", { returnObjects: true }) as string[];
  const videoUrl = import.meta.env.VITE_VIDEO_URL
  if (error) {
    return <ErrorPage />;
  }

  return (
    <div>
      <Header
        name={data?.user?.name}
        profileImage={data?.user?.profileImage}
        isLoggedIn={isLoggedIn}
        id={data?.user?.id}
      />
      <Paper>
        <Box>
          <video className="w-full object-cover" autoPlay loop muted>
            <source src="assets/video/Dashboard_bg.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>

        {/* Heading for Core Features */}
        <Box>
          <Box sx={{ padding: 3, textAlign: "center", marginTop: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {t("features.title")}
            </Typography>
          </Box>

          {/* Grid to display 6 cards */}
          <Box sx={{ padding: 5, paddingBottom: 10 }}>
            <Grid container spacing={3} justifyContent="center" wrap="wrap">
              {Array.isArray(features) &&
                features.map((feature, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card
                      sx={{
                        transition: "box-shadow 0.3s ease", // Smooth transition for shadow
                        "&:hover": {
                          boxShadow: 3, // Apply shadow on hover
                        },
                      }}
                    >
                      <CardContent>
                        <Stack direction="column" alignItems="center">
                          <Box sx={{ fontSize: 40 }}>
                            {iconComponents[feature.icon]}
                          </Box>
                          <Typography
                            variant="h6"
                            component="h2"
                            sx={{ mt: 2 }}
                          >
                            {feature.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ mt: 1, textAlign: "center" }}
                          >
                            {feature.content}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Box>
        </Box>

        <Box
          sx={{
            backgroundColor: (theme) => theme.palette.primary.main,
            paddingY: { xs: 6, sm: 8, md: 12 }, // Adjusts padding for different screen sizes
            paddingX: { xs: 4, sm: 6, md: 10 },
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            {t("howItWorks.title")}
          </Typography>
          <Typography
            variant="body1"
            sx={{ lineHeight: 1.7 }}
            className="text-slate-500"
          >
            {t("howItWorks.content")}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" }, // Column for small screens, row for medium and above
              gap: 4,
              alignItems: { md: "flex-start" }, // Align items properly on medium screens and above
            }}
          >
            {/* Steps Section */}
            <Box sx={{ flex: 1 }}>
              <List
                component="ol"
                sx={{
                  paddingLeft: 5,
                  listStyleType: "decimal", // Ensures numbering style is shown
                }}
              >
                {Array.isArray(steps) &&
                  steps.map((step, index) => (
                    <ListItem key={index} sx={{ display: "list-item" }}>
                      <ListItemText primary={step} />
                    </ListItem>
                  ))}
              </List>
            </Box>

            {/* Video Section */}
            <Box
              sx={{
                flex: 1,
                width: { xs: "100%", md: "50%" }, // Full width on small screens, 50% on medium and above
              }}
            >
              <a href={import.meta.env.VITE_YOUTUBE_URL} target="_blank">
                <video
                 controls
                  autoPlay
                  loop
                  muted
                  style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                >
                  <source
                    src={videoUrl}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </a>
            </Box>
          </Box>
        </Box>
        {/* <Box sx={{
            paddingY: 12,
            paddingX: 10,
          }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 2,textAlign:"center" }}>
            Success Stories
          </Typography> */}
        {/* <Grid container spacing={3} justifyContent="center" wrap="wrap">
              {successStories.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Stack direction="column" alignItems="center">
                        
                       
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid> */}
        {/* </Box> */}

        <Footer />
      </Paper>
    </div>
  );
};

export default Home;

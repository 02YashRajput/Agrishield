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
import DashboardVideo from "../assets/Dashboard_bg.mp4";
import { MdEditDocument } from "react-icons/md";
import { FaHandshake } from "react-icons/fa6";
import { GrSecure } from "react-icons/gr";
import { IoLogoWechat } from "react-icons/io5";
import { FaBoltLightning } from "react-icons/fa6";
import { FaRobot } from "react-icons/fa";
import Footer from "../components/Footer";

interface Data {
  success: boolean;
  message: string;
  user?: {
    name: string;
    profileImage :string;
  };
}

const features = [
  {
    icon: <MdEditDocument />,
    title: "Contract Management",
    content:
      "Negotiate, draft, and finalize farming contracts digitally. Manage quantity, quality, delivery schedules, and payment terms all in one place.",
  },
  {
    icon: <FaHandshake />,
    title: "Price Negotiation",
    content:
      "Use our dynamic price negotiation tool to agree on fair prices. Leverage real-time market data and demand forecasts for optimal pricing.",
  },
  {
    icon: <GrSecure />,
    title: "Secure Payments",
    content:
      "Ensure timely and secure payments with our integrated payment gateways and escrow services, protecting both farmers and buyers.",
  },
  {
    icon: <IoLogoWechat />,
    title: "Communication Channel",
    content:
      "Stay connected with integrated chat. Ensure transparent and efficient communication between farmers and buyers.",
  },
  {
    icon: <FaBoltLightning />,
    title: "Real-Time Updates",
    content:
      "Get real-time updates on market trends, weather forecasts, and other vital farming information to stay ahead of the curve.",
  },
  {
    icon: <FaRobot />,
    title: "AI-Powered Insights",
    content:
      "Leverage AI to analyze data and receive personalized insights for your farming practices and contract negotiations.",
  },
];



const fetcher = (url: string) =>
  axios
    .get(url, {
      withCredentials: true,
    })
    .then((res) => res.data);


const Home: React.FC = () => {
  const { data, error } = useSWR<Data>(`/api/`, fetcher);

  const isLoggedIn = data?.user  ? true : false;

  if (error) {
    return <ErrorPage />;
  }

  console.log({data,  isLoggedIn})
  return (
    <div>
      <Header name={data?.user?.name} profileImage= {data?.user?.profileImage} isLoggedIn = {isLoggedIn} />
      <Paper>
        <Box>
          <video className="w-full object-cover" autoPlay loop muted>
            <source src={DashboardVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>

        {/* Heading for Core Features */}
        <Box>
          <Box sx={{ padding: 3, textAlign: "center", marginTop: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Our Core Features
            </Typography>
          </Box>

          {/* Grid to display 6 cards */}
          <Box sx={{ padding: 5, paddingBottom: 10 }}>
            <Grid container spacing={3} justifyContent="center" wrap="wrap">
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Stack direction="column" alignItems="center">
                        <Box sx={{ fontSize: 40 }}>{feature.icon}</Box>
                        <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
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
            How It Works
          </Typography>
          <Typography
            variant="body1"
            sx={{ lineHeight: 1.7 }}
            className="text-slate-500"
          >
            AgriConnect simplifies the contract farming process, providing a
            seamless experience from
             contract negotiation to harvest delivery.
          </Typography>
          <List
            component="ol"
            sx={{
              paddingLeft: 3,
              listStyleType: "decimal", // This ensures the numbering is shown
            }}
          >
            <ListItem>
              <ListItemText primary="1. Create your farmer or buyer Account." />
            </ListItem>
            <ListItem>
              <ListItemText primary="2. Complete your profile." />
            </ListItem>
            <ListItem>
              <ListItemText primary="3. Browse or list farming opportunities in Market Place" />
            </ListItem>
            <ListItem>
              <ListItemText primary="4. Negotiate terms and finalize contracts." />
            </ListItem>
            <ListItem>
              <ListItemText primary="5. Manage production and track progress." />
            </ListItem>
            <ListItem>
              <ListItemText primary="6. Securely process payments upon deliver" />
            </ListItem>
          </List>
        </Box>
        <Box sx={{
            paddingY: 12,
            paddingX: 10,
          }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 2,textAlign:"center" }}>
            Success Stories
          </Typography>
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
        </Box>


          <Footer/>


      </Paper>
    </div>
  );
};

export default Home;

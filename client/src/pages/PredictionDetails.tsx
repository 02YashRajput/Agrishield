import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import Header from "../components/Header";
import NotFound from "./NotFound";
import ErrorPage from "./Error";
import useSWR from "swr";
import axios from "axios";

// Register necessary Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface Data {
  success: boolean;
  message: string;
  user?: {
    name: string;
    profileImage: string;
    id: Number;
    userType: string;
  };
  data?: {
    state: string;
    district: string;
    predictions: number[];
    imgSrc: string;
  };
}

const fetcher = (url: string) =>
  axios.get(url, { withCredentials: true,headers: {
    'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
  }, }).then((res) => res.data);

const PredictionDetails: React.FC = () => {
  const { crop } = useParams();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const State = params.get("state");
  const District = params.get("district");
  const [state, setState] = useState(State || "");
  const [district, setDistrict] = useState(District || "");

  const { data, error, isLoading } = useSWR<Data>(
    `/api/price-predictor/${crop}?state=${state}&district=${district}`,
    fetcher
  );

  const isLoggedIn = Boolean(data?.user);

  useEffect(() => {
    if (data?.data) {
      setState(data.data.state);
      setDistrict(data.data.district);
    }
  }, [data]);

  useEffect(() => {
    if(State === "" || District === "" ){
   
    const newUrl = `/price-predictor/${crop}?state=${state}&district=${district}`;
    window.history.pushState({}, "", newUrl);
    }
  }, [state, district]);

  if (error) {
    if (error.status === 404) {
      return <NotFound />;
    } else {
      return <ErrorPage />;
    }
  }

  // Calculate the next 12 months starting from the next month
  const currentMonth = new Date().getMonth();
  const labels = Array.from(
    { length: data?.data?.predictions.length || 0 },
    (_, i) => monthNames[(currentMonth + i + 1) % 12]
  );

  const chartData = {
    labels, // Dynamically generated month labels
    datasets: [
      {
        label: "Predicted Prices",
        data: data?.data?.predictions,
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  return (
    <div>
      <Header
        name={data?.user?.name}
        profileImage={data?.user?.profileImage}
        isLoggedIn={isLoggedIn}
        id={data?.user?.id}
      />
      <Paper sx={{ backgroundColor: "#f7f7f7" }} className="min-h-screen p-8">
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <Card
              sx={{ borderRadius: 5 }}
              className="max-w-4xl mx-auto bg-white md:p-8 py-8 "
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", marginLeft: 2 }}
              >
                {crop && decodeURIComponent(crop)}
              </Typography>

              <CardContent>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  justifyContent="center"
                  direction={{ xs: "column", md: "row-reverse" }}
                >
                  <Grid item xs={12} md={6}>
                    <img
                      src={data?.data?.imgSrc}
                      alt="Crop"
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "8px",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        minHeight: "300px",
                      }}
                    >
                      <Line
                        data={chartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: true,
                              position: "top",
                            },
                          },
                        }}
                        height={400}
                      />
                    </div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card
  sx={{ borderRadius: 5 }}
  className="max-w-4xl mx-auto bg-white p-8 mt-5"
>
  <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
    Predicted Prices
  </Typography>
  <CardContent>
    <Grid container spacing={2}>
      {data?.data?.predictions.map((price, index) => {
       
        const monthIndex = (new Date().getMonth() + index + 1) % 12;
        const monthName = new Date(0, monthIndex).toLocaleString("default", {
          month: "long",
        });

        return (
          <Grid item xs={12} key={index}>
            <Card sx={{ padding: 2, borderRadius: 3, width: "100%" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {monthName}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Predicted Price: ₹{price.toFixed(2)}
              </Typography>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  </CardContent>
</Card>

          </>
        )}
      </Paper>
    </div>
  );
};

export default PredictionDetails;

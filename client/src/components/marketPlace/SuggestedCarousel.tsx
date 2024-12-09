import React from "react";
import Slider from "react-slick";
import { Card, Typography, Box, Avatar } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Define the TypeScript interface for the crop
interface SuggestedCrop {
  marketPlaceId: number;
  buyerName: string;
  buyerProfileImage: string;
  buyerProfileLink: string;
  productName: string;
  additionalInstructions: string;
  productQuantity: string;
  deadline: Date;
  initialPaymentAmount: string;
  finalPaymentAmount: string;
  productImage: string;
}

interface SuggestedCropsCarouselProps {
  suggestedCrops: SuggestedCrop[];
}

const SuggestedCropsCarousel: React.FC<SuggestedCropsCarouselProps> = ({
  suggestedCrops,
}) => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    cssEase: "linear",
    arrows: false, // Disable navigation arrows
    slidesToShow: 3, // Default to 3 slides on larger screens
    responsive: [
      {
        breakpoint: 1024, // For tablets and screens smaller than 1024px
        settings: {
          slidesToShow: 2, // Show 2 slides
        },
      },
      {
        breakpoint: 768, // For mobile screens
        settings: {
          slidesToShow: 1, // Show 1 slide
        },
      },
    ],
  };

  return (
    <Card sx={{ borderRadius: 5, maxHeight: 400 }} className="max-w-4xl mx-auto bg-white p-4">
      <Typography variant="h5" gutterBottom sx={{ mb: 2, textAlign: "center" }}>
        Suggested Crops
      </Typography>
      <Slider {...settings}>
        {suggestedCrops.map((crop) => (
          <Box
            key={crop.marketPlaceId}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
              textAlign: "center",
              height: "300px",
              overflow: "hidden",
            }}
          >
            <div className="flex items-center">
              <Avatar
                src={crop.buyerProfileImage || "/assets/img/defaultProfile.jpg"}
                alt={crop.buyerName}
                sx={{ width: 60, height: 60, mb: 1 }}
              />
              <Typography variant="h6" sx={{ mb: 1, fontSize: "1rem" }}>
                {crop.buyerName}
              </Typography>
            </div>
            <img
              src={crop.productImage}
              alt={crop.productName}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "120px", 
                margin: "10px 0",
                objectFit: "cover",
              }}
              className="carousel-image"
            />
            <Typography variant="body2" sx={{ mb: 1, fontSize: "0.875rem" }}>
              {crop.productName}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              {crop.additionalInstructions}
            </Typography>
          </Box>
        ))}
      </Slider>

      <style>
        {`
          @media (max-width: 768px) {
            .carousel-image {
              max-height: 180px !important; 
            }
          }
        `}
      </style>
    </Card>
  );
};

export default SuggestedCropsCarousel;

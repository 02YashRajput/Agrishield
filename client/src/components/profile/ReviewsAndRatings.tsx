import React, { useState } from "react";
import { Data } from "../../pages/Profile";
import {
  Box,
  Button,
  Card,
  CardContent,
  Rating,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { TiPlus } from "react-icons/ti";
import { IoMdClose } from "react-icons/io";
import toast from "react-hot-toast";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from "react-i18next";


interface ReviewsAndRatingsProps {
  profileData: Data["profileData"];
  setProfileData: React.Dispatch<
    React.SetStateAction<Data["profileData"] | null>
  >;
}



// Sort reviews by createdAt in descending order


const ReviewsAndRatings: React.FC<ReviewsAndRatingsProps> = ({
  profileData,
  setProfileData,
}) => {
  const [open, setOpen] = useState(false); // Dialog open state
  const [newReview, setNewReview] = useState({ rating: 0, message: "" }); // New review state

  if (!profileData) {
    return null;
  }

  const { t } = useTranslation(["reviewsAndRating", "crops"]);
  const sortedReviews = profileData.reviews.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleDialogOpen = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);
  const location = useLocation(); // Get the location object
  const id = location.pathname.split('/').pop(); 

  const handleReviewSubmit = async () => {
    if (newReview.message.trim() && newReview.rating > 0) {
      try {
        const response = await axios.post(`/api/profile/add-review/${id}`, {
          rating: newReview.rating,
          message: newReview.message,
        },{
          withCredentials: true,
          headers: {
            'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
          },
        });
  
        if (response.status === 200) {
          const updatedReviews = [
            { ...newReview, createdAt: new Date() },
            ...profileData.reviews,
          ];
  
          // Sort reviews by `createdAt` in descending order
          updatedReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
          // Calculate the new average rating
          const totalRatings = updatedReviews.reduce((sum, review) => sum + review.rating, 0);
          const avgRating = totalRatings / updatedReviews.length;
  
          // Update the profile data state with the new reviews and average rating
          setProfileData({
            ...profileData,
            reviews: updatedReviews,
            rating: avgRating, // Update the rating with the calculated average
          });
  
          // Reset the form
          setNewReview({ rating: 0, message: '' });
          handleDialogClose();
          toast.success('Review submitted successfully!');
        } else {
          toast.error('Failed to submit the review.');
        }
      } catch (error) {
        console.error('Error submitting review:', error);
        toast.error('An error occurred while submitting the review.');
      }
    } else {
      toast.error('Please fill the review.');
    }
  };
  
  

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "left",
          justifyContent: { xs: "flex-start", sm: "space-between" },
          gap: 3,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        {t("riviewandrating")}
        </Typography>
        {!profileData.email && (
          <Button
            variant="contained"
            startIcon={<TiPlus />}
            onClick={handleDialogOpen}
          >
             {t("addreview")}
          </Button>
        )}
      </Box>
      <Box
        className="mt-5"
        sx={{
          display: "grid",
          gap: 2, // Space between grid items
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, // 1 column for xs, 2 columns for md and up
        }}
      >
        {sortedReviews.map((review, index) => (
          <Card
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <CardContent>
              <Rating defaultValue={review.rating} precision={0.5} readOnly />
              <Typography variant="body1">{review.message}</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ textAlign: "end" }}>
  {new Date(review.createdAt).toLocaleDateString()}
</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Dialog for Adding a Review */}
      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h6">Add a Review</Typography>
            <Typography variant="body1">
            {t("share your experience")} {profileData?.userType}
            </Typography>
          </Box>
          <Button
            color="secondary"
            onClick={handleDialogClose}
            sx={{
              minWidth: "auto",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <IoMdClose size={24} />
          </Button>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Rating
              value={newReview.rating}
              onChange={(_, newValue) =>
                setNewReview((prev) => ({ ...prev, rating: newValue || 0 }))
              }
              precision={0.5}
            />
            <TextField
              color="secondary"
              label="Message"
              multiline
              rows={4}
              value={newReview.message}
              onChange={(e) =>
                setNewReview((prev) => ({ ...prev, message: e.target.value }))
              }
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReviewSubmit} color="primary" variant="contained">
          {t("submit")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReviewsAndRatings;

import React, { useState } from 'react';
import { ProductName } from '../../utils/cropsName';
import { Avatar, Box, Card, CardContent, Grid, Typography, Modal, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { FaRupeeSign } from "react-icons/fa";
interface ListedContractsProps {
  results: {
    marketPlaceId: number;
    buyerName: string;
    buyerProfileImage: string;
    buyerProfileLink: string;
    productName: ProductName;
    additionalInstructions: string;
    productQuantity: string;
    deadline: Date;
    initialPaymentAmount: string;
    finalPaymentAmount: string;
    productImage: string;
  }[];
  userType:string;
}

const ListedContracts: React.FC<ListedContractsProps> = ({ results,userType }) => {
  const [selectedContract, setSelectedContract] = useState<typeof results[0] | null>(null);

  const handleCloseModal = () => setSelectedContract(null);

  return (
    <>
     
        <Grid container spacing={2}>
          {results.map((result) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              key={result.marketPlaceId}
              onClick={() => setSelectedContract(result)} // Open modal on card click
            >
              <Card sx={{ cursor: "pointer" }}>
                <CardContent sx={{ padding: 1, height: '100%' }}>
                  <Box sx={{ display: 'flex' ,flexDirection:{
                    xs: 'column',
                    sm: 'row'
                  },gap:1, height: '100%' }}>
                    {/* Image Section */}
                    <Box sx={{ width: {
                      xs: '100%',
                      sm: '50%',
                      
                    }, height: '100%' }}>
                      <img 
                        src={result.productImage} 
                        alt={result.productName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                    {/* Content Section */}
                    <Box sx={{ width: {
                      xs: '100%',
                      sm: '50%',
                      
                    }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Link to={result.buyerProfileLink} className='hover:bg-[#f7f7f7] rounded-sm pl-2'>
                        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                          <Avatar src={result.buyerProfileImage || "/assets/img/defaultProfile.jpg"} alt={result.buyerName} />
                          <Typography variant="h6" sx={{ fontWeight: '500' }}>
                            {result.buyerName}
                          </Typography>
                        </Box>
                      </Link>
                      <Box>
                        <Typography variant='body1'>
                          <strong>Buyer Name:</strong> {result.buyerName}
                        </Typography>
                        <Typography variant='body1'>
                          <strong>Product Name:</strong> {result.productName}
                        </Typography>
                        <Typography variant='body1'>
                          <strong>Quantity:</strong> {result.productQuantity}
                        </Typography>
                        <Typography variant='body1' className='flex items-center'>
                          <strong>Total Amount:</strong>
                         
                            <FaRupeeSign/> {parseInt(result.initialPaymentAmount) + parseInt(result.finalPaymentAmount)}
                        </Typography>
                        <Typography variant='body1'>
                          <strong>Deadline:</strong> {new Date(result.deadline).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
  

      {/* Modal */}
      <Modal
      open={!!selectedContract}
      onClose={handleCloseModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%", // Responsive width
          maxWidth: "768px", // Equivalent to 3xl
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          overflow: "hidden", // Ensures content doesn't overflow
        }}
      >
        {selectedContract && (
          <>
            {/* Image Section */}
            <Box sx={{ width: "100%", height: 200 }}>
              <img
                src={selectedContract.productImage}
                alt={selectedContract.productName}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>

            {/* Details Section */}
            <Box sx={{ p: 4 }}>
              <Typography id="modal-title" variant="h5" component="h2" sx={{ fontWeight: "bold", mb: 2 }}>
                {selectedContract.productName}
              </Typography>
              <Typography id="modal-description" variant="body1" sx={{ mb: 1 }}>
                <strong>Buyer Name:</strong> {selectedContract.buyerName}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Quantity:</strong> {selectedContract.productQuantity}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }} className="flex items-center">
                <strong>Initial Payment Amount:</strong> <FaRupeeSign /> {selectedContract.initialPaymentAmount}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }} className="flex items-center">
                <strong>Final Payment Amount:</strong> <FaRupeeSign /> {selectedContract.finalPaymentAmount}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }} className="flex items-center">
                <strong>Total Payment Amount:</strong> <FaRupeeSign />{" "}
                {parseInt(selectedContract.initialPaymentAmount) + parseInt(selectedContract.finalPaymentAmount)}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Deadline:</strong> {new Date(selectedContract.deadline).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Instructions:</strong> {selectedContract.additionalInstructions}
              </Typography>

              {/* Buyer Profile Link */}
              <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar
                  src={selectedContract.buyerProfileImage || "/assets/img/defaultProfile.jpg"}
                  alt={selectedContract.buyerName}
                />
                <Link to={selectedContract.buyerProfileLink} style={{ textDecoration: "none" }}>
                  <Typography variant="body1" color="secondary">
                    View Buyer Profile
                  </Typography>
                </Link>
              </Box>

{userType === "Farmer"
             &&
              <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mr: 1 }}
                  onClick={() => {}} 
                >
                  Request to Activate
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={() => {}}
                >
                  Negotiate
                </Button>
              </Box>
}

            </Box>
          </>
        )}
      </Box>
    </Modal>

    </>
  );
};

export default ListedContracts;

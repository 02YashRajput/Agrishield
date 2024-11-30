import React from "react";
import { ProductName } from "../../utils/cropsName";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

interface TableComponentProps {
  contracts: {
    contractId: number;
    contractStatus: "Requested" | "Ongoing" | "Completed";
    farmerName: string;
    buyerName: string;
    initialpaymentStatus: "Pending" | "Paid" | "Received";
    finalpaymentStatus: "Pending" | "Paid" | "Received";
    deliveryStatus: "Pending" | "Delivered" | "Received";
    deadline: Date;
    initialPaymentAmount: string;
    finalPaymentAmount: string;
    productName: string;
    productImage: string;
    buyerProfileImage: string;
    buyerProfileLink: string;
    farmerProfileImage: string;
    farmerProfileLink: string;
    productQuantity: string;
    transactions: {
      transactionId: number;
      details: string;
      amount: string;
      date: Date;
    }[];
  }[];
}

const TableComponent: React.FC<TableComponentProps> = ({ contracts }) => {
  return (
    <TableContainer
      component={Paper}
      sx={{ maxHeight: 500, overflow: "auto", mt: 2 }}
    >
      <Table stickyHeader aria-label="contract table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="h6" sx={{fontSize:15 , fontWeight:600}}>Farmer</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" sx={{fontSize:15 , fontWeight:600}}>Buyer</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" sx={{fontSize:15 , fontWeight:600}}>Initial Payment</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" sx={{fontSize:15 , fontWeight:600}}>Final Payment</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" sx={{fontSize:15 , fontWeight:600}}>Delivery Status</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" sx={{fontSize:15 , fontWeight:600}}>Deadline</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" sx={{fontSize:15 , fontWeight:600}}>Product</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contracts.map((contract) => (
            <TableRow
              key={contract.contractId}
              component={Link} // This makes the row a link
              to={`/contracts/${contract.contractId}`} // Link to the contract details
              sx={{ textDecoration: "none", color: "inherit" }} // Style to ensure no underlines or color changes
              hover // Keeps the hover effect on the row
            >
              <TableCell>{contract.farmerName}</TableCell>
              <TableCell>{contract.buyerName}</TableCell>
              <TableCell>{contract.initialpaymentStatus}</TableCell>
              <TableCell>{contract.finalpaymentStatus}</TableCell>
              <TableCell>{contract.deliveryStatus}</TableCell>
              <TableCell>
                {new Date(contract.deadline).toLocaleDateString()}
              </TableCell>
              <TableCell>{contract.productName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;

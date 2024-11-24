import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react'
interface TransactionProps {
  transactions :{
    transactionId: number;
    details: string;
    amount: number;
    date: Date;
  }[]
 
}

const TransactionTable :React.FC<TransactionProps>= ({transactions}) => {
  return (
    <div>
    <Typography variant="h4" gutterBottom>
      Transaction Table
    </Typography>
    <TableContainer >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Transaction ID</strong></TableCell>
            <TableCell><strong>Details</strong></TableCell>
            <TableCell><strong>Amount</strong></TableCell>
            <TableCell><strong>Date</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.transactionId}>
              <TableCell>{transaction.transactionId}</TableCell>
              <TableCell>{transaction.details}</TableCell>
              <TableCell>{transaction.amount}</TableCell>
              <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
  )
}

export default TransactionTable
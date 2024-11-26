import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

interface Transaction {
  transactionId: string;
  details: string;
  amount: number;
  date: string; // ISO string format
}

interface TransactionsTableProps {
  contractId: number;
  transactions: Transaction[];
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ contractId, transactions }) => {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <Typography variant="h5" gutterBottom>
        <Link to ={`/contracts/${contractId}`}>
        Contract ID: {contractId}
        </Link>
      </Typography>
      <TableContainer>
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
                <TableCell>
                  {new Date(transaction.date).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TransactionsTable;

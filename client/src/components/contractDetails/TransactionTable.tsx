import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react'
import { useTranslation } from 'react-i18next';
interface TransactionProps {
  transactions :{
    transactionId: number;
    details: string;
    amount: number;
    date: Date;
  }[]
 
}

const TransactionTable :React.FC<TransactionProps>= ({transactions}) => {
  const {t} = useTranslation("transactiontable")
  return (
    <div>
    <Typography variant="h4" gutterBottom>
      {t("Transaction Table")}
    </Typography>
    <TableContainer >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>{t("Transaction ID")}</strong></TableCell>
            <TableCell><strong>{t("Details")}</strong></TableCell>
            <TableCell><strong>{t("Amount")}</strong></TableCell>
            <TableCell><strong>{t("Date")}</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.transactionId}>
              <TableCell>{transaction.transactionId}</TableCell>
              <TableCell>{t(transaction.details)}</TableCell>
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
import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

interface ContractPdfProps {
  data: {
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
    transactions :{
      transactionId: number;
      details: string;
      amount: number;
      date: Date;
    }[]
  };
}
const ContractPdf :React.FC<ContractPdfProps>= () => {
  return (
    <Document>
      <Page>
       <View>
        <Text>
          Hello
        </Text>
       </View>
      </Page>
    </Document>
  )
}

export default ContractPdf
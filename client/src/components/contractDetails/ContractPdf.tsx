import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  // Image,
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
    createdAt: Date;
    transactions :{
      transactionId: number;
      details: string;
      amount: number;
      date: Date;
    }[]
  };
}



const ContractDocument: React.FC<ContractPdfProps> = () => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <Text style={styles.header}>Outgrower Contract Farming Agreement</Text>
          <Text style={styles.paragraph}>
            This CONTRACT is made and entered into on ____________ day of ___________ 202…
          </Text>

          <Text style={styles.subHeader}>Between</Text>
          <Text style={styles.paragraph}>
            ……………..Company (herein referred to as “Buyer”), located at ………………… district,
          </Text>
          <Text style={styles.paragraph}>
            …………………sector, ………………. cell, ……………, village, TIN number ………… and represented by
            Ms/Mrs/Mr. ……… on the one hand
          </Text>
          <Text style={styles.paragraph}>And</Text>
          <Text style={styles.paragraph}>
            ……… (herein referred to as “Farmer/Producer”), located at …….. district, ……. sector,
            ……cell, ……., village….., ID number ………… (full address) and represented by Ms/Mrs/Mr.,
            …………. on the other hand
          </Text>

          <Text style={styles.subHeader}>Whereas</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>
              • The buyer is willing to purchase the produce from the farmer as agreed upon this
              contract and export the produce to……….(export destination).
            </Text>
            <Text style={styles.listItem}>
              • The Farmer accepts and undertakes to grow produce for The Buyer as per agreed in
              this agreement.
            </Text>
          </View>

          <Text style={styles.subHeader}>Article 1: The Producer and the Buyer Warrants That</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>
              • Have read this Agreement or had this Agreement read to him/her by an independent
              third party before signature.
            </Text>
            <Text style={styles.listItem}>
              • The Producer and the buyer has had the opportunity to seek the advice of [an
              independent legal advisor]/[a producer organisation] on this Agreement before
              signature.
            </Text>
          </View>

          <Text style={styles.subHeader}>Article 2: The Purpose</Text>
          <Text style={styles.paragraph}>
            The main purpose of this contract is for ……(product) …..production/purchase and sell
            between Farmer and Buyer.
          </Text>

          <Text style={styles.subHeader}>Article 3: Buyer Responsibility</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>
              • The buyer provides to the farmer the market requirements (variety, quality, size,
              quantity, color, and any other market requirements) before starting production.
            </Text>
            <Text style={styles.listItem}>
              • The Buyer agrees to buy chili production (“the produce”) produced by the Farmer, and
              which fulfils the agreed conditions in this agreement.
            </Text>
          </View>

          <View style={styles.signatureSection}>
            <View style={styles.signatureBlock}>
              <Text>Buyer</Text>
              <View style={styles.signatureLine}></View>
              <Text>Date: ___________</Text>
            </View>
            <View style={styles.signatureBlock}>
              <Text>Farmer/Producer</Text>
              <View style={styles.signatureLine}></View>
              <Text>Date: ___________</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Times-Roman",
    fontSize: 12,
    lineHeight: 1.6,
  },
  container: {
    padding: 0,
    // border: "1px solid #000",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 14,
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  paragraph: {
    marginBottom: 10,
    textAlign: "justify",
  },
  list: {
    marginBottom: 10,
    paddingLeft: 20,
  },
  listItem: {
    marginBottom: 5,
  },
  signatureSection: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBlock: {
    textAlign: "center",
    width: "45%",
  },
  signatureLine: {
    borderBottom: "1px solid #000",
    marginVertical: 10,
  },
});

export default ContractDocument;
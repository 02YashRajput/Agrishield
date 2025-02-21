import React from 'react'
import logo from "../../assets/AgriShieldTransparent.png";
import stamp from "../../assets/stamp.png";
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
    productVariety: string;
    createdAt: Date;
    transactions: {
      transactionId: number;
      details: string;
      amount: number;
      date: Date;

    }[]
  };
}



const ContractDocument: React.FC<ContractPdfProps> = ({ data }) => {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <Image src={logo} style={styles.logo} />
              <Text style={styles.header}>Contract Farming Agreement</Text>
            </View>
  
            <Text style={styles.paragraph}>
              This CONTRACT is made and entered into on {new Date(data?.createdAt).toLocaleDateString("en-GB")}.
            </Text>
  
            <Text style={styles.subHeader}>Between</Text>
            <Text style={styles.topparagraph}>
              "{data?.buyerName || "[Buyer Name]"}" Company (herein referred to as “Buyer”.)
            </Text>
  
            <Text style={styles.subHeader}>&</Text>
            <Text style={styles.topparagraph}>
              "{data?.farmerName || "[Farmer Name]"}" (herein referred to as “Farmer/Producer”.)
            </Text>
  
            <Text style={styles.subHeader}>Whereas</Text>
            <View style={styles.list}>
              <Text style={styles.listItem}>
                • The buyer is willing to purchase the produce from the farmer as agreed upon this
                contract.
              </Text>
              <Text style={styles.listItem}>
                • The Farmer accepts and undertakes to grow produce for The Buyer as per agreed in
                this agreement.
              </Text>
            </View>
  
            <Text style={styles.topHeader}>
              AGREEMENT TERMS AND CONDITIONS FOR CONTRACT FARMING
            </Text>
            <View style={styles.list}>
              <Text style={styles.subHeader}>1. Purpose of the Agreement</Text>
              <Text style={styles.listItem}>
                • The purpose of this Agreement is to establish the terms and conditions under which the Farmer will cultivate and supply the agreed-upon crop {data?.productName || "[Product Name]"} to the Buyer.
              </Text>
  
              <Text style={styles.subHeader}>2. Duration of Agreement</Text>
              <Text style={styles.listItem}>
                • This Agreement shall commence on {new Date(data?.createdAt).toLocaleDateString("en-GB")} and remain in effect until {new Date(data?.deadline).toLocaleDateString("en-GB")}, unless terminated earlier in accordance with Section 12 of this Agreement.
              </Text>
  
              <Text style={styles.subHeader}>3. Description of Crop and Quantity</Text>
              <Text style={styles.listItem}>
                Crop: {data?.productName || "[Product Name]"}
                {'\n'}Variety: {data?.productVariety || "[Variety]"}
                {'\n'}Quantity: {data?.productQuantity || "[Quantity]"}
              </Text>
  
              <Text style={styles.subHeader}>4. Land Details</Text>
              <Text style={styles.listItem}>
                • The Farmer shall cultivate the Crop on Land in Acres/Hectares located at Farm Address.
                {'\n'}• The Farmer guarantees that the land is suitable for cultivating the specified Crop and free from legal disputes.
              </Text>
  
              <Text style={styles.subHeader}>5. Farming Practices</Text>
              <Text style={styles.listItem}>
                • The Farmer agrees to follow good agricultural practices (GAP) and adhere to the standards set by the Buyer.
                {'\n'}• The Buyer may provide technical guidance and inputs (e.g., seeds, fertilizers) as per mutual agreement.
              </Text>
  
              <Text style={styles.subHeader}>6. Input Supply</Text>
              <Text style={styles.listItem}>
                • The Buyer shall provide the necessary inputs.
                {'\n'}• The cost of inputs shall be borne by Buyer/Borne by Farmer/Shared, specify proportion.
              </Text>
  
              <Text style={styles.subHeader}>7. Quality Standards</Text>
              <Text style={styles.listItem}>
                • The Farmer agrees to deliver the Crop meeting the quality standards specified in Annexure A of this Agreement.
                {'\n'}• Any deviation from these standards may result in rejection or renegotiation of the price.
              </Text>
  
              <Text style={styles.subHeader}>8. Pricing and Payment Terms</Text>
              <Text style={styles.listItem}>
                • Price: The agreed price for the Crop shall be Price per Unit in Local Currency.
                {'\n'}• Initial Payment: The Buyer agrees to provide an initial payment of {data?.initialPaymentAmount || "[Initial Payment Amount]"} of Total Amount to the Farmer at the time of contract signing. This amount shall be adjusted against the final payment.
                {'\n'}• Payment Terms: Payment shall be made online within 2 days of delivery.
                {'\n'}• Delay in Payment: If the Buyer delays payment beyond the agreed deadline, an interest rate of 8% per month shall be added to the outstanding amount.
              </Text>
  
              <Text style={styles.subHeader}>9. Delivery Terms</Text>
              <Text style={styles.listItem}>
                • The Farmer shall deliver the Crop to Delivery Location on or before {new Date(data?.deadline).toLocaleDateString("en-GB")}.
                {'\n'}• The Buyer shall bear the transportation costs unless otherwise agreed.
              </Text>
  
              <Text style={styles.subHeader}>10. Inspection and Acceptance</Text>
              <Text style={styles.listItem}>
                • The Buyer has the right to inspect the Crop upon delivery.
                {'\n'}• Acceptance of the Crop shall be subject to conformity with the agreed quality standards.
              </Text>
  
              <Text style={styles.subHeader}>11. Risk and Ownership</Text>
              <Text style={styles.listItem}>
                • Risk of loss or damage to the Crop remains with the Farmer until delivery and acceptance by the Buyer.
                {'\n'}• Ownership of the Crop transfers to the Buyer upon acceptance.
              </Text>
  
              <Text style={styles.subHeader}>12. Termination</Text>
              <Text style={styles.listItem}>
                • Either party may terminate this Agreement with 15 days written notice in case of breach of terms.
                {'\n'}• Termination shall not affect accrued rights or obligations.
              </Text>
  
              <Text style={styles.subHeader}>13. Dispute Resolution</Text>
              <Text style={styles.listItem}>
                • Any disputes arising out of this Agreement shall be resolved through mutual consultation.
                {'\n'}• If the parties fail to resolve the dispute, it shall be referred to arbitration in accordance with Article 12 of the applicable laws.
              </Text>
  
              <Text style={styles.subHeader}>14. Force Majeure</Text>
              <Text style={styles.listItem}>
                • Neither party shall be liable for failure to perform obligations due to events beyond their reasonable control (e.g., natural disasters, strikes).
                {'\n'}• Natural Calamities and Insurance: In case the Farmer is unable to fulfill the contract due to natural calamities, any insurance benefits provided shall be utilized to compensate the affected party. If the Crop is insured, the insurance claim process shall be initiated by AgriShield Party.
              </Text>
  
              <Text style={styles.subHeader}>15. Advance Payment Recovery</Text>
              <Text style={styles.listItem}>
                • If the Farmer is unable to fulfill the contract and the reason is not covered under force majeure, the advance payment received shall be returned to the Buyer within 5 days of termination of the contract.
              </Text>
  
              <Text style={styles.subHeader}>16. Confidentiality</Text>
              <Text style={styles.listItem}>
                • Both parties agree to maintain confidentiality regarding the terms of this Agreement and any proprietary information shared.
              </Text>
  
              <Text style={styles.subHeader}>17. Miscellaneous</Text>
              <Text style={styles.listItem}>
                • This Agreement represents the complete understanding between the parties, replacing and nullifying all previous agreements.
                {'\n'}• Amendments to this Agreement shall be in writing and signed by both parties.
                {'\n'}• IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.
              </Text>
            </View>
  
            <View style={styles.signatureSection}>
              <View style={styles.signatureBlock}>
                <Text>Buyer</Text>
                <Text>{ data.buyerName}</Text>
                <View style={styles.signatureLine}></View>
                <Text>Date: {new Date(data?.deadline).toLocaleDateString("en-GB")}</Text>
              </View>
              <View style={styles.signatureBlock}>
                <Text>Farmer/Producer</Text>
                <Text>{ data.farmerName}</Text>
                <View style={styles.signatureLine}></View>
                <Text>Date: {new Date(data?.deadline).toLocaleDateString("en-GB")}</Text>
                <Image source={stamp} style={[styles.logo, styles.estampImage]} />

       
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
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    logo: {
      width: 80,
      height: 80,
      marginRight: 20,
    },
    container: {
      padding: 0,
    },
    header: {
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 20,
    },
    subHeader: {
      fontSize: 16,
      marginTop: 5,
      marginBottom: 5,
      textAlign: "justify",
    },
    topHeader: {
      fontSize: 14,
      marginTop: 2,
      marginBottom: 2,
      textAlign: "justify",
    },
    topparagraph: {
      marginBottom: 5,
      textAlign: "justify",
    },
    paragraph: {
      fontSize: 12,
      marginTop: 5,
      marginBottom: 2,
      textAlign: "justify",
    },
    list: {
      marginBottom: 10,
      paddingLeft: 20,
    },
    listItem: {
      fontSize: 12, 
      marginTop: 5,
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
    estampImage: {
      width: 150, // Adjust width as needed
      height: 150, // Adjust height as needed
      marginTop: 10, // Space between the signature line and the estamp
      

    }
  });
  
  export default ContractDocument;
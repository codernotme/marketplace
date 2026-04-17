import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface LowStockAlertProps {
  productName: string;
  currentStock: number;
  threshold: number;
}

export const LowStockAlert = ({
  productName,
  currentStock,
  threshold,
}: LowStockAlertProps) => (
  <Html>
    <Head />
    <Preview>Low Stock Alert: {productName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Low Stock Alert</Heading>
        <Text style={text}>
          Internal notification for merchant inventory management.
        </Text>
        <Section style={alertBox}>
          <Text style={productNameStyle}>{productName}</Text>
          <Text style={stockInfo}>
            Current Stock: <span style={highlight}>{currentStock}</span>
          </Text>
          <Text style={stockInfo}>
            Threshold: {threshold}
          </Text>
        </Section>
        <Text style={text}>
          Please restock this item soon to avoid fulfillment delays.
        </Text>
        <Text style={footer}>
          This is an automated system alert from themrktplace.
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#fff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 0",
  width: "580px",
};

const h1 = {
  color: "#e11d48",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const text = {
  color: "#333",
  fontSize: "14px",
  lineHeight: "24px",
  textAlign: "center" as const,
};

const alertBox = {
  backgroundColor: "#fff1f2",
  borderRadius: "12px",
  border: "1px solid #fecdd3",
  margin: "24px 0",
  padding: "24px",
  textAlign: "center" as const,
};

const productNameStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#9f1239",
  margin: "0 0 8px",
};

const stockInfo = {
  fontSize: "14px",
  color: "#4b5563",
  margin: "4px 0",
};

const highlight = {
  color: "#e11d48",
  fontWeight: "bold",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  textAlign: "center" as const,
  marginTop: "40px",
};

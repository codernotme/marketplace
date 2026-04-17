import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  render,
} from "@react-email/components";
import * as React from "react";

interface OrderReceiptProps {
  orderNumber: string;
  customerName: string;
  total: number;
  items: Array<{ title: string; quantity: number; price: number }>;
}

export const OrderReceipt = ({
  orderNumber,
  customerName,
  total,
  items,
}: OrderReceiptProps) => (
  <Html>
    <Head />
    <Preview>Your receipt for order {orderNumber}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Receipt for {orderNumber}</Heading>
        <Text style={text}>Hi {customerName},</Text>
        <Text style={text}>Thank you for your purchase! Here is a summary of your order:</Text>
        <Section style={section}>
          {items.map((item, index) => (
            <div key={index} style={itemRow}>
              <Text style={itemTitle}>{item.title} x {item.quantity}</Text>
              <Text style={itemPrice}>₹{item.price.toFixed(2)}</Text>
            </div>
          ))}
          <Hr style={hr} />
          <div style={footerRow}>
            <Text style={totalLabel}>Total</Text>
            <Text style={totalValue}>₹{total.toFixed(2)}</Text>
          </div>
        </Section>
        <Text style={footer}>
          If you have any questions, please contact our support team.
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  textAlign: "center" as const,
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 40px",
};

const section = {
  padding: "20px 40px",
};

const itemRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "8px",
};

const itemTitle = {
  fontSize: "14px",
  margin: 0,
};

const itemPrice = {
  fontSize: "14px",
  fontWeight: "bold",
  margin: 0,
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footerRow = {
  display: "flex",
  justifyContent: "space-between",
};

const totalLabel = {
  fontSize: "16px",
  fontWeight: "bold",
  margin: 0,
};

const totalValue = {
  fontSize: "16px",
  fontWeight: "bold",
  margin: 0,
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "48px 40px 0",
  textAlign: "center" as const,
};

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WelcomeTenantProps {
  tenantName: string;
  loginUrl: string;
}

export const WelcomeTenant = ({
  tenantName,
  loginUrl,
}: WelcomeTenantProps) => (
  <Html>
    <Head />
    <Preview>Welcome to themrktplace, {tenantName}!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
           <Text style={logo}>M</Text>
        </Section>
        <Heading style={h1}>Welcome to the platform!</Heading>
        <Text style={text}>Hi {tenantName},</Text>
        <Text style={text}>
          We're excited to have you on board. Your multi-tenant environment is ready. 
          You can now start configuring your store, categories, and products.
        </Text>
        <Section style={btnSection}>
          <Button style={button} href={loginUrl}>
            Go to Tenant Admin
          </Button>
        </Section>
        <Text style={text}>
          If you need help getting started, check out our documentation or reply to this email.
        </Text>
        <Text style={footer}>
          © 2026 themrktplace Inc. The future of multi-tenant retail.
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
  padding: "40px 0 64px",
};

const logoSection = {
  padding: "0 40px",
  textAlign: "center" as const,
};

const logo = {
  fontSize: "32px",
  fontWeight: "bold",
  color: "#3b82f6",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  padding: "0 40px",
};

const btnSection = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#3b82f6",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  padding: "12px 24px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  textAlign: "center" as const,
  marginTop: "40px",
};

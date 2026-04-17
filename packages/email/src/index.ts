import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const email = {
  send: async (payload: {
    to: string | string[];
    subject: string;
    react: React.ReactElement;
    from?: string;
  }) => {
    try {
      const { data, error } = await resend.emails.send({
        from: payload.from || "themrktplace <notifications@themrktplace.io>",
        to: payload.to,
        subject: payload.subject,
        react: payload.react,
      });

      if (error) {
        console.error("Failed to send email:", error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (err) {
      console.error("Unexpected error sending email:", err);
      return { success: false, error: err };
    }
  },
};

export * from "./templates/order-receipt";
export * from "./templates/welcome-tenant";
export * from "./templates/low-stock-alert";

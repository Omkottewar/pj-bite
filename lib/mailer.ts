import nodemailer from "nodemailer";

export const sendOrderEmail = async ({ to, subject, html }: { to: string, subject: string, html: string }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASSWORD, 
      },
    });

    const mailOptions = {
      from: `"Fruit Bite" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Order email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Order email sending error:", error);
    return false;
  }
};

export const sendAuthEmail = async ({ to, subject, html }: { to: string, subject: string, html: string }) => {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY as string,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "Fruit Bite",
          email: process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@fruitbite.com"
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Brevo API error:", errorData);
      return false;
    }

    console.log("Auth email sent via Brevo");
    return true;
  } catch (error) {
    console.error("Auth email sending error:", error);
    return false;
  }
};

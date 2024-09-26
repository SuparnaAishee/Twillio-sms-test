// server.js
import express from "express";
import dotenv from "dotenv";
import twilio from "twilio";

// Load environment variables
dotenv.config();

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Route to send SMS
app.post("/send-sms", async (req, res) => {
  const { to, message } = req.body;

  // Validate request body
  if (!to || !message) {
    return res
      .status(400)
      .json({ error: "Phone number and message are required" });
  }

  try {
    // Send SMS using Twilio
    const smsResponse = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio number
      to: to, // The recipient's phone number
    });

    res
      .status(200)
      .json({ message: "SMS sent successfully", sid: smsResponse.sid });
  } catch (error) {
    console.error("Error sending SMS:", error);
    res.status(500).json({ error: "Failed to send SMS" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

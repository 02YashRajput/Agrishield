// // Import the Twilio module
// import twilio from "twilio";
// import dotenv from "dotenv";
// dotenv.config(); // Load environment variables from.env file

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;

// const client = twilio(accountSid, authToken);

// // Function to send SMS
// export const sendSms = async (to, body) => {
//   try {
//     const message = await client.messages.create({
//       body: body,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to: to,
//     });
//     console.log(`Message sent: ${message.sid}`);
//   } catch (error) {
//     console.error("Error sending message:", error);
//   }
// };

// export const sendCall = async (to,body) => {
//   try {
//     const call = await client.calls.create({
//       twiml:body,
//       to: to,
//       from: process.env.TWILIO_PHONE_NUMBER,
//     });
//     console.log(`Call started: ${call.sid}`);
//   } catch (error) {
//     console.error("Error making a call:", error);
//   }
// };

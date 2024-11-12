import nodemailer from 'nodemailer';
import 'dotenv/config'; 

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.AGRISHIELD_EMAIL,   
    pass: process.env.AGRISHIELD_EMAIL_PASSWORD,    
  },
});

export default transport;

import transport from "../config/transporter.mjs";

export const sendVerifcationEmail = (email, token)=>{

 const url = `${process.env.VERIFICATION_URL}/verify-email?token=${token}`;

  transport.sendMail({
    to :email,
    subject : "verify your email",
    html: `Please click <a href="${url}">here</a> to verify your email.`
  })


}
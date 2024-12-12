import transport from "../config/transporter.mjs";

export const sendVerifcationEmail = async(email, token)=>{

 const url = `${process.env.VERIFICATION_URL}/verify-email?token=${token}`;
 try {
  await transport.sendMail({
    to: email,
    subject: "Verify your email",
    html: `Please click <a href="${url}">here</a> to verify your email.`
  });
}
  catch (error) {
    console.error(`Error sending verification email: ${error.message}`);
  }


}

export const sendContractRequest = (email,url)=>{
  transport.sendMail({
    to : email,
    subject : "New Contract Request",
    html: `You have a new contract request. Please click <a href="${url}">here</a> to view it.`
  })
}

export const acceptContractRequest = (email,url)=>{
  transport.sendMail({
    to : email,
    subject : "Contract Accepted",
    html: `Your contract request has been accepted. Please click <a href="${url}">here</a> to view the contract details.`
  })
}

export const rejectContractRequest = (email)=>{
  transport.sendMail({
    to : email,
    subject : "Contract Request Rejected",
    html: `Your contract request has been rejected`
  })
}

export const updateEmail = (email)=>{
  transport.sendMail({
    to : email,
    subject : "Email Updated",
    html: `You contract status has been updated`
  })
}
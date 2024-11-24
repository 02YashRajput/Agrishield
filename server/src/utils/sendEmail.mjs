import transport from "../config/transporter.mjs";

export const sendVerifcationEmail = (email, token)=>{

 const url = `${process.env.VERIFICATION_URL}/verify-email?token=${token}`;

  transport.sendMail({
    to :email,
    subject : "verify your email",
    html: `Please click <a href="${url}">here</a> to verify your email.`
  })


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
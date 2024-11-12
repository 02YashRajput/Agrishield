import emailjs from 'emailjs-com';

interface SendContactUsEmailProps {
  to_name: string;
  to_email: string;
  from_email: string;
  from_name: string;
  message: string;
}

export const sendContactUsEmail = async (data: SendContactUsEmailProps) => {
  const payload = {
    service_id: import.meta.env.VITE_EMAIL_JS_SERVICE_ID,
    template_id: import.meta.env.VITE_EMAIL_JS_CONTACT_US_TEMPLATE_ID,
    user_id: import.meta.env.VITE_EMAIL_JS_USER_ID,
    template_params: {
      to_name: data.to_name,
      to_email: data.to_email,
      from_email: data.from_email,
      from_name: data.from_name,
      message: data.message,
    },
  };

  try {
    // Using emailjs.send to send the email
    const response = await emailjs.send(payload.service_id, payload.template_id, payload.template_params, payload.user_id);

    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};



import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { toast } from 'react-hot-toast'; // Import only `toast` for notifications

interface GoogleLoginProps {
  userType : string | null; // Define the user type (null for local login)
}
const GoogleLoginButton:React.FC<GoogleLoginProps> = ({userType}) => {
  const navigate = useNavigate();
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const onSuccess = async (credentialResponse:any) => {
   
   
    try {
      const { credential } = credentialResponse;
      const res = await axios.post(
        `${serverUrl}/api/auth/google`, 
        { credential, userType },
        { withCredentials: true } // This ensures cookies are sent along with the request
      );
      const data = res.data;

      if (res.status === 200 || res.status === 201 ) {
        toast.success(data.msg); // Display success toast
        navigate(`/profile/${res.data.userId}?isEditable=true`); // Redirect to another route after successful login
      } else {
        toast.error(data.msg); // Display error toast
      }
    } catch (error) {
      toast.error('Login failed'); // Display error toast
      console.error('Login failed', error);
    }
  };

  const onError = () => {
    toast.error('Login Failed'); // Display error toast
  };

  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onError={onError}
    />
  );
};

export default GoogleLoginButton;

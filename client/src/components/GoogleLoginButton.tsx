

import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { toast } from 'react-hot-toast'; // Import only `toast` for notifications

interface GoogleLoginProps {
  userType : string | null; // Define the user type (null for local login)
}
const GoogleLoginButton:React.FC<GoogleLoginProps> = ({userType}) => {
  const navigate = useNavigate();
  const onSuccess = async (credentialResponse:any) => {
   
   
    try {
      const { credential } = credentialResponse;
      if (!credential) {
        toast.error('Authentication failed. No credentials received.');
        return;
      }
      const res = await axios.post(
        `/api/auth/google`, 
        { credential, userType },
        { withCredentials: true,headers: {
          'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
        }, } // This ensures cookies are sent along with the request
      );
      const data = res.data;

      if (res.status === 200 || res.status === 201 ) {
        toast.success(data.msg); // Display success toast
        if(res.data.userId){

          navigate(`/profile/${res.data.userId}?isEditable=true`); // Redirect to another route after successful login
        }else{
          navigate("/")
        }
      } else {
        toast.error(data.msg); // Display error toast
      }
    } catch (error) {
      toast.error('Please sign up first'); // Display error toast
      console.error('Login failed', error);
    }
  };

  const onError = () => {
    toast.error('Please sign up firstr'); // Display error toast
  };

  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onError={onError}
    />
  );
};

export default GoogleLoginButton;

import React from 'react'
import{
Dialog,
DialogActions,
DialogContent,
DialogTitle,
Typography,
Button
} from "@mui/material";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
interface LogoutModalProps {
  logoutModalOpen : boolean ,
  setLogoutModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setAvatarOpen: React.Dispatch<React.SetStateAction<boolean>>
}


const LogoutModal :React.FC<LogoutModalProps> = ({logoutModalOpen ,setLogoutModalOpen,setAvatarOpen }) => {
  const navigate = useNavigate();
  const handleLogoutCancel = () => {
    setLogoutModalOpen(false);
  };

  const handleLogoutConfirm = async () => {
    try {
      await axios.post(`/api/logout`,{},{withCredentials: true,headers: {
        'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
      },});
      toast.success("Logout successful");
      setLogoutModalOpen(false);
      setAvatarOpen(false);
      window.location.reload();
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <Dialog open={logoutModalOpen} onClose={handleLogoutCancel}>
    <DialogTitle>Logout Confirmation</DialogTitle>
    <DialogContent>
      <Typography>Are you sure you want to log out?</Typography>
    </DialogContent>
    <DialogActions>
      <Button
        onClick={handleLogoutCancel}
        sx={{ color: (theme) => theme.palette.blue?.main }}
      >
        Cancel
      </Button>
      <Button
        onClick={handleLogoutConfirm}
        sx={{ color: (theme) => theme.palette.blue?.main }}
      >
        Yes
      </Button>
    </DialogActions>
  </Dialog>
  )
}

export default LogoutModal
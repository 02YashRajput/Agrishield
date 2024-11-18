import { Routes, Route, useNavigate, useLocation} from 'react-router-dom'; // Importing Route
import Home from './pages/Home';
import toast, { Toaster } from 'react-hot-toast'; // Importing Toaster
import useSWR from "swr";
import axios from "axios";

import SignUp from './pages/SignUp';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import MarketPlace from './pages/MarketPlace';
import ContractList from './pages/ContractList';
import ContractDetails from './pages/ContractDetails';
import NegotiationList from './pages/NegotiationList';
import Profile from './pages/Profile';
import ContactUs from './pages/ContactUs';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import Verification from './pages/Verification';
import { useEffect } from 'react';
import PrivateRoute from './components/PrivateRoute';


const fetcher = (url:string) => axios.get(url).then((res) => res.data);



function App ()  {

  const { data: user,isLoading } = useSWR("/api/user", fetcher);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    
    if (location.pathname === "/profile" || location.pathname === "/profile/") {
      if (user) {
        if(user.userId){

          navigate(`/profile/${user.userId}`);
        }
      else {
        toast.error("Please log in first");
        navigate("/login");
      }
    }
    }
  }, [user, location, navigate]);

  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path='/login' element={<Login />} />

      {/* Private routes */}
      <Route element={<PrivateRoute userId={user?.userId || 0} isLoading={isLoading}/>}>
        <Route path="/marketplace" element={<MarketPlace />} />
        <Route path="/contracts" element={<ContractList />} />
        <Route path="/contact/:id" element={<ContractDetails />} />
        <Route path="/negotiations" element={<NegotiationList />} />
      </Route>

  
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/about" element={<About />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/verify-email" element={<Verification />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Toaster />
  </>
  );
}

export default App;

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
// import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import Verification from './pages/Verification';
import { useEffect } from 'react';
import PrivateRoute from './components/PrivateRoute';
import TransactionList from './pages/TransactionList';
import Chat from './components/chat/Chat';
import PricePredictor from './pages/PricePredictor';
import AgentDashboard from './pages/AgentDashboard';
import PredictionDetails from './pages/PredictionDetails';


const fetcher = (url: string) =>
  axios
    .get(url, {
      withCredentials: true,
      headers: {
        'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
      },
    })
    .then((res) => res.data);





function App ()  {

  const { data: user,isLoading } = useSWR(`/api/user`, fetcher);
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
    const queryParams = new URLSearchParams(location.search);
    if ((location.pathname === "/marketplace" || location.pathname === "/marketplace/") && !queryParams.has("page")) {
        navigate(`/marketplace?page=1`);
    }

  }, [user, location, navigate]);
  const excludeChatRoutes = ["/login", "/sign-up"];
  const showChatWidget = user?.userId && !excludeChatRoutes.includes(location.pathname);
  return (
    <>
    {showChatWidget  &&  <Chat /> }
    
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path='/login' element={<Login />} />

      {/* Private routes */}
      <Route element={<PrivateRoute userId={user?.userId || 0} isLoading={isLoading}/>}>
        <Route path="/marketplace" element={<MarketPlace />} />
        <Route path="/contracts" element={<ContractList />} />
        <Route path="/contracts/:id" element={<ContractDetails />} />
        <Route path="/negotiations" element={<NegotiationList />} />
        <Route path="/transactions" element={<TransactionList />} />
        <Route path='/price-predictor' element={<PricePredictor />} />
        <Route path='/price-predictor/:crop' element = {<PredictionDetails/>}/>
      </Route>

  
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/contact-us" element={<ContactUs />} />
      {/* <Route path="/about" element={<About />} /> */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/agent/dashboard" element={<AgentDashboard />} />
      <Route path="/verify-email" element={<Verification />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Toaster />
  </>
  );
}

export default App;

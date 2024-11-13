import { Routes, Route, useLocation } from 'react-router-dom'; // Importing Route
import Home from './pages/Home';
import { Toaster } from 'react-hot-toast'; // Importing Toaster
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





function App ()  {


  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path='/login' element={<Login />} />
        <Route path="/marketplace" element={<MarketPlace />} />
        <Route path = "/contracts" element={<ContractList/>}/>
        <Route path = "/contact/:id" element={<ContractDetails/>} />
        <Route path='/negotiations' element={<NegotiationList  />}/>
        <Route path="/profile/:id" element={<Profile/>}/>
        <Route path="/contact-us" element={<ContactUs/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
        <Route path="/verify-email" element={<Verification/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;

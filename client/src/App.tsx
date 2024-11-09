import { Routes, Route } from 'react-router-dom'; // Importing Route
import Home from './pages/Home';
import { Toaster } from 'react-hot-toast'; // Importing Toaster
import SignUp from './pages/SignUp';
import Login from './pages/Login';
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path='/login' element={<Login />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;

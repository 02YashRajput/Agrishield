import { AppBar, Box, Button, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText,Divider } from '@mui/material';
import React, { useState } from 'react';
import logo from '../assets/AgriShieldTransparent.png';
import { FaHome } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { FaStore } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { IoDocumentLockSharp } from "react-icons/io5";
import { FaHandshake } from "react-icons/fa6";
import { FaChartLine } from "react-icons/fa6";
import MenuIcon from '@mui/icons-material/Menu'; // Material-UI's Menu Icon
import { useMediaQuery } from '@mui/material';

// Define the interface for the props
interface HeaderProps {
  name: string;
}

const Header: React.FC<HeaderProps> = ({ name }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isSmallScreen = useMediaQuery((theme: any) => theme.breakpoints.down('lg')); 

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: 'Home', icon: <FaHome />, to: '/' },
    { text: 'MarketPlace', icon: <FaStore />, to: '/marketplace' },
    { text: 'My Contracts', icon: <IoDocumentLockSharp />, to: '/contracts' },
    { text: 'My Negotiations', icon: <FaHandshake />, to: '/negotiations' },
    { text: 'Price Predictor', icon: <FaChartLine />, to: '#' },
    { text: 'Contact Us', icon: <FaPhoneAlt />, to: '/contact-us' },
  ];

  // Add Profile and Sign Up buttons based on the user's name
  if (name !== "Guest") {
    menuItems.push({ text: 'Profile', icon: <FaUser />, to: '/profile' });
  } else {
    menuItems.push({ text: 'Sign Up', icon: <FaUser />, to: '/sign-up' });
  }

  return (
    <AppBar position='sticky' className='h-20'>
      <Toolbar className='flex justify-between'>
        <Box className="flex items-center justify-center gap-5">
          <Link to="/">
            <img src={logo} alt="AgriShield Logo" className='h-20 cursor-pointer object-contain'/>
          </Link>
          <Typography variant='h4'>Hello {name}</Typography>
        </Box>

        {isSmallScreen ? (
          // Hamburger menu for small screens
          <>
            <IconButton onClick={() => toggleDrawer(true)} edge="end" color="inherit">
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={() => toggleDrawer(false)}>
              <List>
                {menuItems.map((item, index) => (
                   <>
                   <ListItem key={index}>
                     <ListItemButton component={Link} to={item.to} onClick={() => toggleDrawer(false)} className='flex gap-2'>
                       {item.icon}
                       <ListItemText primary={item.text} />
                     </ListItemButton>
                   </ListItem>
                   <Divider />
                 </>
                ))}
              </List>
            </Drawer>
          </>
        ) : (
          // Regular menu for larger screens
          <Box className="flex gap-3">
            {menuItems.map((item, index) => (
              <Button variant='text' color='inherit' key={index} component={Link} to={item.to} startIcon={item.icon}>
                {item.text}
              </Button>
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#bbf7d0', // Replace with your primary color
    },
    secondary: {
      main: '#000000', // Replace with your secondary color
    },
    background: {
      default: '#f4f6f8', // Light background color
      paper: '#ffffff', // Paper background color
    },
    warning: {
      main: '#f57c00', // Warning color (you can adjust it)
    },
    yellow: {
      main: '#eab308', 
      dark: '#ca8a04'
    },
    blue : {
      main:"#1976d2"
    }
    // You can define other colors here as needed
  },
});

export default theme;

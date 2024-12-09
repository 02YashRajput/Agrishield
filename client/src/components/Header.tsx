import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import React, { useState } from "react";
import logo from "../assets/AgriShieldTransparent.png";
import {
  FaHome,
  FaStore,
  FaPhoneAlt,
  FaUser,
  FaHandshake,
  FaChartLine,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import { IoDocumentLockSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";

import LogoutModal from "./LogoutModal";
import HeaderAvatar from "./HeaderAvatar";

interface HeaderProps {
  name: string | undefined;
  profileImage: string | undefined;
  isLoggedIn: boolean;
  id: Number | undefined;
}

const Header: React.FC<HeaderProps> = ({
  name,
  profileImage,
  isLoggedIn,
  id,
}) => {
  const { t } = useTranslation("header");

  const userName = isLoggedIn ? name : "Guest";
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [avatarOpen, setAvatarOpen] = useState<boolean>(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState<boolean>(false);

  const isSmallScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down("lg")
  );

  const menuItems = [{ text: t("Home"), icon: <FaHome />, to: "/" }];

  if (!isLoggedIn) {
    menuItems.push({
      text: t("ContactUs"),
      icon: <FaPhoneAlt />,
      to: "/contact-us",
    }),
      menuItems.push({ text: t("Login"), icon: <FaUser />, to: "/login" });
  } else {
    menuItems.push(
      { text: t("MarketPlace"), icon: <FaStore />, to: "/marketplace?page=1" },
      {
        text: t("MyContracts"),
        icon: <IoDocumentLockSharp />,
        to: "/contracts",
      },
      { text: t("MyNegotiations"), icon: <FaHandshake />, to: "/negotiations" },
      { text: t("PricePredictor"), icon: <FaChartLine />, to: "/price-predictor" }
    );
    if (isSmallScreen) {
     

      menuItems.push({
        text: t("Profile"),
        icon: <FaUser />,
        to: `/profile/${id}`,
      }),
        menuItems.push({
          text: t("MyTransactions"),
          icon: <FaFileInvoiceDollar />,
          to: "/transactions",
        });
    }
  }

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  return (
    <AppBar position="sticky" className="h-20">
      <Toolbar className="flex justify-between">
        <Box className="flex items-center justify-center gap-5">
          <Link to="/">
            <img
              src={logo}
              alt="AgriShield Logo"
              className="h-20 cursor-pointer object-contain"
            />
          </Link>
          <Typography variant="h4">
            {t("Hello")}, {userName}!
          </Typography>
        </Box>

        {isSmallScreen ? (
          <>
            <IconButton
              onClick={() => setDrawerOpen(true)}
              edge="end"
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            >
              <List>
                {menuItems.map((item, index) => (
                  <div key={index}>
                    <ListItem key={index}>
                      <ListItemButton
                        component={Link}
                        to={item.to}
                        onClick={() => setDrawerOpen(false)}
                        className="flex gap-2"
                        
                      >
                        {item.icon}
                        <ListItemText primary={item.text} />
                      </ListItemButton>
                    </ListItem>
                    <Divider />
                  </div>
                ))}
                {isLoggedIn && (
                  <ListItem>
                    <ListItemButton
                      onClick={handleLogoutClick}
                      className="flex gap-2 "
                      sx={{ color: "red" }}
                    >
                      <ListItemText primary={t("Logout")} />
                    </ListItemButton>
                  </ListItem>
                )}
                <Divider />
              </List>
            </Drawer>
          </>
        ) : (
          <Box className="flex gap-3 items-center">
            {menuItems.map((item, index) => (
              <Button
                variant="text"
                color="inherit"
                key={index}
                component={Link}
                to={item.to}
                startIcon={item.icon}
              >
                {item.text}
              </Button>
            ))}
            {""}
            {isLoggedIn && (
              <>
                <IconButton
                  onClick={() => setAvatarOpen(!avatarOpen)}
                  edge="end"
                  color="inherit"
                >
                  <HeaderAvatar profileImage={profileImage} />
                </IconButton>
                <Drawer
                  anchor="right"
                  open={avatarOpen}
                  onClose={() => setAvatarOpen(false)}
                >
                  <List>
                    <ListItem>
                      <ListItemButton
                        onClick={() => setAvatarOpen(false)}
                        className="flex gap-2 "
                        component={Link}
                        to={`/profile/${id}`}
                      >
                        <FaUser />
                        <ListItemText primary={t("Profile")} />
                      </ListItemButton>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemButton
                        onClick={() => setAvatarOpen(false)}
                        className="flex gap-2 "
                        component={Link}
                        to="/transactions"
                      >
                        <FaFileInvoiceDollar />
                        <ListItemText primary={t("MyTransactions")} />
                      </ListItemButton>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemButton
                        onClick={() => setAvatarOpen(false)}
                        className="flex gap-2 "
                        component={Link}
                        to="/contact-us"
                      >
                        <FaPhoneAlt />
                        <ListItemText primary={t("ContactUs")} />
                      </ListItemButton>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemButton
                        onClick={handleLogoutClick}
                        className="flex gap-2 "
                        sx={{ color: "red" }}
                      >
                        <ListItemText primary={t("Logout")} />
                      </ListItemButton>
                    </ListItem>
                    <Divider />
                  </List>
                </Drawer>
              </>
            )}
          </Box>
        )}
      </Toolbar>

      <LogoutModal
        logoutModalOpen={logoutModalOpen}
        setLogoutModalOpen={setLogoutModalOpen}
        setAvatarOpen={setAvatarOpen}
      />
    </AppBar>
  );
};

export default Header;

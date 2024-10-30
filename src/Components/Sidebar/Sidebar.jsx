/* eslint-disable jsx-a11y/no-static-element-interactions */
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BarChartIcon from "@mui/icons-material/BarChart";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ColorContext } from "../../ColorContext/darkContext";
import "./Sidebar.scss";
import logo from "../../Images/logo.jpg"
function Sidebar() {
  // color state management using react context
  const { darkMode, dispatch } = useContext(ColorContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    // Debugging: Check if this function is called
    console.log("Logging out...");

    // Clear the token and user data from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login page
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <Link to="/" style={{ textDecoration: "none" }}>
         <img src={logo} className="logo-imgaer"/>
        </Link>
      </div>

      <div className="links">
        <ul>
          <p className="spann">Main</p>
          <Link to="/" style={{ textDecoration: "none" }}>
            <li>
              <DashboardIcon className="icon" /> Dashboard
            </li>
          </Link>

          <p className="spann">lists</p>

          <Link to="/contacts" style={{ textDecoration: "none" }}>
            <li>
              <AccountCircleIcon className="icon" /> Orders
            </li>
            <Link to="/pending" style={{ textDecoration: "none" }}>
              <li>
                <PersonIcon className="icon" /> Pending
              </li>
            </Link>
          </Link>
          <Link to="/rejected" style={{ textDecoration: "none" }}>
            <li>
              <CreditCardIcon className="icon" />
              Rejected
            </li>
          </Link>

          {/* <li>
            <BarChartIcon className="icon" /> Status
          </li> */}

          <p className="spann">Settings</p>
          {/* <li>
            <AccountCircleIcon className="icon" /> Support
          </li>
          <li>
            <SettingsRoundedIcon className="icon" /> Setting
          </li> */}
          <li onClick={handleLogout}>
            <LogoutIcon className="icon" /> Log Out
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;

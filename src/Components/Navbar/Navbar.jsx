import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BarChartIcon from "@mui/icons-material/BarChart";
import CloseIcon from "@mui/icons-material/Close";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import TableChartIcon from "@mui/icons-material/TableChart";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ColorContext } from "../../ColorContext/darkContext";
import logo from "../../Images/logo.jpg";

// import sass file
import "./navbar.scss";

// import images

function Navbar() {
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();
  // color state management using react context
  const { darkMode, dispatch } = useContext(ColorContext);

  const handleToggle = () => {
    setToggle(!toggle);
  };

  const handleLogout = () => {
    // Clear the token and user data from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Optionally, clear any user state in your app context or state management
    // setUser({ admin: false }); // Uncomment if you have a setUser function to manage user state
    // Redirect to login page
    navigate("/login");
  };
  return (
    <div className="navbar">
      <div className="navbar_main">
        <div className="menu_logo">
          {toggle ? (
            <CloseIcon className="menu_icon" onClick={handleToggle} />
          ) : (
            <MenuIcon className="menu_icon" onClick={handleToggle} />
          )}

          <Link to="/home" style={{ textDecoration: "none",height:"40px",marginLeft:"20px",width:"100px" }}>
            <img src={logo} height={47} width={170}/> 
          </Link>
        </div>
        <div className="search">
          <input type="text" placeholder="Search.." />

          <SearchIcon className="search_icon" />
        </div>

        <div className="item_lists">
       <div className="item">
            <NotificationsNoneIcon className="item_icon" />
            <span className="badge">1</span>
          </div>
        </div>
      </div>

      <div className="res_navbar">
        {toggle && (
          <div className="res_nav_menu">
            <div className="res_nav_menuu">
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
                      <PersonIcon className="icon" /> Orders
                    </li>
                  </Link>

                  <Link to="/pending" style={{ textDecoration: "none" }}>
                    <li>
                      <TableChartIcon className="icon" /> Pending
                    </li>
                  </Link>
                  <Link to="/rejected" style={{ textDecoration: "none" }}>
                    <li>
                      <CreditCardIcon className="icon" /> Rejected
                    </li>
                  </Link>
                

                  <p className="spann">Settings</p>
              
                  <li onClick={handleLogout}>
                    <LogoutIcon className="icon" /> Log Out
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;

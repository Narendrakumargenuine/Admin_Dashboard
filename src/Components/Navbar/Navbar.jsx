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
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ColorContext } from "../../ColorContext/darkContext";
import logo from "../../Images/logo.jpg";

// import sass file
import "./navbar.scss";

// import images

function Navbar() {
  const { darkMode, dispatch } = useContext(ColorContext);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();
  // color state management using react context


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

  const fetchPendingNotifications = async () => {
    try {
      const response = await fetch(
        "https://auto-mobile-backend.vercel.app/form/notifications/pending"
      );
      const data = await response.json();

      // Check if the fetched data differs from the current state to avoid unnecessary re-renders
      const newNotifications = data.notifications.filter(
        (newNotif) =>
          !pendingOrders.some(
            (existingNotif) => existingNotif._id === newNotif._id
          )
      );

      if (
        newNotifications.length > 0 ||
        pendingOrders.length !== data.notifications.length
      ) {
        setPendingOrders(data.notifications);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
    }
  };

  const markAllAsSeen = async () => {
    try {
      await fetch(
        "https://auto-mobile-backend.vercel.app/form/notifications/markAllAsSeen",
        {
          method: "PUT",
        }
      );
      setPendingOrders([]); // Clear pending notifications after marking as seen
    } catch (error) {
      console.error("Error marking notifications as seen:", error);
    }
  };

  // Polling every 10 seconds for new notifications
  useEffect(() => {
    fetchPendingNotifications(); // Initial fetch

    const interval = setInterval(() => {
      fetchPendingNotifications();
    }, 10000); // 10 seconds interval

    return () => clearInterval(interval); // Cleanup on unmount
  }, [pendingOrders]);

  const handleBellClick = () => {
    setModalOpen(true);
  };

  const closeModal = async () => {
    await markAllAsSeen(); // Only mark as seen if there are pending notifications

    setModalOpen(false); // Close the modal afterward
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
          <div className="item" onClick={handleBellClick}>
            <NotificationsNoneIcon className="item_icon" />
            <span className="badge">{pendingOrders.length}</span>

            {/* Notification Modal positioned below the notification bell */}
            {isModalOpen && (
              <div className="modal">
                <div className="modal_content">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>New Orders</span>
                    <CloseIcon
                      onClick={closeModal}
                      style={{ cursor: "pointer" }} // Makes it look clickable
                    />
                  </div>

                  {loading ? (
                    <p>Loading...</p>
                  ) : pendingOrders.length > 0 ? (
                    pendingOrders.map((order) => (
                      <Link
                        key={order._id}
                        to="/contacts"
                        className="notification-link"
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        <div
                          className="notification-item"
                          style={{ fontSize: "12px" }}
                        >
                          <span
                            style={{
                              display: "inline-block",
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              backgroundColor: "red",
                              marginRight: "8px",
                            }}
                          ></span>
                          You have a new order from {order.fullname}
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p>No pending orders</p>
                  )}
                </div>
              </div>
            )}
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
                      <DashboardIcon className="icon" onClick={handleToggle}/> Dashboard
                    </li>
                  </Link>

                  <p className="spann">lists</p>
                  <Link to="/contacts" style={{ textDecoration: "none" }} onClick={handleToggle}>
                    <li>
                      <PersonIcon className="icon" /> Orders
                    </li>
                  </Link>

                  <Link to="/completed" style={{ textDecoration: "none" }} onClick={handleToggle}>
                    <li>
                      <TableChartIcon className="icon" /> Completed
                    </li>
                  </Link>
                  <Link to="/rejected" style={{ textDecoration: "none" }} onClick={handleToggle}>
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

import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LocalGroceryStoreOutlinedIcon from "@mui/icons-material/LocalGroceryStoreOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./itemlists.scss";

function ItemLists({ type }) {
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch all orders and calculate counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch(
          "https://auto-mobile-backend.vercel.app/form/get"
        );
        const data = await response.json();

        // Calculate total, pending, and rejected counts
        const total = data.contacts.length || 0; // Assuming response has 'contacts' array
        const pending = data.contacts.filter(
          (contact) => contact.status === "completed"
        ).length;
        const rejected = data.contacts.filter(
          (contact) => contact.status === "rejected"
        ).length;

        setCounts({
          total,
          pending,
          rejected,
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  let data;

  // Dynamically change the UI content based on type
  switch (type) {
    case "user":
      data = {
        title: "Total Orders",
        isMoney: false,
        count: counts.total, // Use total count
        icon: (
          <PermIdentityIcon
            style={{
              color: "#FF74B1",
              backgroundColor: "#FFD6EC",
            }}
            className="icon"
          />
        ),
        link: "See all orders",
        linkto: "/contacts",
      };
      break;
    case "orders":
      data = {
        title: "Completed",
        isMoney: false,
        count: counts.pending, // Use fetched pending count
        icon: (
          <LocalGroceryStoreOutlinedIcon
            style={{
              color: "#AC7088",
              backgroundColor: "#FFF38C",
            }}
            className="icon"
          />
        ),
        link: "View all completed orders",
        linkto: "/completed",
      };
      break;
    case "products":
      data = {
        title: "Rejected",
        isMoney: false, // Change to false to remove dollar icon
        count: counts.rejected, // Use fetched rejected count
        icon: null, // Set icon to null since we don't want to display a dollar icon
        link: "See all rejected orders",
        linkto: "/rejected",
      };
      break;
    case "balance":
      data = {
        title: "BALANCE",
        count: 444,
        isMoney: true,
        icon: (
          <PaidOutlinedIcon
            style={{
              color: "#AC7088",
              backgroundColor: "#B1B2FF",
            }}
            className="icon"
          />
        ),
        link: "See all details",
        linkto: "/",
      };
      break;
    default:
      break;
  }

  if (loading) {
    return <p>Loading...</p>; // Show loading state
  }

  // Calculate percentage based on counts
  const calculatePercentage = (count) => {
    return counts.total > 0 ? ((count / counts.total) * 100).toFixed(2) : 0; // Avoid division by zero
  };

  return (
    <div className="item_listss">
      <div className="name">
        <p>{data.title}</p>
        {type !== "balance" && (
          <span className="persentage positive">
            <KeyboardArrowUpIcon />
            {calculatePercentage(data.count)} %
          </span>
        )}
      </div>

      <div className="counts">
        {data.isMoney && <AttachMoneyOutlinedIcon />}
        {data.count}
      </div>

      <div className="see_item">
        <Link to={data.linkto}>
          <p>{data.link}</p>
        </Link>
        {data.icon}
      </div>
    </div>
  );
}

export default ItemLists;

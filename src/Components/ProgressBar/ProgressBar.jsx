import React, { useEffect, useState } from "react";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import "react-circular-progressbar/dist/styles.css";
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts"; // Import Recharts Tooltip

// Import CSS file
import "./progressBar.scss";

function ProgressBar() {
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    rejected: 0,
    today: 0,
    fewDaysAgo: 0,
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

        // Calculate total, pending, rejected, today's and few days ago counts
        const total = data.contacts.length || 0; // Assuming response has 'contacts' array
        const pending = data.contacts.filter(
          (contact) => contact.status === "pending"
        ).length;
        const rejected = data.contacts.filter(
          (contact) => contact.status === "rejected"
        ).length;

        // Get today's date and few days ago date
        const today = new Date();
        const fewDaysAgo = new Date();
        fewDaysAgo.setDate(today.getDate() - 3); // 3 days ago

        // Calculate today's orders and few days ago orders
        const todayCount = data.contacts.filter((contact) => {
          const contactDate = new Date(contact.createdAt); // Assuming createdAt is the date field
          return (
            contactDate.getFullYear() === today.getFullYear() &&
            contactDate.getMonth() === today.getMonth() &&
            contactDate.getDate() === today.getDate()
          );
        }).length;

        const fewDaysCount = data.contacts.filter((contact) => {
          const contactDate = new Date(contact.createdAt);
          return contactDate >= fewDaysAgo && contactDate < today;
        }).length;

        setCounts({
          total,
          pending,
          rejected,
          today: todayCount,
          fewDaysAgo: fewDaysCount,
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loader or placeholder while loading
  }

  // Create data for the pie chart
  const data01 = [
    { name: "Total", value: counts.total },
    { name: "Pending", value: counts.pending },
    { name: "Rejected", value: counts.rejected },
  ];

  // Calculate total contacts (sum of all values in data01)
  const totalContacts = data01.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="progress_bar">
      <div className="top">
        <p>Total Orders</p>
        <MoreVertOutlinedIcon />
      </div>

      <div className="middle">
        <div className="progress">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                dataKey="value"
                data={data01}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#536def"
                label
              />
              <RechartsTooltip
                formatter={(value, name) => [`${value} contacts`, name]} // Custom tooltip formatter
                labelFormatter={(name) => `${name}`} // Tooltip label
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <p>Total Orders</p>
        <p className="price">
          <span style={{ fontSize: "32px" }}>📞</span> {counts.total}
        </p>
      </div>

      <div className="bottom">
        <div className="botom_nested">
          <div className="nested_nested">
            <p>Today's </p>
            <p className="pricee">
              <KeyboardArrowUpOutlinedIcon /> {counts.today}
            </p>
          </div>
          <div className="nested_nested">
            <p>Few Days Ago</p>
            <p className="pricee decrese">
              <KeyboardArrowUpOutlinedIcon /> {counts.fewDaysAgo}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;

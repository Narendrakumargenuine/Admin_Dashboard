import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import "./datatable.scss";

// Replace this with your actual API endpoint
const API_URL = "https://auto-mobile-backend.vercel.app/form/get"; // Update with your actual endpoint
const UPDATE_STATUS_URL = "https://auto-mobile-backend.vercel.app/form/contact"; // Base URL for updating status

function DataTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        const result = await response.json();
        // Set data with transformed rows to include `id`
        const transformedData = result.contacts.map((contact) => ({
          id: contact._id, // Set id property
          fullname: contact.fullname,
          phone: contact.phone,
          email: contact.email,
          description: contact.description,
          image: contact.image,
          status: contact.status, // Include status
        }));
        setData(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`${UPDATE_STATUS_URL}/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setData((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, status: newStatus } : item
          )
        );
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const columns = [
    {
      field: "fullname",
      headerName: "Full Name",
      width: 150,
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "description",
      headerName: "Description",
      width: 200,
    },
    {
      field: "image",
      headerName: "Image",
      width: 150,
      renderCell: (params) => (
        <div>
          {params.row.image.length > 0 ? (
            params.row.image.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Contact Image ${index + 1}`}
                style={{
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                  marginRight: "5px",
                }}
              />
            ))
          ) : (
            <span>No Image</span>
          )}
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <select
          value={params.row.status}
          onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
        </select>
      ),
    },
  ];

  return (
    <div className="dataTable" style={{ height: "700px", width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        loading={loading}
      />
    </div>
  );
}

export default DataTable;

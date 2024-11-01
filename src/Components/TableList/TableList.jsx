import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import GetAppIcon from "@mui/icons-material/GetApp";
import "./tableList.scss";

const API_URL = "https://auto-mobile-backend.vercel.app/form/contacts/pending";

function TableList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [selectedDescription, setSelectedDescription] = useState(null); // New state for description modal

  const fetchPendingContacts = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      const transformedData = result.contacts.map((contact) => ({
        id: contact._id,
        fullname: contact.fullname,
        phone: contact.phone,
        email: contact.email,
        description: contact.description || "No Description",
        image: contact.image,
        status: contact.status,
        orderDate: new Date(contact.createdAt).toLocaleString(),
      }));

      transformedData.sort(
        (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
      );

      setData(transformedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`https://auto-mobile-backend.vercel.app/form/delete/${id}`, {
        method: "DELETE",
      });
      fetchPendingContacts();
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  useEffect(() => {
    fetchPendingContacts();
  }, []);

  const handleImageHover = (img) => {
    setHoveredImage(img);
  };

  const handleImageClick = (img) => {
    setEnlargedImage(img);
  };

  const handleCloseEnlargedImage = () => {
    setEnlargedImage(null);
  };

  const handleDownloadImage = () => {
    if (enlargedImage) {
      const link = document.createElement("a");
      link.href = enlargedImage;
      link.download = enlargedImage.split("/").pop();
      link.click();
    }
  };

  const handleDescriptionClick = (description) => {
    setSelectedDescription(description); // Set the selected description
  };

  const handleCloseDescription = () => {
    setSelectedDescription(null); // Close the description modal
  };

  const columns = [
    { field: "fullname", headerName: "Full Name", width: 150 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "description",
      headerName: "Description",
      width: 200,
      renderCell: (params) => (
        <Typography
          variant="body2"
          onClick={() => handleDescriptionClick(params.row.description)} // Open modal on click
          style={{ cursor: "pointer" }} // Change cursor and color for indication
        >
          {params.row.description.length > 50
            ? `${params.row.description.slice(0, 50)}...`
            : params.row.description}
        </Typography>
      ),
    },
    {
      field: "orderDate",
      headerName: "Order Date & Time",
      width: 200,
    },
    {
      field: "image",
      headerName: "Images",
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
                  cursor: "pointer",
                }}
                onMouseEnter={() => handleImageHover(img)}
                onMouseLeave={() => setHoveredImage(null)} // Hide on mouse leave
                onClick={() => handleImageClick(img)}
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
        <span
          style={{
            color: params.row.status === "pending" ? "orange" : "green",
          }}
        >
          {params.row.status}
        </span>
      ),
    },
    {
      field: "delete",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <DeleteIcon
          onClick={() => handleDelete(params.row.id)}
          style={{ cursor: "pointer", color: "red" }}
        />
      ),
    },
  ];

  return (
    <div className="tableList" style={{ height: "700px", width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        loading={loading}
      />
      {hoveredImage && (
        <div className="image-hover">
          <img
            src={hoveredImage}
            alt="Hovered"
            style={{
              position: "absolute",
              top: "20%",
              left: "45%",
              width: "300px",
              height: "300px",
              objectFit: "cover",
              border: "2px solid #ccc",
              zIndex: 1000,
            }}
          />
        </div>
      )}
      {enlargedImage && (
        <div className="enlarged-image-modal">
          <div className="enlarged-image-content">
            <span className="close-enlarged" onClick={handleCloseEnlargedImage}>
              &times;
            </span>
            <img
              src={enlargedImage}
              alt="Enlarged"
              style={{
                width: "80%",
                height: "auto",
                maxHeight: "80vh",
                objectFit: "contain",
                display: "block",
                margin: "auto",
              }}
            />
            <button
              className="btn"
              onClick={handleDownloadImage}
              style={{ marginTop: "10px" }}
            >
              <GetAppIcon style={{ marginRight: "5px", color: "#fff" }} />
              Download Image
            </button>
          </div>
        </div>
      )}
      {selectedDescription && (
        <div className="description-modal">
          <div className="description-modal-content">
            <span
              className="close-description"
              onClick={handleCloseDescription}
            >
              &times;
            </span>
            <Typography variant="body1">{selectedDescription}</Typography>
          </div>
        </div>
      )}
    </div>
  );
}

export default TableList;
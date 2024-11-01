import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import "./datatable.scss";
import DeleteIcon from "@mui/icons-material/Delete"; // Import delete icon from Material-UI
import GetAppIcon from "@mui/icons-material/GetApp";
const API_URL = "https://auto-mobile-backend.vercel.app/form/get";
const UPDATE_STATUS_URL = "https://auto-mobile-backend.vercel.app/form/contact";
const DELETE_URL = "https://auto-mobile-backend.vercel.app/form/delete"; // Adjust this URL as necessary

function DataTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null); // For enlarged image

  const fetchData = async () => {
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
        createdAt: contact.createdAt,
      }));

      const sortedData = transformedData.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      const filteredData = sortedData.filter(
        (contact) => contact.status === "pending"
      );

      setData(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
        fetchData();
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${DELETE_URL}/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchData(); // Refetch data after deletion
      } else {
        console.error("Failed to delete notification");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleDescriptionClick = (description) => {
    setSelectedDescription(description || "No description available");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedDescription("");
  };

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
      link.download = enlargedImage.split("/").pop(); // Get the image name from URL
      link.click();
    }
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
        <div
          style={{
            cursor: "pointer",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}
          onClick={() => handleDescriptionClick(params.row.description)}
          title={params.row.description}
        >
          {params.row.description.length > 30
            ? `${params.row.description.substring(0, 30)}...`
            : params.row.description}
        </div>
      ),
    },
    {
      field: "orderDate",
      headerName: "Order Date & Time",
      width: 200,
    },
    {
      field: "image",
      headerName: "Image",
      width: 150,
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
          onMouseLeave={() => setHoveredImage(null)}
        >
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
                  cursor: "pointer", // Change cursor to pointer for better UX
                }}
                onMouseEnter={() => handleImageHover(img)} // Set the hovered image on mouse enter
                onClick={() => handleImageClick(img)} // Set the enlarged image on click
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
          style={{
            padding: "5px 10px",
            backgroundColor:
              params.row.status === "pending"
                ? "lightyellow"
                : params.row.status === "completed"
                  ? "lightgreen"
                  : "lightcoral",
            borderRadius: "4px",
            border: "1px solid gray",
          }}
        >
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
        </select>
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
    <div className="dataTable" style={{ height: "700px", width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        loading={loading}
      />
      {modalOpen && (
        <div className="modal-det">
          <div className="modal-content-det">
            <span className="close-det" onClick={handleCloseModal}>
              &times;
            </span>
            <h4>Description</h4>
            <p style={{ marginTop: "10px", fontSize: "14px" }}>
              {selectedDescription}
            </p>
          </div>
        </div>
      )}
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
              className="btn" // Add the btn class for styling
              onClick={handleDownloadImage}
              style={{ marginTop: "10px" }} // Margin for spacing
            >
              <GetAppIcon style={{ marginRight: "5px", color: "#fff" }} />{" "}
              {/* Icon for download */}
              Download Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
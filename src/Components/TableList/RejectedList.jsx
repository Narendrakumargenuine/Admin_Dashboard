/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from "react";
import "./tableList.scss";

// MUI Components
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const REJECTED_API_URL =
  "https://auto-mobile-backend.vercel.app/form/contacts/rejected"; // API endpoint for rejected contacts

function RejectedList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRejectedContacts = async () => {
      try {
        const response = await fetch(REJECTED_API_URL);
        const result = await response.json();
        setData(result.contacts || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRejectedContacts();
  }, []);

  return (
    <TableContainer component={Paper} className="table_list">
      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>No rejected orders</p>
      ) : (
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="table_cell">Full Name</TableCell>
              <TableCell className="table_cell">Phone</TableCell>
              <TableCell className="table_cell">Email</TableCell>
              <TableCell className="table_cell">Description</TableCell>
              <TableCell className="table_cell">Images</TableCell>
              <TableCell className="table_cell">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((contact) => (
              <TableRow key={contact._id}>
                <TableCell className="table_cell">{contact.fullname}</TableCell>
                <TableCell className="table_cell">{contact.phone}</TableCell>
                <TableCell className="table_cell">{contact.email}</TableCell>
                <TableCell className="table_cell">
                  {contact.description}
                </TableCell>
                <TableCell className="table_cell">
                  {contact.image.length > 0 ? (
                    <div className="images_container">
                      {contact.image.map((imgUrl, index) => (
                        <img
                          key={index}
                          src={imgUrl}
                          alt={`contact ${index + 1}`}
                          className="contact_image"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            margin: "4px",
                            borderRadius: "4px",
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <span>No Images</span>
                  )}
                </TableCell>
                <TableCell className="table_cell">
                  <span className={`status ${contact.status}`}>
                    {contact.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
}

export default RejectedList;

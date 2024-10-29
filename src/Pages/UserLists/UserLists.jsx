/* eslint-disable no-constant-condition */
/* eslint-disable no-nested-ternary */
import React from "react";
import { Link } from "react-router-dom";
import DataTable from "../../Components/DataTable/DataTable";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebar from "../../Components/Sidebar/Sidebar";
import TableList from "../../Components/TableList/TableList";
import "./userlists.scss";

function Lists({ type }) {
  return (
    <div className="list_page">
      <div className="home_sidebar">
        <Sidebar />
      </div>

      <div className="list_page_main">
        <Navbar />

        {/* MUI data table */}
        <div className="data_table">
          {/* <div className="btnn">
            <Link
              to={`/${type === "contact" ? "contacts" : type === "user" ? "users" : "blogs"}/addnew`}
              style={{ textDecoration: "none" }}
            >
              <button type="button">
                Add New {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            </Link>
          </div> */}

          {type === "contact" ? <DataTable /> : <TableList />}
        </div>
      </div>
    </div>
  );
}

export default Lists;

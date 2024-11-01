import { useContext, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ColorContext } from "./ColorContext/darkContext";
import Home from "./Components/Home/Home";
import Orders from "./Components/Orders/Orders";
import AddNew from "./Pages/AddNew/AddNew";
import BlogDetail from "./Pages/BlogDetail/BlogDetail";
import Blogs from "./Pages/Blogs/Blogs";
import Detail from "./Pages/Detail/Detail";
import Login from "./Pages/Login/Login";
import Lists from "./Pages/UserLists/UserLists";
import "./app.scss";
import AuthRoute from "./Components/AuthRoute";

function App() {
  // color state management using react context
  const { darkMode } = useContext(ColorContext); // Color context
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : { admin: false };
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser({ admin: false }); // Reset user state if no token
    }
  }, []);

  return (
    <div className={darkMode ? "App dark" : "App"}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="/home"
            element={<AuthRoute element={<Home />} isAdmin={user.admin} />}
          />
          {/* Other routes */}
          <Route path="/completed">
            <Route index element={<Lists type="user" />} />
            <Route path=":userId" element={<Detail />} />
          </Route>
          <Route path="/rejected" element={<Orders />} />
          <Route path="/contacts">
            <Route index element={<Lists type="contact" />} />
            <Route path=":productId" element={<Detail />} />
          </Route>
          <Route path="/blogs">
            <Route index element={<Blogs type="blog" />} />
            <Route path=":blogId" element={<BlogDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

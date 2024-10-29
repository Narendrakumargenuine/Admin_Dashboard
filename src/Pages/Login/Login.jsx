import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios

function Login({ setUser }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null); // State for error handling
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Get the token from local storage
    if (token) {
      // If a token exists, check if the user is an admin
      const user = JSON.parse(localStorage.getItem("user")); // Get user info from local storage
      if (user && user.admin) {
        navigate("/home"); // Redirect to /home if user is an admin
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to your login endpoint
      const response = await axios.post(
        "https://auto-mobile-backend.vercel.app/auth/login",
        formData
      );

      localStorage.setItem("token", response.data.token);
      // Set user state with response user data
      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Navigate to home if user is admin
      if (response.data.user.admin) {
        navigate("/home");
      } else {
        setError("You do not have admin access.");
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f3f4f6",
      padding: "1rem",
    },
    form: {
      width: "100%",
      maxWidth: "400px",
      backgroundColor: "#ffffff",
      padding: "2rem",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
      borderRadius: "8px",
    },
    title: {
      fontSize: "1.5rem",
      textAlign: "center",
      marginBottom: "1rem",
      color: "#333",
    },
    inputGroup: {
      marginBottom: "1rem",
    },
    input: {
      width: "100%",
      padding: "0.75rem",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: "1rem",
    },
    button: {
      width: "100%",
      padding: "0.75rem",
      backgroundColor: "#4a90e2",
      color: "#fff",
      fontSize: "1rem",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    error: {
      color: "red",
      textAlign: "center",
      marginTop: "1rem",
    },
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Login</h2>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.inputGroup}>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.button}>
          Log In
        </button>
      </form>
    </div>
  );
}

export default Login;

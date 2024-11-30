import React, { useState, useEffect } from "react";
import "./login.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Modal } from "antd";
import { RotatingLines } from "react-loader-spinner";

import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { FiEye } from "react-icons/fi";
import { PiEyeClosed } from "react-icons/pi";

import { useAuth } from "./Auth";

const LoginForm = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const location = useLocation();
  const message = location.state?.message;
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Add error state
  const [errorModalVisible, setErrorModalVisible] = useState(false); // Add error modal visibility state
  const [usernamefocused, setUsernamefocused] = useState(false);
  const [usernameerror, setUsernameerror] = useState("");
  const [passwordfocused, setPasswordFocused] = useState(false);
  const [passworderror, setPassworderror] = useState("");
  const [success, setSuccess] = useState("");
  const pathname = sessionStorage.getItem("redirectFrom");

  const { login } = useAuth();

  const navigate = useNavigate();

  function getCSRFToken() {
    const csrfCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="));

    if (csrfCookie) {
      return csrfCookie.split("=")[1];
    }

    return null;
  }
  useEffect(() => {
    if (errorModalVisible) {
      const timerId = setTimeout(() => {
        setErrorModalVisible(false);

        setError("");
      }, 3000);

      return () => clearTimeout(timerId);
    }
  }, [errorModalVisible]);

  useEffect(() => {
    if (message) {
      setSuccess(message);
      setErrorModalVisible(true);
    }
  }, [message]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username && !password) {
      setUsernameerror("You can't leave empty");
      setPassworderror("You can't leave empty");
      setUsernamefocused(true);
      setPasswordFocused(true);
      return;
    }
    if (!username) {
      setUsernameerror("You can't leave empty");
      setUsernamefocused(true);
      return;
    }

    if (!password) {
      setPassworderror("You can't leave empty");
      setPasswordFocused(true);
      return;
    }

    try {
      setLoading(true);

      const requestBody = {
        username,
        password,
      };
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/api/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.status === 201) {
        const data = await response.json();

        localStorage.setItem("username", username);
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("role", "admin");
        login();
        navigate("/home");
      } else {
        console.log("Username or password is Incorrect.");
        setError("Username or password is Incorrect.");
        setErrorModalVisible(true);
      }

      setLoading(false);
    } catch (error) {
      console.error("An error occurred during login:", error);

      setError("An unexpected error occurred. Please try again later.");
      setErrorModalVisible(true);
      setLoading(false);
    }
  }

  return (
    <div className="sub_page">
      <div className="login_container">
        <div className="loading">
          {loading && (
            <RotatingLines
              strokeColor="#f57224"
              strokeWidth="5"
              animationDuration="0.75"
              width="64"
              visible={true}
            />
          )}
        </div>

        <div className="content_login">
          <div className="first_column">
            <h4>Login</h4>
            <div className="field">
              <label>Email*</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your email"
                onChange={(event) => {
                  setUsername(event.target.value);
                  setUsernameerror("");
                }}
                required
                onFocus={() => setUsernamefocused(true)}
                onBlur={() => setUsernamefocused(false)}
                style={{
                  borderColor: usernameerror
                    ? "red"
                    : usernamefocused
                    ? "black"
                    : "",
                  border: "1px solid white",
                }}
              />
              {usernameerror && (
                <div style={{ color: "red", fontSize: "12px" }}>
                  {usernameerror}
                </div>
              )}
            </div>
            <div className="field">
              <label>Password*</label>
              <input
                type={passwordVisible ? "text" : "password"}
                className="pass-key"
                required
                placeholder="Password"
                name="password"
                onChange={(event) => {
                  setPassword(event.target.value);
                  setPassworderror("");
                }}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                style={{
                  borderColor: passworderror
                    ? "red"
                    : passwordfocused
                    ? "black"
                    : "",
                  border: "1px solid white",
                }}
              />
              {passworderror && (
                <div style={{ color: "red", fontSize: "12px" }}>
                  {passworderror}
                </div>
              )}

              <span className="show" onClick={togglePasswordVisibility}>
                {passwordVisible ? (
                  <FiEye style={{ fontSize: "1.2rem" }} />
                ) : (
                  <PiEyeClosed style={{ fontSize: "1.3rem" }} />
                )}
              </span>
              {/* <Link
                className="forget_password  "
                style={{ color: "#049cb9" }}
                to={"/user/forget-password"}
              >
                Forget Password?
              </Link> */}
            </div>

            <div className="field mt-3">
              <label
                className="normal_login"
                style={{
                  background: "#2691d9",
                  border: "none",
                  cursor: "pointer",
                }}
                htmlFor="login"
              >
                <input
                  id="login"
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    outline: "none",
                  }}
                  disabled={loading}
                  onClick={handleSubmit}
                  value={"Login"}
                />
              </label>

              {/* <div className="signup mt-2">
                Don't have an account? <Link to="/signup">Signup Now</Link>
              </div> */}
            </div>
            {/* {error && <p className="error">{error}</p>} */}
          </div>
        </div>
      </div>
      <Modal
        className="modal_autehntication"
        title={
          <div>
            {success ? (
              <CheckCircleOutlined style={{ color: "green", marginRight: 8 }} />
            ) : (
              <ExclamationCircleOutlined
                style={{ color: "#f5222d", marginRight: 8 }}
              />
            )}

            {success ? "Success" : "Error"}
          </div>
        }
        visible={errorModalVisible}
        onOk={null}
        footer={null}
        width={300}
        height={100}

        // Set footer to null to hide buttons
      >
        <p>{success ? success : error}</p>
      </Modal>
    </div>
  );
};

export default LoginForm;

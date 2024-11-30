import React, { useState, useEffect, useCallback, useRef } from "react";
import "./signin.css"; // Create a separate CSS file for styling
import { Link, useNavigate } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import { Modal } from "antd";
import { FiEye } from "react-icons/fi";
import { PiEyeClosed } from "react-icons/pi";

import { RotatingLines } from "react-loader-spinner";
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import AuthenticationNavbar from "./AuthenticationNavbar";
import { useAuth } from "./Auth";
const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernamefocused, setUsernamefocused] = useState(false);
  const [usernameerror, setUsernameerror] = useState("");
  const [emailfocuesd, setEmailfocused] = useState(false);
  const [emailerror, setEmailerror] = useState("");
  const [passwordfocused, setPasswordFocused] = useState(false);
  const [passworderror, setPassworderror] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [phone_number, setPhoneNumber] = useState("");
  const [phone_numberfocuesd, setPhone_numberfocused] = useState(false);
  const [phone_numbererror, setPhone_Numbererror] = useState("");
  const pathname = sessionStorage.getItem("redirectFrom");
  const navigate = useNavigate();
  const { Login } = useAuth();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  useEffect(() => {
    if (errorModalVisible) {
      const timerId = setTimeout(() => {
        setErrorModalVisible(false);

        setError("");
      }, 3000);

      return () => clearTimeout(timerId);
    }
  }, [errorModalVisible]);

  const handleSubmit = async () => {
    if (!username && !email && !password && !phone_number) {
      setUsernameerror("You can't leave empty");
      setEmailerror("You can't leave empty");
      setPassworderror("You can't leave empty");
      setPhone_Numbererror("You can't leave empty");
      setUsernamefocused(true);
      setEmailfocused(true);
      setPasswordFocused(true);
      setPhone_numberfocused(true);
      return;
    }
    if (!username) {
      setUsernameerror("You can't leave empty");
      setUsernamefocused(true);
      return;
    }
    if (!email) {
      setEmailerror("You can't leave empty");
      setEmailfocused(true);
      return;
    }
    if (!password) {
      setPassworderror("You can't leave empty");
      setPasswordFocused(true);
      return;
    }
    if (!isValidEmail) {
      // Email is valid, you can save the data or perform further actions
      setEmailerror("invalid email address");
      setEmailfocused(true);
      return;
    }

    setTimeLeft(2 * 60);
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/send/otp/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      if (response.ok) {
        setOtpVisible(true);
      } else {
        const data = await response.json();
        setError(data.message);
        setErrorModalVisible(true);
      }

      setLoading(false);
    } catch (err) {
      setError("An error occurred during registration");
      setErrorModalVisible(true);
      setLoading(false);
    }
  };
  function getCSRFToken() {
    const csrfCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="));

    if (csrfCookie) {
      return csrfCookie.split("=")[1];
    }

    return null;
  }
  async function handleLogin() {
    try {
      setLoading(true);

      const requestBody = {
        username: email,
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
        Login();
        localStorage.setItem("username", username);
        localStorage.setItem("authToken", data.token);

        if (pathname) {
          navigate(pathname);
        } else {
          navigate("/");
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("An error occurred during login:", error);

      setLoading(false);
    }
  }
  const handleVerify = async (e) => {
    e.preventDefault();
    const otpVale = parseInt(otp.join(""));
    console.log(parseInt(otp));
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/verify-otp/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otp: otpVale,
          }),
        }
      );

      if (response.status === 200) {
        try {
          setLoading(true);

          const response = await fetch(
            `${process.env.REACT_APP_API_KEY}/api/signup/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username,
                email,
                password,
                phone_number,
              }),
            }
          );

          if (response.ok) {
            handleLogin();
          } else {
            const data = await response.json();
            setError(data.message);
            setErrorModalVisible(true);
            setOtpVisible(false);
            setOtpValues(["", "", "", "", "", ""]);
          }

          setLoading(false);
        } catch (err) {
          setError("An error occurred during registration");
          setErrorModalVisible(true);
          setLoading(false);
        }
      } else {
        const data = await response.json();
        setError(data.message);
        setErrorModalVisible(true);
      }

      setLoading(false);
    } catch (err) {
      setError("An error occurred during registration");
      setErrorModalVisible(true);
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const [otpVisible, setOtpVisible] = useState("");
  const [timeLeft, setTimeLeft] = useState(2 * 60);
  const [otp, setOtpValues] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
  ]);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const newOtpValues = [...otp];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);
      if (index < inputRefs.current.length - 1 && value !== "") {
        inputRefs.current[index + 1].current.focus();
      }
    }
  };

  const handleBackspace = (index, e) => {
    if (e.keyCode === 8 && index > 0 && e.target.value === "") {
      inputRefs.current[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").slice(0, otp.length); // Limiting to OTP length
    const newOtpValues = [...otp];
    pasteData.split("").forEach((char, i) => {
      if (i < newOtpValues.length) {
        newOtpValues[i] = char;
      }
    });
    setOtpValues(newOtpValues);
  };

  // Function to concatenate OTP values

  useEffect(() => {
    if (otpVisible) {
      if (timeLeft === 0) return;
      const intervalId = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [otpVisible, timeLeft]);

  const resetTimer = useCallback(() => {
    if (timeLeft === 0) {
      setTimeLeft(2 * 60);
      setOtpValues(["", "", "", "", "", ""]);
      handleSubmit();
    } else {
      return;
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(1, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };
  const handleBack = () => {
    setOtpVisible(false);
  };

  return (
    <div className="sub_page">
      {errorModalVisible && (
        <Modal
          className="modal_autehntication"
          title={
            <div>
              {success ? (
                <CheckCircleOutlined
                  style={{ color: "green", marginRight: 8 }}
                />
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
      )}
      {!otpVisible && (
        <div className="signup_container">
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
          <div className="signup_header">
            Create your Tanni Fashion House Account
          </div>
          <div className="content">
            <div className="first_column">
              <h4>Signup</h4>
              <div className="field">
                <label>Username*</label>
                <input
                  type="text"
                  name="username"
                  placeholder="username"
                  value={username}
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
                      ? "gray"
                      : "",
                    border: "1px solid white",
                    outline: "none",
                  }}
                />
                {usernameerror && (
                  <div style={{ color: "red", fontSize: "12px" }}>
                    {usernameerror}
                  </div>
                )}
              </div>
              <div className="field ">
                <label>Email*</label>
                <input
                  type="email"
                  required
                  placeholder="Please enter your email"
                  value={email}
                  name="password"
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setIsValidEmail(emailRegex.test(event.target.value));
                    setEmailerror("");
                  }}
                  onFocus={() => setEmailfocused(true)}
                  onBlur={() => setEmailfocused(false)}
                  style={{
                    borderColor: emailerror
                      ? "red"
                      : emailfocuesd
                      ? "black"
                      : "",
                    border: "1px solid white",
                  }}
                />
                {emailerror && (
                  <div style={{ color: "red", fontSize: "12px" }}>
                    {emailerror}
                  </div>
                )}
              </div>

              <div className="field ">
                <label>Password*</label>

                <input
                  type={passwordVisible ? "text" : "password"}
                  className="pass-key"
                  required
                  value={password}
                  placeholder="Please enter strong password"
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
              </div>
              <label
                className="normal_login mt-1"
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
                  }}
                  disabled={loading}
                  onClick={handleSubmit}
                  value="Signup"
                />
              </label>

              <div className="signup mt-2">
                Already have an account? <Link to="/login">Login Now</Link>
              </div>
            </div>
          </div>
        </div>
      )}
      {otpVisible && (
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="signin_wrapper">
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
                <div className="user_card">
                  <div className="card-title">
                    <h1 className="text-center mb-3">OTP</h1>
                    <p className="text-center">
                      We have sent a 5 digit code to <span>your email</span>.
                      Put the code in the box below and move forward.
                    </p>
                  </div>
                  <form action="">
                    <div className="row">
                      <div className="col-12">
                        <div className="d-flex">
                          {otp.map((value, index) => (
                            <div key={index} className="otp-input">
                              <input
                                type="text"
                                ref={inputRefs.current[index]}
                                maxLength="1"
                                value={value}
                                onChange={(e) => handleChange(index, e)}
                                onKeyDown={(e) => handleBackspace(index, e)}
                                onPaste={handlePaste}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 resend-otp-button-section">
                        <button
                          type="button"
                          className="resend-otp-text"
                          onClick={resetTimer}
                        >
                          {timeLeft === 0 && "Resend OTP"}
                          <div
                            className={`${timeLeft === 0 ? " " : "otp_timer"} `}
                          >
                            {timeLeft === 0 ? "" : formatTime(timeLeft)}
                          </div>
                        </button>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="back-btn">
                          <button onClick={handleBack}>Back</button>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="login-btn">
                          <button onClick={handleVerify}>Varify</button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;

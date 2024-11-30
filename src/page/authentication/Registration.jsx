import React, { useState, useEffect } from "react";
import "./signin.css";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/api/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (response.ok) {
        console.log("User registered successfully");
        navigate("/login");
        setSuccessMessage("User registered successfully");
        setError("");
        setUsername("");
        setEmail("");
        setPassword("");
      } else {
        const data = await response.json();
        setError(data.message || "Registration failed");
        setSuccessMessage("");
        console.error(data.message || "Registration failed");
      }

      setLoading(false);
    } catch (err) {
      setError("An error occurred during registration");
      setSuccessMessage("");
      console.error(err);
      setLoading(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.access_token) {
        try {
          setLoading(true);
          const response = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
            {
              headers: {
                Authorization: `Bearer ${user.access_token}`,
                Accept: "application/json",
              },
            }
          );

          // Check if the user is coming from Google login

          try {
            setLoading(true);

            const googleresponse = await fetch(
              "http://127.0.0.1:8000/api/google/signup/",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  username: response.data.name,
                  email: response.data.email,
                }),
              }
            );

            if (googleresponse.ok && googleresponse.status === 201) {
              console.log("User registered successfully via Google");
              navigate("/login");
              setSuccessMessage("User registered successfully via Google");
              setError("");
            } else if (googleresponse.status === 200) {
              // Handle the case where the user already exists
              const data = await googleresponse.json();
              setError(data.message || "Registration failed");
              setSuccessMessage("");
              console.error(data.message || "User Name Already Exit");
            } else {
              // Handle other error cases
              const data = await googleresponse.json();
              setError(data.message || "Registration failed");
              setSuccessMessage("");
              console.error(data.message || "Registration failed");
            }

            setLoading(false);
          } catch (err) {
            setError("An error occurred during registration");
            setSuccessMessage("");
            console.error(err);
            setLoading(false);
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      }
      setUser("");
    };

    fetchData();
  }, [user, navigate]);

  return (
    <>

      <div className="bg-img">

        <div className="content">
          <header>Login Form</header>
          <form action="#" onSubmit={handlesubmit}>
            <div className="field">
             <label>Username</label>
              <input
                type="text"
                name="username"
                placeholder="username"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="field space">
              <span className="fas fa-envelope-square"></span>
              <input
                type="email"
                name="email"
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field space">
              <span className="fa fa-lock"></span>
              <input
                type={passwordVisible ? "text" : "password"}
                className="pass-key"
                required
                placeholder="Password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="show" onClick={togglePasswordVisibility}>
                {passwordVisible ? "HIDE" : "SHOW"}
              </span>
            </div>
            
            <div className="field space">
              <input type="submit"  disabled={loading} value="SignUp" />
            </div>
            {error && <p className="error">{error}</p>}
          </form>
          <div className="login">Or login with</div>
          <div className="links">
            <div className="facebook">
              <i className="fab fa-facebook-f">
                <span>Facebook</span>
              </i>
            </div>
            <div className="Google">
              <i className="fab fa-google me-2">
                <span onClick={login}>Google</span>
              </i>
            </div>
          </div>

          <div className="signup">
            Don't have an account? <Link to="/login">SignIn Now</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;

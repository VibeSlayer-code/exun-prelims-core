import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });

  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => {
      setNotification({ show: false, message: "" });
    }, 3000);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );


        console.log(userInfo.data);

        localStorage.setItem("login", "true");
        localStorage.setItem("userEmail", userInfo.data.email);
        localStorage.setItem("userImage", userInfo.data.picture);
        localStorage.setItem("userName", userInfo.data.given_name);
        showNotification(`Welcome, ${userInfo.data.given_name}!`);

        setTimeout(() => {
          navigate("/");
        }, 1000);

      } catch (error) {
        showNotification("Google Login Failed");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      showNotification("Google Sign-In was cancelled");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showNotification("Please fill in both fields");
      return;
    }

    setIsLoading(true);

    const data = { email, password };

    try {
      const res = await fetch("https://nixun-api.onrender.com/check_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (json.status === "OK") {
        localStorage.setItem("login", "true");
        showNotification("Login successful! Initializing...");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        showNotification(json.message || "Login failed");
      }
    } catch (err) {
      showNotification("System Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="left">
        <img className="logo" src="/assets/Global/logo.png" alt="logo" />
        <div className="content">
          <h1 className="welcome-text">Welcome Back</h1>
          <p className="subtitle">
            Your work, your team, your flow - all in one place
          </p>

          <div className="idk">
            {/* ATTACH THE GOOGLE FUNCTION HERE */}
            <button
              type="button"
              className="google"
              onClick={() => googleLogin()}
            >
              <img src="/assets/Login/google.png" className="icon" alt="g" />
              Sign in with Google
            </button>

            <button type="button" className="github">
              <img src="/assets/Login/apple.png" className="icon" alt="gh" />
              Sign in with Apple ID
            </button>
          </div>

          <img className="or" src="/assets/Login/or.png" alt="or" />

          <form className="form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                id="email"
                placeholder=" "
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <label htmlFor="email">Email</label>
            </div>
            <div className="input-group">
              <input
                type="password"
                id="password"
                placeholder=" "
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <label htmlFor="password">Password</label>
            </div>

            <button
              className="login-btn"
              type="submit"
              disabled={isLoading}
              style={{
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? "Authenticating..." : "Sign in with email"}
            </button>

            <p className="signin-text" style={{ position: 'relative', zIndex: 9999 }}>
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="signup-link"
              >
                Sign Up
              </Link>
            </p>
          </form>

          <div className="footer">Help / Terms / Privacy</div>
        </div>
      </div>

      <div className="right">
        <img className="side" src="/assets/Login/side-pic.png" alt="side" />
      </div>

      {notification.show && (
        <div id="notification" className="notification">
          <span className="tick">✓</span>
          <span id="notification-text">{notification.message}</span>
        </div>
      )}
    </div>
  );
}

export default Login;
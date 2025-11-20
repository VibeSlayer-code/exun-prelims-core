import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showNotification("Please fill in both fields");
      return;
    }
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
        showNotification("Login successful!");
        navigate("/");
      } else {
        showNotification(json.message || "Login failed");
      }
    } catch (err) {
      showNotification("Error: " + err.message);
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
            <button className="google">
              <img src="/assets/Login/google.png" className="icon" alt="g" />
              Sign in with Google
            </button>
            <button className="github">
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
              />
              <label htmlFor="password">Password</label>
            </div>

            <button className="login-btn" type="submit">
              Sign in with email
            </button>

            <p className="signin-text">
              Dont have an account?
              <span onClick={() => navigate('/login')}>Sign Up</span>
            </p>
          </form>

          <div className="footer">Help / Terms / Privacy</div>
        </div>
      </div>

      <div className="right">
        <img className="side" src="/assets/Login/side-pic.png" alt="side" />
      </div>

      <div
        id="notification"
        className={`notification ${!notification.show ? "hidden" : ""}`}
      >
        <span className="tick">✓</span>
        <span id="notification-text">{notification.message}</span>
      </div>
    </div>
  );
}

export default Login;

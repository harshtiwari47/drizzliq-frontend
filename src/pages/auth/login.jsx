import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import React, { useState, useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  // form state
  const [identifier, setIdentifier] = useState(""); // email or username
  const [password, setPassword] = useState("");

  // ui state
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  /** SIMPLE CLIENT-SIDE VALIDATION */
  function validateClient() {
    const errors = {};

    if (!identifier.trim()) {
      errors.identifier = "Email or username is required.";
    }

    if (!password.trim()) {
      errors.password = "Password is required.";
    }

    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setGlobalError(null);
    setFieldErrors({});
    setLoading(true);

    const clientErrors = validateClient();
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setLoading(false);
      return;
    }

    try {
      const result = await login(identifier, password);
      if (result) {
        navigate("/", { replace: true });
        return;
      }

      setGlobalError("Login failed. Please try again.");
    } catch (err) {
      setGlobalError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="authPage">
      <div className="leftCard">
        <img
          src="https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg"
          width="100%"
          alt="Login"
        />
      </div>

      <div className="rightCard">
        <form onSubmit={handleSubmit} noValidate>
          <div className="pageTitle">
            <strong>LOGIN NOW ❯</strong>
          </div>

          <div className="msgBar">
            <p>Welcome back! We're glad to see you again.</p>
          </div>

          {/* Email or Username */}
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter your email or username"
          />
          {fieldErrors.identifier && (
            <div className="errorMSG" role="alert">
              {fieldErrors.identifier}
            </div>
          )}

          {/* Password */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          {fieldErrors.password && (
            <div className="errorMSG" role="alert">
              {fieldErrors.password}
            </div>
          )}

          {/* Global error */}
          {globalError && (
            <div className="errorMSG" role="alert">
              {globalError}
            </div>
          )}

          <Link className="frgtPass" to="/reset-password">
            Forget Password?
          </Link>

          <input
            type="submit"
            value={loading ? "Logging in..." : "LOGIN"}
            disabled={loading}
          />

          <div className="registerBtnBar">
            <p>Don't have an account?</p>
            <Link to="/signup">REGISTER</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;